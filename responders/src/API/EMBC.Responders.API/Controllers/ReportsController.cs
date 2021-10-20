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
using System.Security.Claims;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Reports;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IMessagingClient messagingClient;

        private string currentUserRole => User.FindFirstValue("user_role");

        public ReportsController(IMessagingClient messagingClient)
        {
            this.messagingClient = messagingClient;
        }

        [HttpGet("evacuee")]
        public async Task<IActionResult> GetEvacueeReport(string taskNumber, string fileId, string evacuatedFrom, string evacuatedTo)
        {
            var userRole = Enum.Parse<MemberRole>(currentUserRole);
            var includePersonalInfo = userRole == MemberRole.Tier3 || userRole == MemberRole.Tier4;
            var result = await messagingClient.Send(new EvacueeReportQuery { TaskNumber = taskNumber, FileId = fileId, EvacuatedFrom = evacuatedFrom, EvacuatedTo = evacuatedTo, IncludePersonalInfo = includePersonalInfo });

            return new FileContentResult(result.Content, result.ContentType);
        }

        [HttpGet("support")]
        public async Task<IActionResult> GetSupportReport(string taskNumber, string fileId, string evacuatedFrom, string evacuatedTo)
        {
            var result = await messagingClient.Send(new SupportReportQuery { TaskNumber = taskNumber, FileId = fileId, EvacuatedFrom = evacuatedFrom, EvacuatedTo = evacuatedTo });

            return new FileContentResult(result.Content, result.ContentType);
        }
    }
}
