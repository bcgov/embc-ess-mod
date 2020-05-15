using System.Collections.Generic;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;

namespace EMBC.Suppliers.API.ConfigurationModule.Models
{
    public interface ICommunitiesListProvider
    {
        Task<IEnumerable<Community>> GetCommunitiesAsync(string stateProvinceCode, string countryCode);
    }
}
