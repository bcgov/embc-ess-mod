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
using System.Security.Claims;
using System.Threading.Tasks;
using EMBC.Registrants.API.ProfilesModule;
using EMBC.Registrants.API.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace EMBC.Registrants.API.EvacuationsModule
{
    [Route("api/evacuations")]
    [ApiController]
    [Authorize]
    public class EvacuationController : ControllerBase
    {
        private readonly IEvacuationManager evacuationManager;
        private readonly IHostEnvironment env;

        public EvacuationController(IEvacuationManager evacuationManager, IHostEnvironment env)
        {
            this.evacuationManager = evacuationManager;
            this.env = env;
        }

        /// <summary>
        /// Get the currently logged in user's current list of evacuations
        /// </summary>
        /// <returns>List of RegistrantEvacuation</returns>
        [HttpGet("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<ActionResult<List<NeedsAssessment>>> GetCurrentEvacuations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var evacuationList = await evacuationManager.GetEvacuations(userId);

            return Ok(evacuationList);
        }

        /// <summary>
        /// Get the currently logged in user's past list of evacuations
        /// </summary>
        /// <returns>List of RegistrantEvacuation</returns>
        [HttpGet("past")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<ActionResult<List<NeedsAssessment>>> GetPastEvacuations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var evacuationList = await evacuationManager.GetEvacuations(userId);

            return Ok(evacuationList);
        }

        /// <summary>
        /// Create a verified Evacuation
        /// </summary>
        /// <param name="needsAssessment">Evacuation data</param>
        /// <returns>ESS number</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> CreateEvacuation(NeedsAssessment needsAssessment)
        {
            if (needsAssessment == null)
                return BadRequest();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var essFileNumber = await evacuationManager.SaveEvacuation(userId, null, needsAssessment);

            return Ok(essFileNumber);
        }

        /// <summary>
        /// Update a verified Evacuation
        /// </summary>
        /// <param name="essFileNumber">ESS File Number</param>
        /// <param name="needsAssessment">Evacuation data</param>
        /// <returns>ESS number</returns>
        [HttpPost("{essFileNumber}")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> UpdateEvacuation(string essFileNumber, NeedsAssessment needsAssessment)
        {
            if (needsAssessment == null)
                return BadRequest();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            essFileNumber = await evacuationManager.SaveEvacuation(userId, essFileNumber, needsAssessment);

            return Ok(essFileNumber);
        }
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
        public bool? CanEvacueeProvideFood { get; set; }
        public bool? CanEvacueeProvideLodging { get; set; }
        public bool? CanEvacueeProvideClothing { get; set; }
        public bool? CanEvacueeProvideTransportation { get; set; }
        public bool? CanEvacueeProvideIncidentals { get; set; }
        public bool HaveSpecialDiet { get; set; }
        public string SpecialDietDetails { get; set; }
        public bool HaveMedication { get; set; }
        public IEnumerable<PersonDetails> FamilyMembers { get; set; } = Array.Empty<PersonDetails>();
        public IEnumerable<Pet> Pets { get; set; } = Array.Empty<Pet>();
        public bool? HasPetsFood { get; set; }

        public enum InsuranceOption
        {
            No = 174360000,
            Yes = 174360001,
            Unsure = 174360002,
            Unknown = 174360003
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

    public enum EvacueeType
    {
        Person = 174360000,
        Pet = 174360001
    }

    public enum NeedsAssessmentType
    {
        Preliminary = 174360000,
        Assessed = 174360001
    }

    public enum RegistrantType
    {
        Primary = 174360000,
        Member = 174360001
    }
}
