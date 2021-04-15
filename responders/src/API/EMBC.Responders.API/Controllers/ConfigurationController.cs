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
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using EMBC.Responders.API.Utilities;
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
    [AllowAnonymous]
    public class ConfigurationController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public ConfigurationController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        /// <summary>
        /// Get configuration settings for clients
        /// </summary>
        /// <returns>Configuration settings object</returns>
        [HttpGet]
        public async Task<ActionResult<Configuration>> GetConfiguration()
        {
            var config = new Configuration
            {
                Oidc = new OidcConfiguration
                {
                    ClientId = configuration.GetValue<string>("oidc:clientId"),
                    Issuer = configuration.GetValue<string>("oidc:issuer")
                }
            };

            return Ok(await Task.FromResult(config));
        }

        /// <summary>
        /// Get code values and descriptions for lookups and enum types
        /// </summary>
        /// <param name="forEnumType">enum type name</param>
        /// <returns>list of codes and their respective descriptions</returns>
        [HttpGet("codes")]
        public ActionResult<CodeValues> GetCodes(string forEnumType)
        {
            if (string.IsNullOrEmpty(forEnumType)) return BadRequest();
            var type = Assembly.GetExecutingAssembly().ExportedTypes.Where(t => t.Name.Equals(forEnumType, StringComparison.OrdinalIgnoreCase) && t.IsEnum).FirstOrDefault();
            if (type == null) return NotFound(type);
            var values = EnumDescriptionHelper.GetEnumDescriptions(type);
            return Ok(new CodeValues
            {
                ListName = type.Name,
                Codes = values.Select(e => new Code { Value = e.value, Description = e.description }).ToArray()
            });
        }

        public class Configuration
        {
            public OidcConfiguration Oidc { get; set; }
        }

        public class OidcConfiguration
        {
            public string Issuer { get; set; }
            public string ClientId { get; set; }
        }

        public class CodeValues
        {
            public string ListName { get; set; }
            public IEnumerable<Code> Codes { get; set; }
        }

        public class Code
        {
            public string Value { get; set; }
            public string Description { get; set; }
        }
    }
}
