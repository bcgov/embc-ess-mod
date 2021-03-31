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
using System.Globalization;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.Models;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;
using Jasper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace EMBC.Suppliers.API.ConfigurationModule.Controllers
{
    [ApiController]
    [Route("api/config")]
    public class ConfigController : ControllerBase
    {
        private readonly IConfiguration conf;

        public ConfigController(IConfiguration configuration)
        {
            conf = configuration;
        }

        [HttpGet("")]
        public ActionResult<Config> GetConfig()
        {
            string maintMsg = string.Empty;
            var noticeMsg = conf["NOTICE_MESSAGE"] ?? string.Empty;

            var maintWarn = conf["MAINTENANCE_WARNING"] ?? string.Empty;
            var maintPage = conf["MAINTENANCE_PAGEDOWN"] ?? string.Empty;
            var maintTimeStr = conf["MAINTENANCE_START"] ?? string.Empty;

            DateTime maintTime;

            var siteDown = false;

            // TODO: Perform healthcheck against CRM, set Sitedown=true if can't connect

            // Check that maintTimeStr is valid datetime format
            if (DateTime.TryParse(maintTimeStr, out maintTime))
            {
                if (maintTime <= DateTime.Now)
                    siteDown = true;
                else
                    maintMsg = maintWarn;
            }

            // Other options for site takedown via maintTimeStr
            if (maintTimeStr.ToLower(CultureInfo.InvariantCulture) == "down")
                siteDown = true;
            else if (maintTimeStr.ToLower(CultureInfo.InvariantCulture) == "warn")
                maintMsg = maintWarn;

            // If site is down, deliver maintenance page message instead of warning, and remove other Notification message
            if (siteDown)
            {
                maintMsg = maintPage;
                noticeMsg = string.Empty;
            }

            // Return object with details needed for frontend routing
            var result = new ConfigResult
            {
                noticeMsg = noticeMsg,
                maintMsg = maintMsg,
                siteDown = siteDown
            };

            return Ok(result);
        }

        /// <summary>
        /// Checks if CRM can be accessed
        /// </summary>
        /// <returns>True/False, based on CRM connectivity</returns>
        private bool CRMHealthcheck()
        {
            return true;
        }

        /// <summary>
        /// Class declaring objects to be returned from the ConfigController
        /// </summary>
        private class ConfigResult
        {
            public string noticeMsg { get; set; }
            public string maintMsg { get; set; }
            public bool siteDown { get; set; }
        }
    }
}
