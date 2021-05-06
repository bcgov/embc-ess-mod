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

using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.Models;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Suppliers.API.ConfigurationModule.Controllers
{
    [ApiController]
    [Route("api/config")]
    [AllowAnonymous]
    public class ConfigController : ControllerBase
    {
        private readonly ConfigHealthProvider healthcheck;

        public ConfigController(ConfigHealthProvider healthcheck)
        {
            this.healthcheck = healthcheck;
        }

        [HttpGet("")]
        [AllowAnonymous]
        public async Task<ActionResult<ConfigResult>> GetConfig()
        {
            var maintResult = healthcheck.GetMaintenanceState();

            if (!maintResult.SiteDown)
            {
                // Only run Dynamics healthcheck if site isn't already going down for maintenance. Check for CRM connectivity, immediately return error if fails
                var crmHealthy = await healthcheck.CRMHealthcheck();

                if (!crmHealthy)
                {
                    var crmFailResult = healthcheck.GetConfigResult(string.Empty, string.Empty, true);
                    return Ok(crmFailResult);
                }
            }

            // If site is down for maintenance, or Dynamics check passes, return maintenance info
            return Ok(maintResult);
        }
    }
}
