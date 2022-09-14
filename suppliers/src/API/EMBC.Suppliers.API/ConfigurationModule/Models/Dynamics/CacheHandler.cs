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
using System.Threading;
using System.Threading.Tasks;
using Cronos;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public interface ICacheHandler
    {
        Task Handle(RefreshCacheCommand cmd, CancellationToken stoppingToken);
    }

    public class CacheHandler : ICacheHandler
    {
        private readonly ILogger<CacheHandler> logger;
        private readonly IListsRepository listsRepository;
        private readonly IListsGateway listsGateway;
        private readonly IFileSystem fileSystem;
        private readonly FileBasedCachedListsOptions options;
        private static readonly Random random = new Random();
        private readonly CronExpression schedule;

        public CacheHandler(ILogger<CacheHandler> logger,
            IListsRepository listsRepository,
            IListsGateway listsGateway,
            IFileSystem fileSystem,
            IOptions<FileBasedCachedListsOptions> options)
        {
            this.logger = logger;
            this.listsRepository = listsRepository;
            this.listsGateway = listsGateway;
            this.fileSystem = fileSystem;
            this.options = options.Value;
            schedule = CronExpression.Parse("* 16 * * * *", CronFormat.IncludeSeconds);
        }

        public async Task Handle(RefreshCacheCommand _, CancellationToken stoppingToken)
        {
            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    logger.LogInformation("Start metadata cache refresh");
                    if (!fileSystem.Directory.Exists(options.CachePath)) fileSystem.Directory.CreateDirectory(options.CachePath);
                    await listsRepository.SetCountriesAsync(await listsGateway.GetCountriesAsync());
                    await listsRepository.SetStateProvincesAsync(await listsGateway.GetStateProvincesAsync());
                    await listsRepository.SetJurisdictionsAsync(await listsGateway.GetJurisdictionsAsync());
                    await listsRepository.SetSupportsAsync(await listsGateway.GetSupportsAsync());
                    logger.LogInformation("End metadata cache refresh");
                    var nextExecutionDelay = CalculateNextExecutionDelay(DateTime.UtcNow);
                    logger.LogDebug("next run in {0}s", nextExecutionDelay.TotalSeconds);
                    await Task.Delay(nextExecutionDelay, stoppingToken);
                }
            }
            catch (Exception e)
            {
                logger.LogError(e, "Failed to refresh cached lists from Dynamics");
            }
        }

        private TimeSpan CalculateNextExecutionDelay(DateTime utcNow)
        {
            var nextDate = schedule.GetNextOccurrence(utcNow);
            if (nextDate == null) throw new InvalidOperationException("Cannot calculate the next execution date, stopping the background task");

            return nextDate.Value.Subtract(utcNow);
        }
    }

    public class RefreshCacheCommand { }
}
