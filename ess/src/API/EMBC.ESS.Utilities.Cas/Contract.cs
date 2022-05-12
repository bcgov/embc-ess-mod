using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using EMBC.Utilities.Extensions;

namespace EMBC.ESS.Utilities.Cas
{
    public interface IWebProxy
    {
        Task<string> CreateTokenAsync(CancellationToken ct);

        Task<InvoiceResponse> CreateInvoiceAsync(Invoice invoice, CancellationToken ct);

        Task<GetInvoiceResponse> GetInvoiceAsync(GetInvoiceRequest getRequest, CancellationToken ct);

        Task<GetSupplierResponse?> GetSupplierAsync(GetSupplierRequest getRequest, CancellationToken ct);

        Task<CreateSupplierResponse> CreateSupplierAsync(CreateSupplierRequest supplier, CancellationToken ct);
    }

    public class Invoice
    {
        public string InvoiceType { get; set; } = "Standard";
        public string SupplierNumber { get; set; } = null!;
        public string SupplierSiteNumber { get; set; } = null!;
        public DateTime InvoiceDate { get; set; }
        public string InvoiceNumber { get; set; } = null!;
        public decimal InvoiceAmount { get; set; }
        public string PayGroup { get; set; } = null!;
        public DateTime DateInvoiceReceived { get; set; }
        public DateTime? DateGoodsReceived { get; set; }
        public string RemittanceCode { get; set; } = "01";
        public string SpecialHandling { get; set; } = "N";
        public string NameLine1 { get; set; } = null!;
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
        public DateTime GlDate { get; set; }
        public string InvoiceBatchName { get; set; } = null!;
        public string CurrencyCode { get; set; } = "CAD";
        public string? InteracEmail { get; set; }
        public string? InteracMobileCountryCode { get; set; }
        public string? InteracMobileNumber { get; set; }
        public InvoiceLineDetail[] InvoiceLineDetails { get; set; } = Array.Empty<InvoiceLineDetail>();
    }

    public class InvoiceLineDetail
    {
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

    public class GetSupplierRequest
    {
        public string SupplierName { get; set; } = null!;
        public string PostalCode { get; set; } = null!;
    }

    public class GetSupplierResponse
    {
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
        public InvoiceItem[] Items { get; set; } = Array.Empty<InvoiceItem>();

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
        public string Invoicenumber { get; set; } = null!;
        public string Suppliernumber { get; set; } = null!;
        public string Sitecode { get; set; } = null!;
        public DateTime Invoicecreationdate { get; set; }
        public int? Paymentnumber { get; set; }
        public string? Paygroup { get; set; }
        public DateTime? Paymentdate { get; set; }
        public decimal? Paymentamount { get; set; }
        public string? Paymentstatus { get; set; }
        public DateTime? Paymentstatusdate { get; set; }
        public DateTime? Cleareddate { get; set; }
        public DateTime? voiddate { get; set; }
        public string? Voidreason { get; set; }
        public DateTime Systemdate { get; set; }
    }

    public class CasDateJsonConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return DateTime.SpecifyKind(DateTime.Parse(reader.GetString() ?? string.Empty), DateTimeKind.Local);
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToPST().ToString("dd-MMM-yyyy", CultureInfo.InvariantCulture));
        }
    }
}
