using System;
using System.Collections.Generic;
using System.Linq;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;

namespace EMBC.Suppliers.API.SubmissionModule.Models.Dynamics
{
    public static class EntityMappers
    {
        public static IEnumerable<InvoiceEntity> MapInvoices(this IEnumerable<Invoice> invoices, string referenceNumber, SupplierInformation supplierInformation, SupplierInformation supplierRemittanceInformation)
        {
            return invoices.Select((i, n) => new InvoiceEntity
            {
                era_invoicedate = i.Date.ToString("yyyy-MM-dd"),
                era_invoiceref = i.InvoiceNumber,
                era_referencenumber = referenceNumber,
                era_remitpaymenttootherbusiness = false,
                era_totalgst = i.TotalGST,
                era_totalinvoiceamount = i.TotalAmount,
                era_invoicetype = 174360100, //fire and forget
                era_supplierinvoicenumber = i.InvoiceNumber,
                era_suppliername = supplierInformation.Name,
                era_supplierlegalname = supplierInformation.LegalBusinessName,
                era_storenumber = supplierInformation.Location,
                era_gstnumber = supplierInformation.GstNumber,
                era_addressline1 = supplierInformation.Address.AddressLine1,
                era_addressline2 = supplierInformation.Address.AddressLine2,
                era_city = supplierInformation.Address.City,
                era_postalcode = supplierInformation.Address.PostalCode,
                era_province = "/era_provinceterritorieses(8262519F-0884-EA11-B813-005056830319)",
                era_country = supplierInformation.Address.Country,
                era_legalbusinessname = supplierRemittanceInformation?.LegalBusinessName,
                era_remitcountry = supplierRemittanceInformation?.Address?.Country,
                era_remitcity = supplierRemittanceInformation?.Address?.City,
                era_remitaddress1 = supplierRemittanceInformation?.Address?.AddressLine1,
                era_remitaddress2 = supplierRemittanceInformation?.Address?.AddressLine2,
                era_remitprovincestate = supplierRemittanceInformation?.Address?.StateProvince,
                era_remitpostalcode = supplierRemittanceInformation?.Address?.PostalCode,
                era_contactfirstname = supplierInformation.ContactPerson.FirstName,
                era_contactlastname = supplierInformation.ContactPerson.LastName,
                era_contactemail = supplierInformation.ContactPerson.Email,
                era_contactnumber = supplierInformation.ContactPerson.Phone,
                era_contactfax = supplierInformation.ContactPerson.Fax
            });
        }

        public static IEnumerable<ReferralEntity> MapReferrals(this IEnumerable<Referral> referrals, string referenceNumber)
        {
            return referrals.Select((r, n) => new ReferralEntity
            {
                era_referralnumber = r.ReferralNumber,
                era_totalgst = r.TotalGST,
                era_totalamount = r.TotalAmount,
                era_invoicereference = r.InvoiceNumber,
                era_submissionreference = referenceNumber
            });
        }

        public static IEnumerable<LineItemEntity> MapLineItems(this IEnumerable<LineItem> lineItems, string referenceNumber, Receipt receipt)
        {
            return lineItems.Select((l, n) => new LineItemEntity
            {
                era_SupportsProvided = "/era_supports(541D48E3-BF85-EA11-B818-00505683FBF4)",
                era_description = l.Description,
                era_gst = l.GST,
                era_amount = l.Amount,
                era_receipt = receipt.ReceiptNumber,
                era_receiptdate = receipt.Date.ToString("yyyy-MM-dd"),
                era_referralreference = receipt.ReferralNumber,
                era_submissionreference = referenceNumber
            });
        }

        public static IEnumerable<LineItemEntity> MapLineItems(this IEnumerable<LineItem> lineItems, string referenceNumber, Referral referral)
        {
            return lineItems.Select((l, n) => new LineItemEntity
            {
                era_SupportsProvided = "/era_supports(541D48E3-BF85-EA11-B818-00505683FBF4)",
                era_description = l.Description,
                era_gst = l.GST,
                era_amount = l.Amount,
                era_receipt = string.Empty,
                era_receiptdate = null,
                era_referralreference = referral.ReferralNumber,
                era_submissionreference = referenceNumber
            });
        }

        public static IEnumerable<AttachmentEntity> MapAttachments(this IEnumerable<Attachment> attachments)
        {
            Func<Attachment, string> subjectMapper = a =>
            {
                switch (a.Type)
                {
                    case AttachmentType.Receipt:
                        return $"inv-{a.InvoiceNumber}";

                    case AttachmentType.Referral:
                        return $"ref-{a.ReferralNumber}";

                    case AttachmentType.Invoice:
                        return $"rec-{a.ReferralNumber}";

                    default:
                        throw new NotSupportedException();
                }
            };
            return attachments.Select((a, n) => new AttachmentEntity
            {
                body = a.Content,
                filename = a.FileName,
                subject = subjectMapper(a)
            });
        }
    }
}
