// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
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
using EMBC.Registrants.API.EvacuationsModule;
using EMBC.Registrants.API.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace EMBC.Registrants.API.RegistrationsModule
{
    [Route("api/registration")]
    [ApiController]
    public class RegistrationController : ControllerBase
    {
        private readonly IRegistrationManager registrationManager;

        public RegistrationController(IRegistrationManager registrationManager)
        {
            this.registrationManager = registrationManager;
        }

        /// <summary>
        /// Anonymously Create a Registrant Profile and Evacuation File
        /// </summary>
        /// <param name="registration">Anonymous registration form</param>
        /// <returns>ESS number</returns>
        [HttpPost("create-registration-anonymous")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<RegistrationResult>> Create(AnonymousRegistration registration)
        {
            if (registration == null) return BadRequest();
            var referenceNumber = await registrationManager.CreateRegistrationAnonymous(registration);

            return CreatedAtAction(nameof(Create), new RegistrationResult { ReferenceNumber = referenceNumber });
        }

        /// <summary>
        /// Create a Registrant Evacuation
        /// </summary>
        /// <param name="evacuation">registrant evacuation data</param>
        /// <returns>ESS number</returns>
        [HttpPost("evacuation")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<RegistrationResult>> CreateEvacuation(RegistrantEvacuation evacuation)
        {
            //if (evacuation == null || string.IsNullOrEmpty(evacuation.ContactId))
            //    return BadRequest();BCServicesCardtId
            if (evacuation == null || string.IsNullOrEmpty(evacuation.Id))
                return BadRequest();

            var essFileNumber = await registrationManager.CreateRegistrantEvacuation(evacuation);

            return CreatedAtAction(nameof(Create), new RegistrationResult { ReferenceNumber = essFileNumber });
        }

        /// <summary>
        /// Create a Registrant Profile
        /// </summary>
        /// <param name="profileRegistration">Profile Registration Form</param>
        /// <returns>A <see cref="Task{TResult}"/> representing the result of the asynchronous operation.</returns>
        [HttpPost("create-profile")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> CreateProfile(Registration profileRegistration)
        {
            if (profileRegistration == null)
                return BadRequest();

            var result = await registrationManager.CreateProfile(profileRegistration);

            return CreatedAtAction(nameof(CreateProfile), result);
        }

        /// <summary>
        /// Get a Registrant Profile
        /// </summary>
        /// <param name="id">Contact Id</param>
        /// <returns>Registration</returns>
        [HttpGet("get-profile/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Registration>> GetProfileById(string id)
        {
            if (string.IsNullOrEmpty(id) || !Guid.TryParse(id, out Guid contactId))
            {
                return BadRequest();
            }

            var profile = await registrationManager.GetProfileById(contactId);

            //if (string.IsNullOrEmpty(profile.ContactId))
            //    return NotFound();

            // if id not found then an empty oject is returned
            return Ok(profile);
        }

        /// <summary>
        /// Get a Registrant Profile by BCSC
        /// </summary>
        /// <param name="bcscId">BCSC Id</param>
        /// <returns>Registration</returns>
        [HttpGet("get-profile-by-bcsc-id/{bcscId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Registration>> GetProfileByBcscId(string bcscId)
        {
            if (string.IsNullOrEmpty(bcscId))
            {
                return BadRequest();
            }

            var profile = await registrationManager.GetProfileByBcscId(bcscId);

            return Ok(profile);
        }

        /// <summary>
        /// Update a Registrant Profile
        /// </summary>
        /// <param name="id">Contact Id</param>
        /// <param name="profileRegistration">Profile Registration Form</param>
        /// <returns>Registration</returns>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpPatch("patch-profile/{id}")]
        public async Task<ActionResult<Registration>> PatchProfileById(string id, Registration profileRegistration)
        {
            if (string.IsNullOrEmpty(id) || !Guid.TryParse(id, out Guid contactId))
            {
                return BadRequest();
            }

            //if (profileRegistration == null) return NotFound();

            var profile = await registrationManager.PatchProfileById(contactId, profileRegistration);

            return profile;
        }

        /// <summary>
        /// Get a list of evacuations by Contact Id
        /// </summary>
        /// <param name="contactId">Query Parameter: Contact Id</param>
        /// <returns>List of RegistrantEvacuation</returns>
        [HttpGet("evacuation")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<RegistrantEvacuation>>> GetRegistrantEvacuations([FromQuery] string contactId)
        {
            if (string.IsNullOrEmpty(contactId) || !Guid.TryParse(contactId, out Guid contactID))
            {
                return BadRequest();
            }

            var evacuationList = await registrationManager.GetRegistrantEvacuations(contactID);

            return Ok(evacuationList);
        }
    }

    /// <summary>
    /// Registration form for anonymous registrants
    /// </summary>
    public class AnonymousRegistration
    {
        [Required]
        public Registration RegistrationDetails { get; set; }

        [Required]
        public NeedsAssessment PreliminaryNeedsAssessment { get; set; }

        [Required]
        public string Captcha { get; set; }
    }

    /// <summary>
    /// Registrant Evacuation details
    /// </summary>
    public class RegistrantEvacuation
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public NeedsAssessment PreliminaryNeedsAssessment { get; set; }
    }

    /// <summary>
    /// New registration form
    /// </summary>
    public class Registration
    {
        public string ContactId { get; set; }

        public string BCServicesCardId { get; set; }

        [Required]
        public PersonDetails PersonalDetails { get; set; }

        [Required]
        public ContactDetails ContactDetails { get; set; }

        [Required]
        public Address PrimaryAddress { get; set; }

        public Address MailingAddress { get; set; }

        [Required]
        public bool InformationCollectionConsent { get; set; }

        [Required]
        public bool RestrictedAccess { get; set; }

        [Required]
        public string SecretPhrase { get; set; }

        [Required]
        public Address EvacuatedFromAddress { get; set; }
    }

    /// <summary>
    /// Reference number of a new registration submission
    /// </summary>
    public class RegistrationResult
    {
        [Required]
        public string ReferenceNumber { get; set; }
    }
}
