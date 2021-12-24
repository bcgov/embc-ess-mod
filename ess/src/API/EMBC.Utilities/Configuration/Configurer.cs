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
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EMBC.Utilities.Configuration
{
    public interface IConfigureComponentServices
    {
        void ConfigureServices(ConfigurationServices services);
    }

    public class ConfigurationServices
    {
        public IServiceCollection Services { get; internal set; } = null!;
        public IConfiguration Configuration { get; internal set; } = null!;
        public IHostEnvironment Environment { get; internal set; } = null!;
        public ILogger Logger { get; internal set; } = null!;
    }

    public interface IConfigureComponentPipeline
    {
        void ConfigurePipeline(PipelineServices services);
    }

    public interface IHaveGrpcServices
    {
        Type[] GetGrpcServiceTypes();
    }

    public class PipelineServices
    {
        public IApplicationBuilder Application { get; internal set; } = null!;
        public IConfiguration Configuration { get; internal set; } = null!;
        public IHostEnvironment Environment { get; internal set; } = null!;
        public ILogger Logger { get; internal set; } = null!;
    }

    public static class Configurer
    {
        public static I[] CreateInstancesOf<I>(this Assembly assembly) =>
            assembly.DefinedTypes.Where(t => t.IsClass && !t.IsAbstract && t.IsPublic && typeof(I).IsAssignableFrom(t)).Select(t => (I)Activator.CreateInstance(t)).ToArray();

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
    }
}
