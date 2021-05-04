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
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EMBC.Responders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private readonly ILogger<TasksController> logger;

        public TasksController(IMessagingClient messagingClient, IMapper mapper, ILogger<TasksController> logger)
        {
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.logger = logger;
        }

        /// <summary>
        /// Get a single ESS task
        /// </summary>
        /// <param name="taskId">task number</param>
        /// <returns>task or not found</returns>
        [HttpGet("{taskId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ESSTask> GetTask(string taskId)
        {
            //var reply = await messagingClient.Send(new TeamMembersQueryCommand { TeamId = teamId, MemberId = memberId, IncludeActiveUsersOnly = false });
            //var teamMember = reply.TeamMembers.SingleOrDefault();
            //if (teamMember == null) return NotFound(memberId);
            //return Ok(mapper.Map<TeamMember>(teamMember));

            var activeTask = new ESSTask
            {
                Id = "123456",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(3),
                CommunityCode = "6e69dfaf-9f97-ea11-b813-005056830319", //100 Mile House
                Description = "Task Description",
                Status = "Active"
            };

            return Ok(activeTask);
        }
    }

    public class ESSTask
    {
        public string Id { get; set; } //task number
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string CommunityCode { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
    }
}
