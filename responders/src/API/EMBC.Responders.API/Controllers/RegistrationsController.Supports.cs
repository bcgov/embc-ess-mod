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
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Supports
    /// </summary>
    public partial class RegistrationsController
    {
        [HttpPost("files/{fileId}/supports")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ProcessSupports(string fileId, IEnumerable<Support> supports)
        {
            await Task.CompletedTask;
            return Ok();
        }
    }

    [JsonConverter(typeof(SupportJsonConverter))]
    [KnownType(typeof(Referral))]
    public abstract class Support
    {
        public string Id { get; set; }
        public string NeedsAssessmentId { get; set; }

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
        public override SupportCategory Category => SupportCategory.Clothing;
        public override SupportSubCategory SubCategory => SupportSubCategory.None;

        [Required]
        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }
    }

    public class IncidentalsReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Incidentals;
        public override SupportSubCategory SubCategory => SupportSubCategory.None;

        [Required]
        public string ApprovedItems { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }
    }

    public class FoodGroceriesReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Food;
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
        public override SupportCategory Category => SupportCategory.Food;
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
        public override SupportCategory Category => SupportCategory.Lodging;
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
        public override SupportCategory Category => SupportCategory.Lodging;
        public override SupportSubCategory SubCategory => SupportSubCategory.Lodging_Billeting;

        [Required]
        [Range(0, int.MaxValue)]
        public int NumberOfNights { get; set; }
    }

    public class TransportationTaxiReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Transportation;
        public override SupportSubCategory SubCategory => SupportSubCategory.Transportation_Taxi;

        [Required]
        public string FromAddress { get; set; }

        [Required]
        public string ToAddress { get; set; }
    }

    public class TransportationOtherReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Transportation;
        public override SupportSubCategory SubCategory => SupportSubCategory.Transportation_Other;

        [Required]
        [Range(0, double.MaxValue)]
        public double TotalAmount { get; set; }

        [Required]
        public string TransportMode { get; set; }
    }

    public class LodgingGroupReferral : Referral
    {
        public override SupportCategory Category => SupportCategory.Lodging;
        public override SupportSubCategory SubCategory => SupportSubCategory.Lodging_Group;

        [Required]
        [Range(0, int.MaxValue)]
        public int NumberOfNights { get; set; }
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
}
