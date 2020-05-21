using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public interface ICachedListsProvider
    {
        Task<IEnumerable<CountryEntity>> GetCountriesAsync();

        Task<IEnumerable<JurisdictionEntity>> GetJurisdictionsAsync();

        Task<IEnumerable<StateProvinceEntity>> GetStateProvincesAsync();

        Task<IEnumerable<SupportEntity>> GetSupportsAsync();

        Task SetCountriesAsync(IEnumerable<CountryEntity> countries);

        Task SetJurisdictionsAsync(IEnumerable<JurisdictionEntity> jurisdictions);

        Task SetStateProvincesAsync(IEnumerable<StateProvinceEntity> stateProvinces);

        Task SetSupportsAsync(IEnumerable<SupportEntity> supports);
    }
}
