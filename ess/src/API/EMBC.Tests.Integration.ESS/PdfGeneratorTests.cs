using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Utilities.Extensions;
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
        public PdfGeneratorTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
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

        [Fact(Skip = RequiresDynamics)]
        public async Task LoadTestPdfGenerator()
        {
            Func<string> template = () => $@"<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <header>
        <h1>Header</h1>
    </header>
    <main>
        <p>{DateTime.Now}</p>
    </main>
</body>
</html>";

            var generator = services.GetRequiredService<IPdfGenerator>();

            await Enumerable.Range(0, 100).ForEachAsync(10, async i =>
            {
                await Should.NotThrowAsync(generator.Generate(template()));
            });
        }
    }
}
