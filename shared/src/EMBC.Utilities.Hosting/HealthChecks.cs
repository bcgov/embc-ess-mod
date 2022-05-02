using System.Linq;
using System.Net;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace EMBC.Utilities.Hosting
{
    internal static class HealthChecks
    {
        private const string HealthCheckReadyTag = "ready";
        private const string HealthCheckAliveTag = "alive";

        public static IEndpointRouteBuilder MapDefaultHealthChecks(this IEndpointRouteBuilder endpointRouteBuilder)
        {
            endpointRouteBuilder.MapHealthChecks("/hc/ready", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckReadyTag) });
            endpointRouteBuilder.MapHealthChecks("/hc/live", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckAliveTag) });

            return endpointRouteBuilder;
        }

        public static IServiceCollection AddDefaultHealthChecks(this IServiceCollection services)
        {
            services.AddHealthChecks()
                .AddCheck($"ready hc", () => HealthCheckResult.Healthy("ready"), new[] { HealthCheckReadyTag })
                .AddCheck($"live hc", () => HealthCheckResult.Healthy("alive"), new[] { HealthCheckAliveTag });

            return services;
        }

        public static IEndpointRouteBuilder MapVersionsEndpoint(this IEndpointRouteBuilder endpointRouteBuilder)
        {
            endpointRouteBuilder.Map("/version", async ctx =>
            {
                var versionInformationProviders = ctx.RequestServices.GetServices<IVersionInformationProvider>();
                var versions = await versionInformationProviders.AsParallel().SelectManyAsync(async vip => await vip.Get());

                ctx.Response.ContentType = "application/json";
                ctx.Response.StatusCode = (int)HttpStatusCode.OK;
                await ctx.Response.WriteAsJsonAsync(versions.ToArray());
            });

            return endpointRouteBuilder;
        }
    }
}
