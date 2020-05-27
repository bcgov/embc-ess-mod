using System.ComponentModel.DataAnnotations;
using System.Net;
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
            try
            {
                var referenceNumber = await commandBus.Invoke<string>(new PersistSupplierSubmissionCommand(submission));

                return new JsonResult(new { submissionId = referenceNumber, referenceNumber });
            }
            catch (ValidationException e)
            {
                //Temporarily hand validation exceptions to the client - need to remove when Dynamics handler is async from submission
                var referenceNumber = e.Value?.ToString();
                var pd = new ProblemDetails()
                {
                    Status = (int)HttpStatusCode.BadRequest,
                    Detail = e.Message
                };
                pd.Extensions.Add("submissionReferenceNumber", referenceNumber);
                pd.Extensions.Add("traceId", HttpContext.TraceIdentifier);
                throw new HttpResponseException($"'{referenceNumber}' validation error: {e.Message}", e)
                {
                    Status = (int)HttpStatusCode.BadRequest,
                    Value = pd
                };
            }
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
