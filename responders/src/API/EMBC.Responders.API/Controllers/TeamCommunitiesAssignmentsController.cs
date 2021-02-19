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
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Manages the list of communities under the management of a team.
    /// The team is derived from the logged in user's security context
    /// </summary>
    [ApiController]
    [Route("api/team/communities")]
    public class TeamCommunitiesAssignmentsController : ControllerBase
    {
        /// <summary>
        /// Get all assigned communities
        /// </summary>
        /// <returns>list of communities</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Community>>> GetAssignedCommunities()
        {
            return Ok(await Task.FromResult(Array.Empty<Community>()));
        }

        /// <summary>
        /// Assign communities to the team, will ignore communities which were already associated with the team
        /// </summary>
        /// <param name="communityIds">list of community ids</param>
        /// <returns>Ok if successful, bad request if a community is not found or a community is associated with another team</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AssignCommunities([FromBody] IEnumerable<string> communityIds)
        {
            await Task.CompletedTask;
            return Ok();
        }

        /// <summary>
        /// Remove communities associations with the team, will ignore communities which are not associated
        /// </summary>
        /// <param name="communityIds">list of community ids to disassociate</param>
        /// <returns>Ok if successful, bad request if a community is not found</returns>
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveCommunities([FromQuery] IEnumerable<string> communityIds)
        {
            await Task.CompletedTask;
            return Ok();
        }
    }
}
