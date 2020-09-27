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
using System.Threading.Tasks;
using EMBC.Registrants.API.Dynamics;

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
        private readonly IDynamicsListsGateway dynamicsListsGateway;

        public ListsRepository(IDynamicsListsGateway dynamicsListsGateway)
        {
            this.dynamicsListsGateway = dynamicsListsGateway;
        }

        public async Task<IEnumerable<Country>> GetCountries()
        {
            return (await dynamicsListsGateway.GetCountriesAsync()).Select(c => new Country { Code = c.era_countrycode, Name = c.era_name });
        }

        public async Task<IEnumerable<Jurisdiction>> GetJurisdictions()
        {
            var countries = (await dynamicsListsGateway.GetCountriesAsync()).ToArray();
            var stateProvinces = (await dynamicsListsGateway.GetStateProvincesAsync()).ToArray();
            // TODO: optimize state/province and country mapping
            return (await dynamicsListsGateway.GetJurisdictionsAsync()).Select(j => new Jurisdiction
            {
                Code = j.era_jurisdictionid,
                Name = j.era_jurisdictionname,
                Type = string.IsNullOrWhiteSpace(j.era_type) ? JurisdictionType.Undefined : Enum.Parse<JurisdictionType>(j.era_type, true),
                StateProvinceCode = stateProvinces.Single(sp => sp.era_provinceterritoriesid == j._era_relatedprovincestate_value).era_code,
                CountryCode = countries.Single(c => c.era_countryid == stateProvinces.Single(sp => sp.era_provinceterritoriesid == j._era_relatedprovincestate_value)._era_relatedcountry_value).era_countrycode
            });
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvinces()
        {
            var countries = (await dynamicsListsGateway.GetCountriesAsync()).ToArray();
            return (await dynamicsListsGateway.GetStateProvincesAsync()).Select(sp => new StateProvince
            {
                Code = sp.era_provinceterritoriesid,
                Name = sp.era_name,
                CountryCode = countries.Single(c => c.era_countryid == sp._era_relatedcountry_value).era_countrycode
            });
        }
    }
}
