using System.Threading.Tasks;

namespace EMBC.Suppliers.API.DynamicsModule.SubmissionModule
{
    public interface ISubmissionDynamicsCustomActionHandler
    {
        Task<string> Submit(string referenceNumber);
    }
}
