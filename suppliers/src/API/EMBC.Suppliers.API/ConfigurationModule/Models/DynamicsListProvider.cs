using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;

namespace EMBC.Suppliers.API.ConfigurationModule.Models
{
    public class DynamicsListProvider :
        ICountriesListProvider,
        IStateProvincesListProvider,
        IJurisdictionsListProvider
    {
        private readonly IListsGateway listsGateway;

        public DynamicsListProvider(IListsGateway listsGateway)
        {
            this.listsGateway = listsGateway;
        }

        public async Task<IEnumerable<Country>> GetCountriesAsync()
        {
            var countries = await listsGateway.GetCountriesAsync();
            return countries.Select(c => new Country { Code = c.era_countrycode, Name = c.era_name });
        }

        public async Task<IEnumerable<Jurisdiction>> GetJurisdictionsAsync(string[] types, string stateProvinceCode, string countryCode)
        {
            var countries = await listsGateway.GetCountriesAsync();
            var country = countries.SingleOrDefault(c => c.era_countrycode == countryCode);
            if (country == null) return Array.Empty<Jurisdiction>();
            var stateProvinces = await listsGateway.GetStateProvincesAsync(country.era_countryid);
            var stateProvince = stateProvinces.SingleOrDefault(sp => sp.era_code == stateProvinceCode);
            if (stateProvince == null) return Array.Empty<Jurisdiction>();
            var jurisdictions = await listsGateway.GetJurisdictionsAsync(stateProvince.era_provinceterritoriesid);
            return jurisdictions
                .Where(j => !types.Any() || types.Any(t => t.Equals(j.era_type)))
                .Select(j => new Jurisdiction
                {
                    Code = j.era_jurisdictionid,
                    Name = j.era_jurisdictionname,
                    Type = j.era_type,
                    StateProvinceCode = stateProvinceCode,
                    CountryCode = countryCode
                });
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvincesAsync(string countryCode)
        {
            var countries = await listsGateway.GetCountriesAsync();
            var country = countries.SingleOrDefault(c => c.era_countrycode == countryCode);
            if (country == null) return Array.Empty<StateProvince>();
            var stateProvinces = await listsGateway.GetStateProvincesAsync(country.era_countryid);
            return stateProvinces.Select(sp => new StateProvince { Code = sp.era_code, Name = sp.era_name, CountryCode = countryCode });
        }
    }
}
