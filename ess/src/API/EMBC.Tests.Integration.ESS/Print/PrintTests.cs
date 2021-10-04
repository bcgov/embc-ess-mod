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

namespace EMBC.Tests.Integration.ESS.Print
{
    public class PrintTests : WebAppTestBase
    {
        private readonly ICaseRepository caseRepository;
        private readonly ISupplierRepository supplierRepository;

        private readonly MapperConfiguration mapperConfig;
        private IMapper mapper => mapperConfig.CreateMapper();

        private readonly IHostEnvironment env;

        public PrintTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            env = services.GetRequiredService<IHostEnvironment>();
            caseRepository = services.GetRequiredService<ICaseRepository>();
            supplierRepository = services.GetRequiredService<ISupplierRepository>();
            mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(Startup));
            });
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CreateSupportPdfsWithoutSummary()
        {
            var supportsToPrint = new SupportsToPrint() { SupportsIds = new string[] { "D2001131", "D2001328" }, AddSummary = false };
            var supportsService = new SupportsService(caseRepository, mapper, supplierRepository, env);
            var pdfs = await supportsService.GetReferralPdfsAsync(supportsToPrint);
            await File.WriteAllBytesAsync("./newPdfFile.pdf", pdfs);
        }
    }
}
