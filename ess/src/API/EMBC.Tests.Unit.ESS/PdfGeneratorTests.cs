using System.IO;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Utilities.PdfGenerator;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Unit.ESS
{
    public class PdfGeneratorTests : WebAppTestBase
    {
        public PdfGeneratorTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
        }

        [Fact]
        public async Task CanGeneratePdf()
        {
            var template = @"<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <header>
        <h1>Header</h1>
    </header>
    <main>
        <p>Text</p>
    </main>
</body>
</html>";

            var generator = services.GetRequiredService<IPdfGenerator>();

            var result = await generator.Generate(template);

            await File.WriteAllBytesAsync("./actual.pdf", result);

            var expectedPdf = await File.ReadAllBytesAsync("./expected.pdf");
            expectedPdf.ShouldNotBeEmpty();
            var actualPdf = await File.ReadAllBytesAsync("./actual.pdf");
            actualPdf.ShouldNotBeEmpty();

            var startTimestampLocation = Find(expectedPdf, 0, new byte[] { 0x44, 0x3a });
            startTimestampLocation.ShouldBeGreaterThan(-1);
            var endTimestampLocation = Find(expectedPdf, startTimestampLocation, new byte[] { 0x29, 0x0a });
            endTimestampLocation.ShouldBeGreaterThan(startTimestampLocation);

            //remove timestamp from files' contents
            expectedPdf = Slice(expectedPdf, startTimestampLocation, endTimestampLocation);
            actualPdf = Slice(actualPdf, startTimestampLocation, endTimestampLocation);

            actualPdf.ShouldBe(expectedPdf);
        }

        private static int Find(byte[] array, int startIndex, byte[] innerArray)
        {
            for (int i = 0; i < array.Length; i++)
            {
                if (startIndex > i) continue;

                var found = false;
                for (int j = 0; j < innerArray.Length; j++)
                {
                    found = innerArray[j] == array[i + j];
                }
                if (found) return i;
            }
            return -1;
        }

        private static byte[] Slice(byte[] array, int from, int to)
        {
            var sliced = new byte[array.Length - (to - from) + 2];
            var j = 0;
            for (int i = 0; i < array.Length; i++)
            {
                if (i <= from || i >= to) sliced[j++] = array[i];
            }

            return sliced;
        }
    }
}
