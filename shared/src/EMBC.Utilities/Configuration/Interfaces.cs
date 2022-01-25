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
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EMBC.Utilities.Configuration
{
    public class ConfigurationServices
    {
        public IServiceCollection Services { get; set; } = null!;
        public IConfiguration Configuration { get; set; } = null!;
        public IHostEnvironment Environment { get; set; } = null!;
        public ILogger Logger { get; set; } = null!;
    }

    public interface IConfigureComponentServices
    {
        void ConfigureServices(ConfigurationServices services);
    }

    public class PipelineServices
    {
        public IApplicationBuilder Application { get; set; } = null!;
        public IConfiguration Configuration { get; set; } = null!;
        public IHostEnvironment Environment { get; set; } = null!;
        public ILogger Logger { get; set; } = null!;
    }

    public interface IConfigureComponentPipeline
    {
        void ConfigurePipeline(PipelineServices services);
    }

    public interface IHaveGrpcServices
    {
        Type[] GetGrpcServiceTypes();
    }

    public interface IBackgroundTask
    {
        public string Schedule { get; }
        public int DegreeOfParallelism { get; }

        public Task ExecuteAsync(CancellationToken cancellationToken);
    }

    public static class DiscoveryEx
    {
        public static Type[] Discover<I>(this Assembly assembly) =>
            assembly.DefinedTypes.Where(t => t.IsClass && !t.IsAbstract && t.IsPublic && typeof(I).IsAssignableFrom(t)).ToArray();

        public static I[] CreateInstancesOf<I>(this Assembly assembly) =>
            assembly.Discover<I>().Select(t => (I)Activator.CreateInstance(t)).ToArray();
    }
}
