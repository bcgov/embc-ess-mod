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

namespace EMBC.Registrants.API.LocationModule
{
    public class LocationCacheHostedService : IHostedService, IDisposable
    {
        private readonly IDistributedCache cache;
        private readonly IListsRepository listsRepository;
        private readonly ILogger logger;
        private Timer timer;
        private bool disposedValue;

        private TimeSpan refreshInterval = TimeSpan.FromSeconds(300);

        public LocationCacheHostedService(IDistributedCache cache, IListsRepository listsRepository, ILogger<LocationCacheHostedService> logger)
        {
            this.cache = cache;
            this.listsRepository = listsRepository;
            this.logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            logger.LogInformation("{0} starting", nameof(LocationCacheHostedService));
            timer = new Timer(async (s) =>
                {
                    logger.LogInformation("{0} starting location cache refresh", nameof(LocationCacheHostedService));
                    try
                    {
                        await cache.SetAsync(LocationCacheNames.Countries, JsonSerializer.SerializeToUtf8Bytes(await listsRepository.GetCountries()), cancellationToken);
                        await cache.SetAsync(LocationCacheNames.StateProvinces, JsonSerializer.SerializeToUtf8Bytes(await listsRepository.GetStateProvinces()), cancellationToken);
                        await cache.SetAsync(LocationCacheNames.Jurisdictions, JsonSerializer.SerializeToUtf8Bytes(await listsRepository.GetJurisdictions()), cancellationToken);
                        logger.LogInformation("{0} finished location cache refresh", nameof(LocationCacheHostedService));
                    }
                    catch (Exception e)
                    {
                        logger.LogError(e, "{0} finished location cache refresh with error", nameof(LocationCacheHostedService));
                    }
                }, null,
                TimeSpan.Zero,
                refreshInterval);

            await Task.CompletedTask;
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
}
