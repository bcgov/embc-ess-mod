using System.Collections.Generic;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.Models;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;
using Jasper;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Suppliers.API.ConfigurationModule.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListsController : ControllerBase
    {
        private readonly ICommandBus commandBus;

        public ListsController(ICommandBus commandBus)
        {
            this.commandBus = commandBus;
        }

        [HttpGet("countries")]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            return Ok(await commandBus.Invoke<IEnumerable<Country>>(new CountriesQueryCommand()));
        }

        [HttpGet("stateprovinces")]
        public async Task<ActionResult<IEnumerable<StateProvince>>> GetStateProvinces([FromQuery] string countryCode = "CAN")
        {
            return Ok(await commandBus.Invoke<IEnumerable<StateProvince>>(new StateProvincesQueryCommand(countryCode)));
        }

        [HttpGet("jurisdictions")]
        public async Task<ActionResult<IEnumerable<Jurisdiction>>> GetJurisdictions([FromQuery] string[] types, [FromQuery] string countryCode = "CAN", [FromQuery] string stateProvinceCode = "BC")
        {
            return Ok(await commandBus.Invoke<IEnumerable<Jurisdiction>>(new JurisdictionsQueryCommand(types, countryCode, stateProvinceCode)));
        }
    }
}
