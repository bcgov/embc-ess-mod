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
                TaskNumber = "1234",
                //FileId = "101010",
                //EvacuatedFrom = "9e6adfaf-9f97-ea11-b813-005056830319",
                //EvacuatedTo = "9e6adfaf-9f97-ea11-b813-005056830319",
                //IncludePersonalInfo = false,
                //From = DateTime.UtcNow.AddDays(-1),
                //To = DateTime.UtcNow,
            });

            reportId.ShouldNotBeEmpty();

            var success = false;
            for (int attempt = 0; attempt < 30; attempt++)
            {
                try
                {
                    var report = await messagingClient.Send(new EvacueeReportQuery { ReportRequestId = reportId });
                    report.ShouldNotBeNull().Content.ShouldNotBeEmpty();
                    report.ContentType.ShouldBe("text/csv");
                    success = true;

                    break;
                }
                catch (ServerException e)
                {
                    output.WriteLine(e.Message);
                    await Task.Delay(1000);
                }
            }
            success.ShouldBeTrue();
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
            var success = false;
            for (int attempt = 0; attempt < 30; attempt++)
            {
                try
                {
                    var report = await messagingClient.Send(new SupportReportQuery { ReportRequestId = reportId });
                    report.ShouldNotBeNull().Content.ShouldNotBeEmpty();
                    report.ContentType.ShouldBe("text/csv");
                    success = true;

                    break;
                }
                catch (ServerException e)
                {
                    output.WriteLine(e.Message);
                    await Task.Delay(1000);
                }
            }
            success.ShouldBeTrue();
        }
    }
}
