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
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EMBC.Utilities.Configuration
{
    public interface IComponentConfigurtion
    {
        void Configure(ConfigurationServices configurationServices);
    }

    public class ConfigurationServices
    {
        public IServiceCollection Services { get; internal set; } = null!;
        public IConfiguration Configuration { get; internal set; } = null!;
        public IHostEnvironment Environment { get; internal set; } = null!;
        public ILogger Logger { get; internal set; } = null!;
    }

    public static class Configurer
    {
        private static I[] CreateInstancesOf<I>(this Assembly assembly) =>
            assembly.DefinedTypes.Where(t => t.IsClass && !t.IsAbstract && t.IsPublic && typeof(I).IsAssignableFrom(t)).Select(t => (I)Activator.CreateInstance(t)).ToArray();

        public static void Discover(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment, ILogger logger, params Assembly[] assemblies)
        {
            var configServices = new ConfigurationServices
            {
                Services = services,
                Configuration = configuration,
                Environment = environment,
                Logger = logger
            };
            logger.LogInformation("scanning {0} assemblies", assemblies.Length);
            foreach (var assembly in assemblies)
            {
                var configurations = assembly.CreateInstancesOf<IComponentConfigurtion>();
                logger.LogDebug("assembly {0}: discovered {1} component configurations", assembly.GetName().Name, configurations.Length);
                foreach (var config in configurations)
                {
                    logger.LogDebug("configuring {1}", config.GetType().FullName);
                    config.Configure(configServices);
                }
            }
            logger.LogInformation("finished scan");
        }
    }
}
