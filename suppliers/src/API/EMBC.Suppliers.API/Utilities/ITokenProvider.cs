using System.Threading.Tasks;

namespace EMBC.Suppliers.API.DynamicsModule
{
    public interface ITokenProvider
    {
        Task<string> AcquireToken();
    }
}
