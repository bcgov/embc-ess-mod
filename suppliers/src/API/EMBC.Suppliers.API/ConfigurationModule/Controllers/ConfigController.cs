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
using Microsoft.Extensions.Logging;
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
        private readonly ILogger<ConfigController> logger;

        public ConfigController(IConfiguration configuration, CRMWebAPI api, ILogger<ConfigController> logger)
        {
            conf = configuration;
            this.api = api;
            this.logger = logger;
        }

        [HttpGet("")]
        [AllowAnonymous]
        public async Task<ActionResult<ConfigResult>> GetConfig()
        {
            string maintMsg = string.Empty;
            var noticeMsg = conf["NOTICE_MESSAGE"] ?? string.Empty;

            var maintWarn = conf["MAINTENANCE_WARNING"] ?? string.Empty;
            var maintPageMsg = conf["MAINTENANCE_PAGEDOWN"] ?? "Default";
            var maintTimeStr = conf["MAINTENANCE_START"] ?? string.Empty;

            var envStr = conf["ASPNETCORE_ENVIRONMENT"] ?? string.Empty;

            DateTime maintTime;

            // Check for maintenance or other causes of outage
            var siteDown = false;

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
                maintMsg = maintPageMsg;
                noticeMsg = string.Empty;
            }
            else
            {
                // Only run Dynamics healthcheck if site isn't already going down for maintenance. Check for CRM connectivity, immediately return error if fails
                var crmHealthy = await CRMHealthcheck();

                if (!crmHealthy)
                {
                    var crmFailResult = GetConfigResult(string.Empty, string.Empty, true, envStr);
                    return Ok(crmFailResult);
                }
            }

            // Return object with details needed for frontend routing
            var result = GetConfigResult(noticeMsg, maintMsg, siteDown, envStr);

            return Ok(result);
        }

        /// <summary>
        /// Checks if CRM can be accessed
        /// </summary>
        /// <returns>True/False, based on CRM connectivity</returns>
        private async Task<bool> CRMHealthcheck()
        {
            try
            {
                // Simple query to CRM to make sure connection can get response
                CRMGetListResult<SupportEntity> list = await api.GetList<SupportEntity>("era_supports", new CRMGetListOptions
                {
                    Select = new[] { "era_name", "era_supportid" }
                });
                return list.List.Count > 0;
            }
            catch (Exception e)
            {
                logger.LogError(e, "Failed to connect to CRM during health check.");
                return false;
            }
        }

        /// <summary>
        /// Create a ConfigResult object with the passed-in parameters. Will also pass Oidc configuration settings.
        /// </summary>
        /// <param name="noticeMsg">Notification message for top of active site page.</param>
        /// <param name="maintMsg">Message of upcoming or ongoing maintenance. Blank for no maint, or ongoing error.</param>
        /// <param name="siteDown">Whether the site is currently down. True for both maintenance or errors.</param>
        /// <param name="environment">Current server environment (DEV/TEST/TRAIN/PROD)</param>
        /// <returns>ConfigResult object with current site health and config information</returns>
        private ConfigResult GetConfigResult(string noticeMsg, string maintMsg, bool siteDown, string environment)
        {
            return new ConfigResult()
            {
                NoticeMsg = noticeMsg,
                MaintMsg = maintMsg,
                SiteDown = siteDown,
                Environment = environment,
                Oidc = new OidcConfiguration
                {
                    ClientId = conf["oidc:clientId"],
                    Issuer = conf["oidc:issuer"]
                }
            };
        }
    }
}
