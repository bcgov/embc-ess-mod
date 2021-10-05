using EMBC.ESS;
using EMBC.ESS.Resources.Cases;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Xunit.Abstractions;
using AutoMapper;
using EMBC.ESS.Resources.Suppliers;
using EMBC.ESS.Print.Supports;
using Xunit;
using System.Threading.Tasks;
using System.IO;
using Microsoft.Extensions.Hosting;
using EMBC.ESS.Utilities.PdfGenerator;

namespace EMBC.Tests.Integration.ESS.Print
{
    public class PrintTests : WebAppTestBase
    {
        private readonly ICaseRepository caseRepository;
        private readonly ISupplierRepository supplierRepository;

        private readonly MapperConfiguration mapperConfig;
        private IMapper mapper => mapperConfig.CreateMapper();

        private readonly IHostEnvironment env;

        private readonly IPdfGenerator pdfGenerator;

        public PrintTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            pdfGenerator = services.GetRequiredService<IPdfGenerator>();
            env = services.GetRequiredService<IHostEnvironment>();
            caseRepository = services.GetRequiredService<ICaseRepository>();
            supplierRepository = services.GetRequiredService<ISupplierRepository>();
            mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(Startup));
            });
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CreateSupportPdfWithoutSummary()
        {
            var supportsToPrint = new SupportsToPrint() { SupportsIds = new string[] { "D2001353" }, AddSummary = false, CurrentLoggedInUser = "Testing U." };
            var supportsService = new SupportsService(caseRepository, mapper, supplierRepository, env, pdfGenerator);
            var pdfs = await supportsService.GetReferralPdfsAsync(supportsToPrint);
            await File.WriteAllBytesAsync("./newPdfFile.pdf", pdfs);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CreateMultipleSupportsPdfsWithoutSummary()
        {
            var supportsToPrint = new SupportsToPrint() { SupportsIds = new string[] { "D2001127", "D2001131", "D2001132", "D2001328", "D2001335", "D2001352", "D2001353", "D2001356", "D2001357", }, AddSummary = false, CurrentLoggedInUser = "Testing U." };
            var supportsService = new SupportsService(caseRepository, mapper, supplierRepository, env, pdfGenerator);
            var pdfs = await supportsService.GetReferralPdfsAsync(supportsToPrint);
            await File.WriteAllBytesAsync("./newPdfFile.pdf", pdfs);
        }
    }
}
