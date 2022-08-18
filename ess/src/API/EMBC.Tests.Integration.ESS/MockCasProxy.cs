using System;
using System.Collections.Concurrent;
using System.Globalization;
using System.Linq;
using System.Threading;
using EMBC.ESS.Utilities.Cas;
using EMBC.Utilities.Extensions;

namespace EMBC.Tests.Integration.ESS
{
    internal class MockCasProxy : IWebProxy
    {
        private ConcurrentDictionary<string, GetSupplierResponse> Suppliers;
        private ConcurrentDictionary<string, InvoiceItem> InvoiceItems;
        private ConcurrentDictionary<string, Invoice> Invoices;

        public MockCasProxy()
        {
            Suppliers = new ConcurrentDictionary<string, GetSupplierResponse>();
            InvoiceItems = new ConcurrentDictionary<string, InvoiceItem>();
            Invoices = new ConcurrentDictionary<string, Invoice>();
        }

        public async Task<InvoiceResponse> CreateInvoiceAsync(Invoice invoice, CancellationToken ct)
        {
            Invoices.TryAdd(invoice.InvoiceNumber, invoice);
            var toAdd = CreateItemFromInvoice(invoice);
            toAdd.Invoicecreationdate = DateTime.UtcNow;
            var response = new InvoiceResponse
            {
                InvoiceNumber = invoice.InvoiceNumber,
                CASReturnedMessages = InvoiceItems.TryAdd(invoice.InvoiceNumber, toAdd) ? "SUCCEEDED" : "FAILED"
            };
            return await Task.FromResult(response);
        }

        public async Task<GetSupplierResponse?> GetSupplierAsync(GetSupplierRequest getRequest, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(getRequest.PostalCode)) throw new ArgumentNullException(nameof(getRequest.PostalCode));
            if (string.IsNullOrWhiteSpace(getRequest.SupplierName)) throw new ArgumentNullException(nameof(getRequest.SupplierName));

            var supplier = Suppliers.FirstOrDefault(s => s.Value.Suppliername.Equals(getRequest.SupplierName, StringComparison.OrdinalIgnoreCase)).Value;
            if (supplier != null)
            {
                supplier.SupplierAddress = supplier.SupplierAddress.Where(a => a.PostalCode != null && a.PostalCode.Equals(getRequest.PostalCode, StringComparison.OrdinalIgnoreCase)).ToArray();
            }
            return await Task.FromResult(supplier);
        }

        public async Task<CreateSupplierResponse> CreateSupplierAsync(CreateSupplierRequest supplier, CancellationToken ct)
        {
            supplier.SupplierAddress.First().Suppliersitecode = "site code";
            GetSupplierResponse toAdd = new GetSupplierResponse
            {
                Suppliernumber = new Random().Next(1, 1000000).ToString(),
                Suppliername = supplier.SupplierName,
                Subcategory = supplier.SubCategory,
                Businessnumber = supplier.BusinessNumber,
                SupplierAddress = supplier.SupplierAddress,
                Providerid = "CAS_SU_AT_ESS"
            };

            var response = new CreateSupplierResponse
            {
                SupplierNumber = toAdd.Suppliernumber,
                SupplierSiteCode = "site code",
                CASReturnedMessages = Suppliers.TryAdd(toAdd.Suppliernumber, toAdd) ? "SUCCEEDED" : "FAILED"
            };
            return await Task.FromResult(response);
        }

        private static Func<DateTime, string> CasDateTimeFormatter => d => d.ToPST().ToString("dd-MMM-yyyy HH:mm:ss", CultureInfo.InvariantCulture);

        public async Task<GetInvoiceResponse> GetInvoiceAsync(GetInvoiceRequest getRequest, CancellationToken ct)
        {
            var pageLength = 1;
            var nextPage = 1;
            IQueryable<InvoiceItem> query = InvoiceItems.Values.AsQueryable();
            if (!string.IsNullOrWhiteSpace(getRequest.InvoiceNumber)) query = query.Where(i => i.Invoicenumber == getRequest.InvoiceNumber);
            if (!string.IsNullOrWhiteSpace(getRequest.SupplierNumber)) query = query.Where(i => i.Suppliernumber == getRequest.SupplierNumber);
            if (!string.IsNullOrWhiteSpace(getRequest.SupplierSiteCode)) query = query.Where(i => i.Sitecode == getRequest.SupplierSiteCode);
            if (!string.IsNullOrWhiteSpace(getRequest.PaymentStatus)) query = query.Where(i => i.Paymentstatus == getRequest.PaymentStatus);
            if (!string.IsNullOrWhiteSpace(getRequest.PaymentNumber)) query = query.Where(i => i.Paymentnumber == int.Parse(getRequest.PaymentNumber));
            if (getRequest.InvoiceCreationDateFrom.HasValue) query = query.Where(i => i.Invoicecreationdate >= getRequest.InvoiceCreationDateFrom);
            if (getRequest.InvoiceCreationDateTo.HasValue) query = query.Where(i => i.Invoicecreationdate <= getRequest.InvoiceCreationDateTo);
            if (getRequest.PaymentStatusDateFrom.HasValue) query = query.Where(i => i.Paymentstatusdate >= getRequest.PaymentStatusDateFrom);
            if (getRequest.PaymentStatusDateTo.HasValue) query = query.Where(i => i.Paymentstatusdate <= getRequest.PaymentStatusDateTo);
            //if (getRequest.PageNumber.HasValue) queryParams.Add("page", getRequest.PageNumber.Value.ToString());
            if (getRequest.PageNumber > 0)
            {
                query = query.Skip(pageLength * getRequest.PageNumber.Value);
                nextPage = getRequest.PageNumber.Value + 1;
            }

            var response = new GetInvoiceResponse()
            {
                Items = query.ToArray(),
            };

            if (response.Items.Count() > pageLength)
            {
                response.Items = response.Items.Take(pageLength).ToArray();
                response.Next = new PageReference { Ref = $"https://mockurl.ca/blah?page={nextPage}" };
            }

            return await Task.FromResult(response);
        }

        public async Task<string> CreateTokenAsync(CancellationToken ct)
        {
            return await Task.FromResult("some token");
        }

        public int GetSuppliersCount()
        {
            return Suppliers.Count();
        }

        public void AddInvoice(Invoice invoice)
        {
            var toAdd = CreateItemFromInvoice(invoice);
            //Invoices.TryRemove(invoice.InvoiceNumber);
            Invoices.TryAdd(invoice.InvoiceNumber, invoice);
            InvoiceItems.TryAdd(invoice.InvoiceNumber, toAdd);
        }

        public void AddSupplier(GetSupplierResponse supplier)
        {
            supplier.Subcategory = "Individual";
            supplier.Providerid = "CAS_SU_AT_ESS";
            Suppliers.TryAdd(supplier.Suppliernumber, supplier);
        }

        public void SetPaymentDate(string invoiceNumber, DateTime paymentDate, string paymentStatus)
        {
            InvoiceItems.TryGetValue(invoiceNumber, out var invoice);
            if (invoice == null) return;
            invoice.Paymentdate = paymentDate;
            invoice.Paymentstatusdate = paymentDate;
            invoice.Paymentstatus = paymentStatus;
        }

        private InvoiceItem CreateItemFromInvoice(Invoice invoice)
        {
            var invoiceItem = new InvoiceItem
            {
                Invoicenumber = invoice.InvoiceNumber,
                Suppliernumber = invoice.SupplierNumber,
                Sitecode = "001",
                Invoicecreationdate = invoice.InvoiceDate,
                Paymentnumber = 123,
                Paygroup = invoice.PayGroup,
                Paymentdate = invoice.DateInvoiceReceived,
                Paymentamount = invoice.InvoiceAmount,
                Paymentstatus = "NEGOTIABLE",
                Paymentstatusdate = DateTime.UtcNow,
            };

            return invoiceItem;
        }

        public Invoice? GetInvoiceByInvoiceNumber(string invoiceNumber)
        {
            Invoices.TryGetValue(invoiceNumber, out var invoice);
            return invoice;
        }
    }

    public static class CasPaymentStatuses
    {
        public const string Negotiable = "NEGOTIABLE";
        public const string Reconciled = "RECONCILED";
        public const string Voided = "VOIDED";
    }
}
