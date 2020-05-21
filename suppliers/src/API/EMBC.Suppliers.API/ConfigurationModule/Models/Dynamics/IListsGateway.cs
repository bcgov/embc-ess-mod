using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public interface IListsGateway
    {
        Task<IEnumerable<CountryEntity>> GetCountriesAsync();
        Task<IEnumerable> GetDistrictsAsync();
        Task<IEnumerable<JurisdictionEntity>> GetJurisdictionsAsync(string stateProvinceId);
        Task<IEnumerable> GetRegionsAsync();
        Task<IEnumerable<StateProvinceEntity>> GetStateProvincesAsync(string countryId);
        Task<IEnumerable<SupportEntity>> GetSupportsAsync();
    }
}