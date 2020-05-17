using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public interface ISubmissionService
    {
        Task<string> Submit(Submission submission);
    }
}