// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
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
using System.Linq;
using System.Net;
using System.Text.Json.Serialization;
using EMBC.Registrants.API.SecurityModule;
using EMBC.Registrants.API.Services;
using EMBC.Registrants.API.Utils;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using Newtonsoft.Json.Converters;
using NSwag;
using NSwag.AspNetCore;
using NSwag.Generation.Processors.Security;
using Serilog;
using Serilog.Events;

namespace EMBC.Registrants.API
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
            var redisEndpoint = configuration["redis:endpoint"];
            if (!string.IsNullOrEmpty(redisEndpoint))
            {
                services.AddStackExchangeRedisCache(options =>
                {
                    options.Configuration = $"{redisEndpoint},name={Assembly.GetExecutingAssembly().GetName().Name},password={configuration["redis:password"]}";
                });
            }
            else
            {
                services.AddDistributedMemoryCache();
            }

            //Add configuration options
            services.Configure<JwtTokenOptions>(opts => configuration.Bind("auth:jwt", opts));
            services.Configure<JsonOptions>(opts =>
            {
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardLimit = 2;
                var configvalue = configuration.GetValue("app:knownNetwork", string.Empty)?.Split('/');
                if (configvalue.Length == 2)
                {
                    var knownNetwork = new IPNetwork(IPAddress.Parse(configvalue[0]), int.Parse(configvalue[1]));
                    options.KnownNetworks.Add(knownNetwork);
                }
            });

            //Add services
            AddDataProtection(services);
            AddOpenApi(services);
            services.AddCors(opts => opts.AddDefaultPolicy(policy =>
            {
                // try to get array of origins from section array
                var corsOrigins = configuration.GetSection("app:cors:origins").GetChildren().Select(c => c.Value).ToArray();
                // try to get array of origins from value
                if (!corsOrigins.Any()) corsOrigins = configuration.GetValue("app:cors:origins", string.Empty).Split(',');
                corsOrigins = corsOrigins.Where(o => !string.IsNullOrWhiteSpace(o)).ToArray();
                if (corsOrigins.Any())
                {
                    policy.SetIsOriginAllowedToAllowWildcardSubdomains().WithOrigins(corsOrigins);
                }
            }));
            services.AddHealthChecks()
                .AddCheck("Registrants API ready hc", () => HealthCheckResult.Healthy("API ready"), new[] { HealthCheckReadyTag })
                .AddCheck("Registrants API live hc", () => HealthCheckResult.Healthy("API alive"), new[] { HealthCheckAliveTag });

            services.AddControllers(options =>
            {
                options.Filters.Add(new HttpResponseExceptionFilter());
            }).AddNewtonsoftJson(opts => opts.SerializerSettings.Converters.Add(new StringEnumConverter()));
            services.AddResponseCompression();
            services.AddPortalAuthentication(configuration);
            services.AddAutoMapper((sp, cfg) => { cfg.ConstructServicesUsing(t => sp.GetRequiredService(t)); }, typeof(Startup));
            services.AddSecurityModule();

            services.Configure<MessagingOptions>(configuration.GetSection("backend"));
            services.AddMessaging();
            services.AddTransient<IEvacuationSearchService, EvacuationSearchService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            if (!env.IsProduction())
            {
                app.UseExceptionHandler("/error-details");
            }
            else
            {
                app.UseExceptionHandler("/error");
            }

            if (env.IsDevelopment())
            {
                IdentityModelEventSource.ShowPII = true;
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
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseOpenApi();
            app.UseSwaggerUi3();
            app.UseCors();
            app.UseRouting();
            app.UseResponseCompression();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/hc/ready", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckReadyTag) });
                endpoints.MapHealthChecks("/hc/live", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckAliveTag) });
                endpoints.MapHealthChecks("/hc/startup", new HealthCheckOptions() { Predicate = _ => false });
            });
        }

        private void AddDataProtection(IServiceCollection services)
        {
            var dpBuilder = services.AddDataProtection();
            var keyRingPath = configuration.GetValue("KEY_RING_PATH", string.Empty);
            if (!string.IsNullOrWhiteSpace(keyRingPath))
            {
                dpBuilder.PersistKeysToFileSystem(new DirectoryInfo(keyRingPath));
            }
        }

        private void AddOpenApi(IServiceCollection services)
        {
            if (!env.IsProduction())
            {
                services.Configure<OpenApiDocumentMiddlewareSettings>(options =>
                {
                    options.Path = "/api/openapi/{documentName}/openapi.json";
                    options.DocumentName = "Registrants Portal API";
                    options.PostProcess = (document, req) =>
                    {
                        document.Info.Title = "Registrants Portal API";
                    };
                });

                services.Configure<SwaggerUi3Settings>(options =>
                {
                    options.Path = "/api/openapi";
                    options.DocumentTitle = "Registrants Portal API Documentation";
                    options.DocumentPath = "/api/openapi/{documentName}/openapi.json";
                });

                services.AddOpenApiDocument(document =>
                {
                    document.AddSecurity("bearer token", Enumerable.Empty<string>(), new OpenApiSecurityScheme
                    {
                        Type = OpenApiSecuritySchemeType.Http,
                        Scheme = "Bearer",
                        BearerFormat = "paste token here",
                        In = OpenApiSecurityApiKeyLocation.Header
                    });

                    document.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("bearer token"));
                });
            }
        }

        //inspired by https://andrewlock.net/using-serilog-aspnetcore-in-asp-net-core-3-excluding-health-check-endpoints-from-serilog-request-logging/
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
