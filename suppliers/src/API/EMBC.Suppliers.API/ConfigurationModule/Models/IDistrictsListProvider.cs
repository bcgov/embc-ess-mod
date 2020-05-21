using System.Collections.Generic;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;

namespace EMBC.Suppliers.API.ConfigurationModule.Models
{
    public interface IDistrictsListProvider
    {
        Task<IEnumerable<District>> GetDistrictsAsync(string stateProvinceCode, string countryCode);
    }
}
