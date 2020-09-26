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
using System.Net;
using System.Text.Json.Serialization;
using EMBC.Registrants.API.Dynamics;
using EMBC.Registrants.API.LocationModule;
using EMBC.Registrants.API.RegistrationsModule;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
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

            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.All;
                var knownNetworks = configuration.GetValue("KNOWN_NETWORKS", "::ffff:172.51.0.0/16").Split(';');
                foreach (var knownNetwork in knownNetworks)
                {
                    options.KnownNetworks.Add(ParseNetworkFromString(knownNetwork));
                }
            });
            services.Configure<JsonOptions>(opts =>
            {
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });
            services.AddDistributedMemoryCache();

            services.AddRegistrationModule();
            services.AddLocationModule();
            services.Configure<ADFSTokenProviderOptions>(configuration.GetSection("Dynamics:ADFS"));
            services.AddDynamics();
        }

        private IPNetwork ParseNetworkFromString(string network)
        {
            var networkParts = network.Trim().Split('/');
            var prefix = IPAddress.Parse(networkParts[0]);
            var length = int.Parse(networkParts[1]);
            return new IPNetwork(prefix, length);
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

            app.UseSerilogRequestLogging();
            app.UseForwardedHeaders();

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
