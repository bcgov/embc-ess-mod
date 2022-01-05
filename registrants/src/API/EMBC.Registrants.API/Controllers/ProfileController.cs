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

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Submissions;
using EMBC.Registrants.API.Services;
using EMBC.Registrants.API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using NJsonSchema.Converters;

namespace EMBC.Registrants.API.Controllers
{
    [Route("api/profiles")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private readonly IEvacuationSearchService evacuationSearchService;
        private readonly IProfileInviteService profileInviteService;

        private string currentUserId => User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        public ProfileController(
            IHostEnvironment env,
            IMessagingClient messagingClient,
            IMapper mapper,
            IEvacuationSearchService evacuationSearchService,
            IProfileInviteService profileInviteService)
        {
            this.env = env;
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.evacuationSearchService = evacuationSearchService;
            this.profileInviteService = profileInviteService;
        }

        /// <summary>
        /// Get the current logged in user's profile
        /// </summary>
        /// <returns>Currently logged in user's profile</returns>
        [HttpGet("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Profile>> GetProfile()
        {
            var userId = currentUserId;
            var profile = mapper.Map<Profile>(await evacuationSearchService.GetRegistrantByUserId(userId));
            if (profile == null)
            {
                //try get BCSC profile
                profile = GetUserFromPrincipal();
            }
            if (profile == null) return NotFound(userId);
            return Ok(profile);
        }

        /// <summary>
        /// check if user exists or not
        /// </summary>
        /// <returns>true if existing user, false if a new user</returns>
        [HttpGet("current/exists")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> GetDoesUserExists()
        {
            var userId = currentUserId;
            var profile = await evacuationSearchService.GetRegistrantByUserId(userId);
            return Ok(profile != null);
        }

        /// <summary>
        /// Create or update the current user's profile
        /// </summary>
        /// <param name="profile">The profile information</param>
        /// <returns>profile id</returns>
        [HttpPost("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> Upsert(Profile profile)
        {
            profile.Id = currentUserId;
            var mappedProfile = mapper.Map<RegistrantProfile>(profile);
            //BCSC profiles are authenticated and verified
            mappedProfile.AuthenticatedUser = true;
            mappedProfile.VerifiedUser = true;
            var profileId = await messagingClient.Send(new SaveRegistrantCommand { Profile = mappedProfile });
            return Ok(profileId);
        }

        /// <summary>
        /// Get the logged in user's profile and conflicts with the data that came from the authenticating identity provider
        /// </summary>
        /// <returns>The current user's profile, the identity provider's profile and the detected conflicts</returns>
        [HttpGet("current/conflicts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<ProfileDataConflict>>> GetProfileConflicts()
        {
            var userId = currentUserId;

            var profile = await evacuationSearchService.GetRegistrantByUserId(userId);
            if (profile == null) return NotFound(userId);

            //TODO: map to user profile from BCSC
            var userProfile = GetUserFromPrincipal();
            var conflicts = ProfilesConflictDetector.DetectConflicts(mapper.Map<Profile>(profile), userProfile);
            return Ok(conflicts);
        }

        private Profile GetUserFromPrincipal()
        {
            if (!User.HasClaim(c => c.Type.Equals("userInfo", System.StringComparison.OrdinalIgnoreCase))) return null;
            var userProfile = BcscUserInfoMapper.MapBcscUserInfoToProfile(User.Identity?.Name, JsonDocument.Parse(User.FindFirstValue("userInfo")));
            return userProfile;
        }

        [HttpPost("invite-anonymous")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [AllowAnonymous]
        public async Task<IActionResult> Invite(InviteRequest request)
        {
            var file = (await messagingClient.Send(new EvacuationFilesQuery { FileId = request.FileId })).Items.SingleOrDefault();
            if (file == null) return NotFound(request.FileId);
            await messagingClient.Send(new InviteRegistrantCommand { RegistrantId = file.PrimaryRegistrantId, Email = request.Email });
            return Ok();
        }

        [HttpPost("current/join")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> ProcessInvite(InviteToken token)
        {
            return Ok(await profileInviteService.ProcessInvite(token.Token, currentUserId));
        }
    }

    /// <summary>
    /// User's profile
    /// </summary>
    public class Profile
    {
        public string Id { get; set; }

        [Required]
        public PersonDetails PersonalDetails { get; set; }

        [Required]
        public ContactDetails ContactDetails { get; set; }

        [Required]
        public Address PrimaryAddress { get; set; }

        public Address MailingAddress { get; set; }
        public bool IsMailingAddressSameAsPrimaryAddress { get; set; }
        public bool RestrictedAccess { get; set; }
        public IEnumerable<SecurityQuestion> SecurityQuestions { get; set; }
    }

    /// <summary>
    /// Base class for profile data conflicts
    /// </summary>
    [Newtonsoft.Json.JsonConverter(typeof(JsonInheritanceConverter), "dataElementName")]
    [KnownType(typeof(DateOfBirthDataConflict))]
    [KnownType(typeof(NameDataConflict))]
    [KnownType(typeof(AddressDataConflict))]
    public abstract class ProfileDataConflict
    {
        [Required]
        public abstract string DataElementName { get; }

        [Required]
        public virtual object ConflictingValue { get; set; }

        [Required]
        public virtual object OriginalValue { get; set; }
    }

    /// <summary>
    /// Date of birth data conflict
    /// </summary>
    public class DateOfBirthDataConflict : ProfileDataConflict
    {
        [Required]
        public override string DataElementName => "DateOfBirth";

        [Required]
        public new string ConflictingValue { get; set; }

        [Required]
        public new string OriginalValue { get; set; }
    }

    /// <summary>
    /// Name data conflict
    /// </summary>
    public class NameDataConflict : ProfileDataConflict
    {
        [Required]
        public override string DataElementName => "Name";

        [Required]
        public new (string firstName, string lastName) ConflictingValue
        { get; set; }

        [Required]
        public new (string firstName, string lastName) OriginalValue
        { get; set; }
    }

    /// <summary>
    /// Address data conflict
    /// </summary>
    public class AddressDataConflict : ProfileDataConflict
    {
        [Required]
        public override string DataElementName => "Address";

        [Required]
        public new Address ConflictingValue { get; set; }

        [Required]
        public new Address OriginalValue { get; set; }
    }

    public class InviteRequest
    {
        [Required]
        public string FileId { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }

    public class InviteToken
    {
        [Required]
        public string Token { get; set; }
    }
}
