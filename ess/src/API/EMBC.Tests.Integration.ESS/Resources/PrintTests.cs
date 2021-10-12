using EMBC.ESS;
using EMBC.ESS.Resources.Cases;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Xunit.Abstractions;
using AutoMapper;
using EMBC.ESS.Resources.Suppliers;
using EMBC.ESS.Resources.Print.Supports;
using Xunit;
using System.Threading.Tasks;
using System.IO;
using Microsoft.Extensions.Hosting;
using EMBC.ESS.Utilities.PdfGenerator;
using EMBC.ESS.Managers.Submissions;
using EMBC.ESS.Shared.Contracts.Submissions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class PrintTests : WebAppTestBase
    {
        private readonly SubmissionsManager manager;

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
            manager = services.GetRequiredService<SubmissionsManager>();
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
            await File.WriteAllBytesAsync("./newSupportPdfFile.pdf", pdfs);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CreateMultipleSupportsPdfsWithoutSummary()
        {
            var supportsToPrint = new SupportsToPrint() { SupportsIds = new string[] { "D2001127", "D2001131", "D2001132", "D2001328", "D2001335", "D2001352", "D2001353", "D2001356", "D2001357", }, AddSummary = false, CurrentLoggedInUser = "Testing U." };
            var supportsService = new SupportsService(caseRepository, mapper, supplierRepository, env, pdfGenerator);
            var pdfs = await supportsService.GetReferralPdfsAsync(supportsToPrint);
            await File.WriteAllBytesAsync("./newSupportPdfsFile.pdf", pdfs);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CreateSupportPdfWithSummary()
        {
            var supportsToPrint = new SupportsToPrint() { SupportsIds = new string[] { "D2001353" }, AddSummary = true, CurrentLoggedInUser = "Testing U." };
            var supportsService = new SupportsService(caseRepository, mapper, supplierRepository, env, pdfGenerator);
            var pdfs = await supportsService.GetReferralPdfsAsync(supportsToPrint);
            await File.WriteAllBytesAsync("./newSupportPdfWithSummaryFile.pdf", pdfs);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CreateMultipleSupportsPdfsWithSummary()
        {
            var supportsToPrint = new SupportsToPrint() { SupportsIds = new string[] { "D2001127", "D2001131", "D2001132", "D2001328", "D2001335", "D2001352", "D2001353", "D2001356", "D2001357", }, AddSummary = true, CurrentLoggedInUser = "Testing U." };
            var supportsService = new SupportsService(caseRepository, mapper, supplierRepository, env, pdfGenerator);
            var pdfs = await supportsService.GetReferralPdfsAsync(supportsToPrint);
            await File.WriteAllBytesAsync("./newSupportPdfsWithSummaryFile.pdf", pdfs);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CreateReferralPrintAsync()
        {
            var referralPrint = new SaveSupportReferralPrintCommand() { FileId = "101010", SupportIds = new string[] { "D2001358", "D2001357" } };
            var referralPrintId = (await caseRepository.ManageCase(referralPrint)).Id;
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task ReadReferralPrint()
        {
            var referralPrintQuery = new ReferralPrintQuery() { ReferralPrintId = "fb9e0fea-ea63-4cb1-9ab6-04fac7d7dda4" };
            var referralPrintId = (await caseRepository.QueryCase(referralPrintQuery));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task SubmitPrintRequest()
        {
            var pdf = await manager.Handle(new PrintRequestCommand { PrintRequestId = "fb9e0fea-ea63-4cb1-9ab6-04fac7d7dda4" });
            await File.WriteAllBytesAsync("./newTestPrintRequestFile.pdf", pdf);
        }
    }
}
