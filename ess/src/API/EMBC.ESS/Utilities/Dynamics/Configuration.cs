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
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace EMBC.ESS.Utilities.Dynamics
{
    public static class Configuration
    {
        public static IServiceCollection AddDynamics(this IServiceCollection services)
        {
            services.AddADFSTokenProvider();
            services.AddSingleton(sp =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                var dynamicsApiEndpoint = configuration.GetValue<string>("Dynamics:DynamicsApiEndpoint");
                var dynamicsApiBaseUri = configuration.GetValue<string>("Dynamics:DynamicsApiBaseUri");
                var tokenProvider = sp.GetRequiredService<ISecurityTokenProvider>();
                var logger = sp.GetRequiredService<ILogger<EssContext>>();
                return new EssContext(new Uri(dynamicsApiBaseUri), new Uri(dynamicsApiEndpoint), async () => await tokenProvider.AcquireToken(), logger);
            });

            return services;
        }
    }
}
