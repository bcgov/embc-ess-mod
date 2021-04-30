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
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Submissions;
using EMBC.Registrants.API.EvacuationsModule;
using EMBC.Registrants.API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Registrants.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EvacuationsController : ControllerBase
    {
        private readonly IMessagingClient messagingClient;
        private readonly IEvacuationManager evacuationManager;
        private readonly IMapper mapper;

        public EvacuationsController(IMessagingClient messagingClient, IEvacuationManager evacuationManager, IMapper mapper)
        {
            this.messagingClient = messagingClient;
            this.evacuationManager = evacuationManager;
            this.mapper = mapper;
        }

        /// <summary>
        /// Anonymously Create a Registrant Profile and Evacuation File
        /// </summary>
        /// <param name="registration">Anonymous registration form</param>
        /// <returns>ESS number</returns>
        [HttpPost("create-registration-anonymous")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<ActionResult<RegistrationResult>> Create(AnonymousRegistration registration)
        {
            if (registration == null) return BadRequest();
            var id = await messagingClient.Send(new SubmitAnonymousEvacuationFileCommand
            {
                File = mapper.Map<ESS.Shared.Contracts.Submissions.EvacuationFile>(registration),
                SubmitterProfile = mapper.Map<RegistrantProfile>(registration.RegistrationDetails)
            });

            return Ok(new RegistrationResult { ReferenceNumber = id });
        }

        /// <summary>
        /// Get the currently logged in user's current list of evacuations
        /// </summary>
        /// <returns>List of EvacuationFile</returns>
        [HttpGet("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult<IEnumerable<EvacuationFile>>> GetCurrentEvacuations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var evacuationList = await evacuationManager.GetEvacuations(userId);

            return Ok(evacuationList);
        }

        /// <summary>
        /// Get the currently logged in user's past list of evacuations
        /// </summary>
        /// <returns>List of EvacuationFile</returns>
        [HttpGet("past")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult<IEnumerable<EvacuationFile>>> GetPastEvacuations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var evacuationList = await evacuationManager.GetEvacuations(userId);

            return Ok(evacuationList);
        }

        /// <summary>
        /// Create a verified Evacuation
        /// </summary>
        /// <param name="evacuationFile">Evacuation data</param>
        /// <returns>ESS number</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult<string>> CreateEvacuation(EvacuationFile evacuationFile)
        {
            if (evacuationFile == null)
                return BadRequest();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var essFileNumber = await evacuationManager.SaveEvacuation(userId, null, evacuationFile);

            return Ok(essFileNumber);
        }

        /// <summary>
        /// Update a verified Evacuation
        /// </summary>
        /// <param name="essFileNumber">ESS File Number</param>
        /// <param name="evacuationFile">Evacuation data</param>
        /// <returns>ESS number</returns>
        [HttpPost("{essFileNumber}")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult<string>> UpdateEvacuation(string essFileNumber, EvacuationFile evacuationFile)
        {
            if (evacuationFile == null)
                return BadRequest();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            essFileNumber = await evacuationManager.SaveEvacuation(userId, essFileNumber, evacuationFile);

            return Ok(essFileNumber);
        }
    }

    /// <summary>
    /// Evacuation File
    /// </summary>
    public class EvacuationFile
    {
        public string EssFileNumber { get; set; }

        public string EvacuationFileDate { get; set; }

        public bool IsRestricted { get; set; }

        [Required]
        public Address EvacuatedFromAddress { get; set; }

        [Required]
        public IEnumerable<NeedsAssessment> NeedsAssessments { get; set; } = Array.Empty<NeedsAssessment>();
    }

    /// <summary>
    /// Needs assessment form
    /// </summary>
    public class NeedsAssessment
    {
        public string Id { get; set; }

        [Required]
        public InsuranceOption Insurance { get; set; }

        public bool? CanEvacueeProvideFood { get; set; }
        public bool? CanEvacueeProvideLodging { get; set; }
        public bool? CanEvacueeProvideClothing { get; set; }
        public bool? CanEvacueeProvideTransportation { get; set; }
        public bool? CanEvacueeProvideIncidentals { get; set; }
        public bool HaveSpecialDiet { get; set; }
        public string SpecialDietDetails { get; set; }
        public bool HaveMedication { get; set; }
        public IEnumerable<HouseholdMember> HouseholdMembers { get; set; } = Array.Empty<HouseholdMember>();
        public IEnumerable<Pet> Pets { get; set; } = Array.Empty<Pet>();
        public bool? HasPetsFood { get; set; }
        public NeedsAssessmentType Type { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum InsuranceOption
        {
            [EnumMember(Value = "No")]
            No = 174360000,

            [EnumMember(Value = "Yes")]
            Yes = 174360001,

            [EnumMember(Value = "Unsure")]
            Unsure = 174360002,

            [EnumMember(Value = "Unknown")]
            Unknown = 174360003
        }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public enum NeedsAssessmentType
        {
            Preliminary = 174360000,
            Assessed = 174360001
        }
    }

    /// <summary>
    /// A member of the household in needs assessment
    /// </summary>
    public class HouseholdMember
    {
        public string Id { get; set; }
        public PersonDetails Details { get; set; }
        public bool isUnder19 { get; set; }
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
        public bool InformationCollectionConsent { get; set; }

        [Required]
        public string Captcha { get; set; }
    }

    /// <summary>
    /// Reference number of a new registration submission
    /// </summary>
    public class RegistrationResult
    {
        public string ReferenceNumber { get; set; }
    }
}
