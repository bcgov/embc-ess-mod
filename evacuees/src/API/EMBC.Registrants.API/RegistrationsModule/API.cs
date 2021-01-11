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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
        /// Patch a Registrant Profile
        /// </summary>
        /// <param name="id">Contact Id</param>
        /// <param name="profileRegistration">Profile Registration Form</param>
        /// <returns>Registration</returns>
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

            var profile = await registrationManager.PatchProfileById(id, profileRegistration);

            return profile;
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
    }

    /// <summary>
    /// Person details
    /// </summary>
    public class PersonDetails
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public string Initials { get; set; }
        public string PreferredName { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string DateOfBirth { get; set; }
    }

    /// <summary>
    /// Address data with optional lookup code
    /// </summary>
    public class Address
    {
        [Required]
        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        [Required]
        public Jurisdiction Jurisdiction { get; set; }

        public StateProvince StateProvince { get; set; }

        [Required]
        public Country Country { get; set; }

        [Required]
        public string PostalCode { get; set; }
    }

    public class Jurisdiction
    {
        public string JurisdictionCode { get; set; }

        [Required]
        public string JurisdictionName { get; set; }
    }

    public class StateProvince
    {
        public string StateProvinceCode { get; set; }
        public string StateProvinceName { get; set; }
    }

    public class Country
    {
        [Required]
        public string CountryCode { get; set; }

        public string CountryName { get; set; }
    }

    /// <summary>
    /// Registrant contact information
    /// </summary>
    public class ContactDetails
    {
        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Phone { get; set; }

        public bool HidePhoneRequired { get; set; }

        public bool HideEmailRequired { get; set; }
    }

    /// <summary>
    /// Needs assessment form
    /// </summary>
    public class NeedsAssessment
    {
        [Required]
        public Address EvacuatedFromAddress { get; set; }

        [Required]
        public InsuranceOption Insurance { get; set; }

        public bool? RequiresFood { get; set; } //To be deleted
        public bool? RequiresTransportation { get; set; } //To be deleted
        public bool? RequiresLodging { get; set; } //To be deleted
        public bool? RequiresClothing { get; set; } //To be deleted
        public bool? RequiresIncidentals { get; set; } //To be deleted
        public bool? CanEvacueeProvideFood { get; set; }
        public bool? CanEvacueeProvideLodging { get; set; }
        public bool? CanEvacueeProvideClothing { get; set; }
        public bool? CanEvacueeProvideTransportation { get; set; }
        public bool? CanEvacueeProvideIncidentals { get; set; }
        public bool HaveSpecialDiet { get; set; }
        public bool HaveMedication { get; set; }
        public IEnumerable<PersonDetails> FamilyMembers { get; set; } = Array.Empty<PersonDetails>();
        public IEnumerable<Pet> Pets { get; set; } = Array.Empty<Pet>();
        public bool? HasPetsFood { get; set; }

        public enum InsuranceOption
        {
            Unknown,
            Yes,
            No,
            Unsure
        }
    }

    /// <summary>
    /// A pet in needs assessment
    /// </summary>
    public class Pet
    {
        public string Type { get; set; }
        public string Quantity { get; set; }
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
