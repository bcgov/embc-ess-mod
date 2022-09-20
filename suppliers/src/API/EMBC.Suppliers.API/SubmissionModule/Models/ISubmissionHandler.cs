using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public interface ISubmissionHandler
    {
        Task<string> Handle(PersistSupplierSubmissionCommand cmd);
    }
}
