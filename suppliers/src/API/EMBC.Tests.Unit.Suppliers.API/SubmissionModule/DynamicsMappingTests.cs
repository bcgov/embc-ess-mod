using System;
using System.ComponentModel;
using System.Linq;
using System.Text;
using EMBC.Suppliers.API.SubmissionModule.Models.Dynamics;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Newtonsoft.Json;
using Xunit;

namespace EMBC.Tests.Unit.Suppliers.API.SubmissionModule
{
    public class DynamicsMappingTests
    {
        [Fact]
        public void Map_Invoice_CorrectDynamicsType()
        {
            var referenceNumber = "ref";
            var supplier = new SupplierInformation
            {
                ForRemittance = true,
                GstNumber = "gst123",
                LegalBusinessName = "legal name of supplier 1",
                Name = "supplier1",
                Location = "location",
                ContactPerson = new Contact
                {
                    FirstName = "first",
                    LastName = "last",
                    Email = "email@first.last",
                    Fax = "1234",
                    Phone = "2345"
                },
                Address = new Address
                {
                    AddressLine1 = "addr 1",
                    AddressLine2 = "addr 2",
                    City = "city",
                    Country = "country",
                    StateProvince = "state1"
                }
            };
            var srcInvoice = new Invoice { };

            var mappedInvoices = new[] { srcInvoice }.MapInvoices(referenceNumber, supplier, null);

            var mappedInvoice = Assert.Single(mappedInvoices);
            var typeProperty = TypeDescriptor.GetProperties(mappedInvoice).Find("type", true);
            Assert.True(typeProperty.Attributes.Contains(new JsonPropertyAttribute("@odata.type")));
            Assert.Equal("Microsoft.Dynamics.CRM.era_supplierinvoice", typeProperty.GetValue(mappedInvoice));
        }

        [Fact]
        public void Map_LineItem_CorrectDynamicsType()
        {
            var referenceNumber = "ref";
            var receipt = new Receipt
            {
                ReceiptNumber = "rec1",
                ReferralNumber = "ref1",
                Date = "2010-04-20",
                TotalAmount = 10m,
            };
            var lineItem = new LineItem
            {
                Amount = 10m,
                Description = "desc",
                ReceiptNumber = receipt.ReceiptNumber,
                ReferralNumber = receipt.ReferralNumber,
                SupportProvided = "support"
            };

            var mappedLineItems = new[] { lineItem }.MapLineItems(referenceNumber, receipt);
            var mappedLineItem = Assert.Single(mappedLineItems);
            var typeProperty = TypeDescriptor.GetProperties(mappedLineItem).Find("type", true);
            Assert.True(typeProperty.Attributes.Contains(new JsonPropertyAttribute("@odata.type")));
            Assert.Equal("Microsoft.Dynamics.CRM.era_supportlineitem", typeProperty.GetValue(mappedLineItem));
        }

        [Fact]
        public void Map_ReceiptWithLineItem_CorrectDynamicsType()
        {
            var referenceNumber = "ref";
            var receipt = new Referral
            {
                ReferralNumber = "ref1",
                InvoiceNumber = "inv1",
                TotalAmount = 10m,
            };
            var lineItem = new LineItem
            {
                Amount = 10m,
                Description = "desc",
                ReceiptNumber = null,
                ReferralNumber = receipt.ReferralNumber,
                SupportProvided = "support"
            };

            var mappedLineItems = new[] { lineItem }.MapLineItems(referenceNumber, receipt);
            var mappedLineItem = Assert.Single(mappedLineItems);
            var typeProperty = TypeDescriptor.GetProperties(mappedLineItem).Find("type", true);
            Assert.True(typeProperty.Attributes.Contains(new JsonPropertyAttribute("@odata.type")));
            Assert.Equal("Microsoft.Dynamics.CRM.era_supportlineitem", typeProperty.GetValue(mappedLineItem));
        }

        [Fact]
        public void Map_Attachment_CorrectDynamicsType()
        {
            var referenceNumber = "ref";

            var attachment = new Attachment
            {
                Content = Encoding.ASCII.GetBytes("content"),
                ContentType = "contenttype",
                FileName = "filename",
                ReferralNumber = referenceNumber,
                Type = AttachmentType.Invoice,
                InvoiceNumber = "inv1"
            };
            var mappedAttachments = new[] { attachment }.MapAttachments();

            var mappedAttachment = Assert.Single(mappedAttachments);
            var typeProperty = TypeDescriptor.GetProperties(mappedAttachment).Find("type", true);
            Assert.True(typeProperty.Attributes.Contains(new JsonPropertyAttribute("@odata.type")));
            Assert.Equal("Microsoft.Dynamics.CRM.activitymimeattachment", typeProperty.GetValue(mappedAttachment));
        }

        [Fact]
        public void Map_NoInvoice_SingleDummyInvoice()
        {
            var referenceNumber = "ref";
            var supplier = new SupplierInformation
            {
                ForRemittance = true,
                GstNumber = "gst123",
                LegalBusinessName = "legal name of supplier 1",
                Name = "supplier1",
                Location = "location",
                ContactPerson = new Contact
                {
                    FirstName = "first",
                    LastName = "last",
                    Email = "email@first.last",
                    Fax = "1234",
                    Phone = "2345"
                },
                Address = new Address
                {
                    AddressLine1 = "addr 1",
                    AddressLine2 = "addr 2",
                    City = "city",
                    Country = "country",
                    StateProvince = "state1"
                }
            };

            var mappedInvoices = new Invoice[0].MapInvoices(referenceNumber, supplier, null);

            var mappedInvoice = Assert.Single(mappedInvoices);
            Assert.Equal(referenceNumber, mappedInvoice.era_referencenumber);
            Assert.Equal(referenceNumber, mappedInvoice.era_invoiceref);
        }

        [Fact]
        public void Map_NoInvoice_ReferralsReferencesToDummyInvoice()
        {
            var referenceNumber = "refnum";

            var referrals = new[]
            {
                new Referral
                {
                    InvoiceNumber = null,
                    ReferralNumber = "ref1",
                    TotalAmount = 1m,
                },
                new Referral
                {
                    InvoiceNumber = null,
                    ReferralNumber = "ref2",
                    TotalAmount = 2m,
                }
            };

            var invoiceRef = referenceNumber;
            var mappedReferrals = referrals.MapReferrals(referenceNumber);

            Assert.All(mappedReferrals, r =>
            {
                Assert.Equal(invoiceRef, r.era_invoicereference);
            });
        }

        [Fact]
        public void Map_Attachment_DynamicsAttachment()
        {
            var referenceNumber = "refnumber";
            var attachments = new[]
            {
                new Attachment
                {
                    Content = Encoding.ASCII.GetBytes("content"),
                    ContentType = "contenttype",
                    FileName ="filename",
                    ReferralNumber = referenceNumber,
                    Type = AttachmentType.Invoice,
                    InvoiceNumber = "inv1"
                },
                new Attachment
                {
                    Content = Encoding.ASCII.GetBytes("content"),
                    ContentType = "contenttype",
                    FileName ="filename",
                    ReferralNumber = referenceNumber,
                    Type = AttachmentType.Receipt,
                    InvoiceNumber = "inv1"
                },
                new Attachment
                {
                    Content = Encoding.ASCII.GetBytes("content"),
                    ContentType = "contenttype",
                    FileName ="filename",
                    ReferralNumber = referenceNumber,
                    Type = AttachmentType.Referral,
                    InvoiceNumber = "inv1"
                }
            };

            var mappedAttachments = attachments.MapAttachments();

            var invoiceAttachment = Assert.Single(mappedAttachments, a => a.activitysubject == "invoice");
            var referralAttachment = Assert.Single(mappedAttachments, a => a.activitysubject == "referral" && !a.filename.Contains("_receipt_"));
            var receiptAttachment = Assert.Single(mappedAttachments, a => a.activitysubject == "referral" && a.filename.Contains("_receipt_"));
        }

        [Fact]
        public void Map_AttachmentsWithSameNameAndType_FileNameIsUnique()
        {
            var referenceNumber = "refnumber";
            var fileName = "filename";
            var type = AttachmentType.Invoice;

            var submission = new Submission
            {
                Invoices = new[]{
                    new Invoice
                    {
                        Date = "2020-01-01",
                        InvoiceNumber = "inv1",
                        TotalAmount = 0,
                    }
                },
                LineItems = Array.Empty<LineItem>(),
                Receipts = Array.Empty<Receipt>(),
                Referrals = new[]{
                    new Referral
                    {
                        InvoiceNumber = "inv1",
                        ReferralNumber = "ref1",
                        TotalAmount = 0,
                    }
                },
                Suppliers = new[]
                {
                    new SupplierInformation
                    {
                        ForRemittance = true,
                        GstNumber = "gst123",
                        LegalBusinessName = "legal name of supplier 1",
                        Name = "supplier1",
                        Location = "location",
                        ContactPerson = new Contact
                        {
                            FirstName = "first",
                            LastName = "last",
                            Email = "email@first.last",
                            Fax = "1234",
                            Phone = "2345"
                        },
                        Address = new Address
                        {
                            AddressLine1 = "addr 1",
                            AddressLine2 = "addr 2",
                            CityCode ="code",
                            City = "city",
                            CountryCode = "code",
                            Country = "country",
                            StateProvinceCode = "code",
                            StateProvince = "state1"
                        }
                    }
                },
                Attachments = new[]
                {
                    new Attachment
                    {
                        Content = Encoding.ASCII.GetBytes("content"),
                        ContentType = "contenttype",
                        FileName =fileName,
                        ReferralNumber = referenceNumber,
                        Type = type,
                        InvoiceNumber = "inv1"
                    },
                    new Attachment
                    {
                        Content = Encoding.ASCII.GetBytes("content"),
                        ContentType = "contenttype",
                        FileName =fileName,
                        ReferralNumber = referenceNumber,
                        Type = type,
                        InvoiceNumber = "inv1"
                    },
                    new Attachment
                    {
                        Content = Encoding.ASCII.GetBytes("content"),
                        ContentType = "contenttype",
                        FileName =fileName,
                        ReferralNumber = referenceNumber,
                        Type =type,
                        InvoiceNumber = "inv1"
                    }
                }
            };

            var mappedSubmissions = new[] { submission }.MapSubmissions(referenceNumber);
            var mappedSubmission = Assert.Single(mappedSubmissions);

            Assert.Equal(submission.Attachments.Count(), mappedSubmission.documentCollection.Select(a => a.filename).Distinct().Count());
        }
    }
}
