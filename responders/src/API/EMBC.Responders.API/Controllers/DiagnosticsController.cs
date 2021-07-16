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
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace EMBC.Responders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiagnosticsController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public DiagnosticsController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        /// <summary>
        /// Get diagnostics/version inf
        /// </summary>
        /// <returns>Diagnostics Result object</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<DiagnosticsResults>> GetDiagnostics()
        {
            var systemVersions = new[] { new VersionInformation { Date = DateTime.UtcNow, Name = "Dynamics", Version = "0.0.1", Environment = "Hardcoded" } };

            return Ok(await Task.FromResult(new DiagnosticsResults { SystemVersions = systemVersions }));
        }
    }

    public class DiagnosticsResults
    {
        public IEnumerable<VersionInformation> SystemVersions { get; set; }
    }

    public class VersionInformation
    {
        public string Name { get; set; }
        public string Version { get; set; }
        public string Environment { get; set; }
        public DateTime Date { get; set; }
    }
}
