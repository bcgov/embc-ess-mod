using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using IdentityModel.Client;
using IdentityServer4;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace OAuthServer
{
    public class Startup
    {
        private const string HealthCheckReadyTag = "ready";

        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        private IConfiguration configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            var dpBuilder = services.AddDataProtection();
            var keyRingPath = configuration.GetValue<string>("KEY_RING_PATH");
            if (!string.IsNullOrWhiteSpace(keyRingPath))
            {
                //configure data protection folder for key sharing
                dpBuilder.PersistKeysToFileSystem(new DirectoryInfo(keyRingPath));
            }

            var connectionString = configuration.GetConnectionString("DefaultConnection");
            var config = JsonConvert.DeserializeObject<Config>(File.ReadAllText("./Data/config.json"));
            var builder = services
                .AddIdentityServer(options =>
                {
                    options.Events.RaiseErrorEvents = true;
                    options.Events.RaiseInformationEvents = true;
                    options.Events.RaiseFailureEvents = true;
                    options.Events.RaiseSuccessEvents = true;

                    options.UserInteraction.LoginUrl = "~/login";
                    options.UserInteraction.LogoutUrl = "~/logout";

                    if (!string.IsNullOrEmpty(configuration["ISSUER_URI"])) options.IssuerUri = configuration["ISSUER_URI"];
                })

                .AddOperationalStore(options =>
                {
                    options.ConfigureDbContext = builder => builder.UseSqlite(connectionString, sql => sql.MigrationsAssembly(typeof(Startup).Assembly.FullName));
                    options.EnableTokenCleanup = true;
                })
                .AddInMemoryApiScopes(config.ApiScopes)
                .AddInMemoryClients(config.Clients)
                .AddInMemoryIdentityResources(config.IdentityResources)
                .AddInMemoryApiResources(config.ApiResources)
                .AddInMemoryCaching()
                ;

            //store the oidc key in the key ring persistent volume
            var keyPath = Path.Combine(new DirectoryInfo(keyRingPath ?? "./Data").FullName, "oidc_key.jwk");

            //add key as signing key
            builder.AddDeveloperSigningCredential(filename: keyPath);

            //add key as encryption key to oidc jwks endpoint that is used by BCSC to encrypt tokens
            var encryptionKey = Microsoft.IdentityModel.Tokens.JsonWebKey.Create(File.ReadAllText(keyPath));
            encryptionKey.Use = "enc";
            builder.AddValidationKey(new SecurityKeyInfo { Key = encryptionKey });

            services.AddOidcStateDataFormatterCache();
            services.AddDistributedMemoryCache();
            services.AddResponseCompression();

            services.AddAuthentication()
                .AddOpenIdConnect("bcsc", options =>
                {
                    configuration.GetSection("identityproviders:bcsc").Bind(options);
                    options.SaveTokens = true;
                    //TODO: investigate why options.GetClaimsFromUserInfoEndpoint = true fails
                    options.GetClaimsFromUserInfoEndpoint = false;
                    options.UseTokenLifetime = true;
                    options.ResponseType = OpenIdConnectResponseType.Code;
                    options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                    options.SignOutScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        NameClaimType = "name",
                        RoleClaimType = "role",
                    };

                    //add required scopes
                    options.Scope.Add("profile");
                    options.Scope.Add("address");
                    options.Scope.Add("email");

                    //set the tokens decrypting key
                    options.TokenValidationParameters.TokenDecryptionKey = encryptionKey;

                    options.Events = new OpenIdConnectEvents
                    {
                        //OnTokenResponseReceived = async ctx =>
                        //{
                        //    await Task.CompletedTask;
                        //},
                        OnTokenValidated = async ctx =>
                        {
                            //manually fetch claims from userinfo endpoint because the handler throws null reference error
                            var oidcConfig = await ctx.Options.ConfigurationManager.GetConfigurationAsync(CancellationToken.None);
                            using var client = new HttpClient();

                            var response = await client.GetUserInfoAsync(new UserInfoRequest
                            {
                                Address = oidcConfig.UserInfoEndpoint,
                                Token = ctx.TokenEndpointResponse.AccessToken
                            });
                            if (response.IsError)
                            {
                                ctx.Fail(new Exception(response.Error));
                            }
                            //ctx.Principal.AddIdentity(new ClaimsIdentity(response.Claims));
                            ctx.Principal = new ClaimsPrincipal(new ClaimsIdentity(ctx.Principal.Identity, ctx.Principal.Claims.Concat(response.Claims)));
                        },
                        //OnRemoteFailure = async ctx =>
                        //{
                        //    await Task.CompletedTask;
                        //},
                        //OnAuthenticationFailed = async ctx =>
                        //{
                        //    await Task.CompletedTask;
                        //},
                        //OnUserInformationReceived = async ctx =>
                        //{
                        //    await Task.CompletedTask;
                        //},
                        //OnTicketReceived = async ctx =>
                        //{
                        //    await Task.CompletedTask;
                        //}
                    };
                });

            services.AddHealthChecks().AddCheck("OAuth Server ", () => HealthCheckResult.Healthy("OK"), new[] { HealthCheckReadyTag });
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.All;
                options.KnownNetworks.Clear();
                options.KnownProxies.Clear();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();

            app.UseRouting();
            app.UseIdentityServer();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
