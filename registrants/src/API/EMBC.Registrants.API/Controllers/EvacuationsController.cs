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
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Submissions;
using EMBC.Registrants.API.Services;
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
        private readonly IMapper mapper;
        private readonly IEvacuationSearchService evacuationSearchService;

        public EvacuationsController(IMessagingClient messagingClient, IMapper mapper, IEvacuationSearchService evacuationSearchService)
        {
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.evacuationSearchService = evacuationSearchService;
        }

        /// <summary>
        /// Anonymously Create a Registrant Profile and Evacuation File
        /// </summary>
        /// <param name="registration">Anonymous registration form</param>
        /// <returns>ESS number</returns>
        [HttpPost("create-registration-anonymous")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [AllowAnonymous]
        public async Task<ActionResult<RegistrationResult>> Create(AnonymousRegistration registration)
        {
            if (registration == null) return BadRequest();

            var profile = mapper.Map<RegistrantProfile>(registration.RegistrationDetails);
            //anonymous profiles are unverified and not authenticated
            profile.AuthenticatedUser = false;
            profile.VerifiedUser = false;
            var file = mapper.Map<ESS.Shared.Contracts.Submissions.EvacuationFile>(registration.PreliminaryNeedsAssessment);
            var id = await messagingClient.Send(new SubmitAnonymousEvacuationFileCommand
            {
                File = file,
                SubmitterProfile = profile
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
            var files = await evacuationSearchService.GetFiles(userId,
                new[] { ESS.Shared.Contracts.Submissions.EvacuationFileStatus.Active, ESS.Shared.Contracts.Submissions.EvacuationFileStatus.Pending, ESS.Shared.Contracts.Submissions.EvacuationFileStatus.Expired });

            return Ok(mapper.Map<IEnumerable<EvacuationFile>>(files));
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
            var files = await evacuationSearchService.GetFiles(userId,
               new[] { ESS.Shared.Contracts.Submissions.EvacuationFileStatus.Archived, ESS.Shared.Contracts.Submissions.EvacuationFileStatus.Completed });

            return Ok(mapper.Map<IEnumerable<EvacuationFile>>(files));
        }

        /// <summary>
        /// Create or update a verified Evacuation file
        /// </summary>
        /// <param name="evacuationFile">Evacuation data</param>
        /// <returns>ESS number</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<ActionResult<RegistrationResult>> UpsertEvacuationFile(EvacuationFile evacuationFile)
        {
            if (evacuationFile == null)
                return BadRequest();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var file = mapper.Map<ESS.Shared.Contracts.Submissions.EvacuationFile>(evacuationFile);
            file.PrimaryRegistrantId = userId;
            var fileId = await messagingClient.Send(new SubmitEvacuationFileCommand { File = file });

            return Ok(new RegistrationResult { ReferenceNumber = fileId });
        }
    }

    /// <summary>
    /// Evacuation File
    /// </summary>
    public class EvacuationFile
    {
        public string FileId { get; set; }
        public EvacuationFileStatus Status { get; set; }

        public string EvacuationFileDate { get; set; }

        public bool IsRestricted { get; set; }

        [Required]
        public Address EvacuatedFromAddress { get; set; }

        [Required]
        public NeedsAssessment NeedsAssessment { get; set; }

        public string SecretPhrase { get; set; }
        public bool SecretPhraseEdited { get; set; }
        public DateTime LastModified { get; set; }
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
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
    }

    /// <summary>
    /// A member of the household in needs assessment
    /// </summary>
    public class HouseholdMember
    {
        public string Id { get; set; }
        public bool IsPrimaryRegistrant { get; set; }
        public PersonDetails Details { get; set; }
        public bool IsUnder19 { get; set; }
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
        public EvacuationFile PreliminaryNeedsAssessment { get; set; }

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

    public enum EvacuationFileStatus
    {
        [EnumMember(Value = "Pending")]
        Pending,

        [EnumMember(Value = "Active")]
        Active,

        [EnumMember(Value = "Expired")]
        Expired,

        [EnumMember(Value = "Completed")]
        Completed,

        [EnumMember(Value = "Archived")]
        Archived
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum InsuranceOption
    {
        [EnumMember(Value = "No")]
        No,

        [EnumMember(Value = "Yes")]
        Yes,

        [EnumMember(Value = "Unsure")]
        Unsure,

        [EnumMember(Value = "Unknown")]
        Unknown
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum NeedsAssessmentType
    {
        Preliminary,
        Assessed
    }

    [KnownType(typeof(Referral))]
    public abstract class Support
    {
        public string Id { get; set; }
        public DateTime IssuedOn { get; set; }
        public string IssuingMemberTeamName { get; set; }

        public DateTime From { get; set; }
        public DateTime To { get; set; }

        public SupportStatus Status { get; set; }

        public abstract SupportMethod Method { get; }

        public abstract SupportCategory Category { get; }

        public abstract SupportSubCategory SubCategory { get; }

        public IEnumerable<string> IncludedHouseholdMembers { get; set; } = Array.Empty<string>();
    }

    [KnownType(typeof(ClothingReferral))]
    [KnownType(typeof(IncidentalsReferral))]
    [KnownType(typeof(FoodGroceriesReferral))]
    [KnownType(typeof(FoodRestaurantReferral))]
    [KnownType(typeof(FoodRestaurantReferral))]
    [KnownType(typeof(LodgingBilletingReferral))]
    [KnownType(typeof(LodgingGroupReferral))]
    [KnownType(typeof(LodgingHotelReferral))]
    [KnownType(typeof(TransportationOtherReferral))]
    [KnownType(typeof(TransportationTaxiReferral))]
    public abstract class Referral : Support
    {
        public override SupportMethod Method => SupportMethod.Referral;

        public string SupplierId { get; set; }

        public string SupplierName { get; set; }
        public Address SupplierAddress { get; set; }

        public string IssuedToPersonName { get; set; }
    }

    public class ClothingReferral : Referral
    {
        public bool ExtremeWinterConditions { get; set; }

        public override SupportCategory Category => SupportCategory.Clothing;

        public override SupportSubCategory SubCategory => SupportSubCategory.None;

        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }
    }

    public class IncidentalsReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Incidentals;

        public override SupportSubCategory SubCategory => SupportSubCategory.None;

        public string ApprovedItems { get; set; }

        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }
    }

    public class FoodGroceriesReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Food;

        public override SupportSubCategory SubCategory => SupportSubCategory.Food_Groceries;

        [Range(0, int.MaxValue)]
        public int NumberOfDays { get; set; }

        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }
    }

    public class FoodRestaurantReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Food;

        public override SupportSubCategory SubCategory => SupportSubCategory.Food_Restaurant;

        [Range(0, int.MaxValue)]
        public int NumberOfBreakfastsPerPerson { get; set; }

        [Range(0, int.MaxValue)]
        public int NumberOfLunchesPerPerson { get; set; }

        [Range(0, int.MaxValue)]
        public int NumberOfDinnersPerPerson { get; set; }

        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }
    }

    public class LodgingHotelReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Lodging;

        public override SupportSubCategory SubCategory => SupportSubCategory.Lodging_Hotel;

        [Range(0, int.MaxValue)]
        public int NumberOfNights { get; set; }

        [Range(0, int.MaxValue)]
        public int NumberOfRooms { get; set; }
    }

    public class LodgingBilletingReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Lodging;

        public override SupportSubCategory SubCategory => SupportSubCategory.Lodging_Billeting;

        [Range(0, int.MaxValue)]
        public int NumberOfNights { get; set; }

        public string HostName { get; set; }
        public string HostAddress { get; set; }
        public string HostCity { get; set; }
        public string HostEmail { get; set; }
        public string HostPhone { get; set; }
    }

    public class LodgingGroupReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Lodging;

        public override SupportSubCategory SubCategory => SupportSubCategory.Lodging_Group;

        [Range(0, int.MaxValue)]
        public int NumberOfNights { get; set; }

        public string FacilityName { get; set; }
        public string FacilityAddress { get; set; }
        public string FacilityCity { get; set; }
        public string FacilityCommunityCode { get; set; }
        public string FacilityContactPhone { get; set; }
    }

    public class TransportationTaxiReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Transportation;

        public override SupportSubCategory SubCategory => SupportSubCategory.Transportation_Taxi;

        public string FromAddress { get; set; }

        public string ToAddress { get; set; }
    }

    public class TransportationOtherReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Transportation;

        public override SupportSubCategory SubCategory => SupportSubCategory.Transportation_Other;

        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }

        public string TransportMode { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SupportStatus
    {
        [Description("Draft")]
        Draft,

        [Description("Active")]
        Active,

        [Description("Expired")]
        Expired,

        [Description("Void")]
        Void
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SupportMethod
    {
        Unknown,

        [Description("Referral")]
        Referral
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SupportCategory
    {
        Unknown,

        [Description("Clothing")]
        Clothing,

        [Description("Food")]
        Food,

        [Description("Incidentals")]
        Incidentals,

        [Description("Lodging")]
        Lodging,

        [Description("Transportation")]
        Transportation
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SupportSubCategory
    {
        None,

        [Description("Hotel/Motel")]
        Lodging_Hotel,

        [Description("Billeting")]
        Lodging_Billeting,

        [Description("Group Lodging")]
        Lodging_Group,

        [Description("Groceries")]
        Food_Groceries,

        [Description("Restaurant Meals")]
        Food_Restaurant,

        [Description("Taxi")]
        Transportation_Taxi,

        [Description("Other")]
        Transportation_Other
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SupportVoidReason
    {
        [Description("Error On Printed Referral")]
        ErrorOnPrintedReferral,

        [Description("New Supplier Required")]
        NewSupplierRequired,

        [Description("Supplier Could Not Meet Need")]
        SupplierCouldNotMeetNeed
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SupportReprintReason
    {
        [Description("Error On Printed Referral")]
        ErrorOnPrintedReferral,

        [Description("Printed Error")]
        PrintedError,

        [Description("Evacuee Lost Referral")]
        EvacueeLostReferral
    }
}
