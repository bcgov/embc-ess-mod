using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.Models;
using EMBC.Suppliers.API.Services;
using EMBC.Suppliers.API.SubmissionModule.Models;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace EMBC.Suppliers.API.SubmissionModule.Controllers
{
    /// <summary>
    /// Handles suppliers receipt/invoice submissions
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class SubmissionController : ControllerBase
    {
        private readonly ISubmissionHandler handler;
        private readonly IHostEnvironment env;
        private readonly ConfigHealthProvider healthcheck;
        private readonly ICaptchaVerificationService captchaVerificationService;

        public SubmissionController(ISubmissionHandler handler, IHostEnvironment env, ConfigHealthProvider healthcheck, ICaptchaVerificationService captchaVerificationService)
        {
            this.handler = handler;
            this.env = env;
            this.healthcheck = healthcheck;
            this.captchaVerificationService = captchaVerificationService;
        }

        /// <summary>
        /// Post to create a new submission
        /// </summary>
        /// <param name="submission">Submission details</param>
        /// <param name="ct">cancellation token</param>
        /// <returns>New submission's reference number</returns>
        [HttpPost]
        public async Task<ActionResult<string>> Create(Submission submission, CancellationToken ct)
        {
            try
            {
                var isValid = await captchaVerificationService.VerifyAsync(submission.Captcha, ct);

                if (!isValid)
                {
                    return BadRequest(new ProblemDetails
                    {
                        Status = (int)HttpStatusCode.BadRequest,
                        Title = "Invalid captcha",
                    });
                }

                // If site is in maintenance mode, return special message
                var maintResult = healthcheck.GetMaintenanceState();

                if (maintResult.SiteDown)
                {
                    Response.StatusCode = 503;

                    return new JsonResult(new { title = "The site is undergoing scheduled maintenance. Please try submitting later." });
                }

                // Submit supplier form
                var referenceNumber = await handler.Handle(new PersistSupplierSubmissionCommand(submission));

                return new JsonResult(new { submissionId = referenceNumber, referenceNumber });
            }
            catch (ValidationException e)
            {
                // Temporarily hand validation exceptions to the client - need to remove when
                // Dynamics handler is async from submission
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
    }
}
