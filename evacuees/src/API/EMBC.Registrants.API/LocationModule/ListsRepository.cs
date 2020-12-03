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

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ResourceAccess.Dynamics;

namespace EMBC.Registrants.API.LocationModule
{
    public interface IListsRepository
    {
        Task<IEnumerable<Country>> GetCountries();

        Task<IEnumerable<StateProvince>> GetStateProvinces();

        Task<IEnumerable<Jurisdiction>> GetJurisdictions();
    }

    public class ListsRepository : IListsRepository
    {
        private readonly DynamicsClientContext dynamicsClient;

        public ListsRepository(DynamicsClientContext dynamicsClient)
        {
            this.dynamicsClient = dynamicsClient;
        }

        public async Task<IEnumerable<Country>> GetCountries()
        {
            var countries = await dynamicsClient.era_countries.GetAllPagesAsync();
            return countries.Select(c => new Country { Code = c.era_countrycode, Name = c.era_name }).ToArray();
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvinces()
        {
            var provinces = await dynamicsClient.era_provinceterritorieses.Expand(c => c.era_RelatedCountry).GetAllPagesAsync();
            return provinces.Select(sp => new StateProvince
            {
                Code = sp.era_provinceterritoriesid.ToString(),
                Name = sp.era_name,
                CountryCode = sp.era_RelatedCountry.era_countrycode
            }).ToArray();
        }

        public async Task<IEnumerable<Jurisdiction>> GetJurisdictions()
        {
            await GetStateProvinces();  // temporary solution to populate the client's cache with entities, otherwise era_RelatedCountry will be null
            var jurisdictions = await dynamicsClient.era_jurisdictions.Expand(j => j.era_RelatedProvinceState).GetAllPagesAsync();
            return jurisdictions.Select(j => new Jurisdiction
            {
                Code = j.era_jurisdictionid.ToString(),
                Name = j.era_jurisdictionname,
                Type = !j.era_type.HasValue ? JurisdictionType.Undefined : (JurisdictionType)j.era_type.Value,
                StateProvinceCode = j.era_RelatedProvinceState.era_code,
                CountryCode = j.era_RelatedProvinceState.era_RelatedCountry.era_countrycode
            });
        }
    }
}
