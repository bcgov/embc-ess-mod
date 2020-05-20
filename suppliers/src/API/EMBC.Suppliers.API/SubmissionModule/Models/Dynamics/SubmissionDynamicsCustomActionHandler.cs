using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Xrm.Tools.WebAPI;

namespace EMBC.Suppliers.API.SubmissionModule.Models.Dynamics
{
    public class SubmissionDynamicsCustomActionHandler : ISubmissionDynamicsCustomActionHandler
    {
        private readonly CRMWebAPI api;
        private readonly ILogger<SubmissionDynamicsCustomActionHandler> logger;

        public SubmissionDynamicsCustomActionHandler(CRMWebAPI api, ILogger<SubmissionDynamicsCustomActionHandler> logger)
        {
            this.api = api;
            this.logger = logger;
        }

        public async Task Handle(SubmissionSavedEvent evt)
        {
            if (evt == null) throw new ArgumentNullException(nameof(evt));

            var submission = new[] { evt.Submission }.MapSubmissions(evt.ReferenceNumber).Single();

            logger.LogDebug(JsonConvert.SerializeObject(submission));

            dynamic result = await api.ExecuteAction("era_SubmitUnauthInvoices", submission);

            if (!result.submissionFlag)
            {
                throw new Exception($"era_SubmitUnauthInvoices call failed: {result.message}");
            }
        }
    }
}
