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
using System.Threading.Tasks;
using Polly;
using Polly.CircuitBreaker;
using Polly.Extensions.Http;
using Polly.Timeout;

namespace EMBC.Utilities.Resiliency
{
    public interface IPolicyBuilder<T>
    {
        PolicyWrapper<T> Build();
    }

    public class PolicyWrapper<T>
    {
        internal IAsyncPolicy<T> Policy { get; set; } = null!;
    }

    public class HttpClientRetryPolicy : IPolicyBuilder<HttpResponseMessage>
    {
        public int NumberOfRetries { get; set; } = 3;
        public TimeSpan WaitDurationBetweenRetries { get; set; } = TimeSpan.FromSeconds(5);
        public Action<IServiceProvider, TimeSpan, Exception> OnRetry { get; set; } = (sp, t, e) => { };

        public PolicyWrapper<HttpResponseMessage> Build()
        {
            return new PolicyWrapper<HttpResponseMessage>
            {
                Policy = HttpPolicyExtensions.HandleTransientHttpError()
                .Or<TimeoutRejectedException>()
                .Or<BrokenCircuitException>()
                 .WaitAndRetryAsync(NumberOfRetries, r => WaitDurationBetweenRetries,
                 (r, timespan, ctx) => OnRetry((IServiceProvider)ctx[ResiliencyEx.spKey], timespan, r.Exception))
            };
        }
    }

    public class HttpClientCircuitBreakerPolicy : IPolicyBuilder<HttpResponseMessage>
    {
        public int NumberOfErrors { get; set; } = 1;
        public TimeSpan ResetDuration { get; set; } = TimeSpan.FromSeconds(10);
        public Action<IServiceProvider, TimeSpan, Exception> OnBreak { get; set; } = (sp, t, e) => { };

        public Action<IServiceProvider> OnReset { get; set; } = (sp) => { };

        public PolicyWrapper<HttpResponseMessage> Build()
        {
            return new PolicyWrapper<HttpResponseMessage>
            {
                Policy = HttpPolicyExtensions.HandleTransientHttpError()
                 .Or<TimeoutRejectedException>()
                 .CircuitBreakerAsync(
                     NumberOfErrors,
                     ResetDuration,
                     (r, timespan, ctx) => OnBreak((IServiceProvider)ctx[ResiliencyEx.spKey], timespan, r.Exception),
                     ctx => OnReset((IServiceProvider)ctx[ResiliencyEx.spKey]))
            };
        }
    }

    public class HttpClientTimeoutPolicy : IPolicyBuilder<HttpResponseMessage>
    {
        public TimeSpan Timeout { get; set; } = TimeSpan.FromSeconds(30);
        public Action<IServiceProvider, TimeSpan, Exception> OnTimeout { get; set; } = (sp, t, e) => { };

        public PolicyWrapper<HttpResponseMessage> Build()
        {
            return new PolicyWrapper<HttpResponseMessage>
            {
                Policy = Policy.TimeoutAsync<HttpResponseMessage>(Timeout, (ctx, timespan, task, exception) =>
                {
                    OnTimeout((IServiceProvider)ctx[ResiliencyEx.spKey], timespan, exception);
                    return Task.CompletedTask;
                })
            };
        }
    }
}
