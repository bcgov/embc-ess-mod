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
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Cache;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.Logging;

namespace EMBC.ESS.Resources.Metadata
{
    public class CacheUpdater : IBackgroundTask
    {
        private readonly ILogger<CacheUpdater> logger;
        private readonly ICache cache;
        private readonly IMetadataRepository metadataRepository;

        public CacheUpdater(ILogger<CacheUpdater> logger, ICache cache, IEssContextFactory essContextFactory, IMapper mapper)
        {
            this.logger = logger;
            this.cache = cache;
            this.metadataRepository = new InternalMetadataRepository(essContextFactory, mapper);
        }

        public string Schedule => "* 15 * * * *";

        public int DegreeOfParallelism => 1;

        public TimeSpan InitialDelay => TimeSpan.FromSeconds(10);

        public async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            logger.LogInformation("Start metadata cache refresh");
            await cache.Refresh(MetadataRepository.CountriesCacheKey, metadataRepository.GetCountries, MetadataRepository.CacheEntryLifetime);
            await cache.Refresh(MetadataRepository.StatesProvincesCacheKey, metadataRepository.GetStateProvinces, MetadataRepository.CacheEntryLifetime);
            await cache.Refresh(MetadataRepository.CommunitiesCacheKey, metadataRepository.GetCommunities, MetadataRepository.CacheEntryLifetime);
            await cache.Refresh(MetadataRepository.SecurityQuestionsCacheKey, metadataRepository.GetSecurityQuestions, MetadataRepository.CacheEntryLifetime);
            logger.LogInformation("End metadata cache refresh");
        }
    }
}
