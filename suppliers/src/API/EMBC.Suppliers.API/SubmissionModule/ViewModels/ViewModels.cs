using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace EMBC.Suppliers.API.SubmissionModule.ViewModels
{
    public class Submission
    {
        public IEnumerable<SupplierInformation> Suppliers { get; set; }
        public IEnumerable<Receipt> Receipts { get; set; }
        public IEnumerable<Referral> Referrals { get; set; }
        public IEnumerable<Invoice> Invoices { get; set; }
        public IEnumerable<LineItem> LineItems { get; set; }
        public IEnumerable<Attachment> Attachments { get; set; }
    }

    public class SupplierInformation
    {
        public string GstNumber { get; set; }
        public string Name { get; set; }
        public string LegalBusinessName { get; set; }
        public string Location { get; set; }
        public Address Address { get; set; }
        public Contact ContactPerson { get; set; }
        public bool ForRemittance { get; set; }
    }

    public class Address
    {
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string CityCode { get; set; }
        public string City { get; set; }
        public string StateProvinceCode { get; set; }
        public string StateProvince { get; set; }
        public string CountryCode { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
    }

    public class Contact
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
    }

    public class Invoice
    {
        public string InvoiceNumber { get; set; }
        public string Date { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class Referral
    {
        public string ReferralNumber { get; set; }
        public decimal TotalAmount { get; set; }
        public string InvoiceNumber { get; set; }
    }

    public class Receipt
    {
        public string ReceiptNumber { get; set; }
        public string Date { get; set; }
        public decimal TotalAmount { get; set; }
        public string ReferralNumber { get; set; }
    }

    public class LineItem
    {
        public string SupportProvided { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public string ReceiptNumber { get; set; }
        public string ReferralNumber { get; set; }
    }

    public class Attachment
    {
        public byte[] Content { get; set; }
        public string ContentType { get; set; }
        public string FileName { get; set; }
        public string InvoiceNumber { get; set; }
        public string ReferralNumber { get; set; }
        public AttachmentType Type { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public AttachmentType ReferenceType => Type;
    }

    public enum AttachmentType
    {
        Receipt = 0,
        Referral,
        Invoice
    }
}
