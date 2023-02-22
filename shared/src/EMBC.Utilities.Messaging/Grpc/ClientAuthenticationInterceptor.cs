using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Grpc.Core;
using Grpc.Core.Interceptors;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace EMBC.Utilities.Messaging.Grpc
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
