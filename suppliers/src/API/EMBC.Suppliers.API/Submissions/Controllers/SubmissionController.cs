using System;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.Suppliers.API.Submissions.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EMBC.Suppliers.API.Controllers
{
    /// <summary>
    /// Handles suppliers receipt/invoice submissions
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly ILogger<SubmissionController> logger;

        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="logger"></param>
        public SubmissionController(ILogger<SubmissionController> logger)
        {
            this.logger = logger;
        }

        /// <summary>
        /// Post to create a new submission
        /// </summary>
        /// <param name="submission">Submission details</param>
        /// <returns>unique idenfifier of the new submission</returns>
        [HttpPost]
        public async Task<ActionResult<string>> Create(Submission submission)
        {
            await Task.CompletedTask;
            var id = GetShortId();
            var submissionJson = JsonSerializer.Serialize(submission);
            logger.LogDebug(submissionJson);

            return new JsonResult(new { submissionId = id });
        }

        private static string GetShortId()
        {
            using var crypto = new RNGCryptoServiceProvider();
            var bytes = new byte[4];
            crypto.GetBytes(bytes);
            return BitConverter.ToString(bytes).Replace("-", string.Empty, StringComparison.OrdinalIgnoreCase);
        }
    }
}
