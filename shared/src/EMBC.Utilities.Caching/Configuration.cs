using EMBC.Utilities.Configuration;
using EMBC.Utilities.Telemetry;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Utilities.Caching
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddSingleton(sp => new CacheSyncManager(sp.GetRequiredService<ITelemetryProvider>()));
            configurationServices.Services.AddSingleton<ICache, Cache>();
        }
    }
}
