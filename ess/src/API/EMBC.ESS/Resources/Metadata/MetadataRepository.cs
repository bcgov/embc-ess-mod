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
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;

namespace EMBC.ESS.Resources.Metadata
{
    public interface IMetadataRepository
    {
        Task<IEnumerable<Country>> GetCountries();

        Task<IEnumerable<StateProvince>> GetStateProvinces();

        Task<IEnumerable<Community>> GetCommunities();
    }

    public class MetadataRepository : IMetadataRepository
    {
        private readonly EssContext essContext;
        private readonly IMapper mapper;

        public MetadataRepository(EssContext essContext, IMapper mapper)
        {
            this.essContext = essContext;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<Country>> GetCountries()
        {
            var countries = await essContext.era_countries.GetAllPagesAsync();

            essContext.DetachAll();

            return mapper.Map<IEnumerable<Country>>(countries);
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvinces()
        {
            var stateProvinces = await essContext.era_provinceterritorieses.Expand(c => c.era_RelatedCountry).GetAllPagesAsync();

            essContext.DetachAll();

            return mapper.Map<IEnumerable<StateProvince>>(stateProvinces);
        }

        public async Task<IEnumerable<Community>> GetCommunities()
        {
            await Task.CompletedTask;

            var jurisdictions = await essContext.era_jurisdictions
                .Expand(j => j.era_RelatedProvinceState)
                .Expand(j => j.era_RegionalDistrict)
                .GetAllPagesAsync();

            essContext.DetachAll();

            var communities = mapper.Map<IEnumerable<Community>>(jurisdictions);

            // a hack to map country codes to communities because Dynamics v9.0 doesn't allow multi step expansion (i.e. province->country)
            var stateProvinces = essContext.era_provinceterritorieses
                   .Select(sp => new { code = sp.era_code, countryId = sp.era_RelatedCountry.era_countryid, countryCode = sp.era_RelatedCountry.era_countrycode })
                   .ToArray();

            foreach (var community in communities)
            {
                community.CountryCode = stateProvinces.FirstOrDefault(sp => sp.code == community.StateProvinceCode)?.countryCode;
            }
            return communities;
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
        public string DistrictCode { get; set; }
        public string DistrictName { get; set; }
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
