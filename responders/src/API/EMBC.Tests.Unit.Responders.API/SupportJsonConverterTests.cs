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
              new ClothingSupport { Id = "1", From = DateTime.Now, To = DateTime.Now.AddDays(3), SupportDelivery = new Referral{ IssuedToPersonName = "person 1", SupplierId = "1", SupplierName = "sup 1", SupplierAddress = supplierAddress }, Status = SupportStatus.Active },
              new IncidentalsSupport { Id = "2", From = DateTime.Now, To = DateTime.Now.AddDays(3), SupportDelivery = new Referral{ IssuedToPersonName = "person 2", SupplierId = "2", SupplierName = "sup 2", SupplierAddress = supplierAddress }, Status = SupportStatus.Expired },
              new FoodGroceriesSupport { Id = "3", From = DateTime.Now, To = DateTime.Now.AddDays(3), SupportDelivery = new Referral{ IssuedToPersonName = "person 1", SupplierId = "1", SupplierName = "sup 1", SupplierAddress = supplierAddress }, Status = SupportStatus.Void },
              new FoodRestaurantSupport { Id = "4", From = DateTime.Now, To = DateTime.Now.AddDays(3), SupportDelivery = new Referral{ IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress }, Status = SupportStatus.Active },
              new LodgingHotelSupport { Id = "5", From = DateTime.Now, To = DateTime.Now.AddDays(3), SupportDelivery = new Referral{ IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress }, Status = SupportStatus.Active },
              new LodgingBilletingSupport { Id = "6", From = DateTime.Now, To = DateTime.Now.AddDays(3), SupportDelivery = new Referral{ IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress }, Status = SupportStatus.Active },
              new LodgingGroupSupport { Id = "7", From = DateTime.Now, To = DateTime.Now.AddDays(3), SupportDelivery = new Referral{ IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress }, Status = SupportStatus.Active },
              new TransportationTaxiSupport { Id = "8", From = DateTime.Now, To = DateTime.Now.AddDays(3), SupportDelivery = new Referral{ IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress }, Status = SupportStatus.Active },
              new TransportationOtherSupport { Id = "9", From = DateTime.Now, To = DateTime.Now.AddDays(3), SupportDelivery = new Referral{ IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress }, Status = SupportStatus.Active },
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
            var serializedSupports = @"[{
            ""needsAssessmentId"": ""f7febae0-e455-4785-a701-0614ccdf70d7"",
            ""from"": ""2022-04-25T21:58:14.290Z"",
            ""to"": ""2022-04-26T21:58:14.290Z"",
            ""status"": ""Draft"",
			""category"": ""Incidentals"",
            ""subCategory"": ""None"",
            ""method"": ""Referral"",
            ""supportDelivery"": {
                ""method"": ""Referral"",
                ""issuedToPersonName"": ""autotest-load-0,autotest-load-4"",
                ""supplierAddress"": {
                    ""communityCode"": ""7269dfaf-9f97-ea11-b813-005056830319"",
                    ""stateProvinceCode"": ""BC"",
                    ""countryCode"": ""CAN"",
                    ""postalCode"": ""V9B 0Y3"",
                    ""addressLine1"": ""214-950 WHIRLAWAY CRESCENT"",
                    ""addressLine2"": null,
                    ""city"": null
                },
                ""supplierId"": ""bf53ad97-f9cf-492f-9c58-35a03c4d273a"",
                ""supplierName"": ""chest"",
                ""supplierNotes"": ""notes""
            },
            ""includedHouseholdMembers"": [""1a1aafbf-5d08-4d6f-84a1-0d2932794d8f"", ""73eab430-34e0-497e-b294-2b9f5319e2ae""],
            ""approvedItems"": ""exercitationem"",
            ""totalAmount"": 125
        }, {
            ""needsAssessmentId"": ""f7febae0-e455-4785-a701-0614ccdf70d7"",
            ""from"": ""2022-04-25T21:58:14.291Z"",
            ""to"": ""2022-04-27T21:58:14.291Z"",
            ""status"": ""Draft"",
            ""method"": ""Referral"",
            ""supportDelivery"": {
                ""method"": ""Referral"",
                ""issuedToPersonName"": ""autotest-load-0,autotest-load-4"",
                ""supplierAddress"": {
                    ""stateProvinceCode"": ""BC"",
                    ""countryCode"": ""CAN"",
                    ""postalCode"": ""V8Z3D6"",
                    ""addressLine1"": ""123 Douglas St."",
                    ""addressLine2"": ""Store 345-900"",
                    ""city"": null,
                    ""communityCode"": ""986adfaf-9f97-ea11-b813-005056830319""
                },
                ""supplierId"": ""89e0e8a3-4ee3-43a5-8b11-648ea57db19a"",
                ""supplierName"": ""Fresh Ingredients Inc."",
                ""supplierNotes"": ""notes""
            },
            ""category"": ""Clothing"",
            ""subCategory"": ""None"",
            ""includedHouseholdMembers"": [""1a1aafbf-5d08-4d6f-84a1-0d2932794d8f"", ""73eab430-34e0-497e-b294-2b9f5319e2ae"", ""466053c4-f019-4d84-b478-378d0c9748f8"", ""f2301fdc-c3a6-46e5-be0a-434b83920217"", ""46e2368f-9771-4345-a83a-9b1ed01bec0f"", ""5944a456-2582-4604-8bec-b1d3b2344d09"", ""971eba1b-a3b8-439a-b37c-caf060d70f9d"", ""12043608-8c90-4d80-a7fd-de7a0615da46""],
            ""extremeWinterConditions"": false,
            ""totalAmount"": 130
        }, {
            ""needsAssessmentId"": ""f7febae0-e455-4785-a701-0614ccdf70d7"",
            ""from"": ""2022-04-25T21:58:14.291Z"",
            ""to"": ""2022-04-27T21:58:14.291Z"",
            ""status"": ""Draft"",
            ""method"": ""Referral"",
            ""supportDelivery"": {
                ""method"": ""Referral"",
                ""issuedToPersonName"": ""autotest-load-0,autotest-load-4"",
                ""supplierAddress"": {
                    ""countryCode"": ""CAN"",
                    ""postalCode"": ""v8n1g1"",
                    ""addressLine1"": ""1"",
                    ""addressLine2"": ""2"",
                    ""city"": null,
                    ""communityCode"": ""b469dfaf-9f97-ea11-b813-005056830319"",
                    ""stateProvinceCode"": ""BC""
                },
                ""supplierId"": ""769f6a5e-fafc-4938-afb2-8dc01cd47cfe"",
                ""supplierName"": ""test1701"",
                ""supplierNotes"": ""notes""
            },
            ""category"": ""Food"",
            ""subCategory"": ""Food_Restaurant"",
            ""includedHouseholdMembers"": [""1a1aafbf-5d08-4d6f-84a1-0d2932794d8f"", ""73eab430-34e0-497e-b294-2b9f5319e2ae"", ""466053c4-f019-4d84-b478-378d0c9748f8"", ""f2301fdc-c3a6-46e5-be0a-434b83920217"", ""46e2368f-9771-4345-a83a-9b1ed01bec0f"", ""5944a456-2582-4604-8bec-b1d3b2344d09""],
            ""numberOfBreakfastsPerPerson"": 6,
            ""numberOfLunchesPerPerson"": 3,
            ""numberOfDinnersPerPerson"": 2,
            ""totalAmount"": 196
        }, {
            ""needsAssessmentId"": ""f7febae0-e455-4785-a701-0614ccdf70d7"",
            ""from"": ""2022-04-25T21:58:14.291Z"",
            ""to"": ""2022-04-27T21:58:14.291Z"",
            ""status"": ""Draft"",
            ""method"": ""Referral"",
            ""supportDelivery"": {
                ""method"": ""Referral"",
                ""issuedToPersonName"": ""autotest-load-0,autotest-load-4"",
                ""supplierAddress"": {
                    ""stateProvinceCode"": ""BC"",
                    ""countryCode"": ""CAN"",
                    ""postalCode"": ""V9B 0Y3"",
                    ""addressLine1"": ""214-950 WHIRLAWAY CRESCENT"",
                    ""addressLine2"": null,
                    ""city"": null,
                    ""communityCode"": ""7269dfaf-9f97-ea11-b813-005056830319""
                },
                ""supplierId"": ""7d2f957e-91a6-443f-9eab-40bcc8289d61"",
                ""supplierName"": ""tes"",
                ""supplierNotes"": ""notes""
            },
            ""category"": ""Lodging"",
            ""subCategory"": ""Lodging_Billeting"",
            ""includedHouseholdMembers"": [""1a1aafbf-5d08-4d6f-84a1-0d2932794d8f"", ""73eab430-34e0-497e-b294-2b9f5319e2ae"", ""466053c4-f019-4d84-b478-378d0c9748f8"", ""f2301fdc-c3a6-46e5-be0a-434b83920217"", ""46e2368f-9771-4345-a83a-9b1ed01bec0f""],
            ""numberOfNights"": 3,
            ""hostAddress"": ""81439 Aron Coves"",
            ""hostCity"": ""Eleanoramouth"",
            ""hostEmail"": ""Watson49@hotmail.com"",
            ""hostName"": ""Lois Toy"",
            ""hostPhone"": ""690-836-2011""
        }, {
            ""needsAssessmentId"": ""f7febae0-e455-4785-a701-0614ccdf70d7"",
            ""from"": ""2022-04-25T21:58:14.293Z"",
            ""to"": ""2022-04-27T21:58:14.293Z"",
            ""status"": ""Draft"",
            ""method"": ""Referral"",
            ""supportDelivery"": {
                ""method"": ""Referral"",
                ""issuedToPersonName"": ""autotest-load-0,autotest-load-4"",
                ""supplierAddress"": {
                    ""addressLine2"": ""2"",
                    ""city"": null,
                    ""communityCode"": ""b469dfaf-9f97-ea11-b813-005056830319"",
                    ""stateProvinceCode"": ""BC"",
                    ""countryCode"": ""CAN"",
                    ""postalCode"": ""v8n1g1"",
                    ""addressLine1"": ""1""
                },
                ""supplierId"": ""769f6a5e-fafc-4938-afb2-8dc01cd47cfe"",
                ""supplierName"": ""test1701"",
                ""supplierNotes"": ""notes""
            },
            ""category"": ""Lodging"",
            ""subCategory"": ""Lodging_Hotel"",
            ""includedHouseholdMembers"": [""1a1aafbf-5d08-4d6f-84a1-0d2932794d8f"", ""73eab430-34e0-497e-b294-2b9f5319e2ae"", ""466053c4-f019-4d84-b478-378d0c9748f8"", ""f2301fdc-c3a6-46e5-be0a-434b83920217"", ""46e2368f-9771-4345-a83a-9b1ed01bec0f""],
            ""numberOfNights"": 4,
            ""numberOfRooms"": 2
        }, {
            ""needsAssessmentId"": ""f7febae0-e455-4785-a701-0614ccdf70d7"",
            ""from"": ""2022-04-25T21:58:14.293Z"",
            ""to"": ""2022-04-28T21:58:14.293Z"",
            ""status"": ""Draft"",
            ""method"": ""Referral"",
            ""supportDelivery"": {
                ""method"": ""Referral"",
                ""issuedToPersonName"": ""autotest-load-0,autotest-load-4"",
                ""supplierAddress"": {
                    ""communityCode"": ""9e6adfaf-9f97-ea11-b813-005056830319"",
                    ""stateProvinceCode"": ""BC"",
                    ""countryCode"": ""CAN"",
                    ""postalCode"": ""V7Z0H6"",
                    ""addressLine1"": ""1244 Miracle St"",
                    ""addressLine2"": ""Store 9009"",
                    ""city"": null
                },
                ""supplierId"": ""2c26ca14-7dad-4d56-ab0c-5881cbd385fd"",
                ""supplierName"": ""Fresh Ingredients Inc."",
                ""supplierNotes"": ""notes""
            },
            ""category"": ""Transportation"",
            ""subCategory"": ""Transportation_Other"",
            ""includedHouseholdMembers"": [""1a1aafbf-5d08-4d6f-84a1-0d2932794d8f"", ""73eab430-34e0-497e-b294-2b9f5319e2ae""],
            ""transportMode"": ""Coupe"",
            ""totalAmount"": 199
        }, {
            ""needsAssessmentId"": ""f7febae0-e455-4785-a701-0614ccdf70d7"",
            ""from"": ""2022-04-25T21:58:14.294Z"",
            ""to"": ""2022-04-27T21:58:14.294Z"",
            ""status"": ""Draft"",
            ""method"": ""Referral"",
            ""supportDelivery"": {
                ""method"": ""Referral"",
                ""issuedToPersonName"": ""autotest-load-0,autotest-load-4"",
                ""supplierAddress"": {
                    ""addressLine1"": ""123 Douglas St."",
                    ""addressLine2"": ""Store 345-900"",
                    ""city"": null,
                    ""communityCode"": ""986adfaf-9f97-ea11-b813-005056830319"",
                    ""stateProvinceCode"": ""BC"",
                    ""countryCode"": ""CAN"",
                    ""postalCode"": ""V8Z3D6""
                },
                ""supplierId"": ""89e0e8a3-4ee3-43a5-8b11-648ea57db19a"",
                ""supplierName"": ""Fresh Ingredients Inc."",
                ""supplierNotes"": ""notes""
            },
            ""category"": ""Lodging"",
            ""subCategory"": ""Lodging_Group"",
            ""includedHouseholdMembers"": [""1a1aafbf-5d08-4d6f-84a1-0d2932794d8f"", ""73eab430-34e0-497e-b294-2b9f5319e2ae"", ""466053c4-f019-4d84-b478-378d0c9748f8""],
            ""numberOfNights"": 3,
            ""facilityAddress"": ""186 Rudy Key"",
            ""facilityCity"": ""Juneside"",
            ""facilityContactPhone"": ""327-677-0922"",
            ""facilityName"": ""Bartell LLC""
        }, {
            ""needsAssessmentId"": ""f7febae0-e455-4785-a701-0614ccdf70d7"",
            ""from"": ""2022-04-25T21:58:14.295Z"",
            ""to"": ""2022-04-29T21:58:14.295Z"",
            ""status"": ""Draft"",
            ""method"": ""ETransfer"",
            ""supportDelivery"": {
                ""method"": ""ETransfer"",
                ""issuedToPersonName"": ""autotest-load-0,autotest-load-4"",
                ""supplierAddress"": {
                    ""addressLine1"": ""123 Douglas St."",
                    ""addressLine2"": ""Store 345-900"",
                    ""city"": null,
                    ""communityCode"": ""986adfaf-9f97-ea11-b813-005056830319"",
                    ""stateProvinceCode"": ""BC"",
                    ""countryCode"": ""CAN"",
                    ""postalCode"": ""V8Z3D6""
                },
                ""supplierId"": ""89e0e8a3-4ee3-43a5-8b11-648ea57db19a"",
                ""supplierName"": ""Fresh Ingredients Inc."",
                ""supplierNotes"": ""notes""
            },
            ""category"": ""Transportation"",
            ""subCategory"": ""Transportation_Taxi"",
            ""includedHouseholdMembers"": [""1a1aafbf-5d08-4d6f-84a1-0d2932794d8f"", ""73eab430-34e0-497e-b294-2b9f5319e2ae""],
            ""fromAddress"": ""717 Euna Fields"",
            ""toAddress"": ""399 Maritza Square""
        }
    ]";

            var supports = JsonSerializer.Deserialize<IEnumerable<Support>>(serializedSupports);
            supports.Count().ShouldBe(8);
        }
    }
}
