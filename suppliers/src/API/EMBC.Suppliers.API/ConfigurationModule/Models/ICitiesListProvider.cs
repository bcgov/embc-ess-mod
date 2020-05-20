using System.Collections.Generic;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;

namespace EMBC.Suppliers.API.ConfigurationModule.Models
{
    public interface ICitiesListProvider
    {
        Task<IEnumerable<City>> GetCitiesAsync(string stateProvinceCode, string countryCode);
    }
}
