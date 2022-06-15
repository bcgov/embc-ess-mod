using EMBC.Utilities.Configuration;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace EMBC.Utilities.Telemetry
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.TryAddSingleton<ITelemetryProvider, TelemetryProvider>();
        }
    }
}
