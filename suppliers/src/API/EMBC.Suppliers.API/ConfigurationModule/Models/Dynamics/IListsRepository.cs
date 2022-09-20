using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public interface IListsRepository
    {
        Task<IEnumerable<CountryEntity>> GetCountriesAsync();
        Task<IEnumerable<JurisdictionEntity>> GetJurisdictionsAsync();
        Task<IEnumerable<StateProvinceEntity>> GetStateProvincesAsync();
        Task<IEnumerable<SupportEntity>> GetSupportsAsync();
    }
}
