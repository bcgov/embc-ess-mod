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
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Location;
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
        private readonly IMessagingClient client;
        private readonly IMapper mapper;

        public LocationsController(IMessagingClient client, IMapper mapper)
        {
            this.client = client;
            this.mapper = mapper;
        }

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
            var communities = (await client.Send(new CommunitiesQueryCommand()
            {
                CountryCode = countryId,
                StateProvinceCode = stateProvinceId,
                Types = types.Select(t => (EMBC.ESS.Shared.Contracts.Location.CommunityType)t)
            })).Items;

            return Ok(mapper.Map<IEnumerable<Community>>(communities));
        }

        /// <summary>
        /// Provides a filtered list of state/provinces by country
        /// </summary>
        /// <param name="countryId">country filter</param>
        /// <returns>filtered list of state/provinces</returns>
        [HttpGet("stateprovinces")]
        public async Task<ActionResult<IEnumerable<StateProvince>>> GetStateProvinces([FromQuery] string countryId)
        {
            var stateProvinces = (await client.Send(new StateProvincesQueryCommand
            {
                CountryCode = countryId
            })).Items;

            return Ok(mapper.Map<IEnumerable<StateProvince>>(stateProvinces));
        }

        /// <summary>
        /// Provides a list of countries
        /// </summary>
        /// <returns>list of countries</returns>
        [HttpGet("countries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            var countries = (await client.Send(new CountriesQueryCommand())).Items;

            return Ok(mapper.Map<IEnumerable<Country>>(countries));
        }
    }

    /// <summary>
    /// A community in the system
    /// </summary>
    public class Community
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string DistrictName { get; set; }
        public string StateProvinceCode { get; set; }
        public string CountryCode { get; set; }
        public CommunityType Type { get; set; }
    }

    /// <summary>
    /// A state or a province within a country
    /// </summary>
    public class StateProvince
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string CountryCode { get; set; }
    }

    /// <summary>
    /// A country
    /// </summary>
    public class Country
    {
        public string Code { get; set; }
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

    public class LocationMapping : Profile
    {
        public LocationMapping()
        {
            CreateMap<ESS.Shared.Contracts.Location.Country, Country>().ReverseMap();
            CreateMap<ESS.Shared.Contracts.Location.StateProvince, StateProvince>().ReverseMap();
            CreateMap<ESS.Shared.Contracts.Location.Community, Community>().ReverseMap();
        }
    }
}
