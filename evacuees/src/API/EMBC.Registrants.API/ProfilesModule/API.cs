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
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Threading.Tasks;
using EMBC.Registrants.API.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using NJsonSchema.Converters;

namespace EMBC.Registrants.API.ProfilesModule
{
    [Route("api/profiles")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileManager profileManager;
        private readonly IHostEnvironment env;

        public ProfileController(IProfileManager profileManager, IHostEnvironment env)
        {
            this.profileManager = profileManager;
            this.env = env;
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
            var profile = await profileManager.GetProfileByBcscid(userId);
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
            // TODO: optimize the check to not require the entire profile
            var profile = await profileManager.GetProfileByBcscid(userId);
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
                await profileManager.DeleteProfile(userId);
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
            await profileManager.SaveProfile(profile);
            return Ok(profile.Id);
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

            var userProfileWithConflicts = await profileManager.GetProfileConflicts(userId);
            if (userProfileWithConflicts == null) return NotFound();
            return Ok(userProfileWithConflicts);
        }

        /// <summary>
        /// Get the authentication profile of the logged in user
        /// </summary>
        /// <returns>a profile representing the authentication user data</returns>
        [HttpGet("current/login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<ActionResult<Profile>> GetLoggedInProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var loginProfile = await profileManager.GetLoginProfile(userId);
            if (loginProfile == null) return NotFound();
            return Ok(loginProfile);
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
        public new (string firstName, string lastName) ConflictingValue { get; set; }
        [Required]
        public new (string firstName, string lastName) OriginalValue { get; set; }
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
