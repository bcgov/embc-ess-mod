using System;
using System.Net.Http;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using EMBC.Registrants.API.Services;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Telemetry;
using IdentityModel.AspNetCore.OAuth2Introspection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using NSwag;
using NSwag.AspNetCore;
using NSwag.Generation.Processors.Security;

namespace EMBC.Registrants.API
{
    public class Configuration : IConfigureComponentServices, IConfigureComponentPipeline
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var services = configurationServices.Services;
            var configuration = configurationServices.Configuration;

            services.Configure<JsonOptions>(opts =>
            {
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });

            services.AddAuthentication()
             //JWT tokens handling
             .AddJwtBearer("jwt", options =>
             {
                 options.BackchannelHttpHandler = new HttpClientHandler
                 {
                     ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                 };

                 configuration.GetSection("auth:jwt").Bind(options);
                 options.TokenValidationParameters = new TokenValidationParameters
                 {
                     ValidateAudience = false
                 };

                 // if token does not contain a dot, it is a reference token, forward to introspection auth scheme
                 options.ForwardDefaultSelector = ctx =>
                 {
                     var authHeader = (string)ctx.Request.Headers["Authorization"];
                     if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ")) return null;
                     return authHeader.Substring("Bearer ".Length).Trim().Contains('.') ? null : "introspection";
                 };
                 options.Events = new JwtBearerEvents
                 {
                     OnTokenValidated = async ctx =>
                     {
                         await Task.CompletedTask;
                         var logger = ctx.HttpContext.RequestServices.GetRequiredService<ITelemetryProvider>().Get<JwtBearerEvents>();
                         var userInfo = ctx.Principal.FindFirstValue("userInfo");
                         logger.LogDebug("{0}", userInfo);
                     },
                     OnAuthenticationFailed = async ctx =>
                     {
                         await Task.CompletedTask;
                         var logger = ctx.HttpContext.RequestServices.GetRequiredService<ITelemetryProvider>().Get<JwtBearerEvents>();
                         logger.LogError(ctx.Exception, "JWT authantication failed");
                     }
                 };
             })
             //reference tokens handling
             .AddOAuth2Introspection("introspection", options =>
             {
                 options.EnableCaching = true;
                 options.CacheDuration = TimeSpan.FromMinutes(20);
                 configuration.GetSection("auth:introspection").Bind(options);
                 options.Events = new OAuth2IntrospectionEvents
                 {
                     OnTokenValidated = async ctx =>
                     {
                         await Task.CompletedTask;
                         var logger = ctx.HttpContext.RequestServices.GetRequiredService<ITelemetryProvider>().Get<OAuth2IntrospectionEvents>();
                         var userInfo = ctx.Principal?.FindFirst("userInfo");
                         logger.LogDebug("{0}", userInfo);
                     },
                     OnAuthenticationFailed = async ctx =>
                     {
                         await Task.CompletedTask;
                         var logger = ctx.HttpContext.RequestServices.GetRequiredService<ITelemetryProvider>().Get<JwtBearerEvents>();
                         logger.LogError(ctx?.Result?.Failure, "Introspection authantication failed");
                     }
                 };
             });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(JwtBearerDefaults.AuthenticationScheme, policy =>
                {
                    policy
                    .RequireAuthenticatedUser()
                    .AddAuthenticationSchemes("jwt")
                    .RequireClaim("scope", "registrants-portal-api");
                });

                options.DefaultPolicy = options.GetPolicy(JwtBearerDefaults.AuthenticationScheme) ?? null!;
            });

            services.Configure<OpenApiDocumentMiddlewareSettings>(options =>
            {
                options.Path = "/api/openapi/{documentName}/openapi.json";
                options.DocumentName = "Registrants Portal API";
                options.PostProcess = (document, req) =>
                {
                    document.Info.Title = "Registrants Portal API";
                };
            });

            services.Configure<SwaggerUi3Settings>(options =>
            {
                options.Path = "/api/openapi";
                options.DocumentTitle = "Registrants Portal API Documentation";
                options.DocumentPath = "/api/openapi/{documentName}/openapi.json";
            });

            services.AddOpenApiDocument(document =>
            {
                document.AddSecurity("bearer token", Array.Empty<string>(), new OpenApiSecurityScheme
                {
                    Type = OpenApiSecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "paste token here",
                    In = OpenApiSecurityApiKeyLocation.Header
                });

                document.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("bearer token"));
                document.GenerateAbstractProperties = true;
            });

            services.AddTransient<IEvacuationSearchService, EvacuationSearchService>();
            services.AddTransient<IProfileInviteService, ProfileInviteService>();

            services.AddHttpClient("captcha");
            services.Configure<CaptchaVerificationServiceOptions>(options =>
            {
                configuration.GetSection("captcha").Bind(options);
            });
            services.AddTransient<ICaptchaVerificationService, CaptchaVerificationService>();
        }

        public void ConfigurePipeline(PipelineServices services)
        {
            var app = services.Application;
            var env = services.Environment;

            if (!env.IsProduction())
            {
                IdentityModelEventSource.ShowPII = true;
            }
            if (!env.IsProduction())
            {
                app.UseOpenApi();
                app.UseSwaggerUi3();
            }
            app.UseAuthentication();
            app.UseAuthorization();
        }
    }
}
