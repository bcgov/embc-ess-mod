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
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.Registrants.API.Shared;
using Microsoft.Extensions.Caching.Distributed;

namespace EMBC.Registrants.API.LocationModule
{
    public interface ILocationManager
    {
        Task<IEnumerable<Country>> GetCountries();

        Task<IEnumerable<Jurisdiction>> GetJurisdictions(string countryCode, string stateProvinceCode, JurisdictionType[] types = null);

        Task<IEnumerable<StateProvince>> GetStateProvinces(string countryCode);
    }

    public class LocationManager : ILocationManager
    {
        private readonly IDistributedCache cache;

        public LocationManager(IDistributedCache cache)
        {
            this.cache = cache;
        }

        public async Task<IEnumerable<Country>> GetCountries()
        {
            return JsonSerializer.Deserialize<IEnumerable<Country>>(await cache.GetAsync(LocationCacheNames.Countries)).ToArray();
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvinces(string countryCode)
        {
            return JsonSerializer.Deserialize<IEnumerable<StateProvince>>(await cache.GetAsync(LocationCacheNames.StateProvinces))
                .Where(sp => sp.CountryCode == countryCode)
                .ToArray();
        }

        public async Task<IEnumerable<Jurisdiction>> GetJurisdictions(string countryCode, string stateProvinceCode, JurisdictionType[] types = null)
        {
            if (types == null) types = Array.Empty<JurisdictionType>();
            return JsonSerializer.Deserialize<IEnumerable<Jurisdiction>>(await cache.GetAsync(LocationCacheNames.Jurisdictions))
                .Where(j => j.CountryCode == countryCode && j.StateProvinceCode == stateProvinceCode && (types.Length == 0 || types.Contains(j.Type)))
                .ToArray();
        }
    }
}
