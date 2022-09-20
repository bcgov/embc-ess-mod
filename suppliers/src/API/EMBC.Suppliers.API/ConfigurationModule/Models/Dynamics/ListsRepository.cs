using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public class ListsRepository : IListsRepository
    {
        private ICache cache;
        private IListsGateway listsGateway;

        public ListsRepository(ICache cache, IListsGateway listsGateway)
        {
            this.cache = cache;
            this.listsGateway = listsGateway;
        }

        public async Task<IEnumerable<CountryEntity>> GetCountriesAsync()
        {
            return await cache.GetOrSet(
                "countries",
                async () => (await listsGateway.GetCountriesAsync()),
                TimeSpan.FromMinutes(15));
        }

        public async Task<IEnumerable<JurisdictionEntity>> GetJurisdictionsAsync()
        {
            return await cache.GetOrSet(
                "jurisdictions",
                async () => (await listsGateway.GetJurisdictionsAsync()),
                TimeSpan.FromMinutes(15));
        }

        public async Task<IEnumerable<StateProvinceEntity>> GetStateProvincesAsync()
        {
            return await cache.GetOrSet(
                "stateprovinces",
                async () => (await listsGateway.GetStateProvincesAsync()),
                TimeSpan.FromMinutes(15));
        }

        public async Task<IEnumerable<SupportEntity>> GetSupportsAsync()
        {
            return await cache.GetOrSet(
                "supports",
                async () => (await listsGateway.GetSupportsAsync()),
                TimeSpan.FromMinutes(15));
        }
    }
}
