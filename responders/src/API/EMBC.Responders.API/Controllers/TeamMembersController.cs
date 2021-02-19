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
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Manages members within the team.
    /// The team is derived from the logged in user's security context
    /// </summary>
    [ApiController]
    [Route("api/team/members")]
    public class TeamMembersController : ControllerBase
    {
        /// <summary>
        /// Get all team members
        /// </summary>
        /// <returns>list of team members</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TeamMember>>> GetTeamMembers()
        {
            return Ok(await Task.FromResult(Array.Empty<TeamMember>()));
        }

        /// <summary>
        /// Get a single team member
        /// </summary>
        /// <param name="id">team member id</param>
        /// <returns>team member or not found</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TeamMember>> GetTeamMember(string id)
        {
            await Task.CompletedTask;

            return Ok(new TeamMember { Id = id });
        }

        /// <summary>
        /// Creates a new team member
        /// </summary>
        /// <param name="teamMember">team member</param>
        /// <returns>new team member id</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateTeamMember([FromBody] TeamMember teamMember)
        {
            await Task.CompletedTask;

            var id = Guid.NewGuid().ToString("D");
            return Ok(new { Id = id });
        }

        /// <summary>
        /// Updates team member
        /// </summary>
        /// <param name="id">team member id to update</param>
        /// <param name="teamMember">team member</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpPost("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateTeamMember(string id, [FromBody] TeamMember teamMember)
        {
            await Task.CompletedTask;

            return Ok(new { Id = id });
        }

        /// <summary>
        /// Deactivate a team member
        /// </summary>
        /// <param name="id">team member id</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTeamMember(string id)
        {
            await Task.CompletedTask;

            return Ok(new { Id = id });
        }
    }

    /// <summary>
    /// Team details
    /// </summary>
    public class Team
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string Name { get; set; }

        public bool IsActive { get; set; }
    }

    /// <summary>
    /// Team member
    /// </summary>
    public class TeamMember
    {
        public string Id { get; set; }

        [Required]
        public string TeamId { get; set; }

        [Required]
        public string UserName { get; set; }

        public bool IsActive { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Phone { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public DateTime? LastSuccessfulLogin { get; set; }
        public DateTime? AgreementSignDate { get; set; }
    }
}
