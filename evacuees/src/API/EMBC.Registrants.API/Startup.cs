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

using System.IO;
using System.Security.Claims;
using System.Text.Json.Serialization;
using EMBC.Registrants.API.Dynamics;
using EMBC.Registrants.API.LocationModule;
using EMBC.Registrants.API.RegistrationsModule;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
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
            services.AddControllers(options =>
            {
                options.Filters.Add(new HttpResponseExceptionFilter());
            });
            var dpBuilder = services.AddDataProtection();
            var keyRingPath = configuration.GetValue("KEY_RING_PATH", string.Empty);
            if (!string.IsNullOrWhiteSpace(keyRingPath))
            {
                dpBuilder.PersistKeysToFileSystem(new DirectoryInfo(keyRingPath));
            }

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

            services.Configure<JsonOptions>(opts =>
            {
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
            services.Configure<ADFSTokenProviderOptions>(configuration.GetSection("Dynamics:ADFS"));
            services.Configure<LocationCacheHostedServiceOptions>(configuration.GetSection("Location:Cache"));

            // TODO: consider setting a distributed cache in the future
            services.AddDistributedMemoryCache();

            services.AddRegistrationModule();
            services.AddLocationModule();
            services.AddDynamics();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
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
                opts.EnrichDiagnosticContext = (diagCtx, httpCtx) =>
                {
                    diagCtx.Set("User", httpCtx.User.FindFirst(ClaimTypes.Upn)?.Value);
                    diagCtx.Set("Host", httpCtx.Request.Host);
                    diagCtx.Set("UserAgent", httpCtx.Request.Headers["User-Agent"].ToString());
                    diagCtx.Set("RemoteIP", httpCtx.Connection.RemoteIpAddress.ToString());
                    diagCtx.Set("ConnectionId", httpCtx.Connection.Id);
                    diagCtx.Set("Forwarded", httpCtx.Request.Headers["Forwarded"].ToString());
                    diagCtx.Set("ContentLength", httpCtx.Response.ContentLength);
                    if (!env.IsProduction()) diagCtx.Set("Raw_Headers", httpCtx.Request.Headers, true);
                };
            });

            app.UseOpenApi();
            app.UseSwaggerUi3();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
