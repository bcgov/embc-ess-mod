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
using EMBC.Registrants.API.LocationModule;
using EMBC.ResourceAccess.Dynamics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Xrm.Tools.WebAPI;
using Xrm.Tools.WebAPI.Requests;

namespace EMBC.Registrants.API.Dynamics
{
    public static class ModuleConfiguration
    {
        public static IServiceCollection AddDynamics(this IServiceCollection services)
        {
            services.AddTransient<IListsRepository, ListsRepository>();
            services.AddTransient<IDynamicsListsGateway, DynamicsListsGateway>();
            services.AddTransient<ISecurityTokenProvider, ADFSSecurityTokenProvider>();
            services.AddHttpClient("adfs_token", (sp, c) =>
            {
                var options = sp.GetRequiredService<IOptions<ADFSTokenProviderOptions>>().Value;
                c.BaseAddress = new Uri(options.OAuth2TokenEndpoint);
            });
            services.AddSingleton(sp =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                var dynamicsApiEndpoint = configuration.GetValue<string>("Dynamics:DynamicsApiEndpoint");
                var tokenProvider = sp.GetRequiredService<ISecurityTokenProvider>();
                return new CRMWebAPI(new CRMWebAPIConfig
                {
                    APIUrl = dynamicsApiEndpoint,
                    GetAccessToken = async (s) => await tokenProvider.AcquireToken()
                });
            });

            services.AddSingleton(sp =>
           {
               var configuration = sp.GetRequiredService<IConfiguration>();
               var dynamicsApiEndpoint = configuration.GetValue<string>("Dynamics:DynamicsApiEndpoint");
               var tokenProvider = sp.GetRequiredService<ISecurityTokenProvider>();
               var logger = sp.GetRequiredService<ILogger<DynamicsClientContext>>();
               return new DynamicsClientContext(new Uri(dynamicsApiEndpoint), tokenProvider.AcquireToken().GetAwaiter().GetResult, logger);
           });
            return services;
        }
    }
}
