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
        public async Task<IActionResult> GetPrint(string taskNumber, string fileId, string evacuatedFrom, string evacuatedTo)
        {
            var userRole = Enum.Parse<MemberRole>(currentUserRole);
            var result = await messagingClient.Send(new EvacueeReportQuery { TaskNumber = taskNumber, FileId = fileId, EvacuatedFrom = evacuatedFrom, EvacuatedTo = evacuatedTo, IncludePersonalInfo = userRole > MemberRole.Tier2 });

            return Ok(result.EvacueeReport);
            //update once shared contract is updated...
            //return new FileContentResult(result.Content, result.ContentType);
        }
    }
}
