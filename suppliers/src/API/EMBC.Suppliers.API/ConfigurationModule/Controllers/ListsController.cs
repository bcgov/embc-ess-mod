using System.Collections.Generic;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.Models;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Suppliers.API.ConfigurationModule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListsController : ControllerBase
    {
        private readonly ICountriesListProvider countriesListProvider;
        private readonly IStateProvincesListProvider provincesListProvider;
        private readonly IRegionsListProvider regionsListProvider;
        private readonly ICommunitiesListProvider communitiesListProvider;
        private readonly ICitiesListProvider citiesListProvider;
        private readonly IDistrictsListProvider districtsListProvider;

        public ListsController(
            ICountriesListProvider countriesListProvider,
            IStateProvincesListProvider provincesListProvider,
            IRegionsListProvider regionsListProvider,
            ICommunitiesListProvider communitiesListProvider,
            ICitiesListProvider citiesListProvider,
            IDistrictsListProvider districtsListProvider)
        {
            this.countriesListProvider = countriesListProvider;
            this.provincesListProvider = provincesListProvider;
            this.regionsListProvider = regionsListProvider;
            this.communitiesListProvider = communitiesListProvider;
            this.citiesListProvider = citiesListProvider;
            this.districtsListProvider = districtsListProvider;
        }

        [HttpGet("countries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            return Ok(await countriesListProvider.GetCountriesAsync());
        }

        [HttpGet("stateprovinces")]
        public async Task<ActionResult<IEnumerable<StateProvince>>> GetStateProvinces([FromQuery] string countryCode = "CAN")
        {
            return Ok(await provincesListProvider.GetStateProvincesAsync(countryCode));
        }

        [HttpGet("communities")]
        public async Task<ActionResult<IEnumerable<Community>>> GetCommunities([FromQuery] string countryCode = "CAN", [FromQuery] string stateProvinceCode = "BC")
        {
            return Ok(await communitiesListProvider.GetCommunitiesAsync(stateProvinceCode, countryCode));
        }

        [HttpGet("regions")]
        public async Task<ActionResult<IEnumerable<Region>>> GetRegions([FromQuery] string countryCode = "CAN", [FromQuery] string stateProvinceCode = "BC")
        {
            return Ok(await regionsListProvider.GetRegionsAsync(stateProvinceCode, countryCode));
        }

        [HttpGet("cities")]
        public async Task<ActionResult<IEnumerable<City>>> GetCities([FromQuery] string countryCode = "CAN", [FromQuery] string stateProvinceCode = "BC")
        {
            return Ok(await citiesListProvider.GetCitiesAsync(stateProvinceCode, countryCode));
        }

        [HttpGet("districts")]
        public async Task<ActionResult<IEnumerable<District>>> GetDistricts([FromQuery] string countryCode = "CAN", [FromQuery] string stateProvinceCode = "BC")
        {
            return Ok(await districtsListProvider.GetDistrictsAsync(stateProvinceCode, countryCode));
        }
    }
}
