using System;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.Suppliers.API.Submissions.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EMBC.Suppliers.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly ILogger<SubmissionController> logger;

        public SubmissionController(ILogger<SubmissionController> logger)
        {
            this.logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<string>> Create(Submission submission)
        {
            await Task.CompletedTask;
            var id = GetShortId();
            var submissionJson = JsonSerializer.Serialize(submission);
            logger.LogDebug(submissionJson);

            return Ok(JsonSerializer.Serialize(new { submissionId = id }));
        }

        private static string GetShortId()
        {
            var crypto = new RNGCryptoServiceProvider();
            var bytes = new byte[4];
            crypto.GetBytes(bytes);
            return BitConverter.ToString(bytes).Replace("-", string.Empty);
        }
    }
}
