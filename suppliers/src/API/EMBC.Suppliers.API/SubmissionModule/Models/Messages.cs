using EMBC.Suppliers.API.SubmissionModule.ViewModels;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public class PersistSupplierSubmissionCommand
    {
        public PersistSupplierSubmissionCommand(Submission submission)
        {
            Submission = submission;
        }

        public Submission Submission { get; }
    }

    public class SubmissionSavedEvent
    {
        public SubmissionSavedEvent(string refrenceNumber, Submission submission)
        {
            ReferenceNumber = refrenceNumber;
            Submission = submission;
        }

        public string ReferenceNumber { get; }
        public Submission Submission { get; }
    }

    public class GetSupplierSubmissionCommand
    {
        public GetSupplierSubmissionCommand(string referenceNumber)
        {
            ReferenceNumber = referenceNumber;
        }

        public string ReferenceNumber { get; }
    }
}
