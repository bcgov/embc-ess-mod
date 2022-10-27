using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMBC.Suppliers.API;
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using EMBC.Suppliers.API.SubmissionModule.Models;
using EMBC.Suppliers.API.SubmissionModule.Models.Dynamics;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using EMBC.Tests.Integration.Suppliers.API;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Xrm.Tools.WebAPI;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Suppliers.API
{
    public class DynamicsConnectionFixture : IClassFixture<WebApplicationFactory<Startup>>
    {
        //set to null to run tests in this class, requires to be on VPN and Dynamics params configured in secrets.xml
#if RELEASE
        private const string skip = "integration tests";
#else
        private const string skip = null;
#endif

        private readonly ILoggerFactory loggerFactory;
        private CRMWebAPI api;
        private IListsRepository listsRepository;

        public DynamicsConnectionFixture(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory)
        {
            this.loggerFactory = new LoggerFactory(new[] { new XUnitLoggerProvider(output) });
            this.api = webApplicationFactory.Services.CreateScope().ServiceProvider.GetRequiredService<CRMWebAPI>();
            this.listsRepository = webApplicationFactory.Services.CreateScope().ServiceProvider.GetRequiredService<IListsRepository>();
        }

        [Fact(Skip = skip)]
        public async Task CanQuery()
        {
            var gw = new DynamicsListsGateway(api);

            var items = await gw.GetSupportsAsync();

            Assert.NotEmpty(items);
        }

        [Fact(Skip = skip)]
        public async Task CanSubmitUnauthInvoices()
        {
            var handler = new SubmissionDynamicsCustomActionHandler(api, loggerFactory.CreateLogger<SubmissionDynamicsCustomActionHandler>(), listsRepository);

            var referenceNumber = $"reftestinv_{DateTime.Now.Ticks}";
            await handler.Handle(new SubmissionSavedEvent(referenceNumber, new Submission
            {
                Suppliers = new[]
                {
                    new SupplierInformation{
                        Name="name",
                        LegalBusinessName = "legal name",
                        ForRemittance = true,
                        GstNumber = "gstnumber",
                        Location = "location",
                        Address = new Address
                        {
                            AddressLine1 = "addressline1",
                            AddressLine2 = "addressline2",
                            CityCode = "226adfaf-9f97-ea11-b813-005056830319",
                            CountryCode = "CAN",
                            PostalCode ="postalcode",
                            StateProvinceCode = "BC"
                        },
                        ContactPerson = new Contact
                        {
                            FirstName = "first",
                            LastName  = "last",
                            Email="email",
                            Fax = "fax",
                            Phone = "phone"
                        }
                    }
                },
                Invoices = new[]
                {
                    new Invoice
                    {
                        InvoiceNumber = "inv1",
                        Date = "2020-03-12",
                        TotalAmount = 100.00m,
                    }
                },
                Receipts = Array.Empty<Receipt>(),
                LineItems = new[]{
                    new LineItem
                    {
                        SupportProvided = "Clothing",
                        ReferralNumber = "ref123",
                        Amount = 10,
                        Description = "desc"
                    }
                    },
                Referrals = new[]
                {
                    new Referral
                    {
                        InvoiceNumber="inv1",
                        ReferralNumber = "ref123",
                        TotalAmount = 40m
                    }
                },
                Attachments = new[]
                {
                    new Attachment
                    {
                        Content = Encoding.ASCII.GetBytes("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"),
                        FileName = "Application.png",
                        InvoiceNumber = "inv1",
                        Type = AttachmentType.Invoice
                    }
                }
            }));
        }

        [Fact(Skip = skip)]
        public async Task CanSubmitUnauthReceipts()
        {
            var handler = new SubmissionDynamicsCustomActionHandler(api, loggerFactory.CreateLogger<SubmissionDynamicsCustomActionHandler>(), listsRepository);

            var referenceNumber = $"reftestrec_{DateTime.Now.Ticks}";
            await handler.Handle(new SubmissionSavedEvent(referenceNumber, new Submission
            {
                Suppliers = new[]
                {
                    new SupplierInformation
                    {
                        Name="name",
                        LegalBusinessName = "legal name",
                        ForRemittance = false,
                        GstNumber = "gstnumber",
                        Location = "location",
                        Address = new Address
                        {
                            AddressLine1 = "addressline1",
                            AddressLine2 = "addressline2",
                            CityCode = "226adfaf-9f97-ea11-b813-005056830319",
                            CountryCode = "CAN",
                            PostalCode ="postalcode",
                            StateProvinceCode = "BC"
                        },
                        ContactPerson = new Contact
                        {
                             FirstName = "first",
                             LastName  = "last",
                             Email="email",
                             Fax = "fax",
                             Phone = "phone"
                        }
                    }
                },
                Invoices = Array.Empty<Invoice>(),
                Receipts = new[]
                {
                    new Receipt
                    {
                        Date = "2020-01-31",
                        ReceiptNumber = "rec1",
                        ReferralNumber = "ref123",
                        TotalAmount = 50.35m,
                    }
                },
                LineItems = new[]
                {
                    new LineItem
                    {
                        SupportProvided = "Lodging - Hotel/Motel",
                        ReferralNumber = "ref123",
                        ReceiptNumber = "rec1",
                        Amount = 10,
                        Description = "desc"
                    }
                    },
                Referrals = new[]
                {
                    new Referral
                    {
                        InvoiceNumber=null,
                        ReferralNumber = "ref123",
                        TotalAmount = 40m
                    }
                },
                Attachments = new[]
                {
                    new Attachment
                    {
                        Content = Encoding.ASCII.GetBytes("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"),
                        FileName = "Application.png",
                        ReferralNumber = "ref123",
                        Type = AttachmentType.Receipt
                    }
                }
            }));
        }

        [Fact(Skip = skip)]
        public async Task CanGetListOfCountries()
        {
            var gw = new DynamicsListsGateway(api);

            var items = await gw.GetCountriesAsync();

            Assert.NotEmpty(items);
        }

        [Fact(Skip = skip)]
        public async Task CanGetListOfJurisdictions()
        {
            var gw = new DynamicsListsGateway(api);
            var canada = (await gw.GetCountriesAsync()).Single(c => c.era_countrycode == "CAN");
            var bc = (await gw.GetStateProvincesAsync(canada.era_countryid)).Single(c => c.era_code == "BC");

            var items = await gw.GetJurisdictionsAsync(bc.era_provinceterritoriesid);

            Assert.NotEmpty(items);
        }

        [Fact(Skip = skip)]
        public async Task CanGetListOfStateProvinces()
        {
            var gw = new DynamicsListsGateway(api);
            var canada = (await gw.GetCountriesAsync()).Single(c => c.era_countrycode == "CAN");

            var items = await gw.GetStateProvincesAsync(canada.era_countryid);

            Assert.NotEmpty(items);
        }

        [Fact(Skip = skip)]
        public async Task CanGetListOfDistricts()
        {
            var gw = new DynamicsListsGateway(api);

            var items = await gw.GetDistrictsAsync();

            Assert.NotEmpty(items);
        }

        [Fact(Skip = skip)]
        public async Task CanGetListOfRegions()
        {
            var gw = new DynamicsListsGateway(api);

            var items = await gw.GetRegionsAsync();

            Assert.NotEmpty(items);
        }

        [Fact(Skip = skip)]
        public async Task CanGetListOfSupports()
        {
            var gw = new DynamicsListsGateway(api);

            var items = await gw.GetSupportsAsync();

            Assert.NotEmpty(items);
        }
    }
}
