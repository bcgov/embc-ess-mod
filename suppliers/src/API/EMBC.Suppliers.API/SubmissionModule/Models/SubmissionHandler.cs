using System;
using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.Models.Dynamics;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public class SubmissionHandler : ISubmissionHandler
    {
        private readonly ISubmissionRepository submissionRepository;
        private readonly ISubmissionDynamicsCustomActionHandler submissionDynamicsCustomActionHandler;

        public SubmissionHandler(ISubmissionRepository submissionRepository, ISubmissionDynamicsCustomActionHandler submissionDynamicsCustomActionHandler)
        {
            this.submissionRepository = submissionRepository;
            this.submissionDynamicsCustomActionHandler = submissionDynamicsCustomActionHandler;
        }

        public async Task<string> Handle(PersistSupplierSubmissionCommand cmd)
        {
            if (cmd == null) throw new ArgumentNullException(nameof(cmd));
            var referenceNumber = await submissionRepository.SaveAsync(cmd.Submission);

            // Temporary submit to Dynamics before the end of the API call
            // await publisher.Publish(new SubmissionSavedEvent(referenceNumber, cmd.Submission));
            await submissionDynamicsCustomActionHandler.Handle(new SubmissionSavedEvent(referenceNumber, cmd.Submission));

            return referenceNumber;
        }

        public async Task<Submission> Handle(GetSupplierSubmissionCommand cmd)
        {
            if (cmd is null) throw new ArgumentNullException(nameof(cmd));

            var submission = await submissionRepository.GetAsync(cmd.ReferenceNumber);

            return submission;
        }
    }
}
