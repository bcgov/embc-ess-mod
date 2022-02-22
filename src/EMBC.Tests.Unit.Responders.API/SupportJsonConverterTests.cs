using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using EMBC.Responders.API.Controllers;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.Responders.API
{
    public class SupportJsonConverterTests
    {
        [Fact]
        public void CanSerializeSupport()
        {
            var supplierAddress = new Address { AddressLine1 = "12 meh st.", CommunityCode = "226adfaf-9f97-ea11-b813-005056830319", PostalCode = "V1V 1V1", StateProvinceCode = "BC", CountryCode = "CAN" };
            var supports = new Support[]
            {
              new ClothingReferral { Id = "1", From = DateTime.Now, To = DateTime.Now.AddDays(3), IssuedToPersonName = "person 1", SupplierId = "1", SupplierName = "sup 1", SupplierAddress = supplierAddress, Status = SupportStatus.Active },
              new IncidentalsReferral { Id = "2", From = DateTime.Now, To = DateTime.Now.AddDays(3), IssuedToPersonName = "person 2", SupplierId = "2", SupplierName = "sup 2", SupplierAddress = supplierAddress, Status = SupportStatus.Expired },
              new FoodGroceriesReferral { Id = "3", From = DateTime.Now, To = DateTime.Now.AddDays(3), IssuedToPersonName = "person 1", SupplierId = "1", SupplierName = "sup 1", SupplierAddress = supplierAddress, Status = SupportStatus.Void },
              new FoodRestaurantReferral { Id = "4", From = DateTime.Now, To = DateTime.Now.AddDays(3), IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress, Status = SupportStatus.Active },
              new LodgingHotelReferral { Id = "5", From = DateTime.Now, To = DateTime.Now.AddDays(3), IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress, Status = SupportStatus.Active },
              new LodgingBilletingReferral { Id = "6", From = DateTime.Now, To = DateTime.Now.AddDays(3), IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress, Status = SupportStatus.Active },
              new LodgingGroupReferral { Id = "7", From = DateTime.Now, To = DateTime.Now.AddDays(3), IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress, Status = SupportStatus.Active },
              new TransportationTaxiReferral { Id = "8", From = DateTime.Now, To = DateTime.Now.AddDays(3), IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress, Status = SupportStatus.Active },
              new TransportationOtherReferral { Id = "9", From = DateTime.Now, To = DateTime.Now.AddDays(3), IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress, Status = SupportStatus.Active },
            };

            var serializedSupports = JsonSerializer.Serialize(supports);
            serializedSupports.ShouldNotBeNullOrWhiteSpace();
            var supportsJsonElement = JsonDocument.Parse(serializedSupports).RootElement;
            supportsJsonElement.GetArrayLength().ShouldBe(supports.Length);
            foreach (var support in supportsJsonElement.EnumerateArray())
            {
                var id = support.EnumerateObject().FirstOrDefault(p => p.NameEquals(nameof(Support.Id))).Value.GetString().ShouldNotBeNull();
                var originalSupport = supports.FirstOrDefault(s => s.Id == id).ShouldNotBeNull();
                var category = support.EnumerateObject().FirstOrDefault(p => p.NameEquals(nameof(Support.Category))).Value.GetString().ShouldNotBeNull();
                Enum.TryParse<SupportCategory>(category, out var value).ShouldNotBe(false);
                value.ShouldBe(originalSupport.Category);
            }
        }

        [Fact]
        public void CanDeserializeSupport()
        {
            var serializedSupports = @"[
  {
  ""extremeWinterConditions"": false,
  ""category"": ""Clothing"",
  ""subCategory"": ""None"",
  ""totalAmount"": 0,
  ""method"": ""Referral"",
  ""supplierId"": ""1"",
  ""supplierName"": ""sup 1"",
  ""supplierAddress"": {
    ""addressLine1"": ""12 meh st."",
    ""addressLine2"": null,
    ""city"": null,
    ""communityCode"": ""226adfaf-9f97-ea11-b813-005056830319"",
    ""stateProvinceCode"": ""BC"",
    ""countryCode"": ""CAN"",
    ""postalCode"": ""V1V 1V1""
  },
  ""supplierNotes"": null,
  ""issuedToPersonName"": ""person 1"",
  ""id"": ""1"",
  ""from"": ""2021-08-17T12:47:27.9386564-07:00"",
  ""to"": ""2021-08-20T12:47:27.9387129-07:00"",
  ""status"": ""Active"",
  ""includedHouseholdMembers"": []
  },
  {
  ""category"": ""Incidentals"",
  ""subCategory"": ""None"",
  ""approvedItems"": null,
  ""totalAmount"": 0,
  ""method"": ""Referral"",
  ""supplierId"": ""2"",
  ""supplierName"": ""sup 2"",
  ""supplierAddress"": {
    ""addressLine1"": ""12 meh st."",
    ""addressLine2"": null,
    ""city"": null,
    ""communityCode"": ""226adfaf-9f97-ea11-b813-005056830319"",
    ""stateProvinceCode"": ""BC"",
    ""countryCode"": ""CAN"",
    ""postalCode"": ""V1V 1V1""
  },
  ""supplierNotes"": null,
  ""issuedToPersonName"": ""person 2"",
  ""id"": ""2"",
  ""from"": ""2021-08-17T12:47:27.9388806-07:00"",
  ""to"": ""2021-08-20T12:47:27.938883-07:00"",
  ""status"": ""Expired"",
  ""includedHouseholdMembers"": []
  },
  {
  ""category"": ""Food"",
  ""subCategory"": ""Food_Groceries"",
  ""numberOfDays"": 0,
  ""totalAmount"": 0,
  ""method"": ""Referral"",
  ""supplierId"": ""1"",
  ""supplierName"": ""sup 1"",
  ""supplierAddress"": {
    ""addressLine1"": ""12 meh st."",
    ""addressLine2"": null,
    ""city"": null,
    ""communityCode"": ""226adfaf-9f97-ea11-b813-005056830319"",
    ""stateProvinceCode"": ""BC"",
    ""countryCode"": ""CAN"",
    ""postalCode"": ""V1V 1V1""
  },
  ""supplierNotes"": null,
  ""issuedToPersonName"": ""person 1"",
  ""id"": ""3"",
  ""from"": ""2021-08-17T12:47:27.9389111-07:00"",
  ""to"": ""2021-08-20T12:47:27.9389122-07:00"",
  ""status"": ""Void"",
  ""includedHouseholdMembers"": []
  },
  {
  ""category"": ""Food"",
  ""subCategory"": ""Food_Restaurant"",
  ""numberOfBreakfastsPerPerson"": 0,
  ""numberOfLunchesPerPerson"": 0,
  ""numberOfDinnersPerPerson"": 0,
  ""totalAmount"": 0,
  ""method"": ""Referral"",
  ""supplierId"": ""4"",
  ""supplierName"": ""sup 4"",
  ""supplierAddress"": {
    ""addressLine1"": ""12 meh st."",
    ""addressLine2"": null,
    ""city"": null,
    ""communityCode"": ""226adfaf-9f97-ea11-b813-005056830319"",
    ""stateProvinceCode"": ""BC"",
    ""countryCode"": ""CAN"",
    ""postalCode"": ""V1V 1V1""
  },
  ""supplierNotes"": null,
  ""issuedToPersonName"": ""person 4"",
  ""id"": ""4"",
  ""from"": ""2021-08-17T12:47:27.9389337-07:00"",
  ""to"": ""2021-08-20T12:47:27.9389348-07:00"",
  ""status"": ""Active"",
  ""includedHouseholdMembers"": []
  },
  {
  ""category"": ""Lodging"",
  ""subCategory"": ""Lodging_Hotel"",
  ""numberOfNights"": 0,
  ""numberOfRooms"": 0,
  ""method"": ""Referral"",
  ""supplierId"": ""4"",
  ""supplierName"": ""sup 4"",
  ""supplierAddress"": {
    ""addressLine1"": ""12 meh st."",
    ""addressLine2"": null,
    ""city"": null,
    ""communityCode"": ""226adfaf-9f97-ea11-b813-005056830319"",
    ""stateProvinceCode"": ""BC"",
    ""countryCode"": ""CAN"",
    ""postalCode"": ""V1V 1V1""
  },
  ""supplierNotes"": null,
  ""issuedToPersonName"": ""person 4"",
  ""id"": ""5"",
  ""from"": ""2021-08-17T12:47:27.9389561-07:00"",
  ""to"": ""2021-08-20T12:47:27.9389571-07:00"",
  ""status"": ""Active"",
  ""includedHouseholdMembers"": []
  },
  {
  ""category"": ""Lodging"",
  ""subCategory"": ""Lodging_Billeting"",
  ""numberOfNights"": 0,
  ""method"": ""Referral"",
  ""supplierId"": ""4"",
  ""supplierName"": ""sup 4"",
  ""supplierAddress"": {
    ""addressLine1"": ""12 meh st."",
    ""addressLine2"": null,
    ""city"": null,
    ""communityCode"": ""226adfaf-9f97-ea11-b813-005056830319"",
    ""stateProvinceCode"": ""BC"",
    ""countryCode"": ""CAN"",
    ""postalCode"": ""V1V 1V1""
  },
  ""supplierNotes"": null,
  ""issuedToPersonName"": ""person 4"",
  ""id"": ""6"",
  ""from"": ""2021-08-17T12:47:27.938978-07:00"",
  ""to"": ""2021-08-20T12:47:27.9389789-07:00"",
  ""status"": ""Active"",
  ""includedHouseholdMembers"": []
  },
  {
  ""category"": ""Lodging"",
  ""subCategory"": ""Lodging_Group"",
  ""numberOfNights"": 0,
  ""method"": ""Referral"",
  ""supplierId"": ""4"",
  ""supplierName"": ""sup 4"",
  ""supplierAddress"": {
    ""addressLine1"": ""12 meh st."",
    ""addressLine2"": null,
    ""city"": null,
    ""communityCode"": ""226adfaf-9f97-ea11-b813-005056830319"",
    ""stateProvinceCode"": ""BC"",
    ""countryCode"": ""CAN"",
    ""postalCode"": ""V1V 1V1""
  },
  ""supplierNotes"": null,
  ""issuedToPersonName"": ""person 4"",
  ""id"": ""7"",
  ""from"": ""2021-08-17T12:47:27.9389997-07:00"",
  ""to"": ""2021-08-20T12:47:27.9390007-07:00"",
  ""status"": ""Active"",
  ""includedHouseholdMembers"": []
  },
  {
  ""category"": ""Transportation"",
  ""subCategory"": ""Transportation_Taxi"",
  ""fromAddress"": null,
  ""toAddress"": null,
  ""method"": ""Referral"",
  ""supplierId"": ""4"",
  ""supplierName"": ""sup 4"",
  ""supplierAddress"": {
    ""addressLine1"": ""12 meh st."",
    ""addressLine2"": null,
    ""city"": null,
    ""communityCode"": ""226adfaf-9f97-ea11-b813-005056830319"",
    ""stateProvinceCode"": ""BC"",
    ""countryCode"": ""CAN"",
    ""postalCode"": ""V1V 1V1""
  },
  ""supplierNotes"": null,
  ""issuedToPersonName"": ""person 4"",
  ""id"": ""8"",
  ""from"": ""2021-08-17T12:47:27.9390216-07:00"",
  ""to"": ""2021-08-20T12:47:27.9390225-07:00"",
  ""status"": ""Active"",
  ""includedHouseholdMembers"": []
  },
  {
  ""category"": ""Transportation"",
  ""subCategory"": ""Transportation_Other"",
  ""totalAmount"": 0,
  ""transportMode"": null,
  ""method"": ""Referral"",
  ""supplierId"": ""4"",
  ""supplierName"": ""sup 4"",
  ""supplierAddress"": {
    ""addressLine1"": ""12 meh st."",
    ""addressLine2"": null,
    ""city"": null,
    ""communityCode"": ""226adfaf-9f97-ea11-b813-005056830319"",
    ""stateProvinceCode"": ""BC"",
    ""countryCode"": ""CAN"",
    ""postalCode"": ""V1V 1V1""
  },
  ""supplierNotes"": null,
  ""issuedToPersonName"": ""person 4"",
  ""id"": ""9"",
  ""from"": ""2021-08-17T12:47:27.9390435-07:00"",
  ""to"": ""2021-08-20T12:47:27.9390444-07:00"",
  ""status"": ""Active"",
  ""includedHouseholdMembers"": []
  }
]"
            ;

            var supports = JsonSerializer.Deserialize<IEnumerable<ClothingReferral>>(serializedSupports);
            supports.Count().ShouldBe(9);
        }
    }
}
