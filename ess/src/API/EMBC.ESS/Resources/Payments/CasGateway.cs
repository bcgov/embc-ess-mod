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

        public Task<IEnumerable<InvoiceItem>> QueryInvoices(string status, DateTime? statusChangedFrom, DateTime? statusChangedTo, CancellationToken ct);
    }

    [Serializable]
    public class CasException : Exception
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
        private readonly ICasSystemConfigurationProvider casSystemConfigurationProvider;

        public CasGateway(IWebProxy casWebProxy, IMapper mapper, ICasSystemConfigurationProvider casSystemConfigurationProvider)
        {
            this.casWebProxy = casWebProxy;
            this.mapper = mapper;
            this.casSystemConfigurationProvider = casSystemConfigurationProvider;
        }

        public async Task<string> CreateInvoice(string batchName, era_etransfertransaction payment, CancellationToken ct)
        {
            var config = await casSystemConfigurationProvider.Get(ct);

            var invoice = new Invoice
            {
                PayGroup = config.PayGroup,
                CurrencyCode = config.CurrencyCode,
                Terms = config.InvoiceTerms,
                InvoiceType = config.InvoiceType,
                RemittanceCode = config.InvoiceRemittanceCode,
                SpecialHandling = config.InvoiceSpecialHandling,
                InvoiceBatchName = batchName,
                SupplierNumber = payment.era_suppliernumber,
                SupplierSiteNumber = payment.era_sitesuppliernumber,
                InvoiceNumber = payment.era_name,
                DateInvoiceReceived = payment.era_dateinvoicereceived.Value.UtcDateTime,
                GlDate = payment.era_gldate.Value.UtcDateTime,
                InvoiceDate = payment.era_invoicedate.Value.UtcDateTime,
                InvoiceAmount = payment.era_totalamount.Value,
                InteracEmail = payment.era_emailaddress,
                InteracMobileCountryCode = payment.era_phonenumber == null ? null : "1",
                InteracMobileNumber = payment.era_phonenumber?.ToCasTelephoneNumber(),
                RemittanceMessage1 = payment.era_securityquestion?.TrimTo(40),
                RemittanceMessage2 = payment.era_securityanswer?.TrimTo(64),
                // these fields should NOT be sent to CAS as it is expected to be empty
                //NameLine1 = payment.era_firstname,
                //NameLine2 = payment.era_lastname,
                InvoiceLineDetails = new[]
                {
                    new InvoiceLineDetail
                    {
                        InvoiceLineNumber = 1,
                        DefaultDistributionAccount = config.DefaultDistributionAccount,
                        InvoiceLineAmount = payment.era_totalamount.Value,
                        LineCode = config.InvoiceLineCode,
                        InvoiceLineType = config.InvoiceLineType
                    }
                }
            };

            var response = await casWebProxy.CreateInvoiceAsync(invoice, ct);
            if (!response.IsSuccess()) throw new CasException($"{response.CASReturnedMessages}");

            return response.InvoiceNumber;
        }

        public async Task<(string SupplierNumber, string SiteCode)> CreateSupplier(contact contact, CancellationToken ct)
        {
            if (string.IsNullOrEmpty(contact.address1_postalcode)) throw new ArgumentNullException($"contact {contact.contactid}", nameof(contact.address1_postalcode));
            if (string.IsNullOrEmpty(contact.firstname)) throw new ArgumentNullException($"contact {contact.contactid}", nameof(contact.firstname));
            if (string.IsNullOrEmpty(contact.lastname)) throw new ArgumentNullException($"contact {contact.contactid}", nameof(contact.lastname));

            var config = await casSystemConfigurationProvider.Get(ct);
            var response = await casWebProxy.CreateSupplierAsync(new CreateSupplierRequest
            {
                SubCategory = "Individual",
                SupplierName = Formatters.ToCasSupplierName(contact.firstname, contact.lastname),
                SupplierAddress = new[]
                        {
                            new Supplieraddress
                            {
                                ProviderId = config.ProviderId,
                                AddressLine1 = contact.address1_line1?.ToCasAddressLine(),
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
            if (string.IsNullOrEmpty(contact.address1_postalcode)) throw new ArgumentNullException($"contact {contact.contactid}", nameof(contact.address1_postalcode));
            if (string.IsNullOrEmpty(contact.firstname)) throw new ArgumentNullException($"contact {contact.contactid}", nameof(contact.firstname));
            if (string.IsNullOrEmpty(contact.lastname)) throw new ArgumentNullException($"contact {contact.contactid}", nameof(contact.lastname));

            var response = await casWebProxy.GetSupplierAsync(new GetSupplierRequest
            {
                PostalCode = contact.address1_postalcode.ToCasPostalCode(),
                SupplierName = Formatters.ToCasSupplierName(contact.firstname, contact.lastname)
            }, ct);
            if (response == null || !response.SupplierAddress.Any()) return null;
            return (SupplierNumber: response.Suppliernumber, SiteCode: response.SupplierAddress.First().Suppliersitecode.StripCasSiteNumberBrackets());
        }

        public async Task<IEnumerable<InvoiceItem>> QueryInvoices(string status, DateTime? statusChangedFrom, DateTime? statusChangedTo, CancellationToken ct)
        {
            var config = await casSystemConfigurationProvider.Get(ct);
            var response = await casWebProxy.GetInvoiceAsync(new GetInvoiceRequest
            {
                PayGroup = config.PayGroup,
                PaymentStatusDateFrom = statusChangedFrom,
                PaymentStatusDateTo = statusChangedTo,
                PaymentStatus = status
            }, ct);

            var items = new List<InvoiceItem>(response.Items);

            //get all pages
            while (response.Next != null)
            {
                var queryParams = HttpUtility.ParseQueryString(new Uri(response.Next.Ref).Query);
                if (!int.TryParse(queryParams.Get("page"), out var nextPageNumber)) break;
                response = await casWebProxy.GetInvoiceAsync(new GetInvoiceRequest
                {
                    PayGroup = config.PayGroup,
                    PaymentStatusDateFrom = statusChangedFrom,
                    PaymentStatusDateTo = statusChangedTo,
                    PaymentStatus = status,
                    PageNumber = nextPageNumber
                }, ct);
                items.AddRange(response.Items);
            }

            return items;
        }
    }
}
