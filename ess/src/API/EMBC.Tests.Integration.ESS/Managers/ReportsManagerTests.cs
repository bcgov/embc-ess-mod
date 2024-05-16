using System;
using EMBC.ESS.Shared.Contracts.Reports;
using EMBC.Utilities.Messaging;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Managers
{
    public class ReportsManagerTests : WebAppTestBase
    {
        private readonly IMessagingClient messagingClient;

        public ReportsManagerTests(ITestOutputHelper output, WebAppTestFixture fixture) : base(output, fixture)
        {
            messagingClient = Services.GetRequiredService<IMessagingClient>();
        }

        [Fact]
        public async Task CanGetEvacueeReport()
        {
            var reportId = await messagingClient.Send(new RequestEvacueeReportCommand
            {
                //TaskNumber = "1234",
                //FileId = "101010",
                //EvacuatedFrom = "9e6adfaf-9f97-ea11-b813-005056830319",
                //EvacuatedTo = "9e6adfaf-9f97-ea11-b813-005056830319",
                //IncludePersonalInfo = false,
                From = DateTime.UtcNow.AddDays(-30),
                To = DateTime.UtcNow,
            });

            reportId.ShouldNotBeEmpty();

            ReportQueryResult result = null;
            for (int attempt = 0; attempt < 30; attempt++)
            {
                result = await messagingClient.Send(new EvacueeReportQuery { ReportRequestId = reportId });
                if (!result.Ready)
                {
                    await Task.Delay(1000);
                }
            }
            result.ShouldNotBeNull();
            result.Ready.ShouldBeTrue();
            result.Content.ShouldNotBeNull().ShouldNotBeEmpty();
            result.ContentType.ShouldBe("text/csv");
        }

        [Fact]
        public async Task CanGetSupportReport()
        {
            var reportId = await messagingClient.Send(new RequestSupportReportCommand

            {
                TaskNumber = "1234",
                //FileId = "101010",
                //EvacuatedFrom = "9e6adfaf-9f97-ea11-b813-005056830319",
                //EvacuatedTo = "9e6adfaf-9f97-ea11-b813-005056830319",
            });

            reportId.ShouldNotBeEmpty();

            ReportQueryResult result = null;
            for (int attempt = 0; attempt < 30; attempt++)
            {
                result = await messagingClient.Send(new EvacueeReportQuery { ReportRequestId = reportId });
                if (!result.Ready)
                {
                    await Task.Delay(1000);
                }
            }
            result.ShouldNotBeNull();
            result.Ready.ShouldBeTrue();
            result.Content.ShouldNotBeNull().ShouldNotBeEmpty();
            result.ContentType.ShouldBe("text/csv");
        }
    }
}
