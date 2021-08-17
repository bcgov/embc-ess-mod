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
            var support = new ClothingReferral();
            var serializedSupport = JsonSerializer.Serialize(support, new JsonSerializerOptions { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            serializedSupport.ShouldBe(@"{
  ""extremeWinterConditions"": false,
  ""category"": ""Clothing"",
  ""subCategory"": ""None"",
  ""method"": ""Referral"",
  ""supplierId"": null,
  ""supplierName"": null,
  ""notesToSupplier"": null,
  ""id"": null,
  ""from"": ""0001-01-01T00:00:00"",
  ""to"": ""0001-01-01T00:00:00"",
  ""totalAmount"": 0,
  ""status"": ""Draft"",
  ""includedHouseholdMembers"": []
}"
            );
        }

        [Fact]
        public void CanDeserializeSupport()
        {
            var serializedSupport = @"{
  ""extremeWinterConditions"": false,
  ""category"": ""Clothing"",
  ""subCategory"": null,
  ""method"": ""Referral"",
  ""supplierId"": null,
  ""supplierName"": null,
  ""notesToSupplier"": null,
  ""id"": null,
  ""from"": ""0001-01-01T00:00:00"",
  ""to"": ""0001-01-01T00:00:00"",
  ""totalAmount"": 0,
  ""status"": ""Draft"",
  ""includedHouseholdMembers"": []
}";

            var support = JsonSerializer.Deserialize<ClothingReferral>(serializedSupport);
            support.Method.ShouldBe(SupportMethod.Referral);
            support.Category.ShouldBe(SupportCategory.Clothing);
            support.SubCategory.ShouldBe(SupportSubCategory.None);
        }
    }
}
