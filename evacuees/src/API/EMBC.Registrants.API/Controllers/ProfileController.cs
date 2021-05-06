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
using System.Linq;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Submissions;
using EMBC.Registrants.API.ProfilesModule;
using EMBC.Registrants.API.SecurityModule;
using EMBC.Registrants.API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using NJsonSchema.Converters;

namespace EMBC.Registrants.API.Controllers
{
    [Route("api/profiles")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IHostEnvironment env;
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private readonly IUserManager userManager;

        public ProfileController(IHostEnvironment env, IMessagingClient messagingClient, IMapper mapper, IUserManager userManager)
        {
            this.env = env;
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.userManager = userManager;
        }

        /// <summary>
        /// Get the current logged in user's profile
        /// </summary>
        /// <returns>Currently logged in user's profile</returns>
        [HttpGet("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<ActionResult<Profile>> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var profile = (await messagingClient.Send(new RegistrantsQuery { ByUserId = userId })).Items.SingleOrDefault();
            if (profile == null) return NotFound();
            return Ok(profile);
        }

        /// <summary>
        /// check if user exists or not
        /// </summary>
        /// <returns>true if existing user, false if a new user</returns>
        [HttpGet("current/exists")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult<bool>> GetDoesUserExists()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var profile = (await messagingClient.Send(new RegistrantsQuery { ByUserId = userId })).Items.SingleOrDefault();
            return Ok(profile != null);
        }

        /// <summary>
        /// Get the current logged in user's profile
        /// </summary>
        /// <returns>Currently logged in user's profile</returns>
        [HttpDelete("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult<Profile>> DeleteProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!env.IsProduction())
            {
                await messagingClient.Send(new DeleteRegistrantCommand { UserId = userId });
            }
            return Ok(userId);
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
        [Authorize]
        public async Task<ActionResult<string>> Upsert(Profile profile)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (profile.Id != userId)
            {
                //TODO: replace with bad request response
                profile.Id = userId;
            }
            var profileId = await messagingClient.Send(new SaveRegistrantCommand { Profile = mapper.Map<RegistrantProfile>(profile) });
            return Ok(profileId);
        }

        /// <summary>
        /// Get the logged in user's profile and conflicts with the data that came from the authenticating identity provider
        /// </summary>
        /// <returns>The current user's profile, the identity provider's profile and the detected conflicts</returns>
        [HttpGet("current/conflicts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ProfileDataConflict>>> GetProfileConflicts()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var profile = (await messagingClient.Send(new RegistrantsQuery { ByUserId = userId })).Items.SingleOrDefault();
            if (profile == null) return NotFound();

            //TODO: map to user profile from BCSC
            var userProfile = await userManager.Get(userId);
            var conflicts = ProfilesConflictDetector.DetectConflicts(mapper.Map<Profile>(profile), userProfile);
            return Ok(conflicts);
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
        public string SecretPhrase { get; set; }
    }

    /// <summary>
    /// Base class for profile data conflicts
    /// </summary>
    [JsonConverter(typeof(JsonInheritanceConverter), "dataElementName")]
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
        public new(string firstName, string lastName) ConflictingValue { get; set; }

        [Required]
        public new(string firstName, string lastName) OriginalValue { get; set; }
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
}
