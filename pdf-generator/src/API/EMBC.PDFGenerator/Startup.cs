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
using System.Reflection;
using EMBC.PDFGenerator.Utilities.PdfGenerator;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using StackExchange.Redis;

namespace EMBC.PDFGenerator
{
    public class Startup
    {
        private const string HealthCheckReadyTag = "ready";
        private const string HealthCheckAliveTag = "alive";
        private readonly IConfiguration configuration;

        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var redisConnectionString = configuration.GetValue<string>("REDIS_CONNECTIONSTRING", null);
            var dataProtectionPath = configuration.GetValue<string>("KEY_RING_PATH", null);
            var applicationName = configuration.GetValue("APP_NAME", Assembly.GetExecutingAssembly().GetName().Name);
            if (!string.IsNullOrEmpty(redisConnectionString))
            {
                services.AddStackExchangeRedisCache(options =>
                {
                    options.Configuration = redisConnectionString;
                });
                services.AddDataProtection()
                    .SetApplicationName(applicationName)
                    .PersistKeysToStackExchangeRedis(ConnectionMultiplexer.Connect(redisConnectionString), "data-protection-keys");
            }
            else
            {
                services.AddDistributedMemoryCache();
                var dpBuilder = services.AddDataProtection()
                    .SetApplicationName(applicationName);

                if (!string.IsNullOrEmpty(dataProtectionPath)) dpBuilder.PersistKeysToFileSystem(new DirectoryInfo(dataProtectionPath));
            }
            services.AddGrpc();
            services.AddPdfGenerator(configuration);
            services.AddHealthChecks()
                .AddCheck("ESS API ready hc", () => HealthCheckResult.Healthy("API ready"), new[] { HealthCheckReadyTag })
                .AddCheck("ESS API live hc", () => HealthCheckResult.Healthy("API alive"), new[] { HealthCheckAliveTag });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGrpcService<PdfService>();
                endpoints.MapHealthChecks("/hc/ready", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckReadyTag) });
                endpoints.MapHealthChecks("/hc/live", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckAliveTag) });
                endpoints.MapHealthChecks("/hc/startup", new HealthCheckOptions() { Predicate = _ => false });
            });
        }
    }
}
