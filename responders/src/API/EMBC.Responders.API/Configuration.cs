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
using System.Linq;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using EMBC.Responders.API.Services;
using EMBC.Responders.API.Utilities;
using EMBC.Utilities.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using NSwag;
using NSwag.AspNetCore;
using NSwag.Generation.Processors.Security;

namespace EMBC.Responders.API
{
    public class Configuration : IConfigureComponentServices, IConfigureComponentPipeline
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var configuration = configurationServices.Configuration;
            var services = configurationServices.Services;
            var environment = configurationServices.Environment;

            services.Configure<MessagingOptions>(configuration.GetSection("backend"));
            services.AddMessaging();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IEvacuationSearchService, EvacuationSearchService>();

            services.Configure<JsonOptions>(opts =>
            {
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

            if (!environment.IsProduction())
            {
                services.Configure<OpenApiDocumentMiddlewareSettings>(options =>
                {
                    options.Path = "/api/openapi/{documentName}/openapi.json";
                    options.DocumentName = "Responders Portal API";
                    options.PostProcess = (document, req) =>
                    {
                        document.Info.Title = "Responders Portal API";
                    };
                });

                services.Configure<SwaggerUi3Settings>(options =>
                {
                    options.Path = "/api/openapi";
                    options.DocumentTitle = "responders Portal API Documentation";
                    options.DocumentPath = "/api/openapi/{documentName}/openapi.json";
                });

                services.AddOpenApiDocument(document =>
                {
                    document.AddSecurity("bearer token", Enumerable.Empty<string>(), new OpenApiSecurityScheme
                    {
                        Type = OpenApiSecuritySchemeType.Http,
                        Scheme = "Bearer",
                        BearerFormat = "paste token here",
                        In = OpenApiSecurityApiKeyLocation.Header
                    });

                    document.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("bearer token"));
                    document.GenerateAbstractProperties = true;
                });
            }
            services.AddControllers(options =>
            {
                options.Filters.Add(new HttpResponseExceptionFilter());
                options.Filters.Add(new AuthorizeFilter(JwtBearerDefaults.AuthenticationScheme));
            });

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                configuration.GetSection("jwt").Bind(options);

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    RequireSignedTokens = true,
                    RequireAudience = true,
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(60),
                    NameClaimType = ClaimTypes.Upn,
                    RoleClaimType = ClaimTypes.Role,
                    ValidateActor = true,
                    ValidateIssuerSigningKey = true,
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
                        var logger = c.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("JwtBearer");

                        var userService = c.HttpContext.RequestServices.GetRequiredService<IUserService>();
                        c.Principal = await userService.GetPrincipal(c.Principal);
                        logger.LogDebug("Token validated for {0}", c.Principal?.Identity?.Name);
                    }
                };
                options.Validate();
            });
            services.AddAuthorization(options =>
            {
                options.AddPolicy(JwtBearerDefaults.AuthenticationScheme, policy =>
                {
                    policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                        .RequireAuthenticatedUser()
                        .RequireClaim("user_role")
                        .RequireClaim("user_team");
                });
                options.DefaultPolicy = options.GetPolicy(JwtBearerDefaults.AuthenticationScheme) ?? null!;
            });
        }

        public void ConfigurePipeline(PipelineServices services)
        {
            var env = services.Environment;
            var app = services.Application;

            if (!env.IsProduction())
            {
                //app.UseExceptionHandler("/error-details");
                app.UseOpenApi();
                app.UseSwaggerUi3();
            }
            else
            {
                //app.UseExceptionHandler("/error");
            }

            if (env.IsDevelopment())
            {
                IdentityModelEventSource.ShowPII = true;
            }
        }
    }
}
