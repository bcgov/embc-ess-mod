using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.Models;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Jasper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace EMBC.Suppliers.API.SubmissionModule.Controllers
{
    /// <summary>
    /// Handles suppliers receipt/invoice submissions
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly ICommandBus commandBus;
        private readonly IHostEnvironment env;

        public SubmissionController(ICommandBus commandBus, IHostEnvironment env)
        {
            this.commandBus = commandBus;
            this.env = env;
        }

        /// <summary>
        /// Post to create a new submission
        /// </summary>
        /// <param name="submission">Submission details</param>
        /// <returns>New submission's reference number</returns>
        [HttpPost]
        public async Task<ActionResult<string>> Create(Submission submission)
        {
            var referenceNumber = await commandBus.Invoke<string>(new PersistSupplierSubmissionCommand(submission));

            return new JsonResult(new { submissionId = referenceNumber, referenceNumber });
        }

        /// <summary>
        /// GET to return a submission by reference number
        /// </summary>
        /// <param name="referenceNumber">The reference number to search</param>
        /// <returns>Submission object</returns>
        [HttpGet]
        public async Task<ActionResult<Submission>> Get(string referenceNumber)
        {
            if (env.IsProduction()) return NotFound(new { referenceNumber });

            var submission = await commandBus.Invoke<Submission>(new GetSupplierSubmissionCommand(referenceNumber));
            if (submission == null) return NotFound(new { referenceNumber });
            return new JsonResult(submission);
        }
    }
}
