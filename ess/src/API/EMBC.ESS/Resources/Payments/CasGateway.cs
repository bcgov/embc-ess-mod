using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using AutoMapper;
using EMBC.ESS.Utilities.Cas;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Payments
{
    internal interface ICasGateway
    {
        public Task<(string SupplierNumber, string SiteCode)> CreateSupplier(contact contact, CancellationToken ct);

        public Task<(string SupplierNumber, string SiteCode)?> GetSupplier(contact contact, CancellationToken ct);

        public Task<string> CreateInvoice(string batchName, era_etransfertransaction payment, CancellationToken ct);

        public Task<IEnumerable<InvoiceItem>> QueryInvoices(string status, DateTime? statusChangedFrom, CancellationToken ct);
    }

    [Serializable]
    internal class CasException : Exception
    {
        public CasException(string message) : base(message)
        {
        }

        public CasException(string message, Exception inner) : base(message, inner)
        {
        }

        protected CasException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }

    internal class CasGateway : ICasGateway
    {
        private readonly IWebProxy casWebProxy;
        private readonly IMapper mapper;

        public CasGateway(IWebProxy casWebProxy, IMapper mapper)
        {
            this.casWebProxy = casWebProxy;
            this.mapper = mapper;
        }

        public async Task<string> CreateInvoice(string batchName, era_etransfertransaction payment, CancellationToken ct)
        {
            var invoice = mapper.Map<Invoice>(payment);
            //TODO: get from Dynamics sys config values
            invoice.PayGroup = "EMB INC";
            var distributedAccount = "105.15006.10120.5185.1500000.000000.0000";
            invoice.InvoiceBatchName = batchName;
            var lineItemNumber = 1;
            foreach (var lineItem in invoice.InvoiceLineDetails)
            {
                lineItem.InvoiceLineNumber = lineItemNumber++;
                lineItem.DefaultDistributionAccount = distributedAccount;
            }
            var response = await casWebProxy.CreateInvoiceAsync(invoice, ct);
            if (!response.IsSuccess()) throw new CasException($"{response.CASReturnedMessages}");

            return response.InvoiceNumber;
        }

        public async Task<(string SupplierNumber, string SiteCode)> CreateSupplier(contact contact, CancellationToken ct)
        {
            var response = await casWebProxy.CreateSupplierAsync(new CreateSupplierRequest
            {
                SubCategory = "Individual",
                SupplierName = Formatters.ToCasSupplierName(contact.firstname, contact.lastname),
                SupplierAddress = new[]
                        {
                            new Supplieraddress
                            {
                                //TODO: get from dynamics
                                ProviderId = "CAS_SU_AT_ESS",
                                AddressLine1 = contact.address1_line1.ToCasAddressLine(),
                                AddressLine2 = contact.address1_line2?.ToCasAddressLine(),
                                AddressLine3 = contact.address1_line3?.ToCasAddressLine(),
                                City = (contact.era_City?.era_jurisdictionname ?? contact.address1_city).ToCasCity(),
                                PostalCode = contact.address1_postalcode.ToCasPostalCode(),
                                Province = contact.era_ProvinceState?.era_code ?? "BC",
                                Country = "CA",
                            }
                        }
            }, ct);
            if (!response.IsSuccess()) throw new CasException($"CAS supplier creation failed for payee {contact.contactid}: {response.CASReturnedMessages}");
            return (SupplierNumber: response.SupplierNumber, SiteCode: response.SupplierSiteCode.StripCasSiteNumberBrackets());
        }

        public async Task<(string SupplierNumber, string SiteCode)?> GetSupplier(contact contact, CancellationToken ct)
        {
            var response = await casWebProxy.GetSupplierAsync(new GetSupplierRequest
            {
                PostalCode = contact.address1_postalcode.ToCasPostalCode(),
                SupplierName = Formatters.ToCasSupplierName(contact.firstname, contact.lastname)
            }, ct);
            if (response == null || !response.SupplierAddress.Any()) return null;
            return (SupplierNumber: response.Suppliername, SiteCode: response.SupplierAddress.First().Suppliersitecode.StripCasSiteNumberBrackets());
        }

        public async Task<IEnumerable<InvoiceItem>> QueryInvoices(string status, DateTime? statusChangedFrom, CancellationToken ct)
        {
            var response = await casWebProxy.GetInvoiceAsync(new GetInvoiceRequest
            {
                //TODO: get from Dynamics config
                PayGroup = "EMB INC",
                PaymentStatusDateFrom = statusChangedFrom,
                PaymentStatus = status
            }, ct);

            var items = new List<InvoiceItem>(response.Items);

            //get all pages
            while (response.Next != null)
            {
                var queryParams = HttpUtility.ParseQueryString(new Uri(response.Next.Ref).PathAndQuery);
                if (!int.TryParse(queryParams.Get("page"), out var nextPageNumber)) break;
                response = await casWebProxy.GetInvoiceAsync(new GetInvoiceRequest
                {
                    //TODO: get from Dynamics config
                    PayGroup = "EMB INC",
                    PageNumber = nextPageNumber
                }, ct);
                items.AddRange(response.Items);
            }

            return items;
        }
    }
}
