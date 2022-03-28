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

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Grpc.Core;
using Grpc.Core.Interceptors;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace EMBC.Utilities.Messaging
{
    internal class ClientAuthenticationInterceptor : Interceptor
    {
        private readonly ITokenProvider tokenProvider;
        private readonly IHttpContextAccessor httpContextAccessor;
        private static readonly JwtSecurityTokenHandler jwtHandler = new JwtSecurityTokenHandler();

        public ClientAuthenticationInterceptor(ITokenProvider tokenProvider, IHttpContextAccessor httpContextAccessor)
        {
            this.tokenProvider = tokenProvider;
            this.httpContextAccessor = httpContextAccessor;
        }

        public override AsyncUnaryCall<TResponse> AsyncUnaryCall<TRequest, TResponse>(TRequest request, ClientInterceptorContext<TRequest, TResponse> context, AsyncUnaryCallContinuation<TRequest, TResponse> continuation)
        {
            var serverToken = tokenProvider.AcquireToken().GetAwaiter().GetResult();
            var userToken = string.Empty;
            if (httpContextAccessor.HttpContext?.User?.Identity != null)
            {
                //TODO: serialize current user correctly
                var token = jwtHandler.CreateJwtSecurityToken(new SecurityTokenDescriptor
                {
                    Subject = (ClaimsIdentity)httpContextAccessor.HttpContext.User.Identity
                });
                userToken = jwtHandler.WriteToken(token);
            }

            if (context.Options.Headers != null)
            {
                if (!string.IsNullOrEmpty(serverToken)) context.Options.Headers.Add("Authorization", $"bearer {serverToken}");
                if (!string.IsNullOrEmpty(userToken)) context.Options.Headers.Add("_user", $"{userToken}");
            }
            return continuation(request, context);
        }
    }
}
