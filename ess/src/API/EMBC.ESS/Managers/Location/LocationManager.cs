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
using EMBC.ESS.Shared.Contracts.Location;
using EMBC.ESS.Utilities.Cache;

namespace EMBC.ESS.Managers.Location
{
    public class LocationManager
    {
        private readonly ICache cache;
        private readonly IMapper mapper;
        private readonly Resources.Metadata.IMetadataRepository metadataRepository;
        private static readonly TimeSpan cacheEntryLifetime = TimeSpan.FromMinutes(60);

        public LocationManager(ICache cache, IMapper mapper, Resources.Metadata.IMetadataRepository metadataRepository)
        {
            this.cache = cache;
            this.mapper = mapper;
            this.metadataRepository = metadataRepository;
        }

        public async Task<CountriesQueryReply> Handle(CountriesQueryRequest _)
        {
            var countries = await cache.GetOrAdd("location:countries", () => metadataRepository.GetCountries(), DateTimeOffset.Now.Add(cacheEntryLifetime));

            return new CountriesQueryReply { Items = mapper.Map<IEnumerable<Country>>(countries) };
        }

        public async Task<StateProvincesQueryReply> Handle(StateProvincesQueryRequest req)
        {
            var stateProvinces = await cache.GetOrAdd("location:state_provinces", () => metadataRepository.GetStateProvinces(), DateTimeOffset.Now.Add(cacheEntryLifetime));

            if (!string.IsNullOrEmpty(req.CountryCode))
            {
                stateProvinces = stateProvinces.Where(sp => sp.CountryCode == req.CountryCode);
            }

            return new StateProvincesQueryReply { Items = mapper.Map<IEnumerable<StateProvince>>(stateProvinces) };
        }

        public async Task<CommunitiesQueryReply> Handle(CommunitiesQueryRequest req)
        {
            var communities = await cache.GetOrAdd("location:communities", () => metadataRepository.GetCommunities(), DateTimeOffset.Now.Add(cacheEntryLifetime));

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

            return new CommunitiesQueryReply { Items = mapper.Map<IEnumerable<Community>>(communities) };
        }
    }
}
