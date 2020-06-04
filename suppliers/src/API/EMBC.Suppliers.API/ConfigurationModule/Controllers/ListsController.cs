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
using EMBC.Suppliers.API.ConfigurationModule.Models;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;
using Jasper;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Suppliers.API.ConfigurationModule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
#if RELEASE
    [ResponseCache(Duration = 60 * 5)]
#endif
    public class ListsController : ControllerBase
    {
        private readonly ICommandBus commandBus;

        public ListsController(ICommandBus commandBus)
        {
            this.commandBus = commandBus;
        }

        [HttpGet("countries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            return Ok(await commandBus.Invoke<IEnumerable<Country>>(new CountriesQueryCommand()));
        }

        [HttpGet("stateprovinces")]
        public async Task<ActionResult<IEnumerable<StateProvince>>> GetStateProvinces([FromQuery] string countryCode = "CAN")
        {
            return Ok(await commandBus.Invoke<IEnumerable<StateProvince>>(new StateProvincesQueryCommand(countryCode)));
        }

        [HttpGet("jurisdictions")]
        public async Task<ActionResult<IEnumerable<Jurisdiction>>> GetJurisdictions([FromQuery] JurisdictionType[] types = null, [FromQuery] string countryCode = "CAN", [FromQuery] string stateProvinceCode = "BC")
        {
            return Ok(await commandBus.Invoke<IEnumerable<Jurisdiction>>(new JurisdictionsQueryCommand(types, countryCode, stateProvinceCode)));
        }

        [HttpGet("supports")]
        public async Task<ActionResult<IEnumerable<Support>>> GetSupports()
        {
            return Ok(await commandBus.Invoke<IEnumerable<Support>>(new SupportsQueryCommand()));
        }
    }
}
