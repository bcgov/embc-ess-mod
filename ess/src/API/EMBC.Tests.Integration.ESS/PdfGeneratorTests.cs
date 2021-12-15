using System;
using System.Diagnostics;
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
    public class PdfGeneratorTests : IClassFixture<WebApplicationFactory<Startup>>
    {
#if RELEASE
        protected const string RequiresDynamics = "Integration tests that requires Dynamics connection via VPN";
#else
        protected const string RequiresDynamics = null;
        private readonly ITestOutputHelper output;
        private readonly WebApplicationFactory<Startup> webApplicationFactory;
#endif

        public PdfGeneratorTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory)
        {
            this.output = output;
            this.webApplicationFactory = webApplicationFactory;
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGeneratePdfFromHtml()
        {
            var pdfGenerator = webApplicationFactory.Services.GetRequiredService<IPdfGenerator>();

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

            var generator = webApplicationFactory.Services.GetRequiredService<IPdfGenerator>();

            await Enumerable.Range(0, 100).ForEachAsync(5, async i =>
            {
                var sw = Stopwatch.StartNew();
                //await Should.NotThrowAsync(generator.Generate(template()));
                await generator.Generate(template());
                sw.Stop();
                output.WriteLine("pdf {0} generated in {1}ms", i, sw.ElapsedMilliseconds);
            });
        }
    }
}
