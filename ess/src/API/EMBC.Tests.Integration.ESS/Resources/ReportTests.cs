using EMBC.ESS.Resources.Reports;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class ReportTests : DynamicsWebAppTestBase
    {
        private readonly IReportRepository reportRepository;

        public ReportTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            reportRepository = Services.GetRequiredService<IReportRepository>();
        }

        [Fact]
        public async Task EvacueeReportQuery()
        {
            var evacueeQuery = new ReportQuery
            {
                //TaskNumber = "1234",
                //FileId = "101010",
                //EvacuatedFrom = "9e6adfaf-9f97-ea11-b813-005056830319",
                //EvacuatedTo = "9e6adfaf-9f97-ea11-b813-005056830319",
                //StartDate = DateTime.UtcNow.AddDays(-1),
                //EndDate = DateTime.UtcNow,
            };

            var results = (await reportRepository.QueryEvacuee(evacueeQuery)).Items;
            results.ShouldNotBeEmpty();
        }
    }
}
