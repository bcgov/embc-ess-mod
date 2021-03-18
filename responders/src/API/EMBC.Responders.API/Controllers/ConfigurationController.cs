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

using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Provides configuration data for clients
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ConfigurationController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public ConfigurationController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<Configuration>> GetConfiguration()
        {
            var config = new Configuration
            {
                OidcClientId = configuration.GetValue<string>("oidc:clientId"),
                OidcIssuer = configuration.GetValue<string>("oidc:issuer")
            };

            return Ok(await Task.FromResult(config));
        }
    }

    public class Configuration
    {
        public string OidcIssuer { get; set; }
        public string OidcClientId { get; set; }
    }
}
