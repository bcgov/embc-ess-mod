using System;
using System.IO.Abstractions;
using System.Threading.Tasks;
using Jasper;
using Microsoft.Extensions.Logging;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public class CacheHandler
    {
        private readonly IMessageContext messageContext;
        private readonly ILogger<CacheHandler> logger;
        private readonly ICachedListsProvider cache;
        private readonly IListsGateway listsGateway;
        private readonly IFileSystem fileSystem;
        private readonly FileBasedCachedListsOptions options;

        public CacheHandler(IMessageContext messageContext,
            ILogger<CacheHandler> logger,
            ICachedListsProvider cache,
            IListsGateway listsGateway,
            IFileSystem fileSystem,
            FileBasedCachedListsOptions options)
        {
            this.messageContext = messageContext;
            this.logger = logger;
            this.cache = cache;
            this.listsGateway = listsGateway;
            this.fileSystem = fileSystem;
            this.options = options;
        }

        public async Task Handle(RefreshCacheCommand _)
        {
            try
            {
                if (!fileSystem.Directory.Exists(options.CachePath)) fileSystem.Directory.CreateDirectory(options.CachePath);
                await cache.SetCountriesAsync(await listsGateway.GetCountriesAsync());
                await cache.SetStateProvincesAsync(await listsGateway.GetStateProvincesAsync());
                await cache.SetJurisdictionsAsync(await listsGateway.GetJurisdictionsAsync());
                await cache.SetSupportsAsync(await listsGateway.GetSupportsAsync());
            }
            catch (Exception e)
            {
                logger.LogError(e, "Failed to refresh cached lists from Dynamics");
            }
            await messageContext.Schedule(new RefreshCacheCommand(), DateTime.Now.Add(options.UpdateFrequency));
        }
    }

    public class RefreshCacheCommand { }
}
