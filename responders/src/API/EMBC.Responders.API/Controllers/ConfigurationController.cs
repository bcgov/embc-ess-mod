using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Metadata;
using EMBC.Utilities.Caching;
using EMBC.Utilities.Extensions;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Provides configuration data for clients
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ResponseCache(Duration = cacheDuration)]
    public class ConfigurationController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IMessagingClient client;
        private readonly IMapper mapper;
        private readonly ICache cache;
        private const int cacheDuration = 60 * 1; //1 minute

        public ConfigurationController(IConfiguration configuration, IMessagingClient client, IMapper mapper, ICache cache)
        {
            this.configuration = configuration;
            this.client = client;
            this.mapper = mapper;
            this.cache = cache;
        }

        /// <summary>
        /// Get configuration settings for clients
        /// </summary>
        /// <returns>Configuration settings object</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<Configuration>> GetConfiguration()
        {
            var outageInfo = await cache.GetOrSet(
                "outageInfo",
                async () => (await client.Send(new OutageQuery { PortalType = PortalType.Responders })).OutageInfo,
                TimeSpan.FromSeconds(30));

            var config = new Configuration
            {
                Oidc = new OidcConfiguration
                {
                    ClientId = configuration.GetValue<string>("oidc:clientId"),
                    Issuer = configuration.GetValue<string>("oidc:issuer"),
                    Scope = configuration.GetValue<string>("oidc:scope", OidcConfiguration.DefaultScopes),
                    PostLogoutRedirectUrl = $"{configuration.GetValue<string>("oidc:bceidLogoutUrl")}?retnow=1&returl={configuration.GetValue<string>("oidc:returnUrl", "https://ess.gov.bc.ca")}"
                },
                OutageInfo = mapper.Map<OutageInformation>(outageInfo),
                TimeoutInfo = new TimeoutConfiguration
                {
                    SessionTimeoutInMinutes = configuration.GetValue<int>("timeout:minutes", 20),
                    WarningMessageDuration = configuration.GetValue<int>("timeout:warningDuration", 1)
                }
            };

            return Ok(await Task.FromResult(config));
        }

        /// <summary>
        /// Get code values and descriptions for lookups and enum types
        /// </summary>
        /// <param name="forEnumType">enum type name</param>
        /// <returns>list of codes and their respective descriptions</returns>
        [HttpGet("codes")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<IEnumerable<Code>> GetCodes(string forEnumType)
        {
            if (!string.IsNullOrEmpty(forEnumType))
            {
                var type = Assembly.GetExecutingAssembly().ExportedTypes.FirstOrDefault(t => t.Name.Equals(forEnumType, StringComparison.OrdinalIgnoreCase) && t.IsEnum);
                if (type == null) return NotFound(forEnumType);
                var values = EnumDescriptionHelper.GetEnumDescriptions(type);
                return Ok(values.Select(e => new Code { Type = type.Name, Value = e.Value, Description = e.Description }).ToArray());
            }
            return BadRequest(new ProblemDetails { Detail = "empty query parameter" });
        }

        [HttpGet("codes/communities")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<CommunityCode>>> GetCommunities([FromQuery] string? stateProvinceId, [FromQuery] string? countryId, [FromQuery] CommunityType[]? types)
        {
            var items = await cache.GetOrSet(
                "communities",
                async () => (await client.Send(new CommunitiesQuery())).Items,
                TimeSpan.FromMinutes(15));

            if (!string.IsNullOrEmpty(countryId)) items = items.Where(i => i.CountryCode == countryId);
            if (!string.IsNullOrEmpty(stateProvinceId)) items = items.Where(i => i.StateProvinceCode == stateProvinceId);
            if (types != null && types.Any()) items = items.Where(i => types.Any(t => t.ToString().Equals(i.Type.ToString(), StringComparison.InvariantCultureIgnoreCase)));

            return Ok(mapper.Map<IEnumerable<CommunityCode>>(items));
        }

        [HttpGet("codes/stateprovinces")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<CommunityCode>>> GetStateProvinces([FromQuery] string? countryId)
        {
            var items = await cache.GetOrSet(
                "statesprovinces",
                async () => (await client.Send(new StateProvincesQuery())).Items,
                TimeSpan.FromMinutes(15));

            if (!string.IsNullOrEmpty(countryId)) items = items.Where(i => i.CountryCode == countryId);

            return Ok(mapper.Map<IEnumerable<Code>>(items));
        }

        [HttpGet("codes/countries")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<CommunityCode>>> GetCountries()
        {
            var items = await cache.GetOrSet(
                "countries",
                async () => (await client.Send(new CountriesQuery())).Items,
                TimeSpan.FromMinutes(15));

            return Ok(mapper.Map<IEnumerable<Code>>(items));
        }

        [HttpGet("security-questions")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<string[]>> GetSecurityQuestions()
        {
            var questions = await cache.GetOrSet(
                "securityquestions",
                async () => (await client.Send(new SecurityQuestionsQuery())).Items,
                TimeSpan.FromMinutes(15));
            return Ok(questions);
        }

        [HttpGet("outage-info")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<OutageInformation>> GetOutageInfo()
        {
            var outageInfo = await cache.GetOrSet(
                "outageInfo",
                async () => (await client.Send(new OutageQuery { PortalType = PortalType.Responders })).OutageInfo,
                TimeSpan.FromSeconds(30));
            return Ok(mapper.Map<OutageInformation>(outageInfo));
        }
    }

    public class Configuration
    {
        public OidcConfiguration Oidc { get; set; }
        public OutageInformation OutageInfo { get; set; }
        public TimeoutConfiguration TimeoutInfo { get; set; }
    }

    public class OidcConfiguration
    {
        public const string DefaultScopes = "openid profile email offline_access";
        public string Issuer { get; set; }
        public string ClientId { get; set; }
        public string PostLogoutRedirectUrl { get; set; }
        public string Scope { get; set; } = DefaultScopes;
    }

    public class Code
    {
        public string Type { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }
        public Code ParentCode { get; set; }
        public bool IsActive { get; set; }
    }

    public class CommunityCode : Code
    {
        public CommunityType CommunityType { get; set; }
        public string DistrictName { get; set; }
    }

    public class OutageInformation
    {
        public string Content { get; set; }
        public DateTime? OutageStartDate { get; set; }
        public DateTime? OutageEndDate { get; set; }
    }

    public class TimeoutConfiguration
    {
        public int SessionTimeoutInMinutes { get; set; }
        public int WarningMessageDuration { get; set; }
    }

    public class VersionInformation
    {
        public string Name { get; set; }
        public string Version { get; set; }
        public string Build { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CommunityType
    {
        [Description("Undefined")]
        Undefined,

        [Description("City")]
        City,

        [Description("Town")]
        Town,

        [Description("Village")]
        Village,

        [Description("First Nations Community")]
        FirstNationsCommunity,

        [Description("District Municipality")]
        DistrictMunicipality,

        [Description("Indian Government District")]
        IndianGovernmentDistrict,

        [Description("Indian Reserve")]
        IndianReserve,

        [Description("Urban Community")]
        UrbanCommunity,

        [Description("Resort Municipality")]
        ResortMunicipality,

        [Description("Community")]
        Community,
    }

    public class ConfigurationMapping : Profile
    {
        public ConfigurationMapping()
        {
            CreateMap<Country, Code>()
                .ForMember(d => d.Type, opts => opts.MapFrom(s => nameof(Country)))
                .ForMember(d => d.Value, opts => opts.MapFrom(s => s.Code))
                .ForMember(d => d.Description, opts => opts.MapFrom(s => s.Name))
                .ForMember(d => d.ParentCode, opts => opts.Ignore())
                ;

            CreateMap<StateProvince, Code>()
                .ForMember(d => d.Type, opts => opts.MapFrom(s => nameof(StateProvince)))
                .ForMember(d => d.Value, opts => opts.MapFrom(s => s.Code))
                .ForMember(d => d.Description, opts => opts.MapFrom(s => s.Name))
                .ForMember(d => d.ParentCode, opts => opts.MapFrom(s => new Code { Value = s.CountryCode, Type = nameof(Country) }))
                ;

            CreateMap<Community, CommunityCode>()
                .ForMember(d => d.Type, opts => opts.MapFrom(s => nameof(Community)))
                .ForMember(d => d.Value, opts => opts.MapFrom(s => s.Code))
                .ForMember(d => d.Description, opts => opts.MapFrom(s => s.Name))
                .ForMember(d => d.DistrictName, opts => opts.MapFrom(s => s.DistrictName))
                .ForMember(d => d.CommunityType, opts => opts.MapFrom(s => s.Type))
                .ForMember(d => d.ParentCode, opts => opts.MapFrom(s => new Code { Value = s.StateProvinceCode, Type = nameof(StateProvince), ParentCode = new Code { Value = s.CountryCode, Type = nameof(Country) } }))
                ;

            CreateMap<ESS.Shared.Contracts.Metadata.OutageInformation, OutageInformation>()
                ;
        }
    }
}
