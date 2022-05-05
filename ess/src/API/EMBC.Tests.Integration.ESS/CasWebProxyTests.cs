using System;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Cas;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class CasWebProxyTests : WebAppTestBase
    {
        private readonly IWebProxy client;

        public CasWebProxyTests(ITestOutputHelper output, WebAppTestFixture fixture) : base(output, fixture)
        {
            client = Services.GetRequiredService<IWebProxy>();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CreateToken_Success()
        {
            var token = await client.CreateTokenAsync(CancellationToken.None);

            token.ShouldNotBeNull();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task PostInvoice_Success()
        {
            var uniqueId = Guid.NewGuid().ToString().Substring(0, 4);
            var now = DateTime.Now;
            var invoice = new Invoice
            {
                SupplierNumber = "044994",
                SupplierSiteNumber = "001",
                InvoiceNumber = $"era_unittest_{uniqueId}",
                InvoiceBatchName = "era_unittest",
                PayGroup = "EMB INC",
                DateInvoiceReceived = now,
                InvoiceDate = now,
                GlDate = now,
                InvoiceAmount = 100m,
                InvoiceLineDetails = new[]
                {
                    new InvoiceLineDetail
                    {
                        DefaultDistributionAccount = "105.15006.10120.5185.1500000.000000.0000",
                        InvoiceLineAmount = 100m,
                        InvoiceLineNumber = 1
                    }
                },
                InteracEmail = "era@unit.test",
                InteracMobileCountryCode = "1",
                InteracMobileNumber = "1231231234",
                RemittanceMessage1 = "security question",
                RemittanceMessage2 = "answer",
                NameLine1 = "TEST, UNIT",

                AddressLine1 = "123 unit test",
                City = "Victoria",
                PostalCode = "V1V1V1",
                Province = "BC",
                Country = "CA"
            };
            var response = await client.CreateInvoiceAsync(invoice, CancellationToken.None);

            response.ShouldNotBeNull();
            response.IsSuccess().ShouldBeTrue();
            response.InvoiceNumber.ShouldNotBeNull();
        }
    }
}
