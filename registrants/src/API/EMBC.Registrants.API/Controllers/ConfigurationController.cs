using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Threading;
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

namespace EMBC.Responders.API.Controllers;

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
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<Configuration>> GetConfiguration(CancellationToken ct)
    {
        var outageInfo = await cache.GetOrSet(
            "outageinfo",
            async () => (await client.Send(new OutageQuery { PortalType = PortalType.Registrants })).OutageInfo,
            TimeSpan.FromSeconds(30));

        var oidcConfig = configuration.GetSection("auth:oidc");
        var config = new Configuration
        {
            Oidc = new OidcOptions
            {
                ClientId = oidcConfig["clientId"],
                Issuer = oidcConfig["issuer"],
                Scope = oidcConfig.GetValue("scope", "openid offline_access registrants-portal-api"),
                Idp = oidcConfig.GetValue("idp", "bcsc")
            },
            OutageInfo = mapper.Map<OutageInformation>(outageInfo),
            TimeoutInfo = new TimeoutConfiguration
            {
                SessionTimeoutInMinutes = configuration.GetValue<int>("timeout:minutes", 20),
                WarningMessageDuration = configuration.GetValue<int>("timeout:warningDuration", 1)
            },
            Captcha = new CaptchaConfiguration
            {
                Key = configuration.GetValue<string>("captcha:key")
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
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<Code>> GetCodes(string forEnumType)
    {
        if (!string.IsNullOrEmpty(forEnumType))
        {
            var type = Assembly.GetExecutingAssembly().ExportedTypes.FirstOrDefault(t => t.Name.Equals(forEnumType, StringComparison.OrdinalIgnoreCase) && t.IsEnum);
            if (type == null) return NotFound(new ProblemDetails { Detail = $"enum '{forEnumType}' not found" });
            var values = EnumDescriptionHelper.GetEnumDescriptions(type);
            return Ok(values.Select(e => new Code { Type = type.Name, Value = e.Value, Description = e.Description }).ToArray());
        }
        return BadRequest(new ProblemDetails { Detail = "empty query parameter" });
    }

    [HttpGet("codes/communities")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CommunityCode>>> GetCommunities([FromQuery] string? stateProvinceId, [FromQuery] string? countryId, [FromQuery] CommunityType[]? types, CancellationToken ct)
    {
        var items = await cache.GetOrSet(
            "communities",
            async () => (await client.Send(new CommunitiesQuery(), ct)).Items,
            TimeSpan.FromMinutes(15));

        if (!string.IsNullOrEmpty(countryId)) items = items.Where(i => i.CountryCode == countryId);
        if (!string.IsNullOrEmpty(stateProvinceId)) items = items.Where(i => i.StateProvinceCode == stateProvinceId);
        if (types != null && types.Length > 0) items = items.Where(i => Array.Exists(types, t => t.ToString().Equals(i.Type.ToString(), StringComparison.InvariantCultureIgnoreCase)));

        return Ok(mapper.Map<IEnumerable<CommunityCode>>(items));
    }

    [HttpGet("codes/stateprovinces")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Code>>> GetStateProvinces([FromQuery] string? countryId, CancellationToken ct)
    {
        var items = await cache.GetOrSet(
            "statesprovinces",
            async () => (await client.Send(new StateProvincesQuery(), ct)).Items,
            TimeSpan.FromMinutes(15));

        if (!string.IsNullOrEmpty(countryId)) items = items.Where(i => i.CountryCode == countryId);

        return Ok(mapper.Map<IEnumerable<Code>>(items));
    }

    [HttpGet("codes/countries")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Code>>> GetCountries(CancellationToken ct)
    {
        var items = await cache.GetOrSet(
            "countries",
            async () => (await client.Send(new CountriesQuery(), ct)).Items,
            TimeSpan.FromMinutes(15));

        return Ok(mapper.Map<IEnumerable<Code>>(items));
    }

    [HttpGet("security-questions")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<string[]>> GetSecurityQuestions(CancellationToken ct)
    {
        var questions = await cache.GetOrSet(
            "securityquestions",
            async () => (await client.Send(new SecurityQuestionsQuery(), ct)).Items,
            TimeSpan.FromMinutes(15));
        return Ok(questions);
    }

    [HttpGet("outage-info")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<OutageInformation>> GetOutageInfo(CancellationToken ct)
    {
        var outageInfo = await cache.GetOrSet(
            "outageinfo",
            async () => (await client.Send(new OutageQuery { PortalType = PortalType.Registrants })).OutageInfo, TimeSpan.FromSeconds(30), ct);
        return Ok(mapper.Map<OutageInformation>(outageInfo));
    }
}

public record Configuration
{
    public OidcOptions Oidc { get; set; }
    public OutageInformation OutageInfo { get; set; }
    public TimeoutConfiguration TimeoutInfo { get; set; }
    public CaptchaConfiguration Captcha { get; set; }
}

public record OidcOptions
{
    public string Issuer { get; set; }
    public string Scope { get; set; }
    public string ClientId { get; set; }
    public string Idp { get; set; }
}

public record Code
{
    public string Type { get; set; }
    public string Value { get; set; }
    public string Description { get; set; }
    public Code ParentCode { get; set; }
    public bool IsActive { get; set; }
}

public record CommunityCode
{
    public CommunityType CommunityType { get; set; }
    public string DistrictName { get; set; }
    public string Value { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
    public string StateProvinceCode { get; set; }
    public string CountryCode { get; set; }
}

public record OutageInformation
{
    public string Content { get; set; }
    public DateTime? OutageStartDate { get; set; }
    public DateTime? OutageEndDate { get; set; }
}

public record TimeoutConfiguration
{
    public int SessionTimeoutInMinutes { get; set; }
    public int WarningMessageDuration { get; set; }
}

public record CaptchaConfiguration
{
    public string Key { get; set; }
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
            .ForMember(d => d.Value, opts => opts.MapFrom(s => s.Code))
            .ForMember(d => d.Description, opts => opts.MapFrom(s => s.Name))
            .ForMember(d => d.DistrictName, opts => opts.MapFrom(s => s.DistrictName))
            .ForMember(d => d.CommunityType, opts => opts.MapFrom(s => s.Type))
            ;

        CreateMap<ESS.Shared.Contracts.Metadata.OutageInformation, OutageInformation>()
            ;
    }
}
