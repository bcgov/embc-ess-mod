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
using System.IO.Abstractions;
using System.Net;
using EMBC.Suppliers.API.ConfigurationModule.Models;
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using EMBC.Suppliers.API.DynamicsModule;
using EMBC.Suppliers.API.SubmissionModule.Models;
using EMBC.Suppliers.API.SubmissionModule.Models.Dynamics;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NSwag.AspNetCore;
using Serilog;
using Xrm.Tools.WebAPI;
using Xrm.Tools.WebAPI.Requests;

namespace EMBC.Suppliers.API
{
#pragma warning disable CA1822 // Mark members as static

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

#pragma warning restore CA1822 // Mark members as static
}
