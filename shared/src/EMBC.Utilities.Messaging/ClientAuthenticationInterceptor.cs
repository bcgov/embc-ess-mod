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

using Grpc.Core;
using Grpc.Core.Interceptors;
using Microsoft.AspNetCore.Http;

namespace EMBC.Utilities.Messaging
{
    internal class ClientAuthenticationInterceptor : Interceptor
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly ITokenProvider tokenProvider;

        public ClientAuthenticationInterceptor(IHttpContextAccessor httpContextAccessor, ITokenProvider tokenProvider)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.tokenProvider = tokenProvider;
        }

        public override AsyncUnaryCall<TResponse> AsyncUnaryCall<TRequest, TResponse>(TRequest request, ClientInterceptorContext<TRequest, TResponse> context, AsyncUnaryCallContinuation<TRequest, TResponse> continuation)
        {
            var serverToken = tokenProvider.AcquireToken().GetAwaiter().GetResult();
            var userToken = httpContextAccessor.HttpContext?.Request.Headers.Authorization;
            if (context.Options.Headers != null)
            {
                if (!string.IsNullOrEmpty(serverToken)) context.Options.Headers.Add("Authorization", $"bearer {serverToken}");
                if (!string.IsNullOrEmpty(userToken)) context.Options.Headers.Add("UserToken", $"{userToken}");
            }
            return continuation(request, context);
        }
    }
}
