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
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Metadata;
using EMBC.ESS.Utilities.Cache;

namespace EMBC.ESS.Managers.Metadata
{
    public class MetadataManager
    {
        private readonly ICache cache;
        private readonly IMapper mapper;
        private readonly Resources.Metadata.IMetadataRepository metadataRepository;
        private static readonly TimeSpan cacheEntryLifetime = TimeSpan.FromMinutes(5);

        public MetadataManager(ICache cache, IMapper mapper, Resources.Metadata.IMetadataRepository metadataRepository)
        {
            this.cache = cache;
            this.mapper = mapper;
            this.metadataRepository = metadataRepository;
        }

        public async Task<CountriesQueryResponse> Handle(CountriesQuery _)
        {
            var countries = await cache.GetOrSet("metadata:countries", () => metadataRepository.GetCountries(), DateTimeOffset.UtcNow.Add(cacheEntryLifetime));

            return new CountriesQueryResponse { Items = mapper.Map<IEnumerable<Country>>(countries) };
        }

        public async Task<StateProvincesQueryResponse> Handle(StateProvincesQuery req)
        {
            var stateProvinces = await cache.GetOrSet("metadata:state_provinces", () => metadataRepository.GetStateProvinces(), DateTimeOffset.UtcNow.Add(cacheEntryLifetime));

            if (!string.IsNullOrEmpty(req.CountryCode))
            {
                stateProvinces = stateProvinces.Where(sp => sp.CountryCode == req.CountryCode);
            }

            return new StateProvincesQueryResponse { Items = mapper.Map<IEnumerable<StateProvince>>(stateProvinces) };
        }

        public async Task<CommunitiesQueryResponse> Handle(CommunitiesQuery req)
        {
            var communities = await cache.GetOrSet("metadata:communities", () => metadataRepository.GetCommunities(), DateTimeOffset.UtcNow.Add(cacheEntryLifetime));

            if (!string.IsNullOrEmpty(req.CountryCode))
            {
                communities = communities.Where(c => c.CountryCode == req.CountryCode);
            }
            if (!string.IsNullOrEmpty(req.StateProvinceCode))
            {
                communities = communities.Where(c => c.StateProvinceCode == req.StateProvinceCode);
            }

            if (req.Types != null && req.Types.Any())
            {
                var types = req.Types.Select(t => t.ToString()).ToArray();
                communities = communities.Where(c => types.Any(t => t == c.Type.ToString()));
            }

            return new CommunitiesQueryResponse { Items = mapper.Map<IEnumerable<Community>>(communities) };
        }

        public async Task<SecurityQuestionsQueryResponse> Handle(SecurityQuestionsQuery _)
        {
            var questions = await metadataRepository.GetSecurityQuestions();

            return new SecurityQuestionsQueryResponse { Items = questions };
        }

        public async Task<OutageQueryResponse> Handle(Shared.Contracts.Metadata.OutageQuery query)
        {
            var outages = await metadataRepository.GetPlannedOutages(new Resources.Metadata.OutageQuery { DisplayDate = DateTime.UtcNow, PortalType = Enum.Parse<Resources.Metadata.PortalType>(query.PortalType.ToString()) });

            return new OutageQueryResponse { OutageInfo = mapper.Map<OutageInformation>(outages.OrderBy(o => o.OutageStartDate).FirstOrDefault()) };
        }
    }
}
