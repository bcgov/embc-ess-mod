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

        public ListsController(
            ICountriesListProvider countriesListProvider,
            IStateProvincesListProvider provincesListProvider,
            IRegionsListProvider regionsListProvider,
            ICommunitiesListProvider communitiesListProvider)
        {
            this.countriesListProvider = countriesListProvider;
            this.provincesListProvider = provincesListProvider;
            this.regionsListProvider = regionsListProvider;
            this.communitiesListProvider = communitiesListProvider;
        }

        [HttpGet("countries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            return Ok(await countriesListProvider.GetCountriesAsync());
        }

        [HttpGet("stateprovinces")]
        public async Task<ActionResult<IEnumerable<StateProvince>>> GetStateProvinces([FromQuery] string countryCode = "CA")
        {
            return Ok(await provincesListProvider.GetStateProvincesAsync(countryCode));
        }

        [HttpGet("communities")]
        public async Task<ActionResult<IEnumerable<Community>>> GetCommunities([FromQuery]string countryCode = "CA", [FromQuery]string stateProvinceCode = "BC")
        {
            return Ok(await communitiesListProvider.GetCommunitiesAsync(stateProvinceCode, countryCode));
        }

        [HttpGet("regions")]
        public async Task<ActionResult<IEnumerable<Community>>> GetRegions([FromQuery]string countryCode = "CA", [FromQuery]string stateProvinceCode = "BC")
        {
            return Ok(await regionsListProvider.GetRegionsAsync(stateProvinceCode, countryCode));
        }
    }
}
