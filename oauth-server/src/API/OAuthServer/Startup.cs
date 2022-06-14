using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Net;
using System.Net.Http.Headers;
using System.Reflection;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using IdentityModel.Client;
using IdentityServer4;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Newtonsoft.Json;
using Serilog;
using StackExchange.Redis;

namespace OAuthServer
{
    public class Startup
    {
        private const string HealthCheckReadyTag = "ready";
        private const string HealthCheckAliveTag = "alive";

        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        private IConfiguration configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var redisConnectionString = configuration.GetValue<string>("REDIS_CONNECTIONSTRING", null);
            var dataProtectionPath = configuration.GetValue<string>("KEY_RING_PATH", null);
            var applicationName = configuration.GetValue("APP_NAME", Assembly.GetExecutingAssembly().GetName().Name);

            if (!string.IsNullOrEmpty(redisConnectionString))
            {
                Log.Information("Configuring {0} to use Redis cache", applicationName);
                services.AddStackExchangeRedisCache(options =>
                {
                    options.Configuration = redisConnectionString;
                });
                services.AddDataProtection()
                    .SetApplicationName(applicationName)
                    .PersistKeysToStackExchangeRedis(ConnectionMultiplexer.Connect(redisConnectionString), $"{applicationName}-data-protection-keys");
            }
            else
            {
                Log.Warning("Configuring {0} to use in-memory cache", applicationName);
                services.AddDistributedMemoryCache();
                var dpBuilder = services
                    .AddDataProtection()
                    .SetApplicationName(applicationName);

                if (!string.IsNullOrEmpty(dataProtectionPath)) dpBuilder.PersistKeysToFileSystem(new DirectoryInfo(dataProtectionPath));
            }

            services.AddControllers();

            var configFile = configuration.GetValue("IDENTITYSERVER_CONFIG_FILE", (string)null);
            if (string.IsNullOrEmpty(configFile) || !File.Exists(configFile))
            {
                throw new InvalidOperationException($"Config file not found: check env var IDENTITYSERVER_CONFIG_FILE={configFile}");
            }
            var config = JsonConvert.DeserializeObject<Config>(File.ReadAllText(configFile));

            //add IdentityServer
            var builder = services
                .AddOidcStateDataFormatterCache()
                .AddIdentityServer(options =>
                {
                    options.Events.RaiseErrorEvents = true;
                    options.Events.RaiseInformationEvents = true;
                    options.Events.RaiseFailureEvents = true;
                    options.Events.RaiseSuccessEvents = true;

                    options.UserInteraction.LoginUrl = "~/login";
                    options.UserInteraction.LogoutUrl = "~/logout";
                    options.IssuerUri = configuration.GetValue("IDENTITYSERVER_ISSUER_URI", (string)null);
                })
                .AddInMemoryApiScopes(config.ApiScopes)
                .AddInMemoryClients(config.Clients)
                .AddInMemoryIdentityResources(config.IdentityResources)
                .AddInMemoryApiResources(config.ApiResources)
                ;

            var redisOperationalStore = configuration.GetValue("IDENTITYSERVER_REDIS_OPERATIONALSTORE", false);
            var redisPrefix = configuration.GetValue("IDENTITYSERVER_REDIS_KEY_PREFIX", (string)null);
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            if (redisOperationalStore && !string.IsNullOrEmpty(redisConnectionString))
            {
                Log.Information("Configuring Identity Server operational store to use Redis with prefix '{0}'", redisPrefix);
                builder
                    .AddOperationalStore(opts =>
                    {
                        opts.RedisConnectionString = redisConnectionString;
                        opts.KeyPrefix = redisPrefix;
                    });
            }
            else if (!string.IsNullOrEmpty(connectionString))
            {
                Log.Information("Configuring Identity Server operational store to use Sqlite");
                builder
                    .AddOperationalStore(options =>
                    {
                        options.ConfigureDbContext = builder => builder.UseSqlite(connectionString, sql => sql.MigrationsAssembly(typeof(Startup).Assembly.FullName));
                        options.EnableTokenCleanup = true;
                    });
            }
            else
            {
                Log.Information("Configuring Identity Server operational store to use in-memory");
                builder.AddOperationalStore();
            }

            var redisCache = configuration.GetValue("IDENTITYSERVER_REDIS_CACHE", false);
            if (redisCache && !string.IsNullOrEmpty(redisConnectionString))
            {
                Log.Information("Configuring Identity Server cache to use Redis with prefix '{0}'", redisPrefix);
                builder.AddRedisCaching(opts =>
                {
                    opts.RedisConnectionString = redisConnectionString;
                    opts.KeyPrefix = redisPrefix;
                });
            }

            services.AddTestUsers(configuration);

            //store the oidc key in the key ring persistent volume
            var keyPath = Path.Combine(new DirectoryInfo(dataProtectionPath ?? "./Data").FullName, "oidc_key.jwk");

            //add key as signing key
            builder.AddDeveloperSigningCredential(filename: keyPath);

            //add key as encryption key to oidc jwks endpoint that is used by BCSC to encrypt tokens
            var encryptionKey = Microsoft.IdentityModel.Tokens.JsonWebKey.Create(File.ReadAllText(keyPath));
            encryptionKey.Use = "enc";
            builder.AddValidationKey(new SecurityKeyInfo { Key = encryptionKey });

            services.AddResponseCompression();

            services.AddAuthentication()
                .AddOpenIdConnect("bcsc", options =>
                {
                    // Note: Microsoft.AspNetCore.Authentication.OpenIdConnect.OpenIdConnectHandler  doesn't handle JWE correctly
                    // See https://github.com/dotnet/aspnetcore/issues/4650 for more information
                    // When BCSC user info payload is encrypted, we need to load the user info manually in OnTokenValidated event below
                    // IdentityModel.Client also doesn't support JWT userinfo responses, so the following code takes care of this manually
                    options.GetClaimsFromUserInfoEndpoint = false;

                    configuration.GetSection("identityproviders:bcsc").Bind(options);

                    options.ResponseType = OpenIdConnectResponseType.Code;
                    options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                    options.SignOutScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;

                    //add required scopes
                    options.Scope.Add("profile");
                    options.Scope.Add("address");
                    options.Scope.Add("email");

                    //set the tokens decrypting key
                    options.TokenValidationParameters.TokenDecryptionKey = encryptionKey;

                    options.Events = new OpenIdConnectEvents
                    {
                        OnTokenValidated = async ctx =>
                        {
                            var oidcConfig = await ctx.Options.ConfigurationManager.GetConfigurationAsync(CancellationToken.None);

                            //set token validation parameters
                            var validationParameters = ctx.Options.TokenValidationParameters.Clone();
                            validationParameters.IssuerSigningKeys = oidcConfig.JsonWebKeySet.GetSigningKeys();
                            validationParameters.ValidateLifetime = false;
                            validationParameters.ValidateIssuer = false;
                            var userInfoRequest = new UserInfoRequest
                            {
                                Address = oidcConfig.UserInfoEndpoint,
                                Token = ctx.TokenEndpointResponse.AccessToken
                            };
                            //set the userinfo response to be JWT
                            userInfoRequest.Headers.Accept.Clear();
                            userInfoRequest.Headers.Accept.Add(MediaTypeWithQualityHeaderValue.Parse("application/jwt"));

                            //request userinfo claims through the backchannel
                            var response = await ctx.Options.Backchannel.GetUserInfoAsync(userInfoRequest, CancellationToken.None);
                            if (response.IsError && response.HttpStatusCode == HttpStatusCode.OK)
                            {
                                //handle encrypted userinfo response...
                                if (response.HttpResponse.Content?.Headers?.ContentType?.MediaType == "application/jwt")
                                {
                                    var handler = new JwtSecurityTokenHandler();
                                    if (handler.CanReadToken(response.Raw))
                                    {
                                        handler.ValidateToken(response.Raw, validationParameters, out var token);
                                        var jwe = token as JwtSecurityToken;
                                        ctx.Principal.AddIdentity(new ClaimsIdentity(new[] { new Claim("userInfo", jwe.Payload.SerializeToJson()) }));
                                    }
                                }
                                else
                                {
                                    //...or fail
                                    ctx.Fail(response.Error);
                                }
                            }
                            else if (response.IsError)
                            {
                                //handle for all other failures
                                ctx.Fail(response.Error);
                            }
                            else
                            {
                                //handle non encrypted userinfo response
                                ctx.Principal.AddIdentity(new ClaimsIdentity(new[] { new Claim("userInfo", response.Json.GetRawText()) }));
                            }
                        },
                        OnUserInformationReceived = async ctx =>
                        {
                            //handle userinfo claim mapping when options.GetClaimsFromUserInfoEndpoint = true
                            await Task.CompletedTask;
                            ctx.Principal.AddIdentity(new ClaimsIdentity(new[]
                            {
                              new Claim("userInfo", ctx.User.RootElement.GetRawText())
                            }));
                        }
                    };
                });

            services.AddHealthChecks()
                .AddCheck("Oauth Server ready hc", () => HealthCheckResult.Healthy("Service ready"), new[] { HealthCheckReadyTag })
                .AddCheck("Oauth Server live hc", () => HealthCheckResult.Healthy("Service alive"), new[] { HealthCheckAliveTag });
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.All;
                options.KnownNetworks.Clear();
                options.KnownProxies.Clear();
            });
            services.AddOpenTelemetry(applicationName);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                IdentityModelEventSource.ShowPII = true;
            }

            app.SetDefaultRequestLogging();

            app.UseForwardedHeaders();
            app.UseRouting();
            app.UseIdentityServer();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/hc/ready", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckReadyTag) });
                endpoints.MapHealthChecks("/hc/live", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckAliveTag) });
                endpoints.Map("/version", async ctx =>
                {
                    ctx.Response.ContentType = "application/json";
                    ctx.Response.StatusCode = (int)HttpStatusCode.OK;
                    await ctx.Response.WriteAsJsonAsync(new { version = Environment.GetEnvironmentVariable("VERSION") ?? "Unknown" });
                });
            });
        }
    }
}
