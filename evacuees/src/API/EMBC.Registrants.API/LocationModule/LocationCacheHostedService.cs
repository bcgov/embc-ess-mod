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
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace EMBC.Registrants.API.LocationModule
{
    public class LocationCacheHostedService : IHostedService, IDisposable
    {
        private readonly IDistributedCache cache;
        private readonly IListsRepository listsRepository;
        private readonly ILogger logger;
        private readonly LocationCacheHostedServiceOptions options;
        private Timer timer;
        private bool disposedValue;

        public LocationCacheHostedService(IDistributedCache cache, IListsRepository listsRepository, ILogger<LocationCacheHostedService> logger, IOptions<LocationCacheHostedServiceOptions> options)
        {
            this.cache = cache;
            this.listsRepository = listsRepository;
            this.logger = logger;
            this.options = options.Value;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            if (!options.AutoRefreshEnabled)
            {
                logger.LogWarning("{0} will not auto refresh the cache and will attempt to load the cache only once", nameof(LocationCacheHostedService));
                await RefreshCache(cancellationToken);
                return;
            }

            logger.LogInformation("{0} starting and will auto refresh the cache every {1} seconds", nameof(LocationCacheHostedService), options.RefreshInterval.TotalSeconds);
            timer = new Timer(async (s) =>
                {
                    await RefreshCache(cancellationToken);
                }, null,
                TimeSpan.Zero,
                options.RefreshInterval);

            await Task.CompletedTask;
        }

        private async Task RefreshCache(CancellationToken cancellationToken)
        {
            try
            {
                logger.LogInformation("{0} starting location cache refresh", nameof(LocationCacheHostedService));
                await cache.SetAsync(LocationCacheNames.Countries, JsonSerializer.SerializeToUtf8Bytes(await listsRepository.GetCountries()), cancellationToken);
                await cache.SetAsync(LocationCacheNames.StateProvinces, JsonSerializer.SerializeToUtf8Bytes(await listsRepository.GetStateProvinces()), cancellationToken);
                await cache.SetAsync(LocationCacheNames.Jurisdictions, JsonSerializer.SerializeToUtf8Bytes(await listsRepository.GetJurisdictions()), cancellationToken);
                logger.LogInformation("{0} finished location cache refresh", nameof(LocationCacheHostedService));
            }
            catch (Exception e)
            {
                logger.LogError(e, "{0} finished location cache refresh with error", nameof(LocationCacheHostedService));
            }
        }

        public async Task StopAsync(CancellationToken cancellationToken)
        {
            logger.LogInformation("{0} stopping", nameof(LocationCacheHostedService));
            timer?.Change(Timeout.Infinite, 0);
            await Task.CompletedTask;
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    timer?.Dispose();
                }
                disposedValue = true;
            }
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }

    public class LocationCacheHostedServiceOptions
    {
        public TimeSpan RefreshInterval { get; set; } = TimeSpan.FromMinutes(60);
        public bool AutoRefreshEnabled { get; set; } = true;
    }
}
