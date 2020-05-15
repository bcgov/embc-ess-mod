using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.Models;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EMBC.Suppliers.API.SubmissionModule.Controllers
{
    /// <summary>
    /// Handles suppliers receipt/invoice submissions
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly ILogger<SubmissionController> logger;
        private readonly ISubmissionRepository submissionRepository;

        public SubmissionController(ILogger<SubmissionController> logger, ISubmissionRepository submissionRepository)
        {
            this.logger = logger;
            this.submissionRepository = submissionRepository;
        }

        /// <summary>
        /// Post to create a new submission
        /// </summary>
        /// <param name="submission">Submission details</param>
        /// <returns>New submission's reference number</returns>
        [HttpPost]
        public async Task<ActionResult<string>> Create(Submission submission)
        {
            var id = await submissionRepository.SaveAsync(submission);

            return new JsonResult(new { submissionId = id });
        }
    }
}
