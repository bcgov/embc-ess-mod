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
using Microsoft.Extensions.DependencyInjection;
using Polly;
using Polly.Extensions.Http;

namespace EMBC.Utilities.Extensions
{
    public static class HttpClientEx
    {
        public static IHttpClientBuilder AddCircuitBreaker(
            this IHttpClientBuilder httpClientBuilder,
            Action<IServiceProvider, Exception> onBreak,
            Action<IServiceProvider> onReset,
            int numberOfErrors = 2,
            int secondsToWait = 10)
        {
            httpClientBuilder.AddPolicyHandler(
                (services, request) => HttpPolicyExtensions
                    .HandleTransientHttpError()
                    .CircuitBreakerAsync(
                        numberOfErrors,
                        TimeSpan.FromSeconds(secondsToWait),
                        (r, timespan, ctx) => onBreak(services, r.Exception),
                        ctx => onReset(services)));
            return httpClientBuilder;
        }
    }
}
