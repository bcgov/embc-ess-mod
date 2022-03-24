using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.PdfGenerator;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Hosting.Internal;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Unit.ESS.Utilities
{
    public class PdfGeneratorTests
    {
        private readonly ServiceProvider services;

        public PdfGeneratorTests(ITestOutputHelper output)
        {
            var services = TestHelper.CreateDIContainer(output).AddTestCache();

            var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string>
            {
                { "pdfGenerator:url", "https://dev-pdf-generator.apps.clab.devops.gov.bc.ca/" },
                { "pdfGenerator:allowInvalidServerCertificate", "true" }
            }).Build();

            new Configuration().ConfigureServices(new EMBC.Utilities.Configuration.ConfigurationServices
            {
                Services = services,
                Environment = new HostingEnvironment { EnvironmentName = Environments.Development },
                Logger = output.BuildLogger(),
                Configuration = config
            });

            this.services = services.BuildServiceProvider(validateScopes: true);
        }

        [Fact(Skip = "Run when testing remote pdf generator")]
        public async Task GenerateLoad()
        {
            Func<string> template = () => $@"<!DOCTYPE html>
html>
head>
/head>
body>
   <header>
       <h1>Header</h1>
   </header>
   <main>
       <p>{DateTime.Now}</p>
   </main>
/body>
/html>";

            var tasks = Enumerable.Range(0, 50).Select(i =>
            {
                var generator = services.GetRequiredService<IPdfGenerator>();
                return generator.Generate(Encoding.UTF8.GetBytes(template()));
            });
            await Task.WhenAll(tasks.ToArray());
            //for (int i = 0; i < 50; i++)
            //{
            //    var generator = services.GetRequiredService<IPdfGenerator>();
            //    await generator.Generate(template());
            //}
        }
    }
}
