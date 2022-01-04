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

using System.Linq;
using System.Net.Http;
using Microsoft.Extensions.DependencyInjection;
using Polly;

namespace EMBC.Utilities.Resiliency
{
    public static class ResiliencyEx
    {
        internal const string spKey = "_serviceProvider";

        /// <summary>
        /// Add the policies to an http client
        /// </summary>
        /// <param name="httpClientBuilder">http client builder</param>
        /// <param name="policies">policies to add</param>
        /// <returns>the same http client builder</returns>
        public static IHttpClientBuilder AddResiliencyPolicies(this IHttpClientBuilder httpClientBuilder, params IPolicyBuilder<HttpResponseMessage>[] policies)
        {
            //materialize and pin policies in memory
            var wrappedPolicy = Policy.WrapAsync(policies.Select(p => p.Build().Policy).ToArray());
            return httpClientBuilder.AddPolicyHandler((sp, request) =>
            {
                var context = request.GetPolicyExecutionContext() ?? new Context();
                //store service provider in context
                context[spKey] = sp;
                request.SetPolicyExecutionContext(context);
                return wrappedPolicy;
            });
        }
    }
}
