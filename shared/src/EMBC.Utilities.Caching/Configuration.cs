using EMBC.Utilities.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace EMBC.Utilities.Caching
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddSingleton(sp => new CacheSyncManager(sp.GetRequiredService<ILogger<CacheSyncManager>>()));
            configurationServices.Services.AddSingleton<ICache, Cache>();
        }
    }
}
