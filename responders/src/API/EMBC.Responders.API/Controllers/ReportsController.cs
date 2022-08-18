using System;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Reports;
using EMBC.Responders.API.Helpers;
using EMBC.Utilities.Messaging;
using Grpc.Core;
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
        private ErrorParser errorParser;

        public ReportsController(IMessagingClient messagingClient)
        {
            this.messagingClient = messagingClient;
            this.errorParser = new ErrorParser();
        }

        [HttpGet("evacuee")]
        public async Task<IActionResult> GetEvacueeReport(string? taskNumber, string? fileId, string? evacuatedFrom, string? evacuatedTo, string? from, string? to)
        {
            try
            {
                var userRole = Enum.Parse<MemberRole>(currentUserRole);
                var includePersonalInfo = userRole == MemberRole.Tier3 || userRole == MemberRole.Tier4;
                var dateFrom = string.IsNullOrEmpty(from) ? (DateTime?)null : DateTime.Parse(from);
                var dateTo = string.IsNullOrEmpty(to) ? (DateTime?)null : DateTime.Parse(to);
                var result = await messagingClient.Send(new EvacueeReportQuery { TaskNumber = taskNumber, FileId = fileId, EvacuatedFrom = evacuatedFrom, EvacuatedTo = evacuatedTo, From = dateFrom, To = dateTo, IncludePersonalInfo = includePersonalInfo });

                return new FileContentResult(result.Content, result.ContentType);
            }
            catch (ServerException e)
            {
                return errorParser.Parse(e);
            }
        }

        [HttpGet("support")]
        public async Task<IActionResult> GetSupportReport(string? taskNumber, string? fileId, string? evacuatedFrom, string? evacuatedTo, string? from, string? to)
        {
            var dateFrom = string.IsNullOrEmpty(from) ? (DateTime?)null : DateTime.Parse(from);
            var dateTo = string.IsNullOrEmpty(to) ? (DateTime?)null : DateTime.Parse(to);
            var result = await messagingClient.Send(new SupportReportQuery { TaskNumber = taskNumber, FileId = fileId, EvacuatedFrom = evacuatedFrom, EvacuatedTo = evacuatedTo, From = dateFrom, To = dateTo });

            return new FileContentResult(result.Content, result.ContentType);
        }
    }
}
