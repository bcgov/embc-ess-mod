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
using System.Net.Http.Headers;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Resiliency;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OData.Extensions.Client;

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
                .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                .AddResiliencyPolicies(new IPolicyBuilder<HttpResponseMessage>[]
                {
                    new HttpClientCircuitBreakerPolicy
                    {
                        NumberOfErrors = options.Adfs.CircuitBreakerNumberOfErrors,
                        ResetDuration = TimeSpan.FromSeconds(options.Adfs.CircuitBreakerResetInSeconds),
                        OnBreak = (sp, t, e) => { OnBreak("adfs_token", sp, t, e); },
                        OnReset = sp => { OnReset("adfs_token", sp); }
                    },
                    new HttpClientBulkheadIsolationPolicy
                    {
                        MaxParallelization = 1,
                        QueueSize = 10
                    },
                    new HttpClientRetryPolicy
                    {
                        NumberOfRetries = options.NumberOfRetries,
                        WaitDurationBetweenRetries = TimeSpan.FromSeconds(options.RetryWaitTimeInSeconds),
                        OnRetry = (sp, t, e) => { OnRetry("adfs_token", sp, t, e); }
                    },
                    new HttpClientTimeoutPolicy
                    {
                        Timeout = TimeSpan.FromSeconds(options.Adfs.TimeoutInSeconds),
                        OnTimeout = (sp, t, e) => { OnTimeout("adfs_token", sp, t, e); }
                    }
                });

            services.AddTransient<ISecurityTokenProvider, CachedADFSSecurityTokenProvider>();

            services
                .AddODataClient("dynamics")
                .AddODataClientHandler<DynamicsODataClientHandler>()
                .AddHttpClient()
                .SetHandlerLifetime(TimeSpan.FromMinutes(5))
                .ConfigureHttpClient((sp, c) =>
                {
                    var options = sp.GetRequiredService<IOptions<DynamicsOptions>>().Value;
                    var tokenProvider = sp.GetRequiredService<ISecurityTokenProvider>();
                    c.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenProvider.AcquireToken().GetAwaiter().GetResult());
                })
                .AddResiliencyPolicies(new IPolicyBuilder<HttpResponseMessage>[]
                {
                    new HttpClientCircuitBreakerPolicy
                    {
                        NumberOfErrors = options.CircuitBreakerNumberOfErrors,
                        ResetDuration = TimeSpan.FromSeconds(options.CircuitBreakerResetInSeconds),
                        OnBreak = (sp, t, e) => { OnBreak("dynamics", sp, t, e); },
                        OnReset = sp => { OnReset("dynamics", sp); }
                    },
                    new HttpClientRetryPolicy
                    {
                        NumberOfRetries = options.NumberOfRetries,
                        WaitDurationBetweenRetries = TimeSpan.FromSeconds(options.RetryWaitTimeInSeconds),
                        OnRetry = (sp, t, e) => { OnRetry("dynamics", sp, t, e); }
                    },
                    new HttpClientTimeoutPolicy
                    {
                        Timeout = TimeSpan.FromSeconds(options.TimeoutInSeconds),
                        OnTimeout = (sp, t, e) => { OnTimeout("dynamics", sp, t, e); }
                    }
                })
                ;

            services.AddScoped<IEssContextFactory, EssContextFactory>();
            services.AddTransient(sp => sp.GetRequiredService<IEssContextFactory>().Create());
            services.AddTransient<IEssContextStateReporter, EssContextStateReporter>();
        }

        private static void OnBreak(string source, IServiceProvider sp, TimeSpan time, Exception exception)
        {
            var logger = sp.GetRequiredService<ILoggerFactory>().CreateLogger(source);
            logger.LogError("BREAK: {0} {1}: {2}", time, exception.GetType().FullName, exception.Message);
            var reporter = sp.GetRequiredService<IEssContextStateReporter>();
            reporter.ReportBroken($"{source}: {exception.Message}").GetAwaiter().GetResult();
        }

        private static void OnReset(string source, IServiceProvider sp)
        {
            var logger = sp.GetRequiredService<ILoggerFactory>().CreateLogger(source);
            logger.LogInformation("RESET");
            var reporter = sp.GetRequiredService<IEssContextStateReporter>();
            reporter.ReportFixed().GetAwaiter().GetResult();
        }

        private static void OnRetry(string source, IServiceProvider sp, TimeSpan time, Exception exception)
        {
            var logger = sp.GetRequiredService<ILoggerFactory>().CreateLogger(source);
            logger.LogWarning("RETRY: {0} {1}: {2}", time, exception?.GetType().FullName, exception?.Message);
        }

        private static void OnTimeout(string source, IServiceProvider sp, TimeSpan time, Exception exception)
        {
            var logger = sp.GetRequiredService<ILoggerFactory>().CreateLogger(source);
            logger.LogWarning("TIMOUT: {0} {1}: {2}", time, exception.GetType().FullName, exception.Message);
        }
    }
}
