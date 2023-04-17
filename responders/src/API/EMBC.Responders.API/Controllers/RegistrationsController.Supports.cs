using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Supports
    /// </summary>
    public partial class RegistrationsController
    {
        /// <summary>
        /// Process  digital draft supports by the API and create a print supports request
        /// </summary>
        /// <param name="fileId">evacuation file number</param>
        /// <param name="request">the request with draft supports to process</param>
        /// <returns>new print request id</returns>
        [HttpPost("files/{fileId}/supports")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ReferralPrintRequestResponse>> ProcessSupports(string fileId, ProcessDigitalSupportsRequest request)
        {
            var noDeliveryMethod = request.Supports.Where(s => s.Method == SupportMethod.Unknown).ToArray();
            if (noDeliveryMethod.Any())
            {
                return BadRequest(new ProblemDetails
                {
                    Status = (int)HttpStatusCode.BadRequest,
                    Title = "Some supports delivery methods are not defined",
                    Detail = string.Join(',', noDeliveryMethod.Select(r => $"{r.Category}-{r.SubCategory}"))
                });
            }

            var userId = currentUserId;
            var mappedSupports = mapper.Map<IEnumerable<EMBC.ESS.Shared.Contracts.Events.Support>>(request.Supports);
            foreach (var support in mappedSupports)
            {
                support.CreatedBy = new EMBC.ESS.Shared.Contracts.Events.TeamMember { Id = userId };
                support.IssuedBy = new EMBC.ESS.Shared.Contracts.Events.TeamMember { Id = userId };
                support.CreatedOn = DateTime.UtcNow;
                support.IssuedOn = support.CreatedOn;
            }
            var printRequestId = await messagingClient.Send(new ProcessSupportsCommand
            {
                FileId = fileId,
                Supports = mappedSupports,
                RequestingUserId = userId,
                IncludeSummaryInReferralsPrintout = request.IncludeSummaryInPrintRequest
            });
            return Ok(new ReferralPrintRequestResponse { PrintRequestId = printRequestId });
        }

        /// <summary>
        /// Process draft paper referrals by the API and create a print supports request
        /// </summary>
        /// <param name="fileId">evacuation file number</param>
        /// <param name="request">the request with paper referrals to process</param>
        /// <returns>Ok if successfully submitted</returns>
        [HttpPost("files/{fileId}/paperreferrals")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> ProcessPaperReferrals(string fileId, ProcessPaperReferralsRequest request)
        {
            var noneReferrals = request.Referrals.Where(r => r.Method != SupportMethod.Referral).ToArray();
            if (noneReferrals.Any())
            {
                return BadRequest(new ProblemDetails
                {
                    Status = (int)HttpStatusCode.BadRequest,
                    Title = "Some supports delivery methods is not referrals",
                    Detail = string.Join(',', noneReferrals.Select(r => $"{r.Category}-{r.SubCategory}"))
                });
            }
            var userId = currentUserId;
            var referrals = mapper.Map<IEnumerable<EMBC.ESS.Shared.Contracts.Events.Support>>(request.Referrals);
            foreach (var referral in referrals)
            {
                referral.CreatedBy = new EMBC.ESS.Shared.Contracts.Events.TeamMember { Id = userId };
                referral.CreatedOn = DateTime.UtcNow;
            }
            await messagingClient.Send(new ProcessPaperSupportsCommand
            {
                FileId = fileId,
                Supports = referrals,
                RequestingUserId = userId,
            });
            return Ok();
        }

        /// <summary>
        /// Void a support
        /// </summary>
        /// <param name="fileId">evacuation file number</param>
        /// <param name="supportId">support id</param>
        /// <param name="voidReason">reason to void the support</param>
        /// <returns>Ok if successfully voided</returns>
        [HttpPost("files/{fileId}/supports/{supportId}/void")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> VoidSupport(string fileId, string supportId, SupportVoidReason voidReason)
        {
            await messagingClient.Send(new VoidSupportCommand
            {
                FileId = fileId,
                SupportId = supportId,
                VoidReason = Enum.Parse<EMBC.ESS.Shared.Contracts.Events.SupportVoidReason>(voidReason.ToString(), true)
            });

            return Ok();
        }

        /// <summary>
        /// Cancel a support
        /// </summary>
        /// <param name="fileId">evacuation file number</param>
        /// <param name="supportId">support id</param>
        /// <returns>Ok if successfully voided</returns>
        [HttpPost("files/{fileId}/supports/{supportId}/cancel")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CancelSupport(string fileId, string supportId)
        {
            await messagingClient.Send(new CancelSupportCommand
            {
                FileId = fileId,
                SupportId = supportId,
                Reason = "User initiated cancellation"
            });

            return Ok();
        }

        /// <summary>
        /// Reprint a referral support
        /// </summary>
        /// <param name="fileId">evacuation file number</param>
        /// <param name="supportId">support if</param>
        /// <param name="reprintReason">reprint reason</param>
        /// <param name="includeSummary">inlcude summary</param>
        /// <returns>new print request id</returns>
        [HttpPost("files/{fileId}/supports/{supportId}/reprint")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ReferralPrintRequestResponse>> ReprintSupport(string fileId, string supportId, SupportReprintReason reprintReason, bool includeSummary)
        {
            var result = await messagingClient.Send(new ReprintSupportCommand
            {
                FileId = fileId,
                SupportId = supportId,
                ReprintReason = EnumDescriptionHelper.GetEnumDescription(reprintReason),
                RequestingUserId = currentUserId,
                IncludeSummary = includeSummary
            });

            return Ok(new ReferralPrintRequestResponse { PrintRequestId = result });
        }

        /// <summary>
        /// Request a print by id
        /// </summary>
        /// <param name="fileId">evacuation file number</param>
        /// <param name="printRequestId">print request id</param>
        /// <returns>Blob of the print request results</returns>
        [HttpGet("files/{fileId}/supports/print/{printRequestId}")]
        public async Task<FileContentResult> GetPrint(string fileId, string printRequestId)
        {
            var result = await messagingClient.Send(new PrintRequestQuery { PrintRequestId = printRequestId, RequestingUserId = currentUserId });
            Response.Headers.Add("Content-Disposition", "attachment;filename=" + result.FileName);
            return new FileContentResult(result.Content, result.ContentType);
        }

        /// <summary>
        /// Search for supports
        /// </summary>
        /// <param name="manualReferralId">search for supports for an manual referral id</param>
        /// <param name="fileId">search for supports in a specific evacuation file</param>
        /// <returns>list of supports</returns>
        [HttpGet("supports")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Support>>> SearchSupports(string? manualReferralId, string? fileId)
        {
            if (string.IsNullOrEmpty(manualReferralId) && string.IsNullOrEmpty(fileId))
                return BadRequest(new ProblemDetails { Status = (int)HttpStatusCode.BadRequest, Detail = "Must specify search criteria" });

            var items = mapper.Map<IEnumerable<Support>>((await messagingClient.Send(new SearchSupportsQuery
            {
                ManualReferralId = manualReferralId,
                FileId = fileId
            })).Items);
            return Ok(items);
        }
    }

    [KnownType(typeof(ReferralSummary))]
    [KnownType(typeof(ETransferSummary))]
    [JsonConverter(typeof(PolymorphicJsonConverter<SupportSummary>))]
    public abstract class SupportSummary
    {
        public string Id { get; set; }
        public string FileId { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public SupportStatus Status { get; set; }
        public SupportMethod Method { get; set; }
        public SupportCategory Category { get; set; }
        public SupportSubCategory? SubCategory { get; set; }
    }

    public class ReferralSummary : SupportSummary
    {
        public string? ManualReferralId { get; set; }
    }

    public class ETransferSummary : SupportSummary
    {
    }

    public class ProcessDigitalSupportsRequest
    {
        public bool IncludeSummaryInPrintRequest { get; set; }
        public IEnumerable<Support> Supports { get; set; }
    }

    public class ProcessPaperReferralsRequest
    {
        public IEnumerable<Support> Referrals { get; set; }
    }

    [JsonConverter(typeof(SupportJsonConverter))]
    [KnownType(typeof(ClothingSupport))]
    [KnownType(typeof(IncidentalsSupport))]
    [KnownType(typeof(FoodGroceriesSupport))]
    [KnownType(typeof(FoodRestaurantSupport))]
    [KnownType(typeof(LodgingBilletingSupport))]
    [KnownType(typeof(LodgingGroupSupport))]
    [KnownType(typeof(LodgingHotelSupport))]
    [KnownType(typeof(TransportationOtherSupport))]
    [KnownType(typeof(TransportationTaxiSupport))]
    public abstract class Support
    {
        public string? Id { get; set; }
        public string? FileId { get; set; }

        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public string? CreatedByTeam { get; set; }

        public DateTime? IssuedOn { get; set; }
        public string? IssuedBy { get; set; }
        public string? IssuedByTeam { get; set; }

        public string? NeedsAssessmentId { get; set; }

        [Required]
        public DateTime From { get; set; }

        [Required]
        public DateTime To { get; set; }

        public SupportStatus Status { get; set; }

        public SupportMethod Method => SupportDelivery?.Method ?? SupportMethod.Unknown;

        [Required]
        public SupportDelivery SupportDelivery { get; set; }

        [Required]
        public abstract SupportCategory Category { get; }

        public abstract SupportSubCategory SubCategory { get; }

        [Required]
        public IEnumerable<string> IncludedHouseholdMembers { get; set; } = Array.Empty<string>();
    }

    public class ClothingSupport : Support
    {
        public bool ExtremeWinterConditions { get; set; }

        [Required]
        public override SupportCategory Category => SupportCategory.Clothing;

        [Required]
        public override SupportSubCategory SubCategory => SupportSubCategory.None;

        [Required]
        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }

        public string ApproverName { get; set; }
    }

    public class IncidentalsSupport : Support
    {
        [Required]
        public override SupportCategory Category => SupportCategory.Incidentals;

        [Required]
        public override SupportSubCategory SubCategory => SupportSubCategory.None;

        [Required]
        public string ApprovedItems { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }

        public string ApproverName { get; set; }
    }

    public class FoodGroceriesSupport : Support
    {
        [Required]
        public override SupportCategory Category => SupportCategory.Food;

        [Required]
        public override SupportSubCategory SubCategory => SupportSubCategory.Food_Groceries;

        [Required]
        [Range(0, int.MaxValue)]
        public int NumberOfDays { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }

        public string ApproverName { get; set; }
    }

    public class FoodRestaurantSupport : Support
    {
        [Required]
        public override SupportCategory Category => SupportCategory.Food;

        [Required]
        public override SupportSubCategory SubCategory => SupportSubCategory.Food_Restaurant;

        [Required]
        [Range(0, int.MaxValue)]
        public int NumberOfBreakfastsPerPerson { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int NumberOfLunchesPerPerson { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int NumberOfDinnersPerPerson { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }
    }

    public class LodgingHotelSupport : Support
    {
        [Required]
        public override SupportCategory Category => SupportCategory.Lodging;

        [Required]
        public override SupportSubCategory SubCategory => SupportSubCategory.Lodging_Hotel;

        [Required]
        [Range(0, int.MaxValue)]
        public int NumberOfNights { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int NumberOfRooms { get; set; }
    }

    public class LodgingBilletingSupport : Support
    {
        [Required]
        public override SupportCategory Category => SupportCategory.Lodging;

        [Required]
        public override SupportSubCategory SubCategory => SupportSubCategory.Lodging_Billeting;

        [Required]
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
        [Required]
        public override SupportCategory Category => SupportCategory.Lodging;

        [Required]
        public override SupportSubCategory SubCategory => SupportSubCategory.Lodging_Group;

        [Required]
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
        [Required]
        public override SupportCategory Category => SupportCategory.Transportation;

        [Required]
        public override SupportSubCategory SubCategory => SupportSubCategory.Transportation_Taxi;

        [Required]
        public string FromAddress { get; set; }

        [Required]
        public string ToAddress { get; set; }
    }

    public class TransportationOtherSupport : Support
    {
        [Required]
        public override SupportCategory Category => SupportCategory.Transportation;

        [Required]
        public override SupportSubCategory SubCategory => SupportSubCategory.Transportation_Other;

        [Required]
        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }

        [Required]
        public string TransportMode { get; set; }
    }

    [JsonConverter(typeof(SupportDeliveryJsonConverter))]
    [KnownType(typeof(ETransfer))]
    [KnownType(typeof(Referral))]
    public abstract class SupportDelivery
    {
        public abstract SupportMethod Method { get; }
    }

    [KnownType(typeof(Interac))]
    public abstract class ETransfer : SupportDelivery
    {
        [Required]
        public override SupportMethod Method => SupportMethod.ETransfer;
    }

    public class Interac : ETransfer
    {
        [Required]
        public string ReceivingRegistrantId { get; set; }

        public string RecipientFirstName { get; set; }
        public string RecipientLastName { get; set; }

        public string? NotificationEmail { get; set; }
        public string? NotificationMobile { get; set; }
    }

    public class Referral : SupportDelivery
    {
        public string? ManualReferralId { get; set; }

        [Required]
        public override SupportMethod Method => SupportMethod.Referral;

        [Required]
        public string SupplierId { get; set; }

        public string SupplierName { get; set; }
        public string SupplierLegalName { get; set; }
        public Address SupplierAddress { get; set; }
        public string SupplierNotes { get; set; }

        [Required]
        public string IssuedToPersonName { get; set; }
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

        [Description("e-Transfer")]
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

        [Description("Lodging - Hotel/Motel/Campground")]
        Lodging_Hotel,

        [Description("Lodging - Billeting")]
        Lodging_Billeting,

        [Description("Lodging - Group Lodging")]
        Lodging_Group,

        [Description("Food - Groceries")]
        Food_Groceries,

        [Description("Food - Restaurant Meals")]
        Food_Restaurant,

        [Description("Transportation - Taxi")]
        Transportation_Taxi,

        [Description("Transportation - Other")]
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

        [Description("Printer Error")]
        PrinterError,

        [Description("Evacuee Lost the Referral")]
        EvacueeLostTheReferral,

        [Description("Remote Supports")]
        RemoteSupports
    }

    public class ReferralPrintRequestResponse
    {
        public string PrintRequestId { get; set; }
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

            int baseDepth = clonedReader.CurrentDepth;

            while (clonedReader.Read())
            {
                if (baseDepth == clonedReader.CurrentDepth && clonedReader.TokenType == JsonTokenType.EndObject) break;

                if (clonedReader.TokenType != JsonTokenType.PropertyName) continue;
                var propertyName = FirstLetterCapital(clonedReader.GetString());

                clonedReader.Read();
                if (clonedReader.TokenType != JsonTokenType.String || clonedReader.TokenType == JsonTokenType.Null) continue;
                var propertyValue = clonedReader.GetString();
                switch (propertyName)
                {
                    case nameof(Support.Method):
                        if (!Enum.TryParse(propertyValue, out method)) throw new JsonException($"Failed to parse {propertyName} {propertyValue}");
                        break;

                    case nameof(Support.Category):
                        if (!Enum.TryParse(propertyValue, out category)) throw new JsonException($"Failed to parse {propertyName} {propertyValue}");
                        break;

                    case nameof(Support.SubCategory):
                        if (!Enum.TryParse(propertyValue, out subCategory)) throw new JsonException($"Failed to parse {propertyName} {propertyValue}");
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

    public class SupportDeliveryJsonConverter : JsonConverter<SupportDelivery>
    {
        public override SupportDelivery? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var clonedReader = reader;
            while (clonedReader.Read())
            {
                if (clonedReader.TokenType == JsonTokenType.PropertyName && clonedReader.GetString().Equals(nameof(SupportDelivery.Method), StringComparison.OrdinalIgnoreCase))
                {
                    clonedReader.Read();
                    var method = clonedReader.GetString();
                    if (!Enum.TryParse<SupportMethod>(method, true, out var deliveryMethod)) throw new JsonException($"Failed to parse method {method}");
                    return deliveryMethod switch
                    {
                        SupportMethod.Referral => JsonSerializer.Deserialize<Referral>(ref reader, options),
                        SupportMethod.ETransfer => JsonSerializer.Deserialize<Interac>(ref reader, options),

                        _ => throw new JsonException($"Don't know how to deserialize SupportMethod {deliveryMethod}")
                    };
                }
            }
            throw new JsonException("SupportDelivery doesn't have a Method property");
        }

        public override void Write(Utf8JsonWriter writer, SupportDelivery value, JsonSerializerOptions options)
        {
            switch (value.Method)
            {
                case SupportMethod.Referral:
                    JsonSerializer.Serialize(writer, (Referral)value, options);
                    break;

                case SupportMethod.ETransfer:
                    JsonSerializer.Serialize(writer, (Interac)value, options);
                    break;

                default:
                    throw new JsonException($"Don't know how to serialize SupportMethod {value.Method}");
            }
        }
    }

    public class SupportMapping : Profile
    {
        public SupportMapping()
        {
            CreateMap<EMBC.ESS.Shared.Contracts.Events.Support, Support>()
                .IncludeAllDerived()
                .ForMember(d => d.NeedsAssessmentId, opts => opts.MapFrom(s => s.OriginatingNeedsAssessmentId))
                .ForMember(d => d.CreatedBy, opts => opts.MapFrom(s => s.CreatedBy.DisplayName))
                .ForMember(d => d.CreatedByTeam, opts => opts.MapFrom(s => s.CreatedBy.TeamName))
                .ForMember(d => d.IssuedBy, opts => opts.MapFrom(s => s.IssuedBy.DisplayName))
                .ForMember(d => d.IssuedByTeam, opts => opts.MapFrom(s => s.IssuedBy.TeamName))
                .ForMember(d => d.SupportDelivery, opts => opts.MapFrom((s, d, m, ctx) => new SupportDeliveryTypeConverter().Convert(s.SupportDelivery, m, ctx)))
                .ReverseMap()
                .IncludeAllDerived()
                .ValidateMemberList(MemberList.Destination)
                .ForMember(d => d.CreatedBy, opts => opts.Ignore())
                .ForMember(d => d.IssuedBy, opts => opts.MapFrom(s => new EMBC.ESS.Shared.Contracts.Events.TeamMember { DisplayName = s.IssuedBy }))
                .ForMember(d => d.OriginatingNeedsAssessmentId, opts => opts.Ignore())
                .ForMember(d => d.SupportDelivery, opts => opts.MapFrom((s, d, m, ctx) => new SupportDeliveryTypeConverter().Convert(s.SupportDelivery, m, ctx)))
                .ForMember(d => d.Flags, opts => opts.Ignore())
                ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.Referral, Referral>()
                .IncludeAllDerived()
                .ForMember(d => d.SupplierId, opts => opts.MapFrom(s => s.SupplierDetails != null ? s.SupplierDetails.Id : null))
                .ForMember(d => d.SupplierName, opts => opts.MapFrom(s => s.SupplierDetails != null ? s.SupplierDetails.Name : null))
                .ForMember(d => d.SupplierLegalName, opts => opts.MapFrom(s => s.SupplierDetails != null ? s.SupplierDetails.LegalName : null))
                .ForMember(d => d.SupplierAddress, opts => opts.MapFrom(s => s.SupplierDetails != null ? s.SupplierDetails.Address : null))
                .ReverseMap()
                .IncludeAllDerived()
                .ValidateMemberList(MemberList.Destination)
                .ForMember(d => d.SupplierDetails, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.SupplierId) ? null : new SupplierDetails { Id = s.SupplierId }))
                ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.ETransfer, ETransfer>()
                .IncludeAllDerived()
                .ReverseMap()
                .IncludeAllDerived()
                .ValidateMemberList(MemberList.Destination)
                ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.Interac, Interac>()
                .IncludeAllDerived()
                .ReverseMap()
                .IncludeAllDerived()
                .ValidateMemberList(MemberList.Destination)
                .ForMember(d => d.SecurityAnswer, opts => opts.Ignore())
                .ForMember(d => d.SecurityQuestion, opts => opts.Ignore())
                .ForMember(d => d.RelatedPaymentId, opts => opts.Ignore())
                ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.ClothingSupport, ClothingSupport>()

                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.IncidentalsSupport, IncidentalsSupport>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.FoodGroceriesSupport, FoodGroceriesSupport>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.FoodRestaurantSupport, FoodRestaurantSupport>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.LodgingBilletingSupport, LodgingBilletingSupport>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.LodgingGroupSupport, LodgingGroupSupport>()

                    .ReverseMap()

                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.LodgingHotelSupport, LodgingHotelSupport>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.TransportationOtherSupport, TransportationOtherSupport>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.TransportationTaxiSupport, TransportationTaxiSupport>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<IEnumerable<Support>, IEnumerable<SupportSummary>>()
                .ConvertUsing((s, d, ctx) =>
                    s.Select(i => i.Method switch
                    {
                        SupportMethod.Referral => ctx.Mapper.Map<ReferralSummary>(i.SupportDelivery),
                        SupportMethod.ETransfer => ctx.Mapper.Map<ETransferSummary>(i.SupportDelivery),
                        _ => ctx.Mapper.Map<SupportSummary>(i.SupportDelivery)
                    }));

            CreateMap<Support, SupportSummary>();

            CreateMap<Support, ReferralSummary>()
                .ForMember(d => d.ManualReferralId, opts => opts.MapFrom(s => ((Referral)s.SupportDelivery).ManualReferralId))
            ;

            CreateMap<Support, ETransferSummary>();
        }
    }

    public class SupportDeliveryTypeConverter :
        ITypeConverter<SupportDelivery, EMBC.ESS.Shared.Contracts.Events.SupportDelivery>,
        ITypeConverter<EMBC.ESS.Shared.Contracts.Events.SupportDelivery, SupportDelivery>
    {
        public ESS.Shared.Contracts.Events.SupportDelivery Convert(SupportDelivery source, ESS.Shared.Contracts.Events.SupportDelivery destination, ResolutionContext context) =>
            source.Method switch
            {
                SupportMethod.Referral => context.Mapper.Map<EMBC.ESS.Shared.Contracts.Events.Referral>(source),
                SupportMethod.ETransfer => context.Mapper.Map<EMBC.ESS.Shared.Contracts.Events.ETransfer>(source),
                _ => throw new NotImplementedException()
            };

        public SupportDelivery Convert(ESS.Shared.Contracts.Events.SupportDelivery source, SupportDelivery destination, ResolutionContext context) =>
                        source switch
                        {
                            ESS.Shared.Contracts.Events.Referral r => context.Mapper.Map<Referral>(r),
                            ESS.Shared.Contracts.Events.ETransfer e => context.Mapper.Map<ETransfer>(e),
                            _ => throw new NotImplementedException()
                        };
    }
}
