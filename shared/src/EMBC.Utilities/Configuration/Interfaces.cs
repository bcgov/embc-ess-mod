using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EMBC.Utilities.Telemetry;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace EMBC.Utilities.Configuration
{
    public class ConfigurationServices
    {
        public IServiceCollection Services { get; set; } = null!;
        public IConfiguration Configuration { get; set; } = null!;
        public IHostEnvironment Environment { get; set; } = null!;
        public ITelemetryReporter Logger { get; set; } = null!;
    }

    public interface IConfigureComponentServices
    {
        void ConfigureServices(ConfigurationServices configurationServices);
    }

    public class PipelineServices
    {
        public IApplicationBuilder Application { get; set; } = null!;
        public IConfiguration Configuration { get; set; } = null!;
        public IHostEnvironment Environment { get; set; } = null!;
        public ITelemetryReporter Logger { get; set; } = null!;
    }

    public interface IConfigureComponentPipeline
    {
        void ConfigurePipeline(PipelineServices services);
    }

    public interface IHaveGrpcServices
    {
        Type[] GetGrpcServiceTypes();
    }

    public interface IVersionInformationProvider
    {
        Task<IEnumerable<VersionInformation>> Get();
    }

    public class VersionInformation
    {
        public string Name { get; set; } = null!;
        public Version? Version { get; set; }
    }
}
