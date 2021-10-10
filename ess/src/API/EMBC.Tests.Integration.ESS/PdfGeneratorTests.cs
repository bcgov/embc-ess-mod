using System;
using System.IO;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Utilities.PdfGenerator;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class PdfGeneratorTests : WebAppTestBase
    {
        public PdfGeneratorTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGeneratePdfFromHtml()
        {
            var pdfGenerator = services.GetRequiredService<IPdfGenerator>();

            var pdf = await pdfGenerator.Generate($"<h1>pdf genrated on {DateTime.Now}</h1>");

            pdf.ShouldNotBeEmpty();

            await File.WriteAllBytesAsync("./pdf_test.pdf", pdf);
        }
    }
}
