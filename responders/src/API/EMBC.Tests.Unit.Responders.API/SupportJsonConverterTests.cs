using System;
using System.Collections.Generic;
using System.IO;
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
              new LodgingAllowanceSupport { Id = "8", From = DateTime.Now, To = DateTime.Now.AddDays(3), SupportDelivery = new Referral{ IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress }, Status = SupportStatus.Active },
              new TransportationTaxiSupport { Id = "9", From = DateTime.Now, To = DateTime.Now.AddDays(3), SupportDelivery = new Referral{ IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress }, Status = SupportStatus.Active },
              new TransportationOtherSupport { Id = "10", From = DateTime.Now, To = DateTime.Now.AddDays(3), SupportDelivery = new Referral{ IssuedToPersonName = "person 4", SupplierId = "4", SupplierName = "sup 4", SupplierAddress = supplierAddress }, Status = SupportStatus.Active },
            };

            var serializedSupports = JsonSerializer.Serialize(supports);
            serializedSupports.ShouldNotBeNullOrWhiteSpace();
            var supportsJsonElement = JsonDocument.Parse(serializedSupports).RootElement;
            supportsJsonElement.GetArrayLength().ShouldBe(supports.Length);
            foreach (var support in supportsJsonElement.EnumerateArray())
            {
                var id = support.EnumerateObject().FirstOrDefault(p => p.NameEquals(nameof(Support.Id))).Value.GetString().ShouldNotBeNull();
                var originalSupport = supports.SingleOrDefault(s => s.Id == id).ShouldNotBeNull();
                var category = support.EnumerateObject().FirstOrDefault(p => p.NameEquals(nameof(Support.Category))).Value.GetString().ShouldNotBeNull();
                Enum.TryParse<SupportCategory>(category, out var value).ShouldNotBe(false);
                value.ShouldBe(originalSupport.Category);
            }
        }

        [Fact]
        public void CanDeserializeSupport()
        {
            var serializedSupports = File.ReadAllText("./supports.json");

            var supports = JsonSerializer.Deserialize<IEnumerable<Support>>(serializedSupports);
            supports.Count().ShouldBe(9);
        }
    }
}
