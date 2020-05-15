using System.Collections.Generic;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;

namespace EMBC.Suppliers.API.ConfigurationModule.Models
{
    public interface ICountriesListProvider
    {
        Task<IEnumerable<Country>> GetCountriesAsync();
    }
}
