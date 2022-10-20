using System;
using System.Security.Claims;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Reports;
using EMBC.Responders.API.Helpers;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IMessagingClient messagingClient;

        private string currentUserRole => User.FindFirstValue("user_role");
        private readonly ErrorParser errorParser;

        public ReportsController(IMessagingClient messagingClient)
        {
            this.messagingClient = messagingClient;
            this.errorParser = new ErrorParser();
        }

        [HttpPost("evacuee")]
        public async Task<string?> CreateEvacueeReport(string? taskNumber, string? fileId, string? evacuatedFrom, string? evacuatedTo, DateTime? from, DateTime? to)
        {
            var userRole = Enum.Parse<MemberRole>(currentUserRole);
            var includePersonalInfo = userRole == MemberRole.Tier3 || userRole == MemberRole.Tier4;

            var requestId = await messagingClient.Send(new RequestEvacueeReportCommand
            {
                TaskNumber = taskNumber,
                FileId = fileId,
                EvacuatedFrom = evacuatedFrom,
                EvacuatedTo = evacuatedTo,
                From = from,
                To = to,
                IncludePersonalInfo = includePersonalInfo
            });

            return requestId;
        }

        [HttpGet("evacuee")]
        public async Task<IActionResult> GetEvacueeReport(string reportRequestId)
        {
            try
            {
                var report = await messagingClient.Send(new EvacueeReportQuery { ReportRequestId = reportRequestId });

                return new FileContentResult(report.Content, report.ContentType);
            }
            catch (Exception e)
            {
                return errorParser.Parse(e);
            }
        }

        [HttpPost("support")]
        public async Task<string?> CreateSupportReport(string? taskNumber, string? fileId, string? evacuatedFrom, string? evacuatedTo, DateTime? from, DateTime? to)
        {
            var requestId = await messagingClient.Send(new RequestSupportReportCommand
            {
                TaskNumber = taskNumber,
                FileId = fileId,
                EvacuatedFrom = evacuatedFrom,
                EvacuatedTo = evacuatedTo,
                From = from,
                To = to
            });

            return requestId;
        }

        [HttpGet("support")]
        public async Task<IActionResult> GetSupportReport(string reportRequestId)
        {
            try
            {
                var report = await messagingClient.Send(new SupportReportQuery { ReportRequestId = reportRequestId });

                return new FileContentResult(report.Content, report.ContentType);
            }
            catch (Exception e)
            {
                return errorParser.Parse(e);
            }
        }
    }
}
