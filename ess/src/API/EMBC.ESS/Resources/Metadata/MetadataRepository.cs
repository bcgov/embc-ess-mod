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
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Cache;
using EMBC.ESS.Utilities.Dynamics;

namespace EMBC.ESS.Resources.Metadata
{
    public class MetadataRepository : IMetadataRepository
    {
        internal const string CountriesCacheKey = "metadata:countries";
        internal const string StatesProvincesCacheKey = "metadata:stateprovinces";
        internal const string CommunitiesCacheKey = "metadata:communities";
        internal const string SecurityQuestionsCacheKey = "metadata:securityquestions";
        internal const string PlannedOutagesCacheKey = "metadata:plannedoutages";

        internal static readonly TimeSpan CacheEntryLifetime = TimeSpan.FromMinutes(60);

        private readonly InternalMetadataRepository internalRepository;
        private readonly ICache cache;

        public MetadataRepository(IEssContextFactory essContextFactory, IMapper mapper, ICache cache)
        {
            this.internalRepository = new InternalMetadataRepository(essContextFactory, mapper);
            this.cache = cache;
        }

        public async Task<IEnumerable<Country>> GetCountries()
        {
            return await cache.GetOrSet(CountriesCacheKey, internalRepository.GetCountries, CacheEntryLifetime);
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvinces()
        {
            return await cache.GetOrSet(StatesProvincesCacheKey, internalRepository.GetStateProvinces, CacheEntryLifetime);
        }

        public async Task<IEnumerable<Community>> GetCommunities()
        {
            return await cache.GetOrSet(CommunitiesCacheKey, internalRepository.GetCommunities, CacheEntryLifetime);
        }

        public async Task<string[]> GetSecurityQuestions()
        {
            return await cache.GetOrSet(SecurityQuestionsCacheKey, internalRepository.GetSecurityQuestions, CacheEntryLifetime);
        }

        public async Task<IEnumerable<OutageInformation>> GetPlannedOutages(OutageQuery query)
        {
            return await cache.GetOrSet($"{PlannedOutagesCacheKey}:{query.PortalType}", () => internalRepository.GetPlannedOutages(query), CacheEntryLifetime);
        }
    }
}
