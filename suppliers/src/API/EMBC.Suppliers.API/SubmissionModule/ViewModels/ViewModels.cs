// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

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
        public decimal TotalGST { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class Referral
    {
        public string ReferralNumber { get; set; }
        public decimal TotalGST { get; set; }
        public decimal TotalAmount { get; set; }
        public string InvoiceNumber { get; set; }
    }

    public class Receipt
    {
        public string ReceiptNumber { get; set; }
        public string Date { get; set; }
        public decimal TotalGST { get; set; }
        public decimal TotalAmount { get; set; }
        public string ReferralNumber { get; set; }
    }

    public class LineItem
    {
        public string SupportProvided { get; set; }
        public string Description { get; set; }
        public decimal GST { get; set; }
        public decimal Amount { get; set; }
        public string ReceiptNumber { get; set; }
        public string ReferralNumber { get; set; }
    }

    public class Attachment
    {
        public string Content { get; set; }
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
