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
        /// <param name="fileId">evacuation file id</param>
        /// <param name="request">the request with draft supports to process</param>
        /// <returns>the generated print request id which can be later used to request the printed PDF</returns>
        [HttpPost("files/{fileId}/supports")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ReferralPrintRequestResponse>> ProcessSupports(string fileId, ProcessDigitalSupportsRequest request)
        {
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
        /// <param name="fileId">evacuation file id</param>
        /// <param name="request">the request with paper referrals to process</param>
        /// <returns>Ok if paper referrals were processed successfully</returns>
        [HttpPost("files/{fileId}/paperreferrals")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> ProcessPaperReferrals(string fileId, ProcessPaperReferralsRequest request)
        {
            var userId = currentUserId;
            var referrals = mapper.Map<IEnumerable<EMBC.ESS.Shared.Contracts.Events.Referral>>(request.Referrals);
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

        [HttpPost("files/{fileId}/supports/{supportId}/void")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> VoidSupport(string fileId, string supportId, SupportVoidReason voidReason)
        {
            var result = await messagingClient.Send(new VoidSupportCommand
            {
                FileId = fileId,
                SupportId = supportId,
                VoidReason = Enum.Parse<EMBC.ESS.Shared.Contracts.Events.SupportVoidReason>(voidReason.ToString(), true)
            });

            return Ok();
        }

        [HttpPost("files/{fileId}/supports/{supportId}/reprint")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ReferralPrintRequestResponse>> ReprintSupport(string fileId, string supportId, SupportReprintReason reprintReason)
        {
            var result = await messagingClient.Send(new ReprintSupportCommand
            {
                FileId = fileId,
                SupportId = supportId,
                ReprintReason = EnumDescriptionHelper.GetEnumDescription(reprintReason),
                RequestingUserId = currentUserId
            });

            return Ok(new ReferralPrintRequestResponse { PrintRequestId = result });
        }

        [HttpGet("files/{fileId}/supports/print/{printRequestId}")]
        public async Task<IActionResult> GetPrint(string fileId, string printRequestId)
        {
            var result = await messagingClient.Send(new PrintRequestQuery { PrintRequestId = printRequestId, RequestingUserId = currentUserId });
            return new FileContentResult(result.Content, result.ContentType);
        }

        [HttpGet("supports")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SupportSummary>>> SearchSupports(string? externalReferenceId, string? fileId)
        {
            if (string.IsNullOrEmpty(externalReferenceId) || string.IsNullOrEmpty(fileId))
                return BadRequest(new ProblemDetails { Status = (int)HttpStatusCode.BadRequest, Detail = "Must specify search criteria" });

            var items = mapper.Map<IEnumerable<Support>>((await messagingClient.Send(new SearchSupportsQuery
            {
                ExternalReferenceId = externalReferenceId,
                FileId = fileId
            })).Items);
            var results = mapper.Map<IEnumerable<SupportSummary>>(items).ToArray();
            return Ok(results);
        }
    }

    [KnownType(typeof(ReferralSummary))]
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
        public string? ExternalReferenceId { get; set; }
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
    [KnownType(typeof(Referral))]
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

        [Required]
        public abstract SupportMethod Method { get; }

        [Required]
        public abstract SupportCategory Category { get; }

        public abstract SupportSubCategory SubCategory { get; }

        [Required]
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
        public string? ExternalReferenceId { get; set; }

        [Required]
        public override SupportMethod Method => SupportMethod.Referral;

        [Required]
        public string SupplierId { get; set; }

        public string SupplierName { get; set; }
        public Address SupplierAddress { get; set; }
        public string SupplierNotes { get; set; }

        [Required]
        public string IssuedToPersonName { get; set; }
    }

    public class ClothingReferral : Referral
    {
        public bool ExtremeWinterConditions { get; set; }

        [Required]
        public override SupportCategory Category => SupportCategory.Clothing;

        [Required]
        public override SupportSubCategory SubCategory => SupportSubCategory.None;

        [Required]
        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }
    }

    public class IncidentalsReferral : Referral
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
    }

    public class FoodGroceriesReferral : Referral
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
    }

    public class FoodRestaurantReferral : Referral
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

    public class LodgingHotelReferral : Referral
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

    public class LodgingBilletingReferral : Referral
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

    public class LodgingGroupReferral : Referral
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

    public class TransportationTaxiReferral : Referral
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

    public class TransportationOtherReferral : Referral
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

        [Description("Lodging - Hotel/Motel")]
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
        EvacueeLostTheReferral
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

            if (clonedReader.TokenType != JsonTokenType.StartObject) throw new JsonException();

            while (clonedReader.Read())
            {
                if (clonedReader.TokenType == JsonTokenType.EndObject) break;
                if (clonedReader.TokenType != JsonTokenType.PropertyName) continue;
                var propertyName = FirstLetterCapital(clonedReader.GetString());

                clonedReader.Read();
                if (clonedReader.TokenType != JsonTokenType.String || clonedReader.TokenType == JsonTokenType.Null) continue;
                var propertyValue = clonedReader.GetString();
                switch (propertyName)
                {
                    case nameof(Support.Method):
                        if (!Enum.TryParse(propertyValue, out method)) throw new JsonException();
                        break;

                    case nameof(Support.Category):
                        if (!Enum.TryParse(propertyValue, out category)) throw new JsonException();
                        break;

                    case nameof(Support.SubCategory):
                        if (!Enum.TryParse(propertyValue, out subCategory)) throw new JsonException();
                        break;
                }
            }

            if (method == SupportMethod.Unknown || category == SupportCategory.Unknown) throw new JsonException($"Could not determine the support method or category");

            //Dserialize to the correct type
            return category switch
            {
                SupportCategory.Clothing => JsonSerializer.Deserialize<ClothingReferral>(ref reader, options),
                SupportCategory.Incidentals => JsonSerializer.Deserialize<IncidentalsReferral>(ref reader, options),
                SupportCategory.Food when subCategory == SupportSubCategory.Food_Groceries => JsonSerializer.Deserialize<FoodGroceriesReferral>(ref reader, options),
                SupportCategory.Food when subCategory == SupportSubCategory.Food_Restaurant => JsonSerializer.Deserialize<FoodRestaurantReferral>(ref reader, options),
                SupportCategory.Lodging when subCategory == SupportSubCategory.Lodging_Hotel => JsonSerializer.Deserialize<LodgingHotelReferral>(ref reader, options),
                SupportCategory.Lodging when subCategory == SupportSubCategory.Lodging_Billeting => JsonSerializer.Deserialize<LodgingBilletingReferral>(ref reader, options),
                SupportCategory.Lodging when subCategory == SupportSubCategory.Lodging_Group => JsonSerializer.Deserialize<LodgingGroupReferral>(ref reader, options),
                SupportCategory.Transportation when subCategory == SupportSubCategory.Transportation_Taxi => JsonSerializer.Deserialize<TransportationTaxiReferral>(ref reader, options),
                SupportCategory.Transportation when subCategory == SupportSubCategory.Transportation_Other => JsonSerializer.Deserialize<TransportationOtherReferral>(ref reader, options),
                _ => throw new NotSupportedException($"Support with method {method}, category {category}, sub category {subCategory}")
            };
        }

        public override void Write(Utf8JsonWriter writer, Support value, JsonSerializerOptions options)
        {
            switch (value.Category)
            {
                case SupportCategory.Clothing:
                    JsonSerializer.Serialize(writer, (ClothingReferral)value, options);
                    break;

                case SupportCategory.Incidentals:
                    JsonSerializer.Serialize(writer, (IncidentalsReferral)value, options);
                    break;

                case SupportCategory.Food when value.SubCategory == SupportSubCategory.Food_Groceries:
                    JsonSerializer.Serialize(writer, (FoodGroceriesReferral)value, options);
                    break;

                case SupportCategory.Food when value.SubCategory == SupportSubCategory.Food_Restaurant:
                    JsonSerializer.Serialize(writer, (FoodRestaurantReferral)value, options);
                    break;

                case SupportCategory.Lodging when value.SubCategory == SupportSubCategory.Lodging_Hotel:
                    JsonSerializer.Serialize(writer, (LodgingHotelReferral)value, options);
                    break;

                case SupportCategory.Lodging when value.SubCategory == SupportSubCategory.Lodging_Billeting:
                    JsonSerializer.Serialize(writer, (LodgingBilletingReferral)value, options);
                    break;

                case SupportCategory.Lodging when value.SubCategory == SupportSubCategory.Lodging_Group:
                    JsonSerializer.Serialize(writer, (LodgingGroupReferral)value, options);
                    break;

                case SupportCategory.Transportation when value.SubCategory == SupportSubCategory.Transportation_Taxi:
                    JsonSerializer.Serialize(writer, (TransportationTaxiReferral)value, options);
                    break;

                case SupportCategory.Transportation when value.SubCategory == SupportSubCategory.Transportation_Other:
                    JsonSerializer.Serialize(writer, (TransportationOtherReferral)value, options);
                    break;

                default: throw new NotSupportedException($"Support with method {value.Method}, category {value.Category}, sub category {value.SubCategory}");
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
                .ReverseMap()
                .IncludeAllDerived()
                .ValidateMemberList(MemberList.Destination)
                .ForMember(d => d.CreatedBy, opts => opts.Ignore())
                .ForMember(d => d.IssuedBy, opts => opts.MapFrom(s => new EMBC.ESS.Shared.Contracts.Events.TeamMember { DisplayName = s.IssuedBy }))
                .ForMember(d => d.OriginatingNeedsAssessmentId, opts => opts.Ignore())
                ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.Referral, Referral>()
                .IncludeAllDerived()
                .ForMember(d => d.SupplierId, opts => opts.MapFrom(s => s.SupplierDetails != null ? s.SupplierDetails.Id : null))
                .ForMember(d => d.SupplierName, opts => opts.MapFrom(s => s.SupplierDetails != null ? s.SupplierDetails.Name : null))
                .ForMember(d => d.SupplierAddress, opts => opts.MapFrom(s => s.SupplierDetails != null ? s.SupplierDetails.Address : null))
                .ReverseMap()
                .IncludeAllDerived()
                .ValidateMemberList(MemberList.Destination)
                .ForMember(d => d.SupplierDetails, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.SupplierId) ? null : new SupplierDetails { Id = s.SupplierId }))
                ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.ClothingReferral, ClothingReferral>()

                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.IncidentalsReferral, IncidentalsReferral>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.FoodGroceriesReferral, FoodGroceriesReferral>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.FoodRestaurantReferral, FoodRestaurantReferral>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.LodgingBilletingReferral, LodgingBilletingReferral>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.LodgingGroupReferral, LodgingGroupReferral>()

                    .ReverseMap()

                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.LodgingHotelReferral, LodgingHotelReferral>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.TransportationOtherReferral, TransportationOtherReferral>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.TransportationTaxiReferral, TransportationTaxiReferral>()

                    .ReverseMap()
                    .ValidateMemberList(MemberList.Destination)
                    ;

            CreateMap<IEnumerable<Support>, IEnumerable<SupportSummary>>()
                .ConvertUsing((s, d, ctx) =>
                    s.Select(i => i is Referral r
                        ? ctx.Mapper.Map<ReferralSummary>(r)
                        : ctx.Mapper.Map<SupportSummary>(i)));

            CreateMap<Support, SupportSummary>()
            ;

            CreateMap<Referral, ReferralSummary>()
                .ForMember(d => d.ExternalReferenceId, opts => opts.MapFrom(s => s.ExternalReferenceId))
            ;
        }
    }
}
