using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Managers.Admin;
using EMBC.ESS.Managers.Metadata;
using EMBC.ESS.Managers.Reports;
using EMBC.ESS.Shared.Contracts.Metadata;
using EMBC.ESS.Shared.Contracts.Reports;
using EMBC.ESS.Shared.Contracts.Suppliers;
using EMBC.ESS.Shared.Contracts.Team;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Reports
{
    public class ReportsTests : WebAppTestBase
    {
        private readonly ReportsManager reportsManager;

        public ReportsTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            reportsManager = services.GetRequiredService<ReportsManager>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacueeReport()
        {
            var res = await reportsManager.Handle(new EvacueeReportQuery
            {
                //TaskNumber = "UNIT-TEST-ACTIVE-TASK",
                //FileId = "101010",
                //EvacuatedFrom = "9e6adfaf-9f97-ea11-b813-005056830319",
                //EvacuatedTo = "9e6adfaf-9f97-ea11-b813-005056830319",
                IncludePersonalInfo = false,
            });

            res.EvacueeReport.ShouldBeOfType(typeof(string));
            res.EvacueeReport.ShouldContain(",");
        }
    }
}
