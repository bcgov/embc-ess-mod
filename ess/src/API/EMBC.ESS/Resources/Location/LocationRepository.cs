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

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics;

namespace EMBC.ESS.Resources.Location
{
    public interface ILocationRepository
    {
        Task<IEnumerable<Country>> GetCountries();

        Task<IEnumerable<StateProvince>> GetStateProvinces();

        Task<IEnumerable<Community>> GetCommunities();
    }

    public class LocationRepository : ILocationRepository
    {
        private readonly EssContext essContext;

        public LocationRepository(EssContext essContext)
        {
            this.essContext = essContext;
        }

        public async Task<IEnumerable<Country>> GetCountries()
        {
            var countries = await essContext.era_countries.GetAllPagesAsync();
            return countries.Select(c => new Country { Code = c.era_countrycode, Name = c.era_name }).ToArray();
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvinces()
        {
            var provinces = await essContext.era_provinceterritorieses.Expand(c => c.era_RelatedCountry).GetAllPagesAsync();
            return provinces.Select(sp => new StateProvince
            {
                Code = sp.era_code,
                Name = sp.era_name,
                CountryCode = sp.era_RelatedCountry.era_countrycode
            }).ToArray();
        }

        public async Task<IEnumerable<Community>> GetCommunities()
        {
            await GetStateProvinces();  // temporary solution to populate the client's cache with entities, otherwise era_RelatedCountry will be null
            var jurisdictions = await essContext.era_jurisdictions.Expand(j => j.era_RelatedProvinceState).GetAllPagesAsync();
            return jurisdictions.Select(j => new Community
            {
                Code = j.era_jurisdictionid.ToString(),
                Name = j.era_jurisdictionname,
                Type = !j.era_type.HasValue ? CommunityType.Undefined : (CommunityType)j.era_type.Value,
                StateProvinceCode = j.era_RelatedProvinceState.era_code,
                CountryCode = j.era_RelatedProvinceState.era_RelatedCountry.era_countrycode
            });
        }
    }

    public class Country
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class StateProvince
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string CountryCode { get; set; }
    }

    public class Community
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public CommunityType Type { get; set; }
        public string StateProvinceCode { get; set; }
        public string CountryCode { get; set; }
    }

#pragma warning disable CA1008 // Enums should have zero value

    public enum CommunityType
#pragma warning restore CA1008 // Enums should have zero value
    {
        Undefined = -1,
        City = 1,
        Town = 4,
        Village = 2,
        District = 12,
        DistrictMunicipality = 100000014,
        Township = 3,
        IndianGovernmentDistrict = 100000015,
        IslandMunicipality = 13,
        IslandTrust = 10,
        MountainResortMunicipality = 8,
        MunicipalityDistrict = 9,
        RegionalDistrict = 14,
        RegionalMunicipality = 6,
        ResortMunicipality = 5,
        RuralMunicipalities = 7
    }
}
