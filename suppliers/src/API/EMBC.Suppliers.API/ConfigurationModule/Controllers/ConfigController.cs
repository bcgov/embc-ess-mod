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
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;
using EMBC.Suppliers.API.Utilities;
using Jasper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Xrm.Tools.WebAPI;
using Xrm.Tools.WebAPI.Requests;
using Xrm.Tools.WebAPI.Results;

namespace EMBC.Suppliers.API.ConfigurationModule.Controllers
{
    [ApiController]
    [Route("api/config")]
    [AllowAnonymous]
    public class ConfigController : ControllerBase
    {
        private readonly IConfiguration conf;
        private readonly CRMWebAPI api;

        public ConfigController(IConfiguration configuration, CRMWebAPI api)
        {
            conf = configuration;
            this.api = api;
        }

        [HttpGet("")]
        [AllowAnonymous]
        public async Task<ActionResult<Config>> GetConfig()
        {
            string maintMsg = string.Empty;
            var noticeMsg = conf["NOTICE_MESSAGE"] ?? string.Empty;

            var maintWarn = conf["MAINTENANCE_WARNING"] ?? string.Empty;
            var maintPage = conf["MAINTENANCE_PAGEDOWN"] ?? string.Empty;
            var maintTimeStr = conf["MAINTENANCE_START"] ?? string.Empty;

            var envStr = conf["ASPNETCORE_ENVIRONMENT"] ?? string.Empty;

            DateTime maintTime;

            Task<bool> healthCheck = CRMHealthcheck();

            var siteDown = await healthCheck;

            // Check that maintTimeStr is valid datetime format
            if (DateTime.TryParse(maintTimeStr, out maintTime))
            {
                // Timestamp will be in Pacific, so convert local time for comparison
                var curtime = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.Now.ToUniversalTime(), TimeZoneProvider.GetPSTTimeZone());

                if (maintTime <= curtime)
                    siteDown = true;
                else
                    maintMsg = maintWarn;
            }

            // Other options for site takedown via maintTimeStr
            if (maintTimeStr.ToLower() == "down")
                siteDown = true;
            else if (maintTimeStr.ToLower() == "warn")
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
                siteDown = siteDown,
                environment = envStr,
                Oidc = new OidcConfiguration
                {
                    ClientId = conf["oidc:clientId"],
                    Issuer = conf["oidc:issuer"]
                }
            };

            return Ok(result);
        }

        /// <summary>
        /// Checks if CRM can be accessed
        /// </summary>
        /// <returns>True/False, based on CRM connectivity</returns>
        private async Task<bool> CRMHealthcheck()
        {
            bool siteDown = true;
            try
            {
                CRMGetListResult<SupportEntity> list = await api.GetList<SupportEntity>("era_supports", new CRMGetListOptions
                {
                    Select = new[] { "era_name", "era_supportid" }
                });

                if (list.List.Count > 0)
                {
                    siteDown = false;
                }
                return siteDown;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return siteDown;
            }
        }

        /// <summary>
        /// Class declaring objects to be returned from the ConfigController
        /// </summary>
        private class ConfigResult
        {
            public string noticeMsg { get; set; }
            public string maintMsg { get; set; }
            public bool siteDown { get; set; }
            public string environment { get; set; }
            public OidcConfiguration Oidc { get; set; }
        }

        public class OidcConfiguration
        {
            public string Issuer { get; set; }
            public string ClientId { get; set; }
        }
    }
}
