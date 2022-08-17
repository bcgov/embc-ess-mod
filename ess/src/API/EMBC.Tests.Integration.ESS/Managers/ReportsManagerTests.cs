using System.Threading.Tasks;
using EMBC.ESS.Managers.Reports;
using EMBC.ESS.Shared.Contracts.Reports;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Managers
{
    public class ReportsManagerTests : WebAppTestBase
    {
        private readonly ReportsManager reportsManager;

        public ReportsManagerTests(ITestOutputHelper output, WebAppTestFixture fixture) : base(output, fixture)
        {
            reportsManager = Services.GetRequiredService<ReportsManager>();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanGetEvacueeReport()
        {
            var res = await reportsManager.Handle(new EvacueeReportQuery
            {
                TaskNumber = "1234",
                //FileId = "101010",
                //EvacuatedFrom = "9e6adfaf-9f97-ea11-b813-005056830319",
                //EvacuatedTo = "9e6adfaf-9f97-ea11-b813-005056830319",
                IncludePersonalInfo = false,
                //From = DateTime.UtcNow.AddDays(-1),
                //To = DateTime.UtcNow,
            });

            res.Content.ShouldNotBeEmpty();
            res.ContentType.ShouldBe("text/csv");
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanGetSupportReport()
        {
            var res = await reportsManager.Handle(new SupportReportQuery
            {
                TaskNumber = "1234",
                //FileId = "101010",
                //EvacuatedFrom = "9e6adfaf-9f97-ea11-b813-005056830319",
                //EvacuatedTo = "9e6adfaf-9f97-ea11-b813-005056830319",
            });

            res.Content.ShouldNotBeEmpty();
            res.ContentType.ShouldBe("text/csv");
        }
    }
}
