using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Utilities.Extensions;
using EMBC.ESS.Utilities.PdfGenerator;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class PdfGeneratorTests : WebAppTestBase
    {
        public PdfGeneratorTests(ITestOutputHelper output, WebAppTestFixture<Startup> fixture) : base(output, fixture)
        {
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanGeneratePdfFromHtml()
        {
            var pdfGenerator = Services.GetRequiredService<IPdfGenerator>();

            var pdf = await pdfGenerator.Generate($"<h1>pdf genrated on {DateTime.Now}</h1>");

            pdf.ShouldNotBeEmpty();

            await File.WriteAllBytesAsync("./pdf_test.pdf", pdf);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
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

            var generator = Services.GetRequiredService<IPdfGenerator>();
            var logger = Services.GetRequiredService<ILogger<PdfGeneratorTests>>();

            await Enumerable.Range(0, 20).ForEachAsync(10, async i =>
            {
                var sw = Stopwatch.StartNew();
                //await Should.NotThrowAsync(generator.Generate(template()));
                await generator.Generate(template());
                sw.Stop();
                logger.LogInformation("pdf {0} generated in {1}ms", i, sw.ElapsedMilliseconds);
            });
        }
    }
}
