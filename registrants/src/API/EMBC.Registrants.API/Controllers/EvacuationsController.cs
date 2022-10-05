using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Registrants.API.Services;
using EMBC.Utilities.Messaging;
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
        private readonly ICaptchaVerificationService captchaVerificationService;

        private string currentUserId => User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        public EvacuationsController(IMessagingClient messagingClient, IMapper mapper, IEvacuationSearchService evacuationSearchService, ICaptchaVerificationService captchaVerificationService)
        {
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.evacuationSearchService = evacuationSearchService;
            this.captchaVerificationService = captchaVerificationService;
        }

        /// <summary>
        /// Anonymously Create a Registrant Profile and Evacuation File
        /// </summary>
        /// <param name="registration">Anonymous registration form</param>
        /// <param name="ct">cancellation token</param>
        /// <returns>ESS number</returns>
        [HttpPost("create-registration-anonymous")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [AllowAnonymous]
        public async Task<ActionResult<RegistrationResult>> Create(AnonymousRegistration registration, CancellationToken ct)
        {
            if (registration == null) return BadRequest();

            var isValid = await captchaVerificationService.VerifyAsync(registration.Captcha, ct);

            if (!isValid)
            {
                return BadRequest(new ProblemDetails
                {
                    Status = (int)HttpStatusCode.BadRequest,
                    Title = "Invalid captcha",
                });
            }

            var profile = mapper.Map<RegistrantProfile>(registration.RegistrationDetails);
            //anonymous profiles are unverified and not authenticated
            profile.AuthenticatedUser = false;
            profile.VerifiedUser = false;
            var file = mapper.Map<ESS.Shared.Contracts.Events.EvacuationFile>(registration.PreliminaryNeedsAssessment);
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
            try
            {
                var userId = currentUserId;
                var files = await evacuationSearchService.GetFiles(userId,
                    new[] { ESS.Shared.Contracts.Events.EvacuationFileStatus.Active, ESS.Shared.Contracts.Events.EvacuationFileStatus.Pending, ESS.Shared.Contracts.Events.EvacuationFileStatus.Expired });

                return Ok(mapper.Map<IEnumerable<EvacuationFile>>(files));
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
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
            var userId = currentUserId;
            var files = await evacuationSearchService.GetFiles(userId,
               new[] { ESS.Shared.Contracts.Events.EvacuationFileStatus.Archived, ESS.Shared.Contracts.Events.EvacuationFileStatus.Completed });

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

            var userId = currentUserId;
            var file = mapper.Map<ESS.Shared.Contracts.Events.EvacuationFile>(evacuationFile);
            file.PrimaryRegistrantUserId = userId;
            var fileId = await messagingClient.Send(new SubmitEvacuationFileCommand { File = file });

            return Ok(new RegistrationResult { ReferenceNumber = fileId });
        }
    }

    /// <summary>
    /// Evacuation File
    /// </summary>
    public class EvacuationFile
    {
        public string? FileId { get; set; }
        public string? CompletedOn { get; set; }
        public string? CompletedBy { get; set; }
        public EvacuationFileStatus Status { get; set; }

        public DateTime? EvacuationFileDate { get; set; }

        public bool? IsRestricted { get; set; }

        [Required]
        public Address EvacuatedFromAddress { get; set; }

        [Required]
        public NeedsAssessment NeedsAssessment { get; set; }

        public string? SecretPhrase { get; set; }
        public bool? SecretPhraseEdited { get; set; }
        public DateTime LastModified { get; set; }
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
        public string? ManualFileId { get; set; }
        public bool? IsPaper { get; set; }
    }

    /// <summary>
    /// Needs assessment form
    /// </summary>
    public class NeedsAssessment
    {
        public string? Id { get; set; }

        [Required]
        public InsuranceOption Insurance { get; set; }

        public bool? CanEvacueeProvideFood { get; set; }
        public bool? CanEvacueeProvideLodging { get; set; }
        public bool? CanEvacueeProvideClothing { get; set; }
        public bool? CanEvacueeProvideTransportation { get; set; }
        public bool? CanEvacueeProvideIncidentals { get; set; }
        public bool HaveSpecialDiet { get; set; }
        public string? SpecialDietDetails { get; set; }
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
        public string? Id { get; set; }
        public bool IsPrimaryRegistrant { get; set; }
        public PersonDetails Details { get; set; }
        public bool IsMinor { get; set; }
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

    [JsonConverter(typeof(SupportJsonConverter))]
    [KnownType(typeof(ClothingSupport))]
    [KnownType(typeof(IncidentalsSupport))]
    [KnownType(typeof(FoodGroceriesSupport))]
    [KnownType(typeof(FoodRestaurantSupport))]
    [KnownType(typeof(FoodRestaurantSupport))]
    [KnownType(typeof(LodgingBilletingSupport))]
    [KnownType(typeof(LodgingGroupSupport))]
    [KnownType(typeof(LodgingHotelSupport))]
    [KnownType(typeof(TransportationOtherSupport))]
    [KnownType(typeof(TransportationTaxiSupport))]
    public abstract class Support
    {
        public string Id { get; set; }
        public DateTime IssuedOn { get; set; }
        public string IssuingMemberTeamName { get; set; }

        public DateTime From { get; set; }
        public DateTime To { get; set; }

        public SupportStatus Status { get; set; }

        public abstract SupportCategory Category { get; }

        public abstract SupportSubCategory SubCategory { get; }

        public IEnumerable<string> IncludedHouseholdMembers { get; set; } = Array.Empty<string>();
        public string? ManualReferralId { get; set; }

        public SupportMethod Method { get; set; }

        public string? SupplierId { get; set; }

        public string? SupplierName { get; set; }
        public string? SupplierLegalName { get; set; }
        public Address? SupplierAddress { get; set; }

        public string? IssuedToPersonName { get; set; }
        public string? NotificationEmail { get; set; }
        public string? NofificationMobile { get; set; }
        public string? RecipientFirstName { get; set; }
        public string? RecipientLastName { get; set; }
        public string? SecurityQuestion { get; set; }
        public string? SecurityAnswer { get; set; }
    }

    public class ClothingSupport : Support
    {
        public bool ExtremeWinterConditions { get; set; }

        public override SupportCategory Category => SupportCategory.Clothing;

        public override SupportSubCategory SubCategory => SupportSubCategory.None;

        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }
    }

    public class IncidentalsSupport : Support
    {
        public override SupportCategory Category => SupportCategory.Incidentals;

        public override SupportSubCategory SubCategory => SupportSubCategory.None;

        public string ApprovedItems { get; set; }

        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }
    }

    public class FoodGroceriesSupport : Support
    {
        public override SupportCategory Category => SupportCategory.Food;

        public override SupportSubCategory SubCategory => SupportSubCategory.Food_Groceries;

        [Range(0, int.MaxValue)]
        public int NumberOfDays { get; set; }

        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }
    }

    public class FoodRestaurantSupport : Support
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

    public class LodgingHotelSupport : Support
    {
        public override SupportCategory Category => SupportCategory.Lodging;

        public override SupportSubCategory SubCategory => SupportSubCategory.Lodging_Hotel;

        [Range(0, int.MaxValue)]
        public int NumberOfNights { get; set; }

        [Range(0, int.MaxValue)]
        public int NumberOfRooms { get; set; }
    }

    public class LodgingBilletingSupport : Support
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

    public class LodgingGroupSupport : Support
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

    public class TransportationTaxiSupport : Support
    {
        public override SupportCategory Category => SupportCategory.Transportation;

        public override SupportSubCategory SubCategory => SupportSubCategory.Transportation_Taxi;

        public string FromAddress { get; set; }

        public string ToAddress { get; set; }
    }

    public class TransportationOtherSupport : Support
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
        Void,

        [Description("Pending Approval")]
        PendingApproval,

        [Description("Pending Approval")]
        UnderReview,

        [Description("Approved")]
        Approved,

        [Description("Paid")]
        Paid,

        [Description("Cancelled")]
        Cancelled
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SupportMethod
    {
        Unknown,

        [Description("Referral")]
        Referral,

        [Description("e-transfer")]
        ETransfer
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

        [Description("Hotel/Motel/Campground")]
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

    public class SupportJsonConverter : JsonConverter<Support>
    {
        private string FirstLetterCapital(string str) => char.ToUpper(str[0]) + str.Remove(0, 1);

        public override Support Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            //parse the support meta properties to identify the support type (method, category, sub category)
            var clonedReader = reader;
            SupportMethod method = SupportMethod.Unknown;
            SupportCategory category = SupportCategory.Unknown;
            SupportSubCategory subCategory = SupportSubCategory.None;

            if (clonedReader.TokenType != JsonTokenType.StartObject) throw new JsonException($"Invalid json object");

            while (clonedReader.Read())
            {
                if (clonedReader.TokenType != JsonTokenType.PropertyName) continue;
                var propertyName = FirstLetterCapital(clonedReader.GetString());

                clonedReader.Read();
                if (clonedReader.TokenType != JsonTokenType.String || clonedReader.TokenType == JsonTokenType.Null) continue;
                var propertyValue = clonedReader.GetString();
                switch (propertyName)
                {
                    case nameof(Support.Method):
                        if (!Enum.TryParse(propertyValue, out method)) throw new JsonException($"Invalid support method");
                        break;

                    case nameof(Support.Category):
                        if (!Enum.TryParse(propertyValue, out category)) throw new JsonException($"Invalid support category");
                        break;

                    case nameof(Support.SubCategory):
                        if (!Enum.TryParse(propertyValue, out subCategory)) throw new JsonException($"Invalid support sub category");
                        break;
                }
            }

            if (method == SupportMethod.Unknown || category == SupportCategory.Unknown) throw new JsonException($"Could not determine the support method or category");

            //Dserialize to the correct type
            return category switch
            {
                SupportCategory.Clothing => JsonSerializer.Deserialize<ClothingSupport>(ref reader, options),
                SupportCategory.Incidentals => JsonSerializer.Deserialize<IncidentalsSupport>(ref reader, options),
                SupportCategory.Food when subCategory == SupportSubCategory.Food_Groceries => JsonSerializer.Deserialize<FoodGroceriesSupport>(ref reader, options),
                SupportCategory.Food when subCategory == SupportSubCategory.Food_Restaurant => JsonSerializer.Deserialize<FoodRestaurantSupport>(ref reader, options),
                SupportCategory.Lodging when subCategory == SupportSubCategory.Lodging_Hotel => JsonSerializer.Deserialize<LodgingHotelSupport>(ref reader, options),
                SupportCategory.Lodging when subCategory == SupportSubCategory.Lodging_Billeting => JsonSerializer.Deserialize<LodgingBilletingSupport>(ref reader, options),
                SupportCategory.Lodging when subCategory == SupportSubCategory.Lodging_Group => JsonSerializer.Deserialize<LodgingGroupSupport>(ref reader, options),
                SupportCategory.Transportation when subCategory == SupportSubCategory.Transportation_Taxi => JsonSerializer.Deserialize<TransportationTaxiSupport>(ref reader, options),
                SupportCategory.Transportation when subCategory == SupportSubCategory.Transportation_Other => JsonSerializer.Deserialize<TransportationOtherSupport>(ref reader, options),
                _ => throw new NotSupportedException($"Support with method {method}, category {category}, sub category {subCategory}")
            };
        }

        public override void Write(Utf8JsonWriter writer, Support value, JsonSerializerOptions options)
        {
            switch (value.Category)
            {
                case SupportCategory.Clothing:
                    JsonSerializer.Serialize(writer, (ClothingSupport)value, options);
                    break;

                case SupportCategory.Incidentals:
                    JsonSerializer.Serialize(writer, (IncidentalsSupport)value, options);
                    break;

                case SupportCategory.Food when value.SubCategory == SupportSubCategory.Food_Groceries:
                    JsonSerializer.Serialize(writer, (FoodGroceriesSupport)value, options);
                    break;

                case SupportCategory.Food when value.SubCategory == SupportSubCategory.Food_Restaurant:
                    JsonSerializer.Serialize(writer, (FoodRestaurantSupport)value, options);
                    break;

                case SupportCategory.Lodging when value.SubCategory == SupportSubCategory.Lodging_Hotel:
                    JsonSerializer.Serialize(writer, (LodgingHotelSupport)value, options);
                    break;

                case SupportCategory.Lodging when value.SubCategory == SupportSubCategory.Lodging_Billeting:
                    JsonSerializer.Serialize(writer, (LodgingBilletingSupport)value, options);
                    break;

                case SupportCategory.Lodging when value.SubCategory == SupportSubCategory.Lodging_Group:
                    JsonSerializer.Serialize(writer, (LodgingGroupSupport)value, options);
                    break;

                case SupportCategory.Transportation when value.SubCategory == SupportSubCategory.Transportation_Taxi:
                    JsonSerializer.Serialize(writer, (TransportationTaxiSupport)value, options);
                    break;

                case SupportCategory.Transportation when value.SubCategory == SupportSubCategory.Transportation_Other:
                    JsonSerializer.Serialize(writer, (TransportationOtherSupport)value, options);
                    break;

                default: throw new NotSupportedException($"Support with method {value.Method}, category {value.Category}, sub category {value.SubCategory}");
            }
        }
    }
}
