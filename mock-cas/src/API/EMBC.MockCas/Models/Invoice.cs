using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EMBC.MockCas.Models
{
    public class Invoice
    {
        [Key]
        public int Id { get; set; }
        public string InvoiceType { get; set; } = "Standard";
        public string SupplierNumber { get; set; } = null!;
        public string SupplierSiteNumber { get; set; } = null!;
        public string InvoiceDate { get; set; } = null!;
        public string InvoiceNumber { get; set; } = null!;
        public decimal InvoiceAmount { get; set; }
        public string PayGroup { get; set; } = null!;
        public string DateInvoiceReceived { get; set; } = null!;
        public string? DateGoodsReceived { get; set; }
        public string RemittanceCode { get; set; } = "01";
        public string SpecialHandling { get; set; } = "N";
        public string? NameLine1 { get; set; } = null!;
        public string? NameLine2 { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? AddressLine3 { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? Province { get; set; }
        public string? PostalCode { get; set; }
        public string? EftAdviceFlag { get; set; }
        public string? QualifiedReceiver { get; set; }
        public string Terms { get; set; } = "Immediate";
        public string PayAloneFlag { get; set; } = "Y";
        public string? PaymentAdviceComments { get; set; }
        public string RemittanceMessage1 { get; set; } = null!;
        public string RemittanceMessage2 { get; set; } = null!;
        public string? RemittanceMessage3 { get; set; }
        public string GlDate { get; set; } = null!;
        public string InvoiceBatchName { get; set; } = null!;
        public string CurrencyCode { get; set; } = "CAD";
        public string? InteracEmail { get; set; }
        public string? InteracMobileCountryCode { get; set; }
        public string? InteracMobileNumber { get; set; }
        public ICollection<InvoiceLineDetail> InvoiceLineDetails { get; set; } = new List<InvoiceLineDetail>();
    }

    public class InvoiceLineDetail
    {
        public int Id { get; set; }
        public Invoice? Invoice { get; set; }
        public int InvoiceLineNumber { get; set; }
        public string InvoiceLineType { get; set; } = "Item";
        public string LineCode { get; set; } = "DR";
        public decimal InvoiceLineAmount { get; set; }
        public string DefaultDistributionAccount { get; set; } = null!;
        public string? Description { get; set; }
        public string? TaxClassificationCode { get; set; }
        public string? DistributionSupplier { get; set; }
        public string? Info1 { get; set; }
        public string? Info2 { get; set; }
        public string? Info3 { get; set; }
    }

    public class InvoiceResponse
    {
        [JsonPropertyName("invoice_number")]
        public string? InvoiceNumber { get; set; }

        [JsonPropertyName("CAS-Returned-Messages")]
        public string CASReturnedMessages { get; set; } = null!;

        public bool IsSuccess() => "SUCCEEDED".Equals(CASReturnedMessages, StringComparison.OrdinalIgnoreCase);
    }

    public class GetInvoiceRequest
    {
        public string PayGroup { get; set; } = null!;
        public DateTime? InvoiceCreationDateFrom { get; set; }
        public DateTime? InvoiceCreationDateTo { get; set; }
        public DateTime? PaymentStatusDateFrom { get; set; }
        public DateTime? PaymentStatusDateTo { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? SupplierNumber { get; set; }
        public string? SupplierSiteCode { get; set; }
        public string? PaymentStatus { get; set; }
        public string? PaymentNumber { get; set; }
        public int? PageNumber { get; set; }
    }

    public class GetInvoiceResponse
    {
        [JsonPropertyName("items")]
        public List<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();

        public PageReference? First { get; set; }
        public PageReference? Next { get; set; }
    }

    public class PageReference
    {
        [JsonPropertyName("$ref")]
        public string Ref { get; set; } = null!;
    }

    public class InvoiceItem
    {
        public int Id { get; set; }
        public string Invoicenumber { get; set; } = null!;
        public string Suppliernumber { get; set; } = null!;
        public string Sitecode { get; set; } = null!;
        public string Invoicecreationdate { get; set; } = null!;
        public int? Paymentnumber { get; set; }
        public string? Paygroup { get; set; }
        public string? Paymentdate { get; set; }
        public decimal? Paymentamount { get; set; }
        public string? Paymentstatus { get; set; }
        public string? Paymentstatusdate { get; set; }
        public string? Cleareddate { get; set; }
        public string? voiddate { get; set; }
        public string? Voidreason { get; set; }
        public string? Systemdate { get; set; }
    }
}
