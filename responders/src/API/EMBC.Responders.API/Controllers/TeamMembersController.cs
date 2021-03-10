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
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Team;
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
        private readonly IMessagingClient client;
        private readonly IMapper mapper;
        private string teamId = "3f132f42-b74f-eb11-b822-00505683fbf4";

        public TeamMembersController(IMessagingClient client, IMapper mapper)
        {
            this.client = client;
            this.mapper = mapper;
        }

        /// <summary>
        /// Get all team members
        /// </summary>
        /// <returns>list of team members</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TeamMember>>> GetTeamMembers()
        {
            var response = await client.Send(new TeamMembersQueryCommand { TeamId = teamId });
            return Ok(mapper.Map<IEnumerable<TeamMember>>(response.TeamMembers));
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
            var reply = await client.Send(new TeamMembersQueryCommand { TeamId = teamId, MemberId = memberId });
            var teamMember = reply.TeamMembers.SingleOrDefault();
            if (teamMember == null) return NotFound(memberId);

            return Ok(mapper.Map<TeamMember>(teamMember));
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
            var reply = await client.Send(new SaveTeamMemberCommand
            {
                Member = mapper.Map<ESS.Shared.Contracts.Team.TeamMember>(teamMember)
            });
            return Ok(new { Id = reply.MemberId });
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
            if (string.IsNullOrEmpty(memberId)) return BadRequest(nameof(memberId));

            var reply = await client.Send(new SaveTeamMemberCommand
            {
                Member = mapper.Map<ESS.Shared.Contracts.Team.TeamMember>(teamMember)
            });
            if (reply == null) return NotFound(memberId);
            return Ok(new { Id = reply.MemberId });
        }

        /// <summary>
        /// Delete a team member
        /// </summary>
        /// <param name="memberId">team member id</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpDelete("{memberId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTeamMember(string memberId)
        {
            if (string.IsNullOrEmpty(memberId)) return BadRequest(nameof(memberId));

            var reply = await client.Send(new DeleteTeamMemberCommand
            {
                TeamId = teamId,
                MemberId = memberId
            });
            if (reply == null) return NotFound(memberId);
            return Ok(new { Id = memberId });
        }

        /// <summary>
        /// Deactivate a team member
        /// </summary>
        /// <param name="memberId">team member id</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpPost("{memberId}/active")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeactivateTeamMember(string memberId)
        {
            if (string.IsNullOrEmpty(memberId)) return BadRequest(nameof(memberId));

            var reply = await client.Send(new ActivateTeamMemberCommand
            {
                TeamId = teamId,
                MemberId = memberId
            });
            if (reply == null) return NotFound(memberId);
            return Ok(new { Id = memberId });
        }

        /// <summary>
        /// Activate a team member
        /// </summary>
        /// <param name="memberId">team member id</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpPost("{memberId}/inactive")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ActivateTeamMember(string memberId)
        {
            if (string.IsNullOrEmpty(memberId)) return BadRequest(nameof(memberId));

            var reply = await client.Send(new DeactivateTeamMemberCommand
            {
                TeamId = teamId,
                MemberId = memberId
            });
            if (reply == null) return NotFound(memberId);
            return Ok(new { Id = memberId });
        }

        [HttpGet("username")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<bool>> IsUserNameExists(string userName)
        {
            var response = await client.Send(new ValidateTeamMemberCommand { UniqueUserName = userName });
            return Ok(!response.UniqueUserName);
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
                new MemberRole { Code = "r1", Name = "Tier 1" },
                new MemberRole { Code = "r2", Name = "Tier 2" },
                new MemberRole { Code = "r3", Name = "Tier 3" },
                new MemberRole { Code = "r4", Name = "Tier 4" },
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
                new MemberLabel { Code = "l1", Name = "label 1" },
                new MemberLabel { Code = "l2", Name = "label 2" },
                new MemberLabel { Code = "l3", Name = "label 3" },
                new MemberLabel { Code = "l4", Name = "label 4" },
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
        public string RoleCode { get; set; }

        public string LabelCode { get; set; }
    }

    /// <summary>
    /// a role that a team member belongs to
    /// </summary>
    public class MemberRole
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }

    /// <summary>
    /// a label to describe the team member
    /// </summary>
    public class MemberLabel
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<ESS.Shared.Contracts.Team.TeamMember, TeamMember>()
                .ForMember(d => d.RoleCode, opts => opts.MapFrom(s => s.Role.Id))
                .ForMember(d => d.LabelCode, opts => opts.MapFrom(s => s.Label))
                .ReverseMap();
        }
    }
}
