using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Managers.Reports;
using EMBC.ESS.Shared.Contracts.Reports;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class ReportsTests : WebAppTestBase
    {
        private readonly ReportsManager reportsManager;

        public ReportsTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            reportsManager = services.GetRequiredService<ReportsManager>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacueeReport()
        {
            var res = await reportsManager.Handle(new EvacueeReportQuery
            {
                TaskNumber = TestData.ActiveTaskId,
                //FileId = "101010",
                //EvacuatedFrom = "9e6adfaf-9f97-ea11-b813-005056830319",
                //EvacuatedTo = "9e6adfaf-9f97-ea11-b813-005056830319",
                IncludePersonalInfo = false,
            });

            res.Content.ShouldNotBeEmpty();
            res.ContentType.ShouldBe("text/csv");
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetSupportReport()
        {
            var res = await reportsManager.Handle(new SupportReportQuery
            {
                TaskNumber = TestData.ActiveTaskId,
                //FileId = "101010",
                //EvacuatedFrom = "9e6adfaf-9f97-ea11-b813-005056830319",
                //EvacuatedTo = "9e6adfaf-9f97-ea11-b813-005056830319",
            });

            res.Content.ShouldNotBeEmpty();
            res.ContentType.ShouldBe("text/csv");
        }
    }
}
