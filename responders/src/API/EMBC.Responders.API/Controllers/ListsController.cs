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

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Provides lists for location services and backend controlled metadata
    /// </summary>
    [ApiController]
    [Route("api/lists")]
    public class ListsController : ControllerBase
    {
        /// <summary>
        /// Provides a filtered list of communities by region, state/province and/or country
        /// </summary>
        /// <param name="regionId">region filter</param>
        /// <param name="stateProvinceId">state/province filter</param>
        /// <param name="countryId">country filter</param>
        /// <returns>filtered list of communities</returns>
        [HttpGet("communities")]
        public async Task<ActionResult<IEnumerable<Community>>> GetCommunities([FromQuery] string regionId, [FromQuery] string stateProvinceId, [FromQuery] string countryId)
        {
            return Ok(await Task.FromResult(Array.Empty<Community>()));
        }

        /// <summary>
        /// Provides a filtered list of regions by state/province and/or country
        /// </summary>
        /// <param name="stateProvinceId">state/province filter</param>
        /// <param name="countryId">country filter</param>
        /// <returns>filtered list of regions</returns>
        [HttpGet("regions")]
        public async Task<ActionResult<IEnumerable<Region>>> GetRegions([FromQuery] string stateProvinceId, [FromQuery] string countryId)
        {
            return Ok(await Task.FromResult(Array.Empty<Region>()));
        }

        /// <summary>
        /// Provides a filtered list of state/provinces by country
        /// </summary>
        /// <param name="countryId">country filter</param>
        /// <returns>filtered list of state/provinces</returns>
        [HttpGet("stateprovinces")]
        public async Task<ActionResult<IEnumerable<StateProvince>>> GetStateProvinces([FromQuery] string countryId)
        {
            return Ok(await Task.FromResult(Array.Empty<StateProvince>()));
        }

        /// <summary>
        /// Provides a list of countries
        /// </summary>
        /// <returns>list of countries</returns>
        [HttpGet("countries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            return Ok(await Task.FromResult(Array.Empty<Country>()));
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
    }

    /// <summary>
    /// A region is a group of communities
    /// </summary>
    public class Region
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string StateProvinceId { get; set; }
        public string CountryId { get; set; }
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
}
