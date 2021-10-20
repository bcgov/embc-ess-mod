// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System;
using System.IO;
using System.IO.Abstractions;
using System.Net;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.Models;
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using EMBC.Suppliers.API.DynamicsModule;
using EMBC.Suppliers.API.SubmissionModule.Models;
using EMBC.Suppliers.API.SubmissionModule.Models.Dynamics;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using NSwag.AspNetCore;
using Serilog;
using Serilog.Events;
using StackExchange.Redis;
using Xrm.Tools.WebAPI;
using Xrm.Tools.WebAPI.Requests;

namespace EMBC.Suppliers.API
{
    public class Startup
    {
        private const string HealthCheckReadyTag = "ready";
        private const string HealthCheckAliveTag = "alive";

        private readonly IHostEnvironment env;
        private readonly IConfiguration configuration;

        public Startup(IConfiguration configuration, IHostEnvironment env)
        {
            this.configuration = configuration;
            this.env = env;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var redisConnectionString = configuration.GetValue<string>("REDIS_CONNECTIONSTRING", null);
            var dataProtectionPath = configuration.GetValue<string>("KEY_RING_PATH", null);
            if (!string.IsNullOrEmpty(redisConnectionString))
            {
                services.AddStackExchangeRedisCache(options =>
                {
                    options.Configuration = redisConnectionString;
                    options.InstanceName = Assembly.GetExecutingAssembly().GetName().Name;
                });
                services.AddDataProtection()
                    .SetApplicationName(Assembly.GetExecutingAssembly().GetName().Name)
                    .PersistKeysToStackExchangeRedis(ConnectionMultiplexer.Connect(redisConnectionString), "data-protection-keys");
            }
            else
            {
                services.AddDistributedMemoryCache();
                var dpBuilder = services.AddDataProtection()
                    .SetApplicationName(Assembly.GetExecutingAssembly().GetName().Name);

                if (!string.IsNullOrEmpty(dataProtectionPath)) dpBuilder.PersistKeysToFileSystem(new DirectoryInfo(dataProtectionPath));
            }
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                configuration.GetSection("jwt").Bind(options);

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    RequireSignedTokens = true,
                    RequireAudience = true,
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(60),
                    NameClaimType = ClaimTypes.Upn,
                    RoleClaimType = ClaimTypes.Role,
                    ValidateActor = true,
                    ValidateIssuerSigningKey = true,
                };
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = async c =>
                    {
                        await Task.CompletedTask;
                        var logger = c.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("JwtBearer");
                        logger.LogError(c.Exception, $"Error authenticating token");
                    },
                    OnTokenValidated = async c =>
                    {
                        await Task.CompletedTask;
                        var logger = c.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("JwtBearer");
                        logger.LogDebug("Token validated for {0}", c.ToString());
                        // var userService = c.HttpContext.RequestServices.GetRequiredService<IUserService>();
                        // c.Principal = await userService.CreatePrincipalForUser(c.Principal);
                        // logger.LogDebug("Token validated for {0}", c.Principal.Identity.Name);
                    }
                };
                options.Validate();
            });
            services.AddAuthorization(options =>
            {
                options.AddPolicy(JwtBearerDefaults.AuthenticationScheme, policy =>
                {
                    policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                        .RequireAuthenticatedUser();
                });
                options.DefaultPolicy = options.GetPolicy(JwtBearerDefaults.AuthenticationScheme);
            });

            services.AddControllers(options =>
            {
                options.Filters.Add(new HttpResponseExceptionFilter());
                options.Filters.Add(new AuthorizeFilter());
            });

            services.AddHealthChecks()
                .AddCheck("Suppliers API ready hc", () => HealthCheckResult.Healthy("API ready"), new[] { HealthCheckReadyTag })
                .AddCheck("Suppliers live hc", () => HealthCheckResult.Healthy("API alive"), new[] { HealthCheckAliveTag });

            services.AddOpenApiDocument();
            services.Configure<OpenApiDocumentMiddlewareSettings>(options =>
            {
                options.Path = "/api/swagger/{documentName}/swagger.json";
            });
            services.Configure<SwaggerUi3Settings>(options =>
            {
                options.Path = "/api/swagger";
                options.DocumentPath = "/api/swagger/{documentName}/swagger.json";
            });
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.All;
                var knownNetworks = configuration.GetValue("KNOWN_NETWORKS", "::ffff:172.51.0.0/16").Split(';');
                foreach (var knownNetwork in knownNetworks)
                {
                    options.KnownNetworks.Add(ParseNetworkFromString(knownNetwork));
                }
            });
            services.AddDistributedMemoryCache();

            services.AddSingleton<IFileSystem, FileSystem>();
            services.AddTransient<ICountriesListProvider, ListsProvider>();
            services.AddTransient<IStateProvincesListProvider, ListsProvider>();
            services.AddTransient<IJurisdictionsListProvider, ListsProvider>();
            services.AddTransient<ISupportsListProvider, ListsProvider>();
            services.AddTransient<IListsGateway, DynamicsListsGateway>();
            services.Configure<FileBasedCachedListsOptions>(configuration.GetSection("Dynamics:Cache"));
            services.AddTransient<IListsRepository, FileBasedCachedListsRepository>();
            services.Configure<ADFSTokenProviderOptions>(configuration.GetSection("Dynamics:ADFS"));
            services.AddADFSTokenProvider();
            services.AddTransient<ISubmissionRepository, SubmissionRepository>();
            services.AddTransient<IReferenceNumberGenerator, ReferenceNumberGenerator>();
            services.AddTransient<ISubmissionDynamicsCustomActionHandler, SubmissionDynamicsCustomActionHandler>();
            services.AddScoped(sp =>
            {
                var dynamicsApiEndpoint = configuration.GetValue<string>("Dynamics:DynamicsApiEndpoint");
                var tokenProvider = sp.GetRequiredService<ITokenProvider>();
                return new CRMWebAPI(new CRMWebAPIConfig
                {
                    APIUrl = dynamicsApiEndpoint,
                    GetAccessToken = async (s) => await tokenProvider.AcquireToken()
                });
            });
        }

        private IPNetwork ParseNetworkFromString(string network)
        {
            var networkParts = network.Trim().Split('/');
            var prefix = IPAddress.Parse(networkParts[0]);
            var length = int.Parse(networkParts[1]);
            return new IPNetwork(prefix, length);
        }

        public void Configure(IApplicationBuilder app)
        {
            if (env.IsDevelopment())
            {
                app.UseExceptionHandler("/error-local-development");
            }
            else
            {
                app.UseExceptionHandler("/error");
            }

            app.UseSerilogRequestLogging(opts =>
            {
                opts.GetLevel = ExcludeHealthChecks;
                opts.EnrichDiagnosticContext = (diagCtx, httpCtx) =>
                {
                    diagCtx.Set("User", httpCtx.User.Identity?.Name);
                    diagCtx.Set("Host", httpCtx.Request.Host);
                    diagCtx.Set("UserAgent", httpCtx.Request.Headers["User-Agent"].ToString());
                    diagCtx.Set("RemoteIP", httpCtx.Connection.RemoteIpAddress.ToString());
                    diagCtx.Set("ConnectionId", httpCtx.Connection.Id);
                    diagCtx.Set("Forwarded", httpCtx.Request.Headers["Forwarded"].ToString());
                    diagCtx.Set("ContentLength", httpCtx.Response.ContentLength);
                };
            });
            app.UseForwardedHeaders();

            app.UseOpenApi();
            app.UseSwaggerUi3();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/hc/ready", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckReadyTag) });
                endpoints.MapHealthChecks("/hc/live", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckAliveTag) });
                endpoints.MapHealthChecks("/hc/startup", new HealthCheckOptions() { Predicate = _ => false });
            });
        }

        // inspired by https://andrewlock.net/using-serilog-aspnetcore-in-asp-net-core-3-excluding-health-check-endpoints-from-serilog-request-logging/
        private static LogEventLevel ExcludeHealthChecks(HttpContext ctx, double _, Exception ex) =>
        ex != null
            ? LogEventLevel.Error
            : ctx.Response.StatusCode >= (int)HttpStatusCode.InternalServerError
                ? LogEventLevel.Error
                : ctx.Request.Path.StartsWithSegments("/hc", StringComparison.InvariantCultureIgnoreCase)
                    ? LogEventLevel.Verbose
                    : LogEventLevel.Information;
    }
}
