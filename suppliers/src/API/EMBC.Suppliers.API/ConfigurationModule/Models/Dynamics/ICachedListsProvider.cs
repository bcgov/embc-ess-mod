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
using System.Threading.Tasks;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public interface ICachedListsProvider
    {
        Task<IEnumerable<CountryEntity>> GetCountriesAsync();

        Task<IEnumerable<JurisdictionEntity>> GetJurisdictionsAsync();

        Task<IEnumerable<StateProvinceEntity>> GetStateProvincesAsync();

        Task<IEnumerable<SupportEntity>> GetSupportsAsync();

        Task SetCountriesAsync(IEnumerable<CountryEntity> countries);

        Task SetJurisdictionsAsync(IEnumerable<JurisdictionEntity> jurisdictions);

        Task SetStateProvincesAsync(IEnumerable<StateProvinceEntity> stateProvinces);

        Task SetSupportsAsync(IEnumerable<SupportEntity> supports);
    }
}
