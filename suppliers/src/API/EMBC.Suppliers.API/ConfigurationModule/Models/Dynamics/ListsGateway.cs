using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xrm.Tools.WebAPI;
using Xrm.Tools.WebAPI.Requests;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public class ListsGateway : IListsGateway
    {
        private readonly CRMWebAPI api;

        public ListsGateway(CRMWebAPI api)
        {
            this.api = api;
        }

        public async Task<IEnumerable<SupportEntity>> GetSupportsAsync()
        {
            var list = await api.GetList<SupportEntity>("era_supports", new CRMGetListOptions
            {
                Select = new[] { "era_name", "era_supportid" }
            });

            return list.List;
        }

        public async Task<IEnumerable<CountryEntity>> GetCountriesAsync()
        {
            var list = await api.GetList<CountryEntity>("era_countries", new CRMGetListOptions
            {
                Select = new[] { "era_countrycode", "era_countryid", "era_isocountrycode", "era_name" }
            });

            return list.List;
        }

        public async Task<IEnumerable<StateProvinceEntity>> GetStateProvincesAsync(string countryId)
        {
            var list = await api.GetList<StateProvinceEntity>("era_provinceterritorieses", new CRMGetListOptions
            {
                Select = new[] { "era_code", "era_name", "era_provinceterritoriesid", "_era_relatedcountry_value" },
                Filter = $"_era_relatedcountry_value eq {countryId}"
            });

            return list.List;
        }

        public async Task<IEnumerable> GetDistrictsAsync()
        {
            var list = await api.GetList("era_regionaldistricts", new CRMGetListOptions
            {
                Select = new[] { "era_regionaldistrictid", "era_districtname", "_era_embcregion_value" },
            });

            return list.List;
        }

        public async Task<IEnumerable<JurisdictionEntity>> GetJurisdictionsAsync(string stateProvinceId)
        {
            var list = await api.GetList<JurisdictionEntity>("era_jurisdictions", new CRMGetListOptions
            {
                Select = new[] { "era_jurisdictionid", "era_jurisdictionname", "era_type", "_era_relatedprovincestate_value" },
                Filter = $"_era_relatedprovincestate_value eq {stateProvinceId}"
            });

            return list.List;
        }

        public async Task<IEnumerable> GetRegionsAsync()
        {
            var list = await api.GetList("era_embcregions", new CRMGetListOptions
            {
                Select = new[] { "era_embcregionid", "era_location", "era_name", "era_code" }
            });

            return list.List;
        }
    }
}
