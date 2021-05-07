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
using Microsoft.Extensions.Options;

namespace EMBC.ESS.Utilities.Dynamics
{
    public static class Configuration
    {
        public static IServiceCollection AddDynamics(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<DynamicsOptions>(configuration.GetSection("Dynamics"));
            services.AddHttpClient("adfs_token", (sp, c) =>
            {
                var options = sp.GetRequiredService<IOptions<DynamicsOptions>>().Value;
                c.BaseAddress = new Uri(options.Adfs.OAuth2TokenEndpoint);
            });
            services.AddTransient<ISecurityTokenProvider, CachedADFSSecurityTokenProvider>();
            services.AddScoped(sp =>
            {
                var options = sp.GetRequiredService<IOptions<DynamicsOptions>>().Value;
                var tokenProvider = sp.GetRequiredService<ISecurityTokenProvider>();
                var logger = sp.GetRequiredService<ILogger<EssContext>>();
                return new EssContext(new Uri(options.DynamicsApiBaseUri), new Uri(options.DynamicsApiEndpoint), async () => await tokenProvider.AcquireToken(), logger);
            });

            return services;
        }
    }
}
