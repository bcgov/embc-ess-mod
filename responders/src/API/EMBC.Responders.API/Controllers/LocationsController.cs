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
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Provides location related lists
    /// </summary>
    [ApiController]
    [Route("api/locations")]
    public class LocationsController : ControllerBase
    {
        /// <summary>
        /// Provides a filtered list of communities by community type, state/province and/or country
        /// </summary>
        /// <param name="stateProvinceId">state/province filter</param>
        /// <param name="countryId">country filter</param>
        /// <param name="types">community type filter</param>
        /// <returns>filtered list of communities</returns>
        [HttpGet("communities")]
        public async Task<ActionResult<IEnumerable<Community>>> GetCommunities([FromQuery] string stateProvinceId, [FromQuery] string countryId, [FromQuery] CommunityType[] types)
        {
            var communities = new[]
            {
                new Community { Id = "c1", Name = "c 1", DistrictName = "d 1", CountryId = "c1", StateProvinceId = "sp1", Type = CommunityType.City },
                new Community { Id = "c2", Name = "c 2", DistrictName = "d 2", CountryId = "c1", StateProvinceId = "sp1", Type = CommunityType.IslandMunicipality },
                new Community { Id = "c3", Name = "c 3", DistrictName = "d 1", CountryId = "c1", StateProvinceId = "sp1", Type = CommunityType.Township },
                new Community { Id = "c4", Name = "c 4", DistrictName = "d 2", CountryId = "c1", StateProvinceId = "sp1", Type = CommunityType.Village },
            };
            return Ok(await Task.FromResult(communities));
        }

        /// <summary>
        /// Provides a filtered list of state/provinces by country
        /// </summary>
        /// <param name="countryId">country filter</param>
        /// <returns>filtered list of state/provinces</returns>
        [HttpGet("stateprovinces")]
        public async Task<ActionResult<IEnumerable<StateProvince>>> GetStateProvinces([FromQuery] string countryId)
        {
            var stateProvinces = new[]
            {
                new StateProvince { Id = "sp1", CountryId = "c1", Name = "sp 1" },
                new StateProvince { Id = "sp2", CountryId = "c1", Name = "sp 2" },
            };
            return Ok(await Task.FromResult(stateProvinces));
        }

        /// <summary>
        /// Provides a list of countries
        /// </summary>
        /// <returns>list of countries</returns>
        [HttpGet("countries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            var countries = new[]
            {
                new Country { Id = "c1", Name = "c 1" },
                new Country { Id = "c2", Name = "c 2" },
                new Country { Id = "c3", Name = "c 3" },
            };
            return Ok(await Task.FromResult(countries));
        }
    }

    /// <summary>
    /// A community in the system
    /// </summary>
    public class Community
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string DistrictName { get; set; }
        public string RegionId { get; set; }
        public string StateProvinceId { get; set; }
        public string CountryId { get; set; }
        public CommunityType Type { get; set; }
    }

    /// <summary>
    /// A state or a province within a country
    /// </summary>
    public class StateProvince
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string CountryId { get; set; }
    }

    /// <summary>
    /// A country
    /// </summary>
    public class Country
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    /// <summary>
    /// Community type
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CommunityType
    {
        Undefined,
        City,
        Town,
        Village,
        District,
        DistrictMunicipality,
        Township,
        IndianGovernmentDistrict,
        IslandMunicipality,
        IslandTrust,
        MountainResortMunicipality,
        MunicipalityDistrict,
        RegionalDistrict,
        RegionalMunicipality,
        ResortMunicipality,
        RuralMunicipalities
    }
}
