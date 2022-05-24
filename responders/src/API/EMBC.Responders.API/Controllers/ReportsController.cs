using System;
using System.Security.Claims;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Reports;
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

        public ReportsController(IMessagingClient messagingClient)
        {
            this.messagingClient = messagingClient;
        }

        [HttpGet("evacuee")]
        public async Task<IActionResult> GetEvacueeReport(string? taskNumber, string? fileId, string? evacuatedFrom, string? evacuatedTo, string? timePeriod)
        {
            var userRole = Enum.Parse<MemberRole>(currentUserRole);
            var includePersonalInfo = userRole == MemberRole.Tier3 || userRole == MemberRole.Tier4;
            var result = await messagingClient.Send(new EvacueeReportQuery { TaskNumber = taskNumber, FileId = fileId, EvacuatedFrom = evacuatedFrom, EvacuatedTo = evacuatedTo, TimePeriod = timePeriod, IncludePersonalInfo = includePersonalInfo });

            return new FileContentResult(result.Content, result.ContentType);
        }

        [HttpGet("support")]
        public async Task<IActionResult> GetSupportReport(string? taskNumber, string? fileId, string? evacuatedFrom, string? evacuatedTo, string? timePeriod)
        {
            var result = await messagingClient.Send(new SupportReportQuery { TaskNumber = taskNumber, FileId = fileId, EvacuatedFrom = evacuatedFrom, EvacuatedTo = evacuatedTo, TimePeriod = timePeriod });

            return new FileContentResult(result.Content, result.ContentType);
        }
    }
}
