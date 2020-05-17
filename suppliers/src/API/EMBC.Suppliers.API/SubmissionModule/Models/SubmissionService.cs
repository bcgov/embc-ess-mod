using System.Threading.Tasks;
using EMBC.Suppliers.API.DynamicsModule.SubmissionModule;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public class SubmissionService : ISubmissionService
    {
        private readonly ISubmissionRepository submissionRepository;
        private readonly ISubmissionDynamicsCustomActionHandler submissionDynamicsCustomActionHandler;

        public SubmissionService(ISubmissionRepository submissionRepository, ISubmissionDynamicsCustomActionHandler submissionDynamicsCustomActionHandler)
        {
            this.submissionRepository = submissionRepository;
            this.submissionDynamicsCustomActionHandler = submissionDynamicsCustomActionHandler;
        }

        public async Task<string> Submit(Submission submission)
        {
            var referenceNumber = await submissionRepository.SaveAsync(submission);

            await submissionDynamicsCustomActionHandler.Submit(referenceNumber);

            return referenceNumber;
        }
    }
}
