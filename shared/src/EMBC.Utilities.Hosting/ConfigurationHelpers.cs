using System.Linq;
using System.Reflection;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Extensions;
using EMBC.Utilities.Telemetry;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace EMBC.Utilities.Hosting
{
    public static class ConfigurationHelpers
    {
        public static void ConfigureComponentServices(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment, TelemetryProvider telemetryProvider, params Assembly[] assemblies)
        {
            var reporter = telemetryProvider.Get(nameof(ConfigureComponentServices));
            var configServices = new ConfigurationServices
            {
                Services = services,
                Configuration = configuration,
                Environment = environment,
                Logger = reporter
            };
            reporter.LogInformation("scanning {0} assemblies for service configuration", assemblies.Length);
            foreach (var assembly in assemblies)
            {
                var configurations = assembly.CreateInstancesOf<IConfigureComponentServices>();
                reporter.LogDebug("assembly {0}: discovered {1} component configurations", assembly.GetName().Name, configurations.Length);
                foreach (var config in configurations)
                {
                    reporter.LogDebug("configuring {0} services", config.GetType().FullName);
                    config.ConfigureServices(configServices);
                }
            }
            reporter.LogInformation("finished service configuration scan");
        }

        public static void ConfigureComponentPipeline(this IApplicationBuilder app, IConfiguration configuration, IHostEnvironment environment, TelemetryProvider telemetryProvider, params Assembly[] assemblies)
        {
            var reporter = telemetryProvider.Get(nameof(ConfigureComponentServices));
            var pipelineServices = new PipelineServices
            {
                Application = app,
                Configuration = configuration,
                Environment = environment,
                Logger = reporter
            };
            reporter.LogInformation("scanning {0} assemblies for pipeline configuration", assemblies.Length);
            foreach (var assembly in assemblies)
            {
                var configurations = assembly.CreateInstancesOf<IConfigureComponentPipeline>();
                reporter.LogDebug("assembly {0}: discovered {1} component configurations", assembly.GetName().Name, configurations.Length);
                foreach (var config in configurations)
                {
                    reporter.LogDebug("configuring {0} pipeline", config.GetType().FullName);
                    config.ConfigurePipeline(pipelineServices);
                }
            }
            reporter.LogInformation("finished pipeline configuration scan");
        }

        public static void AddBackgroundTasks(this IServiceCollection services, TelemetryProvider telemetryProvider, params Assembly[] assemblies)
        {
            var reporter = telemetryProvider.Get(nameof(AddBackgroundTasks));
            var backgroundTasks = assemblies.SelectMany(a => a.Discover<IBackgroundTask>()).ToArray();
            var mi = typeof(BackgroundTaskEx).GetMethod(nameof(BackgroundTaskEx.AddBackgroundTask)) ?? null!;
            foreach (var task in backgroundTasks)
            {
                reporter.LogInformation("Adding background task {0}", task.FullName);
                mi.MakeGenericMethod(task).Invoke(null, new[] { services });
            }
        }
    }
}
