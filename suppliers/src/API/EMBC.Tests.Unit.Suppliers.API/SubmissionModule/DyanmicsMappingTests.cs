using System.ComponentModel;
using EMBC.Suppliers.API.SubmissionModule.Models.Dynamics;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Newtonsoft.Json;
using Xunit;

namespace EMBC.Tests.Unit.Suppliers.API.SubmissionModule
{
    public class DyanmicsMappingTests
    {
        [Fact]
        public void CanMapInvoice()
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
        public void CanMapLineItemInReceipt()
        {
            var referenceNumber = "ref";
            var receipt = new Receipt
            {
                ReceiptNumber = "rec1",
                ReferralNumber = "ref1",
                Date = "2010-04-20",
                TotalAmount = 10m,
                TotalGST = 5m
            };
            var lineItem = new LineItem
            {
                Amount = 10m,
                Description = "desc",
                GST = 5m,
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
        public void CanMapLineItemInReferral()
        {
            var referenceNumber = "ref";
            var receipt = new Referral
            {
                ReferralNumber = "ref1",
                InvoiceNumber = "inv1",
                TotalAmount = 10m,
                TotalGST = 5m
            };
            var lineItem = new LineItem
            {
                Amount = 10m,
                Description = "desc",
                GST = 5m,
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

            Assert.Single(mappedInvoices);
        }
    }
}
