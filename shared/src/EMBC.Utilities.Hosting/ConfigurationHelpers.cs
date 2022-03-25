using System.Linq;
using System.Reflection;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EMBC.Utilities.Hosting
{
    public static class ConfigurationHelpers
    {
        public static void ConfigureComponentServices(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment, ILogger logger, params Assembly[] assemblies)
        {
            var configServices = new ConfigurationServices
            {
                Services = services,
                Configuration = configuration,
                Environment = environment,
                Logger = logger
            };
            logger.LogInformation("scanning {0} assemblies for service configuration", assemblies.Length);
            foreach (var assembly in assemblies)
            {
                var configurations = assembly.CreateInstancesOf<IConfigureComponentServices>();
                logger.LogDebug("assembly {0}: discovered {1} component configurations", assembly.GetName().Name, configurations.Length);
                foreach (var config in configurations)
                {
                    logger.LogDebug("configuring {1} services", config.GetType().FullName);
                    config.ConfigureServices(configServices);
                }
            }
            logger.LogInformation("finished service configuration scan");
        }

        public static void ConfigureComponentPipeline(this IApplicationBuilder app, IConfiguration configuration, IHostEnvironment environment, ILogger logger, params Assembly[] assemblies)
        {
            var pipelineServices = new PipelineServices
            {
                Application = app,
                Configuration = configuration,
                Environment = environment,
                Logger = logger
            };
            logger.LogInformation("scanning {0} assemblies for pipeline configuration", assemblies.Length);
            foreach (var assembly in assemblies)
            {
                var configurations = assembly.CreateInstancesOf<IConfigureComponentPipeline>();
                logger.LogDebug("assembly {0}: discovered {1} component configurations", assembly.GetName().Name, configurations.Length);
                foreach (var config in configurations)
                {
                    logger.LogDebug("configuring {0} pipeline", config.GetType().FullName);
                    config.ConfigurePipeline(pipelineServices);
                }
            }
            logger.LogInformation("finished pipeline configuration scan");
        }

        public static void AddBackgroundTasks(this IServiceCollection services, ILogger logger, params Assembly[] assemblies)
        {
            var backgroundTasks = assemblies.SelectMany(a => a.Discover<IBackgroundTask>()).ToArray();
            var mi = typeof(BackgroundTaskEx).GetMethod(nameof(BackgroundTaskEx.AddBackgroundTask)) ?? null!;
            foreach (var task in backgroundTasks)
            {
                logger.LogInformation("Adding background task {0}", task.FullName);
                mi.MakeGenericMethod(task).Invoke(null, new[] { services });
            }
        }
    }
}
