using System;
using System.Collections.Generic;

namespace EMBC.Suppliers.API.Submissions.ViewModels
{
    public class Submission
    {
        public string SupplierLegalName { get; set; }
        public string SupplierName { get; set; }
        public string Location { get; set; }
        public string GstNumber { get; set; }
        public bool RemitToOtherBusiness { get; set; }
        public SupplierAddress Address { get; set; }
        public SupplierContact ContactPerson { get; set; }
        public IEnumerable<Receipt> Receipts { get; set; }
    }

    public class SupplierAddress
    {
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string CityCode { get; set; }
        public string City { get; set; }
        public string ProvinceCode { get; set; }
        public string Province { get; set; }
        public string CountryCode { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
    }

    public class SupplierContact
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
    }

    public class InvoiceSubmission
    {
        public string Number { get; set; }
        public DateTime Date { get; set; }
        public IEnumerable<ReferralSubmission> Referrals { get; set; }
        public IEnumerable<Attachment> Attachments { get; set; }
    }

    public class ReferralSubmission
    {
        public string ReferralNumber { get; set; }
    }

    public class Receipt
    {
        public DateTime Date { get; set; }
        public decimal TotalGST { get; set; }
        public decimal TotalAmount { get; set; }
        public IEnumerable<LineItem> LineItems { get; set; }
        public IEnumerable<Attachment> ReferralAttachments { get; set; }
        public IEnumerable<Attachment> ReceiptAttachments { get; set; }
    }

    public class LineItem
    {
        public string SupportProvided { get; set; }
        public string Description { get; set; }
        public decimal GST { get; set; }
        public decimal Amount { get; set; }
    }

    public class Attachment
    {
        public string Content { get; set; }
        public string ContentType { get; set; }
        public string FileName { get; set; }
    }
}
