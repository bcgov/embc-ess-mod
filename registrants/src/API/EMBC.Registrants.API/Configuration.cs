using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using EMBC.Registrants.API.Services;
using EMBC.Utilities.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace EMBC.Registrants.API;

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
#pragma warning disable S4830 // Server certificates should be verified during SSL/TLS connections
             options.BackchannelHttpHandler = new HttpClientHandler
             {
                 ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
             };
#pragma warning restore S4830 // Server certificates should be verified during SSL/TLS connections

             configuration.GetSection("auth:jwt").Bind(options);
             options.TokenValidationParameters = new TokenValidationParameters
             {
                 ValidateAudience = false,
                 NameClaimType = JwtRegisteredClaimNames.Sub,
             };

             // if token does not contain a dot, it is a reference token, forward to introspection auth scheme
             options.ForwardDefaultSelector = ctx =>
             {
                 var authHeader = (string)ctx.Request.Headers["Authorization"];
                 if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ")) return null;
                 return authHeader.Substring("Bearer ".Length).Trim().Contains('.') ? null : "introspection";
             };
         })
         //reference tokens handling
         .AddOAuth2Introspection("introspection", options =>
         {
             options.EnableCaching = true;
             options.CacheDuration = TimeSpan.FromMinutes(20);
             options.NameClaimType = JwtRegisteredClaimNames.Sub;
             configuration.GetSection("auth:introspection").Bind(options);
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

        services.AddSwaggerGen(opts =>
        {
            opts.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Registrants Portal API",
                Version = "v1"
            });

            opts.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "JWT Authorization header using the Bearer scheme."
            });
            opts.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "bearerAuth" }
                    },
                    new string[] {}
                }
            });
            opts.CustomOperationIds(apiDesc => apiDesc.TryGetMethodInfo(out MethodInfo methodInfo) ? $"{apiDesc.ActionDescriptor.RouteValues["controller"]}{methodInfo.Name}" : null);
            opts.OperationFilter<ContentTypeOperationFilter>();
            opts.UseOneOfForPolymorphism();
            opts.UseAllOfForInheritance();
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
            app.UseSwagger(opts =>
            {
                opts.RouteTemplate = "api/openapi/{documentName}/openapi.json";
            });
            app.UseSwaggerUI(opts =>
            {
                opts.SwaggerEndpoint("v1/openapi.json", "Registrants portal API");
                opts.RoutePrefix = "api/openapi";
            });
        }
        app.UseAuthentication();
        app.UseAuthorization();
    }
}

internal class ContentTypeOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        foreach (var (_, response) in operation.Responses)
        {
            if (response.Content.ContainsKey("text/plain"))
                response.Content.Remove("text/plain");
            if (response.Content.ContainsKey("text/json"))
                response.Content.Remove("text/json");
        }
    }
}
