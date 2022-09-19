using System;
using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.Models.Dynamics;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public class SubmissionHandler : ISubmissionHandler
    {
        private readonly ISubmissionDynamicsCustomActionHandler submissionDynamicsCustomActionHandler;
        private readonly IReferenceNumberGenerator referenceNumberGenerator;

        public SubmissionHandler(ISubmissionDynamicsCustomActionHandler submissionDynamicsCustomActionHandler, IReferenceNumberGenerator referenceNumberGenerator)
        {
            this.submissionDynamicsCustomActionHandler = submissionDynamicsCustomActionHandler;
            this.referenceNumberGenerator = referenceNumberGenerator;
        }

        public async Task<string> Handle(PersistSupplierSubmissionCommand cmd)
        {
            if (cmd == null) throw new ArgumentNullException(nameof(cmd));
            var referenceNumber = referenceNumberGenerator.CreateNew();

            // Temporary submit to Dynamics before the end of the API call
            // await publisher.Publish(new SubmissionSavedEvent(referenceNumber, cmd.Submission));
            await submissionDynamicsCustomActionHandler.Handle(new SubmissionSavedEvent(referenceNumber, cmd.Submission));

            return referenceNumber;
        }
    }
}
