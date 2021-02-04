// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
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
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace EMBC.Registrants.API.SecurityModule
{
    public static class ModuleConfiguration
    {
        public static IServiceCollection AddSecurityModule(this IServiceCollection services)
        {
            services.AddTransient<IUserManager, UserManager>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddSingleton<ITokenManager, TokenManager>();
            return services;
        }

        public static IServiceCollection AddPortalAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddAuthentication(options =>
                {
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                })
                .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
                {
                    options.Cookie.SameSite = SameSiteMode.Strict;
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(1);
                    options.SlidingExpiration = false;
                    options.ForwardChallenge = JwtBearerDefaults.AuthenticationScheme;
                    configuration.GetSection("auth:cookie").Bind(options);
                }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
                {
                    var jwtConfig = configuration.GetSection("auth:jwt");
                    var tokenOptions = jwtConfig.Get<JwtTokenOptions>();

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateAudience = true,
                        ValidateIssuer = true,
                        RequireSignedTokens = true,
                        RequireAudience = true,
                        RequireExpirationTime = true,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.FromSeconds(60),
                        NameClaimType = ClaimTypes.NameIdentifier,
                        RoleClaimType = ClaimTypes.Role,
                        ValidateActor = true,
                        ValidateIssuerSigningKey = true,
                        TokenDecryptionKey = string.IsNullOrEmpty(tokenOptions.EncryptingKey)
                            ? null
                            : new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenOptions.EncryptingKey)),
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenOptions.SigningKey)),
                        ValidAudience = tokenOptions.Audience,
                        ValidIssuer = tokenOptions.ClaimsIssuer
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = async c =>
                        {
                            await Task.CompletedTask;
                            var logger = c.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("JwtBearer");
                            logger.LogError(c.Exception, $"Error authenticating token");
                        },
                        OnTokenValidated = async c =>
                        {
                            await Task.CompletedTask;
                            var logger = c.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("JwtBearer");
                            logger.LogDebug("Token validated {0}", c.Principal.Identity.Name);
                        }
                    };
                    configuration.Bind("auth:jwt", options);
                })
                .AddBcscOidc(BcscAuthenticationDefaults.AuthenticationScheme, options =>
                {
                    configuration.Bind("auth:bcsc", options);
                });

            return services;
        }
    }
}
