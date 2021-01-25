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
using System.Linq;
using System.Threading.Tasks;
using EMBC.Registrants.API.Shared;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Registrants.API.LocationModule
{
    [Route("api/location")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ILocationManager locationQueryManager;

        public LocationController(ILocationManager locationQueriesService)
        {
            this.locationQueryManager = locationQueriesService;
        }

        [HttpGet("countries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            return (await locationQueryManager.GetCountries()).ToArray();
        }

        [HttpGet("stateprovinces")]
        public async Task<ActionResult<IEnumerable<StateProvince>>> GetStateProvinces([FromQuery] string countryCode = "CAN")
        {
            return (await locationQueryManager.GetStateProvinces(countryCode)).ToArray();
        }

        [HttpGet("jurisdictions")]
        public async Task<ActionResult<IEnumerable<Jurisdiction>>> GetJurisdictions([FromQuery] JurisdictionType[] types, [FromQuery] string countryCode = "CAN", [FromQuery] string stateProvinceCode = "BC")
        {
            return (await locationQueryManager.GetJurisdictions(countryCode, stateProvinceCode, types)).ToArray();
        }
    }
}
