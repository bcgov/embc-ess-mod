using System;
using System.Threading.Tasks;
using Jasper;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public class SubmissionHandler : ISubmissionHandler
    {
        private readonly ISubmissionRepository submissionRepository;
        private readonly IMessagePublisher publisher;

        public SubmissionHandler(ISubmissionRepository submissionRepository, IMessagePublisher publisher)
        {
            this.submissionRepository = submissionRepository;
            this.publisher = publisher;
        }

        public async Task<string> Handle(PersistSupplierSubmissionCommand cmd)
        {
            if (cmd == null) throw new ArgumentNullException(nameof(cmd));
            var referenceNumber = await submissionRepository.SaveAsync(cmd.Submission);

            await publisher.Publish(new SubmissionSavedEvent(referenceNumber, cmd.Submission));

            return referenceNumber;
        }
    }
}
