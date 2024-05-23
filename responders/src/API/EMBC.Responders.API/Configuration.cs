using System;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;
using EMBC.Responders.API.Services;
using EMBC.Utilities.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace EMBC.Responders.API;

public class Configuration : IConfigureComponentServices, IConfigureComponentPipeline
{
    public void ConfigureServices(ConfigurationServices configurationServices)
    {
        var services = configurationServices.Services;

        services.AddAuthentication(options =>
        {
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
        {
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

            configurationServices.Configuration.GetSection("jwt").Bind(options);

            options.Events = new JwtBearerEvents
            {
                OnTokenValidated = async c =>
                {
                    var userService = c.HttpContext.RequestServices.GetRequiredService<IUserService>();
                    c.Principal = await userService.GetPrincipal(c.Principal);
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

        services.AddSwaggerGen(opts =>
        {
            opts.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Responders Portal API",
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

        services.AddTransient<IUserService, UserService>();
        services.AddTransient<IEvacuationSearchService, EvacuationSearchService>();
    }

    public void ConfigurePipeline(PipelineServices services)
    {
        var app = services.Application;
        var env = services.Environment;

        if (services.Environment.IsDevelopment())
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
                opts.SwaggerEndpoint("v1/openapi.json", "Responders portal API");
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
