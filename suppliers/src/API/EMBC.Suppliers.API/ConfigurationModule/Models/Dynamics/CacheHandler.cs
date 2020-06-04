// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
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
using System.IO.Abstractions;
using System.Threading.Tasks;
using Jasper;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

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
        private static readonly Random random = new Random();

        public CacheHandler(IMessageContext messageContext,
            ILogger<CacheHandler> logger,
            ICachedListsProvider cache,
            IListsGateway listsGateway,
            IFileSystem fileSystem,
            IOptions<FileBasedCachedListsOptions> options)
        {
            this.messageContext = messageContext;
            this.logger = logger;
            this.cache = cache;
            this.listsGateway = listsGateway;
            this.fileSystem = fileSystem;
            this.options = options.Value;
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
            await messageContext.Schedule(new RefreshCacheCommand(), DateTime.Now.AddMinutes(options.UpdateFrequency).AddSeconds(random.Next(-5, 5)));
        }
    }

    public class RefreshCacheCommand { }
}
