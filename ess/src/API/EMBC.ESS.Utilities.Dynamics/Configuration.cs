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
using System.Net.Http;
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Extensions.Client;
using Polly;
using Polly.Extensions.Http;

namespace EMBC.ESS.Utilities.Dynamics
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var services = configurationServices.Services;
            var configuration = configurationServices.Configuration;

            var options = configuration.GetSection("Dynamics").Get<DynamicsOptions>();

            services.Configure<DynamicsOptions>(opts => configuration.GetSection("Dynamics").Bind(opts));

            services
                .AddHttpClient("adfs_token")
                .SetHandlerLifetime(TimeSpan.FromMinutes(30))
                ;

            services.AddSingleton<ISecurityTokenProvider, ADFSSecurityTokenProvider>();

            var policy = HttpPolicyExtensions.HandleTransientHttpError()
                .CircuitBreakerAsync(
                        options.CircuitBreakerNumberOfErrors,
                        TimeSpan.FromSeconds(options.CircuitBreakerResetInSeconds),
                        OnBreak,
                        OnReset);

            services
                .AddODataClient("dynamics")
                .AddODataClientHandler<DynamicsODataClientHandler>()
                .AddHttpClient()
                .SetHandlerLifetime(TimeSpan.FromMinutes(30))
                .AddPolicyHandler((sp, request) =>
                {
                    var ctx = request.GetPolicyExecutionContext() ?? new Context();
                    ctx["_serviceprovider"] = sp;
                    request.SetPolicyExecutionContext(ctx);
                    return policy;
                })
                ;

            services.AddSingleton<IEssContextFactory, EssContextFactory>();
            services.AddTransient(sp => sp.GetRequiredService<IEssContextFactory>().Create());
            services.AddTransient<IEssContextStateReporter, EssContextStateReporter>();
        }

        private static void OnBreak(DelegateResult<HttpResponseMessage> r, TimeSpan time, Context ctx)
        {
            var source = "dynamics-circuitbreaker";
            var sp = (IServiceProvider)ctx["_serviceprovider"];
            var logger = sp.GetRequiredService<ILoggerFactory>().CreateLogger(source);
            logger.LogError("BREAK: {0} {1}: {2}", time, r.Exception.GetType().FullName, r.Exception.Message);
            var reporter = sp.GetRequiredService<IEssContextStateReporter>();
            reporter.ReportBroken($"{source}: {r.Exception.Message}").ConfigureAwait(false).GetAwaiter().GetResult();
        }

        private static void OnReset(Context ctx)
        {
            var source = "dynamics-circuitbreaker";
            var sp = (IServiceProvider)ctx["_serviceprovider"];
            var logger = sp.GetRequiredService<ILoggerFactory>().CreateLogger(source);
            logger.LogInformation("RESET");
            var reporter = sp.GetRequiredService<IEssContextStateReporter>();
            reporter.ReportFixed().ConfigureAwait(false).GetAwaiter().GetResult();
        }
    }
}
