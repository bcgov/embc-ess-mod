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
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;

namespace EMBC.Suppliers.API.ConfigurationModule.Models
{
    public interface IListsProvider
    {
        Task<IEnumerable<Country>> GetCountriesAsync();
        Task<IEnumerable<StateProvince>> GetStateProvincesAsync(string countryCode);
        Task<IEnumerable<Jurisdiction>> GetJurisdictionsAsync(JurisdictionType[] types, string stateProvinceCode, string countryCode);
        Task<IEnumerable<Support>> GetSupportsAsync();
    }
    public class ListsProvider : IListsProvider
    {
        private readonly IListsRepository listsRepository;

        public ListsProvider(IListsRepository listsRepository)
        {
            this.listsRepository = listsRepository;
        }

        public async Task<IEnumerable<Country>> GetCountriesAsync()
        {
            var countries = await listsRepository.GetCountriesAsync();
            return countries.Select(c => new Country { Code = c.era_countrycode, Name = c.era_name }).OrderBy(c => c.Name);
        }

        public async Task<IEnumerable<Jurisdiction>> GetJurisdictionsAsync(JurisdictionType[] types, string stateProvinceCode, string countryCode)
        {
            var country = (await listsRepository.GetCountriesAsync()).SingleOrDefault(c => c.era_countrycode == countryCode);
            if (country == null) return Array.Empty<Jurisdiction>();
            var stateProvince = (await listsRepository.GetStateProvincesAsync()).SingleOrDefault(sp => sp._era_relatedcountry_value == country.era_countryid && sp.era_code == stateProvinceCode);
            if (stateProvince == null) return Array.Empty<Jurisdiction>();

            return (await listsRepository.GetJurisdictionsAsync())
                .Where(j => j._era_relatedprovincestate_value == stateProvince.era_provinceterritoriesid &&
                    (types == null || !types.Any() || types.Any(t => ((int)t).ToString().Equals(j.era_type))))
                .Select(j => new Jurisdiction
                {
                    Code = j.era_jurisdictionid,
                    Name = j.era_jurisdictionname,
                    Type = string.IsNullOrWhiteSpace(j.era_type) ? JurisdictionType.Undefined : Enum.Parse<JurisdictionType>(j.era_type, true),
                    StateProvinceCode = stateProvinceCode,
                    CountryCode = countryCode
                }).OrderBy(j => j.Name);
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvincesAsync(string countryCode)
        {
            var country = (await listsRepository.GetCountriesAsync()).SingleOrDefault(c => c.era_countrycode == countryCode);
            if (country == null) return Array.Empty<StateProvince>();
            return (await listsRepository.GetStateProvincesAsync())
                .Where(sp => sp._era_relatedcountry_value == country.era_countryid)
                .Select(sp => new StateProvince { Code = sp.era_code, Name = sp.era_name, CountryCode = countryCode })
                .OrderBy(sp => sp.Name);
        }

        public async Task<IEnumerable<Support>> GetSupportsAsync()
        {
            var supports = await listsRepository.GetSupportsAsync();
            return supports.Select(s => new Support { Code = s.era_name, Name = s.era_name })
                .OrderBy(s => s.Name);
        }
    }
}
