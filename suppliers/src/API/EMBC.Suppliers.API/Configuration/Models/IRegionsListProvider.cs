using System.Collections.Generic;
using System.Threading.Tasks;
using EMBC.Suppliers.API.Configuration.ViewModels;

namespace EMBC.Suppliers.API.Configuration.Models
{
    public interface IRegionsListProvider
    {
        Task<IEnumerable<Region>> GetRegionsAsync(string stateProvinceCode, string countryCode);
    }
}
