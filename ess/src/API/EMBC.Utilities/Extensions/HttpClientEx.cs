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
using Microsoft.Extensions.DependencyInjection;
using Polly;
using Polly.Extensions.Http;
using Polly.Timeout;

namespace EMBC.Utilities.Extensions
{
    public static class HttpClientEx
    {
        private const string spKey = "_serviceProvider";

        public static IHttpClientBuilder AddCircuitBreaker(
            this IHttpClientBuilder httpClientBuilder,
            Action<IServiceProvider, Exception, TimeSpan> onBreak,
            Action<IServiceProvider> onReset,
            int numberOfErrorsBeforeBreak = 1,
            int breakDurationInSeconds = 10,
            int timeoutInSecond = 30)
        {
            //create and pin the stateful policy composition
            var policy = HttpPolicyExtensions.HandleTransientHttpError()
                .Or<TimeoutRejectedException>() //handle timeout policy exceptions
                .CircuitBreakerAsync(
                    numberOfErrorsBeforeBreak,
                    TimeSpan.FromSeconds(breakDurationInSeconds),
                    (r, timespan, ctx) => onBreak((IServiceProvider)ctx[spKey], r.Exception, timespan),
                    ctx => onReset((IServiceProvider)ctx[spKey]))
                .WrapAsync(Policy.TimeoutAsync<HttpResponseMessage>(timeoutInSecond));

            httpClientBuilder
                .AddPolicyHandler((sp, request) =>
                {
                    var context = request.GetPolicyExecutionContext() ?? new Context();
                    context[spKey] = sp;
                    request.SetPolicyExecutionContext(context);
                    return policy;
                });

            return httpClientBuilder;
        }
    }
}
