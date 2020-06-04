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
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;
using ImTools;

namespace EMBC.Suppliers.API.ConfigurationModule.Models
{
    public class QueriesHandler
    {
        private readonly ICountriesListProvider countriesListProvider;
        private readonly IStateProvincesListProvider stateProvincesListProvider;
        private readonly IJurisdictionsListProvider jurisdictionsListProvider;
        private readonly ISupportsListProvider supportsListProvider;

        public QueriesHandler(ICountriesListProvider countriesListProvider,
            IStateProvincesListProvider provincesListProvider,
            IJurisdictionsListProvider jurisdictionsListProvider,
            ISupportsListProvider supportsListProvider)
        {
            this.countriesListProvider = countriesListProvider;
            this.stateProvincesListProvider = provincesListProvider;
            this.jurisdictionsListProvider = jurisdictionsListProvider;
            this.supportsListProvider = supportsListProvider;
        }

        public async Task<IEnumerable<Country>> Handle(CountriesQueryCommand _)
        {
            return await countriesListProvider.GetCountriesAsync();
        }

        public async Task<IEnumerable<StateProvince>> Handle(StateProvincesQueryCommand cmd)
        {
            return await stateProvincesListProvider.GetStateProvincesAsync(cmd.CountryCode);
        }

        public async Task<IEnumerable<Jurisdiction>> Handle(JurisdictionsQueryCommand cmd)
        {
            var types = cmd.Types ?? Array.Empty<JurisdictionType>();
            return await jurisdictionsListProvider.GetJurisdictionsAsync(types.ToArray(), cmd.StateProvinceCode, cmd.CountryCode);
        }

        public async Task<IEnumerable<Support>> Handle(SupportsQueryCommand _)
        {
            return await supportsListProvider.GetSupportsAsync();
        }
    }

    public class JurisdictionsQueryCommand
    {
        public IEnumerable<JurisdictionType> Types { get; }
        public string StateProvinceCode { get; }
        public string CountryCode { get; }

        public JurisdictionsQueryCommand(IEnumerable<JurisdictionType> types, string countryCode, string stateProvinceCode)
        {
            CountryCode = countryCode;
            Types = types;
            StateProvinceCode = stateProvinceCode;
        }
    }

    public class StateProvincesQueryCommand
    {
        public string CountryCode { get; }

        public StateProvincesQueryCommand(string countryCode)
        {
            CountryCode = countryCode;
        }
    }

    public class CountriesQueryCommand
    {
    }

    public class SupportsQueryCommand
    {
    }
}
