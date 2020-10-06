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
        private readonly RegistrationReferenceNumberGenerator registrationReferenceNumberGenerator;

        public RegistrationController(RegistrationReferenceNumberGenerator registrationReferenceNumberGenerator)
        {
            this.registrationReferenceNumberGenerator = registrationReferenceNumberGenerator;
        }

        /// <summary>
        /// Register a new anonymous registrant and preliminary needs assessment
        /// </summary>
        /// <param name="registration">Anonymous registration form</param>
        /// <returns>New registration number</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<RegistrationResult>> Create(AnonymousRegistration registration)
        {
            if (registration == null) return BadRequest();
            var referenceNumber = await registrationReferenceNumberGenerator.GenerateNext();

            return CreatedAtAction(nameof(Create), new RegistrationResult { ReferenceNumber = referenceNumber });
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
        public NeedsAssessment PerliminaryNeedsAssessment { get; set; }

        [Required]
        public string Captcha { get; set; }
    }

    /// <summary>
    /// New registration form
    /// </summary>
    public class Registration
    {
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

        public bool? RequiresFood { get; set; }
        public bool? RequiresTransportation { get; set; }
        public bool? RequiresLodging { get; set; }
        public bool? RequiresClothing { get; set; }
        public bool? RequiresIncidentals { get; set; }
        public bool HaveSpecialDiet { get; set; }
        public bool HaveMedication { get; set; }
        public IEnumerable<PersonDetails> FamilyMembers { get; set; } = Array.Empty<PersonDetails>();
        public IEnumerable<Pet> Pets { get; set; } = Array.Empty<Pet>();

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
