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
using EMBC.Registrants.API.ProfilesModule;
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
    }

    /// <summary>
    /// Registration form for anonymous registrants
    /// </summary>
    public class AnonymousRegistration
    {
        [Required]
        public Profile RegistrationDetails { get; set; }

        [Required]
        public Address EvacuatedFromAddress { get; set; }

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
    /// Reference number of a new registration submission
    /// </summary>
    public class RegistrationResult
    {
        [Required]
        public string ReferenceNumber { get; set; }
    }
}
