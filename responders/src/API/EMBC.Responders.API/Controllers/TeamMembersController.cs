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
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Shared.Contracts.Admin;
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
        private readonly Dispatcher.DispatcherClient dispatcherClient;

        public TeamMembersController(Dispatcher.DispatcherClient dispatcherClient)
        {
            this.dispatcherClient = dispatcherClient;
        }

        /// <summary>
        /// Get all team members
        /// </summary>
        /// <returns>list of team members</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TeamMember>>> GetTeamMembers()
        {
            var teamId = "t1";
            // var members = new[]
            // {
            //    new TeamMember { Id = "1", FirstName = "one_f", LastName = "one_l", IsActive = true, Email = "1@email.com", UserName = "one", TeamId = teamId, RoleId = "r1", LabelId = "l1", AgreementSignDate = DateTime.Now },
            //    new TeamMember { Id = "2", FirstName = "two_f", LastName = "two_l", IsActive = true, Email = "2@email.com", UserName = "two", TeamId = teamId, RoleId = "r2", LabelId = "l2", AgreementSignDate = DateTime.Now },
            //    new TeamMember { Id = "3", FirstName = "three_f", LastName = "three_l", IsActive = true, Email = "3@email.com", UserName = "three", TeamId = teamId, RoleId = "r3", LabelId = "l3", AgreementSignDate = DateTime.Now },
            //    new TeamMember { Id = "4", FirstName = "four_f", LastName = "four_l", IsActive = true, Email = "4@email.com", UserName = "four", TeamId = teamId, RoleId = "r4", LabelId = "l4", AgreementSignDate = DateTime.Now },
            // };
            // return Ok(await Task.FromResult(members));
            var response = await dispatcherClient.SendRequest<TeamMembersByIdQueryRequest, TeamMembersQueryReply>(new TeamMembersByIdQueryRequest { TeamId = teamId });
            var teamMembers = response.TeamMembers;
            return Ok(teamMembers.Select(m => new TeamMember
            {
                Id = m.Id,
                FirstName = m.FirstName,
                LastName = m.LastName,
                Email = m.Email,
                Phone = m.Phone,
                IsActive = m.IsActive,
                LabelId = null,
                UserName = m.UserName,
                AgreementSignDate = m.AgreementSignDate,
                LastSuccessfulLogin = m.LastSuccessfulLogin,
                RoleId = null,
                TeamId = teamId
            }));
        }

        /// <summary>
        /// Get a single team member
        /// </summary>
        /// <param name="memberId">team member id</param>
        /// <returns>team member or not found</returns>
        [HttpGet("{memberId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TeamMember>> GetTeamMember(string memberId)
        {
            var teamId = "t1";
            return Ok(await Task.FromResult(new TeamMember { Id = "1", FirstName = "one_f", LastName = "one_l", IsActive = true, Email = "1@email.com", UserName = "one", TeamId = teamId, RoleId = "r1", LabelId = "l1", AgreementSignDate = DateTime.Now }));
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
        /// <param name="memberId">team member id to update</param>
        /// <param name="teamMember">team member</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpPost("{memberId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateTeamMember(string memberId, [FromBody] TeamMember teamMember)
        {
            await Task.CompletedTask;

            return Ok(new { Id = memberId });
        }

        /// <summary>
        /// Deactivate a team member
        /// </summary>
        /// <param name="memberId">team member id</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpDelete("{memberId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTeamMember(string memberId)
        {
            await Task.CompletedTask;

            return Ok(new { Id = memberId });
        }

        [HttpGet("username")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<bool>> IsUserNameExists(string userName)
        {
            return Ok(await Task.FromResult(string.Equals(userName, "positive", StringComparison.InvariantCultureIgnoreCase)));
        }

        /// <summary>
        /// Provides a list of team member roles
        /// </summary>
        /// <returns>list of roles</returns>
        [HttpGet("memberroles")]
        public async Task<ActionResult<IEnumerable<MemberRole>>> GetMemberRoles()
        {
            var roles = new[]
            {
                new MemberRole { Id = "r1", Name = "Tier 1" },
                new MemberRole { Id = "r2", Name = "Tier 2" },
                new MemberRole { Id = "r3", Name = "Tier 3" },
                new MemberRole { Id = "r4", Name = "Tier 4" },
            };
            return Ok(await Task.FromResult(roles));
        }

        /// <summary>
        /// Provides a list of team member labels
        /// </summary>
        /// <returns>list of labels</returns>
        [HttpGet("memberlabels")]
        public async Task<ActionResult<IEnumerable<MemberLabel>>> GetMemberLabels()
        {
            var labels = new[]
            {
                new MemberLabel { Id = "l1", Name = "label 1" },
                new MemberLabel { Id = "l2", Name = "label 2" },
                new MemberLabel { Id = "l3", Name = "label 3" },
                new MemberLabel { Id = "l4", Name = "label 4" },
            };
            return Ok(await Task.FromResult(labels));
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

        public bool IsActive { get; set; } = true;
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

        public bool IsActive { get; set; } = true;

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

        [Required]
        public string RoleId { get; set; }

        public string LabelId { get; set; }
    }

    /// <summary>
    /// a role that a team member belongs to
    /// </summary>
    public class MemberRole
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    /// <summary>
    /// a label to describe the team member
    /// </summary>
    public class MemberLabel
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
