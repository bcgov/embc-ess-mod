using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Teams;
using EMBC.Responders.API.Services;
using EMBC.Utilities.Messaging;
using EMBC.Utilities.Telemetry;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Handle user profile requests
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private readonly IUserService userService;
        private readonly ITelemetryReporter telemetryReporter;

        private string GetCurrentUserName() => User.FindFirstValue("bceid_username");

        private string GetCurrentUserId() => User.FindFirstValue("bceid_user_guid");

        private string GetCurrentUserSourceSystem()
        {
            var identityProvider = User.FindFirstValue("identity_provider");
            return identityProvider.StartsWith("bceid") ? "bceid" : identityProvider;
        }

        public ProfileController(IMessagingClient messagingClient, IMapper mapper, IUserService userService, ITelemetryProvider telemetryProvider)
        {
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.userService = userService;
            this.telemetryReporter = telemetryProvider.Get<ProfileController>();
        }

        /// <summary>
        /// Get the current logged in user profile
        /// </summary>
        /// <returns>current user profile</returns>
        [HttpGet("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<UserProfile>> GetCurrentUserProfile()
        {
            var userName = GetCurrentUserName();
            var userId = GetCurrentUserId();

            var sourceSystem = GetCurrentUserSourceSystem();

            // Get the current user
            var currentMember = await userService.GetTeamMember();

            if (currentMember == null)
            {
                telemetryReporter.LogError($"User {userId} ({userName}@{sourceSystem}) not found");
                return Forbid();
            }
            if (currentMember.ExternalUserId != null && currentMember.ExternalUserId != userId)
            {
                telemetryReporter.LogError($"User {userName}@{sourceSystem} already has external id {currentMember.ExternalUserId} but trying to log in with user id {userId}");
                return Forbid();
            }

            currentMember.ExternalUserId = userId;
            currentMember.LastSuccessfulLogin = DateTime.UtcNow;

            telemetryReporter.LogInformation($"User {userId} ({userName}@{sourceSystem}) logged in successfully");
            // Update current user
            await messagingClient.Send(new SaveTeamMemberCommand
            {
                Member = mapper.Map<ESS.Shared.Contracts.Teams.TeamMember>(currentMember)
            });

            return Ok(mapper.Map<UserProfile>(currentMember));
        }

        /// <summary>
        /// Update the current user's profile
        /// </summary>
        /// <param name="request">The profile information</param>
        /// <returns>profile id</returns>
        [HttpPost("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Update(UpdateUserProfileRequest request)
        {
            var userName = GetCurrentUserName();

            // Get the current user
            var reply = await messagingClient.Send(new TeamMembersQuery { UserName = userName, IncludeActiveUsersOnly = false });
            var currentMember = reply.TeamMembers.SingleOrDefault();
            if (currentMember == null)
            {
                throw new NotFoundException($"team member not found", userName);
            }

            // Set the updateable fields
            currentMember.FirstName = request.FirstName;
            currentMember.LastName = request.LastName;
            currentMember.Email = request.Email;
            currentMember.Phone = request.Phone;

            // Update current user
            await messagingClient.Send(new SaveTeamMemberCommand
            {
                Member = mapper.Map<ESS.Shared.Contracts.Teams.TeamMember>(currentMember)
            });

            return Ok();
        }

        /// <summary>
        /// Current user read and signed the electronic agreement
        /// </summary>
        /// <returns>Ok when successful</returns>
        [HttpPost("agreement")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SignAgreement()
        {
            var userName = GetCurrentUserName();

            // Get the current user
            var reply = await messagingClient.Send(new TeamMembersQuery { UserName = userName, IncludeActiveUsersOnly = true });
            var currentMember = reply.TeamMembers.SingleOrDefault();
            if (currentMember == null)
            {
                throw new NotFoundException($"team member not found", userName);
            }

            // Set the Agreement Sign Date
            currentMember.AgreementSignDate = DateTime.UtcNow;

            // Update current user
            await messagingClient.Send(new SaveTeamMemberCommand
            {
                Member = mapper.Map<ESS.Shared.Contracts.Teams.TeamMember>(currentMember)
            });

            return Ok();
        }
    }

    public class UserProfile
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string TeamId { get; set; }
        public string TeamName { get; set; }
        public string Role { get; set; }
        public string Label { get; set; }
        public bool RequiredToSignAgreement { get; set; }
        public DateTime? AgreementSignDate { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }

    public class UpdateUserProfileRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }

    public class SecurityMapping : Profile
    {
        public SecurityMapping()
        {
            CreateMap<EMBC.ESS.Shared.Contracts.Teams.TeamMember, UserProfile>()
                .ForMember(d => d.LastLoginDate, opts => opts.MapFrom(s => s.LastSuccessfulLogin))
                .ForMember(d => d.RequiredToSignAgreement, opts => opts.MapFrom(s => !s.AgreementSignDate.HasValue));
        }
    }
}
