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
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text.Json.Serialization;
using AutoMapper;
using EMBC.Registrants.API.EvacuationsModule;
using EMBC.Registrants.API.LocationModule;
using EMBC.Registrants.API.ProfilesModule;
using EMBC.Registrants.API.RegistrationsModule;
using EMBC.Registrants.API.Security;
using EMBC.Registrants.API.SecurityModule;
using EMBC.Registrants.API.Utils;
using EMBC.ResourceAccess.Dynamics;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using NSwag.AspNetCore;
using Serilog;

namespace EMBC.Registrants.API
{
    public class Startup
    {
        private readonly IHostEnvironment env;
        private readonly IConfiguration configuration;

        public Startup(IConfiguration configuration, IHostEnvironment env)
        {
            this.configuration = configuration;
            this.env = env;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            //Add configuration options
            services.Configure<JwtTokenOptions>(opts => configuration.Bind("auth:jwt", opts));
            services.Configure<JsonOptions>(opts =>
            {
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
            services.Configure<ADFSTokenProviderOptions>(configuration.GetSection("Dynamics:ADFS"));
            services.Configure<LocationCacheHostedServiceOptions>(configuration.GetSection("Location:Cache"));
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
            services.AddControllers(options =>
            {
                options.Filters.Add(new HttpResponseExceptionFilter());
            }).AddNewtonsoftJson();
            services.AddResponseCompression();
            services.AddPortalAuthentication(configuration);
            services.AddAutoMapper((sp, cfg) => { cfg.ConstructServicesUsing(t => sp.GetRequiredService(t)); }, typeof(Startup));
            services.AddDistributedMemoryCache(); // TODO: configure proper distributed cache
            services.AddRegistrationModule();
            services.AddLocationModule();
            services.AddProfileModule();
            services.AddSecurityModule();
            services.AddEvacuationsModule();
            services.AddADFSTokenProvider();
            services.AddScoped(sp =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                var dynamicsApiEndpoint = configuration.GetValue<string>("Dynamics:DynamicsApiEndpoint");
                var dynamicsApiBaseUri = configuration.GetValue<string>("Dynamics:DynamicsApiBaseUri");
                var tokenProvider = sp.GetRequiredService<ISecurityTokenProvider>();
                var logger = sp.GetRequiredService<ILogger<DynamicsClientContext>>();
                return new DynamicsClientContext(new Uri(dynamicsApiBaseUri), new Uri(dynamicsApiEndpoint), async () => await tokenProvider.AcquireToken(), logger);
            });
            services.AddSingleton<IEmailConfiguration>(configuration.GetSection("SMTP").Get<EmailConfiguration>());
            services.AddTransient<IEmailSender, EmailSender>();
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
                opts.EnrichDiagnosticContext = (diagCtx, httpCtx) =>
                {
                    diagCtx.Set("User", httpCtx.User.FindFirst(ClaimTypes.Upn)?.Value);
                    diagCtx.Set("Host", httpCtx.Request.Host);
                    diagCtx.Set("UserAgent", httpCtx.Request.Headers["User-Agent"].ToString());
                    diagCtx.Set("RemoteIP", httpCtx.Connection.RemoteIpAddress.ToString());
                    diagCtx.Set("ConnectionId", httpCtx.Connection.Id);
                    diagCtx.Set("Forwarded", httpCtx.Request.Headers["Forwarded"].ToString());
                    diagCtx.Set("X-Forwarded-For", httpCtx.Request.Headers["X-Forwarded-For"].ToString());
                    diagCtx.Set("X-Forwarded-Proto", httpCtx.Request.Headers["X-Forwarded-Proto"].ToString());
                    diagCtx.Set("X-Forwarded-Host", httpCtx.Request.Headers["X-Forwarded-Host"].ToString());
                    diagCtx.Set("ContentLength", httpCtx.Response.ContentLength);
                    if (!env.IsProduction()) diagCtx.Set("Raw_Headers", httpCtx.Request.Headers, true);
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

                services.AddOpenApiDocument();
            }
        }
    }
}
