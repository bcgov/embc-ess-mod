using System.Threading.Tasks;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public interface ISubmissionHandler
    {
        Task<string> Handle(PersistSupplierSubmissionCommand cmd);
    }
}
