using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Utilities.Extensions;
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

            //find creation timestamp
            var startCreateTimestampLocation = Find(expectedPdf, 0, Encoding.Default.GetBytes("/CreationDate (D:"));
            startCreateTimestampLocation.ShouldBeGreaterThan(-1);
            var endCreateTimestampLocation = Find(expectedPdf, startCreateTimestampLocation, Encoding.Default.GetBytes("+00'00')"));
            endCreateTimestampLocation.ShouldBeGreaterThan(startCreateTimestampLocation);

            //remove creation timestamp from files' contents
            expectedPdf = Slice(expectedPdf, startCreateTimestampLocation, endCreateTimestampLocation);
            actualPdf = Slice(actualPdf, startCreateTimestampLocation, endCreateTimestampLocation);

            //find mod timestamp
            var startModTimestampLocation = Find(expectedPdf, 0, Encoding.Default.GetBytes("/ModDate (D:"));
            startModTimestampLocation.ShouldBeGreaterThan(startCreateTimestampLocation);
            var endModTimestampLocation = Find(expectedPdf, startModTimestampLocation, Encoding.Default.GetBytes("+00'00')"));
            endModTimestampLocation.ShouldBeGreaterThan(startModTimestampLocation);

            //remove mod timestamp from files' contents
            expectedPdf = Slice(expectedPdf, startModTimestampLocation, endModTimestampLocation);
            actualPdf = Slice(actualPdf, startModTimestampLocation, endModTimestampLocation);

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
                    if (!found) break;
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

        [Fact]
        public async Task CanHandleConcurrentPdfGenerationRequests()
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

            await Enumerable.Range(0, 50).ForEachAsync(10, async i =>
            {
                await Should.NotThrowAsync(generator.Generate(template()));
            });
        }
    }
}
