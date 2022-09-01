using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MockCas.Models
{
    public class GetSupplierRequest
    {
        public string SupplierName { get; set; } = null!;
        public string PostalCode { get; set; } = null!;
    }

    public class GetSupplierResponse
    {
        [Key]
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
        public ICollection<Supplieraddress> SupplierAddress { get; set; } = new List<Supplieraddress>();
    }

    public class Supplieraddress
    {
        public int Id { get; set; }
        public GetSupplierResponse? Supplier { get; set; }
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
        public List<Supplieraddress> SupplierAddress { get; set; } = new List<Supplieraddress>();
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
