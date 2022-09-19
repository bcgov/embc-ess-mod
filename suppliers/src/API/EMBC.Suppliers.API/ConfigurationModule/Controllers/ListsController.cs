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
using EMBC.Suppliers.API.ConfigurationModule.Models;
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Suppliers.API.ConfigurationModule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
#if RELEASE
    [ResponseCache(Duration = 60 * 5)]
#endif
    public class ListsController : ControllerBase
    {
        private readonly ICache cache;
        private readonly IListsGateway listsGateway;

        public ListsController(ICache cache, IListsGateway listsGateway)
        {
            this.cache = cache;
            this.listsGateway = listsGateway;
        }

        [HttpGet("countries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            var res = (await cache.GetOrSet(
                "countries",
                async () => (await listsGateway.GetCountriesAsync()),
                TimeSpan.FromMinutes(15)))
                .Select(c => new Country { Code = c.era_countrycode, Name = c.era_name })
                .OrderBy(c => c.Name);
            return Ok(res);
        }

        [HttpGet("stateprovinces")]
        public async Task<ActionResult<IEnumerable<StateProvince>>> GetStateProvinces([FromQuery] string countryCode = "CAN")
        {
            var country = (await cache.GetOrSet(
                "countries",
                async () => (await listsGateway.GetCountriesAsync()),
                TimeSpan.FromMinutes(15))).SingleOrDefault(c => c.era_countrycode == countryCode);

            if (country == null) return NotFound();

            var res = (await cache.GetOrSet(
                 "stateprovinces",
                 async () => (await listsGateway.GetStateProvincesAsync()),
                 TimeSpan.FromMinutes(15)))
                 .Where(sp => sp._era_relatedcountry_value == country.era_countryid)
                .Select(sp => new StateProvince { Code = sp.era_code, Name = sp.era_name, CountryCode = countryCode })
                .OrderBy(sp => sp.Name);

            return Ok(res);
        }

        [HttpGet("jurisdictions")]
        public async Task<ActionResult<IEnumerable<Jurisdiction>>> GetJurisdictions([FromQuery] JurisdictionType[] types = null, [FromQuery] string countryCode = "CAN", [FromQuery] string stateProvinceCode = "BC")
        {
            var country = (await cache.GetOrSet(
                "countries",
                async () => (await listsGateway.GetCountriesAsync()),
                TimeSpan.FromMinutes(15))).SingleOrDefault(c => c.era_countrycode == countryCode);

            if (country == null) return NotFound();

            var stateProvince = (await cache.GetOrSet(
                 "stateprovinces",
                 async () => (await listsGateway.GetStateProvincesAsync()),
                 TimeSpan.FromMinutes(15))).SingleOrDefault(sp => sp._era_relatedcountry_value == country.era_countryid && sp.era_code == stateProvinceCode);

            if (stateProvince == null) return NotFound();

            var res = (await cache.GetOrSet(
                 "jurisdictions",
                 async () => (await listsGateway.GetJurisdictionsAsync()),
                 TimeSpan.FromMinutes(15)))
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

            return Ok(res);
        }

        [HttpGet("supports")]
        public async Task<ActionResult<IEnumerable<Support>>> GetSupports()
        {
            var res = (await cache.GetOrSet(
                "supports",
                async () => (await listsGateway.GetSupportsAsync()),
                TimeSpan.FromMinutes(15)))
                .Select(s => new Support { Code = s.era_name, Name = s.era_name })
                .OrderBy(s => s.Name);
            return Ok(res);
        }
    }
}
