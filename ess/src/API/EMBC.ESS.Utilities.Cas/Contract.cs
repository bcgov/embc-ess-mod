using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace EMBC.ESS.Utilities.Cas
{
    public interface IWebProxy
    {
        Task<InvoiceResponse> CreateInvoiceAsync(Invoice invoice);

        Task<string> CreateTokenAsync();
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
    }

    public class CasDateJsonConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return DateTime.Parse(reader.GetString() ?? string.Empty);
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString("dd-MMM-yyyy", CultureInfo.InvariantCulture));
        }
    }
}
