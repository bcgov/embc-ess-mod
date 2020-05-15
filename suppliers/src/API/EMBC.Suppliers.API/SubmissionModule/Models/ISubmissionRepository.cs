using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public interface ISubmissionRepository
    {
        Task<string> Submit(Submission submission);
    }
}
