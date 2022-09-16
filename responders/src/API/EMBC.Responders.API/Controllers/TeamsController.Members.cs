using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Teams;
using EMBC.Utilities.Extensions;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Members related endpoints
    /// </summary>
    public partial class TeamsController
    {
        /// <summary>
        /// Get all team members
        /// </summary>
        /// <returns>list of team members</returns>
        [HttpGet("members")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TeamMember>>> GetTeamMembers()
        {
            var response = await client.Send(new TeamMembersQuery { TeamId = teamId, IncludeActiveUsersOnly = false });
            return Ok(mapper.Map<IEnumerable<TeamMember>>(response.TeamMembers));
        }

        /// <summary>
        /// Get a single team member
        /// </summary>
        /// <param name="memberId">team member id</param>
        /// <returns>team member or not found</returns>
        [HttpGet("members/{memberId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TeamMember>> GetTeamMember(string memberId)
        {
            var reply = await client.Send(new TeamMembersQuery { TeamId = teamId, MemberId = memberId, IncludeActiveUsersOnly = false });
            var teamMember = reply.TeamMembers.SingleOrDefault();
            if (teamMember == null) return NotFound(memberId);

            return Ok(mapper.Map<TeamMember>(teamMember));
        }

        /// <summary>
        /// Creates a new team member
        /// </summary>
        /// <param name="teamMember">team member</param>
        /// <returns>new team member id</returns>
        [HttpPost("members")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<TeamMemberResult>> CreateTeamMember([FromBody] TeamMember teamMember)
        {
            try
            {
                teamMember.TeamId = teamId;
                var memberId = await client.Send(new SaveTeamMemberCommand
                {
                    Member = mapper.Map<ESS.Shared.Contracts.Teams.TeamMember>(teamMember)
                });
                return Ok(new TeamMemberResult { Id = memberId });
            }
            catch (Exception e)
            {
                return errorParser.Parse(e);
            }
        }

        /// <summary>
        /// Updates team member
        /// </summary>
        /// <param name="memberId">team member id to update</param>
        /// <param name="teamMember">team member</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpPost("members/{memberId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TeamMemberResult>> UpdateTeamMember(string memberId, [FromBody] TeamMember teamMember)
        {
            try
            {
                teamMember.Id = memberId;
                teamMember.TeamId = teamId;
                mapper.Map<ESS.Shared.Contracts.Teams.TeamMember>(teamMember);
                var updatedMemberId = await client.Send(new SaveTeamMemberCommand
                {
                    Member = mapper.Map<ESS.Shared.Contracts.Teams.TeamMember>(teamMember)
                });
                return Ok(new TeamMemberResult { Id = updatedMemberId });
            }
            catch (Exception e)
            {
                return errorParser.Parse(e);
            }
        }

        /// <summary>
        /// Delete a team member
        /// </summary>
        /// <param name="memberId">team member id</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpDelete("members/{memberId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TeamMemberResult>> DeleteTeamMember(string memberId)
        {
            try
            {
                await client.Send(new DeleteTeamMemberCommand
                {
                    TeamId = teamId,
                    MemberId = memberId
                });
                return Ok(new TeamMemberResult { Id = memberId });
            }
            catch (Exception e)
            {
                return errorParser.Parse(e);
            }
        }

        /// <summary>
        /// Activate a team member
        /// </summary>
        /// <param name="memberId">team member id</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpPost("members/{memberId}/active")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<TeamMemberResult>> ActivateTeamMember(string memberId)
        {
            if (string.IsNullOrEmpty(memberId)) return BadRequest(nameof(memberId));

            await client.Send(new ActivateTeamMemberCommand
            {
                TeamId = teamId,
                MemberId = memberId
            });
            return Ok(new TeamMemberResult { Id = memberId });
        }

        /// <summary>
        /// Deactivate a team member
        /// </summary>
        /// <param name="memberId">team member id</param>
        /// <returns>team member id if success, not found or bad request</returns>
        [HttpPost("members/{memberId}/inactive")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeactivateTeamMember(string memberId)
        {
            if (string.IsNullOrEmpty(memberId)) return BadRequest(nameof(memberId));

            await client.Send(new DeactivateTeamMemberCommand
            {
                TeamId = teamId,
                MemberId = memberId
            });
            return Ok(new TeamMemberResult { Id = memberId });
        }

        [HttpGet("members/username")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<bool>> IsUserNameExists(string userName, string? memberId = null)
        {
            var response = await client.Send(new ValidateTeamMemberCommand
            {
                TeamMember = new ESS.Shared.Contracts.Teams.TeamMember { UserName = userName, Id = memberId, TeamId = teamId }
            });
            return Ok(!response.UniqueUserName);
        }

        private const int cacheDuration = 5 * 60; //5 minutes

        /// <summary>
        /// Provides a list of team member roles
        /// </summary>
        /// <returns>list of role codes with description</returns>
        [HttpGet("members/codes/memberrole")]
        [ResponseCache(Duration = cacheDuration)]
        public async Task<ActionResult<IEnumerable<MemberRoleDescription>>> GetMemberRoles()
        {
            var enumList = EnumDescriptionHelper.GetEnumDescriptions<MemberRole>();
            return Ok(await Task.FromResult(enumList.Select(e => new MemberRoleDescription { Code = e.Value, Description = e.Description }).ToArray()));
        }

        /// <summary>
        /// Provides a list of team member labels
        /// </summary>
        /// <returns>list of label codes with description</returns>
        [HttpGet("members/codes/memberlabel")]
        [ResponseCache(Duration = cacheDuration)]
        public async Task<ActionResult<IEnumerable<MemberLabelDescription>>> GetMemberLabels()
        {
            var enumList = EnumDescriptionHelper.GetEnumDescriptions<MemberLabel>();
            return Ok(await Task.FromResult(enumList.Select(e => new MemberLabelDescription { Code = e.Value, Description = e.Description }).ToArray()));
        }
    }

    public class TeamMemberResult
    {
        public string Id { get; set; }
    }

    /// <summary>
    /// Team member
    /// </summary>
    public class TeamMember
    {
        public string? Id { get; set; }

        public string? TeamId { get; set; }
        public string TeamName { get; set; }

        [Required]
        public string UserName { get; set; }

        public bool IsActive { get; set; } = true;

        [EmailAddress]
        public string? Email { get; set; }

        [Phone]
        public string? Phone { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public DateTime? LastSuccessfulLogin { get; set; }
        public DateTime? AgreementSignDate { get; set; }

        [Required]
        public MemberRole Role { get; set; }

        public MemberLabel? Label { get; set; }

        public bool IsUserNameEditable { get; set; }
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
        [Description("Tier 1 - Responder (default)")]
        Tier1,

        [Description("Tier 2 - Supervisor")]
        Tier2,

        [Description("Tier 3 - Director/Manager")]
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

        [Description("First Nation")]
        FirstNation,

        [Description("Local Government Employee")]
        LocalGovernmentEmployee,
    }

    public class TeamMemberMapping : Profile
    {
        public TeamMemberMapping()
        {
            CreateMap<ESS.Shared.Contracts.Teams.TeamMember, TeamMember>()
                .ForMember(d => d.Role, opts => opts.MapFrom(s => Enum.Parse<MemberRole>(s.Role)))
                .ForMember(d => d.Label, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.Label) ? (MemberLabel?)null : Enum.Parse<MemberLabel>(s.Label)))
                .ForMember(d => d.IsUserNameEditable, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.ExternalUserId)))
                .ReverseMap()
                .ForMember(d => d.Role, opts => opts.MapFrom(s => s.Role.ToString()))
                .ForMember(d => d.Label, opts => opts.MapFrom(s => s.Label.ToString()))
                ;
        }
    }
}
