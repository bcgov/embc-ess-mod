using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.Models;

namespace EMBC.Suppliers.API.SubmissionModule.Models.Dynamics
{
    public interface ISubmissionDynamicsCustomActionHandler
    {
        Task Handle(SubmissionSavedEvent evt);
    }
}
