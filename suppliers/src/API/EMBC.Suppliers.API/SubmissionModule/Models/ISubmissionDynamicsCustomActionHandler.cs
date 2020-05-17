using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.Models;

namespace EMBC.Suppliers.API.DynamicsModule.SubmissionModule
{
    public interface ISubmissionDynamicsCustomActionHandler
    {
        Task<string> Handle(SubmissionSavedEvent evt);
    }
}
