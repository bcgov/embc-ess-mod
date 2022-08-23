using System.Text.Json.Serialization;

namespace EMBC.MockCas.Models
{
    public class GetSupplierRequest
    {
        public string SupplierName { get; set; } = null!;
        public string PostalCode { get; set; } = null!;
    }

    public class GetSupplierResponse
    {
        public int Id { get; set; }
        public string Suppliernumber { get; set; } = null!;
        public string Suppliername { get; set; } = null!;
        public string? Subcategory { get; set; }
        public string? Sin { get; set; }
        public string? Providerid { get; set; }
        public string? Businessnumber { get; set; }
        public string? Status { get; set; }
        public string? Supplierprotected { get; set; }
        public string? Standardindustryclassification { get; set; }
        public DateTime? Lastupdated { get; set; }

        [JsonPropertyName("supplieraddress")]
        public Supplieraddress[] SupplierAddress { get; set; } = Array.Empty<Supplieraddress>();
    }

    public class Supplieraddress
    {
        public int Id { get; set; }
        public string Suppliersitecode { get; set; } = null!;
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? AddressLine3 { get; set; }
        public string? City { get; set; }
        public string? Province { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
        public string? EmailAddress { get; set; }
        public string? AccountNumber { get; set; }
        public string? BranchNumber { get; set; }
        public string? BankNumber { get; set; }
        public string? EftAdvicePref { get; set; }
        public string? ProviderId { get; set; }
        public string? Status { get; set; }
        public string? SiteProtected { get; set; }
        public string? LastUpdated { get; set; }
    }

    public class CreateSupplierRequest
    {
        public string SupplierName { get; set; } = null!;

        public string SubCategory { get; set; } = null!;
        public string? Sin { get; set; }

        public string? BusinessNumber { get; set; }
        public Supplieraddress[] SupplierAddress { get; set; } = Array.Empty<Supplieraddress>();
    }

    public class CreateSupplierResponse
    {
        [JsonPropertyName("SUPPLIER_NUMBER")]
        public string SupplierNumber { get; set; } = null!;

        [JsonPropertyName("SUPPLIER_SITE_CODE")]
        public string SupplierSiteCode { get; set; } = null!;

        [JsonPropertyName("CAS-Returned-Messages")]
        public string CASReturnedMessages { get; set; } = null!;

        public bool IsSuccess() => "SUCCEEDED".Equals(CASReturnedMessages, StringComparison.OrdinalIgnoreCase);
    }
}
