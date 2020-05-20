using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.Models;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Jasper;
using Microsoft.AspNetCore.Mvc;

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

        public SubmissionController(ICommandBus commandBus)
        {
            this.commandBus = commandBus;
        }

        /// <summary>
        /// Post to create a new submission
        /// </summary>
        /// <param name="submission">Submission details</param>
        /// <returns>New submission's reference number</returns>
        [HttpPost]
        public async Task<ActionResult<string>> Create(Submission submission)
        {
            var id = await commandBus.Invoke<string>(new PersistSupplierSubmissionCommand(submission));

            return new JsonResult(new { submissionId = id });
        }
    }
}
