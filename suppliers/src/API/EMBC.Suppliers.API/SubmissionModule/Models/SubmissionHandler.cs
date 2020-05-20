using System;
using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.Models.Dynamics;
using Jasper;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public class SubmissionHandler : ISubmissionHandler
    {
        private readonly ISubmissionRepository submissionRepository;
        private readonly IMessagePublisher publisher;
        private readonly ISubmissionDynamicsCustomActionHandler submissionDynamicsCustomActionHandler;

        public SubmissionHandler(ISubmissionRepository submissionRepository, IMessagePublisher publisher, ISubmissionDynamicsCustomActionHandler submissionDynamicsCustomActionHandler)
        {
            this.submissionRepository = submissionRepository;
            this.publisher = publisher;
            this.submissionDynamicsCustomActionHandler = submissionDynamicsCustomActionHandler;
        }

        public async Task<string> Handle(PersistSupplierSubmissionCommand cmd)
        {
            if (cmd == null) throw new ArgumentNullException(nameof(cmd));
            var referenceNumber = await submissionRepository.SaveAsync(cmd.Submission);

            //Temporary submit to Dynamics before the end of the API call
            //await publisher.Publish(new SubmissionSavedEvent(referenceNumber, cmd.Submission));
            await submissionDynamicsCustomActionHandler.Handle(new SubmissionSavedEvent(referenceNumber, cmd.Submission));

            return referenceNumber;
        }
    }
}
