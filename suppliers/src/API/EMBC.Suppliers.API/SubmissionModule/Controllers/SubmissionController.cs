// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.Models;
using EMBC.Suppliers.API.SubmissionModule.Models;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Jasper;
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
        private readonly ICommandBus commandBus;
        private readonly IHostEnvironment env;
        private readonly ConfigHealthProvider healthcheck;

        public SubmissionController(ICommandBus commandBus, IHostEnvironment env, ConfigHealthProvider healthcheck)
        {
            this.commandBus = commandBus;
            this.env = env;
            this.healthcheck = healthcheck;
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
                // If site is in maintenance mode, return special message
                var maintResult = healthcheck.GetMaintenanceState();

                if (maintResult.SiteDown)
                {
                    Response.StatusCode = 503;

                    return new JsonResult(new { title = "The site is undergoing scheduled maintenance. Please try submitting later." });
                }

                // Submit supplier form
                var referenceNumber = await commandBus.Invoke<string>(new PersistSupplierSubmissionCommand(submission));

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
