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
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Team;
using EMBC.Responders.API.Utilities;
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
            teamMember.TeamId = teamId;
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

            teamMember.TeamId = teamId;
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
        /// Activate a team member
        /// </summary>
        /// <param name="memberId">team member id</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpPost("{memberId}/active")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ActivateTeamMember(string memberId)
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
        /// Deactivate a team member
        /// </summary>
        /// <param name="memberId">team member id</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpPost("{memberId}/inactive")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeactivateTeamMember(string memberId)
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
        public async Task<ActionResult<bool>> IsUserNameExists(string userName, string memberId = null)
        {
            var response = await client.Send(new ValidateTeamMemberCommand
            {
                TeamMember = new ESS.Shared.Contracts.Team.TeamMember { UserName = userName, Id = memberId, TeamId = teamId }
            });
            return Ok(!response.UniqueUserName);
        }

        /// <summary>
        /// Provides a list of team member roles
        /// </summary>
        /// <returns>list of role codes with description</returns>
        [HttpGet("codes/memberrole")]
        public async Task<ActionResult<IEnumerable<MemberRole>>> GetMemberRoles()
        {
            var enumList = EnumHelper.GetEnumDescriptions<MemberRole>();
            return Ok(await Task.FromResult(enumList.Select(e => new MemberRoleDescription { Code = e.value, Description = e.description }).ToArray()));
        }

        /// <summary>
        /// Provides a list of team member labels
        /// </summary>
        /// <returns>list of label codes with description</returns>
        [HttpGet("codes/memberlabel")]
        public async Task<ActionResult<IEnumerable<MemberLabel>>> GetMemberLabels()
        {
            var enumList = EnumHelper.GetEnumDescriptions<MemberLabel>();
            return Ok(await Task.FromResult(enumList.Select(e => new MemberLabelDescription { Code = e.value, Description = e.description }).ToArray()));
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

        public string TeamId { get; set; }
        public string TeamName { get; set; }

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
        public MemberRole Role { get; set; }

        public MemberLabel Label { get; set; }
    }

    /// <summary>
    /// role code and description
    /// </summary>
    public class MemberRoleDescription
    {
        public MemberRole Code { get; set; }
        public string Description { get; set; }
    }

    /// <summary>
    /// A role a team member is assigned to
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum MemberRole
    {
        [Description("Tier 1 (Responder)")]
        Tier1,

        [Description("Tier 2 (Supervisor)")]
        Tier2,

        [Description("Tier 3 (Director/Manager)")]
        Tier3,

        [Description("Tier 4 (LEP)")]
        Tier4,
    }

    /// <summary>
    /// label code and description
    /// </summary>
    public class MemberLabelDescription
    {
        public MemberLabel Code { get; set; }
        public string Description { get; set; }
    }

    /// <summary>
    /// A label to describe a team member
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum MemberLabel
    {
        [Description("Volunteer")]
        Volunteer,

        [Description("3rd Party")]
        ThirdParty,

        [Description("Convergent Volunteer")]
        ConvergentVolunteer,

        [Description("EMBC Employee")]
        EMBCEmployee,
    }

    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<ESS.Shared.Contracts.Team.TeamMember, TeamMember>()
                .ForMember(d => d.Role, opts => opts.MapFrom(s => Enum.Parse<MemberRole>(s.Role)))
                .ForMember(d => d.Label, opts => opts.MapFrom(s => Enum.Parse<MemberLabel>(s.Label)))
                .ReverseMap()
                .ForMember(d => d.Role, opts => opts.MapFrom(s => s.Role.ToString()))
                .ForMember(d => d.Label, opts => opts.MapFrom(s => s.Label.ToString()))
                ;
        }
    }
}
