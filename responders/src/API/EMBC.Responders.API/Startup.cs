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

using System.IO;
using System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NSwag.AspNetCore;
using Serilog;

namespace EMBC.Responders.API
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
            AddDataProtection(services);
            AddOpenApi(services);
            services.AddDistributedMemoryCache();
            services.AddControllers(options =>
            {
                options.Filters.Add(new HttpResponseExceptionFilter());
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseExceptionHandler("/error-details");
            }
            else
            {
                app.UseExceptionHandler("/error");
            }

            app.UseSerilogRequestLogging(opts =>
            {
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
            app.UseRouting();
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
                    options.DocumentName = "Responders Portal API";
                    options.PostProcess = (document, req) =>
                    {
                        document.Info.Title = "Registrants Portal API";
                    };
                });

                services.Configure<SwaggerUi3Settings>(options =>
                {
                    options.Path = "/api/openapi";
                    options.DocumentTitle = "responders Portal API Documentation";
                    options.DocumentPath = "/api/openapi/{documentName}/openapi.json";
                });

                services.AddOpenApiDocument();
            }
        }
    }
}
