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

using EMBC.ESS.Managers.Admin;
using EMBC.ESS.Managers.Location;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Resources.Team;
using EMBC.ESS.Utilities.Cache;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Messaging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace EMBC.ESS
{
    public class Startup
    {
        private readonly IConfiguration configuration;

        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddGrpc(opts =>
            {
                opts.EnableDetailedErrors = true;
            });

            services.AddAutoMapper((sp, cfg) => { cfg.ConstructServicesUsing(t => sp.GetRequiredService(t)); }, typeof(Startup));

            services.AddSingleton(sp =>
            {
                var registry = new MessageHandlerRegistry();
                registry.Register<AdminManager>();
                registry.Register<LocationManager>();

                return registry;
            });

            services.AddAdminManager();
            services.AddLocationManager();
            services.AddTeamRepository();
            services.AddMetadataRepository();
            services.Configure<DynamicsOptions>(configuration.GetSection("Dynamics"));
            services.AddDynamics();
            services.AddCache();
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
                endpoints.MapGrpcService<DispatcherService>();
            });
        }
    }
}
