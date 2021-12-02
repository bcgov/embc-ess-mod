// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Metadata;
using EMBC.Registrants.API.Utils;
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
        private const int cacheDuration = 60 * 60; //60 minutes

        public ConfigurationController(IConfiguration configuration, IMessagingClient client, IMapper mapper)
        {
            this.configuration = configuration;
            this.client = client;
            this.mapper = mapper;
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
            //TODO - get outage info
            var oidcConfig = configuration.GetSection("auth:oidc");
            var config = new Configuration
            {
                Oidc = new OidcOptions
                {
                    ClientId = oidcConfig["clientId"],
                    Issuer = oidcConfig["issuer"],
                    Scope = oidcConfig.GetValue("scope", "openid offline_access registrants-portal-api")
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
                var type = Assembly.GetExecutingAssembly().ExportedTypes.Where(t => t.Name.Equals(forEnumType, StringComparison.OrdinalIgnoreCase) && t.IsEnum).FirstOrDefault();
                if (type == null) return NotFound(new ProblemDetails { Detail = $"enum '{forEnumType}' not found" });
                var values = EnumDescriptionHelper.GetEnumDescriptions(type);
                return Ok(values.Select(e => new Code { Type = type.Name, Value = e.value, Description = e.description }).ToArray());
            }
            return BadRequest(new ProblemDetails { Detail = "empty query parameter" });
        }

        [HttpGet("codes/communities")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<CommunityCode>>> GetCommunities([FromQuery] string stateProvinceId, [FromQuery] string countryId, [FromQuery] CommunityType[] types)
        {
            var items = (await client.Send(new CommunitiesQuery()
            {
                CountryCode = countryId,
                StateProvinceCode = stateProvinceId,
                Types = types.Select(t => (EMBC.ESS.Shared.Contracts.Metadata.CommunityType)t)
            })).Items;

            return Ok(mapper.Map<IEnumerable<CommunityCode>>(items));
        }

        [HttpGet("codes/stateprovinces")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<CommunityCode>>> GetStateProvinces([FromQuery] string countryId)
        {
            var items = (await client.Send(new StateProvincesQuery()
            {
                CountryCode = countryId,
            })).Items;

            return Ok(mapper.Map<IEnumerable<Code>>(items));
        }

        [HttpGet("codes/countries")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<CommunityCode>>> GetCountries()
        {
            var items = (await client.Send(new CountriesQuery())).Items;

            return Ok(mapper.Map<IEnumerable<Code>>(items));
        }

        [HttpGet("security-questions")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<string[]>> GetSecurityQuestions()
        {
            var questions = (await client.Send(new SecurityQuestionsQuery())).Items;
            return Ok(questions);
        }
    }

    public class Configuration
    {
        public OidcOptions Oidc { get; set; }
        public OutageInformation OutageInfo { get; set; }
    }

    public class OidcOptions
    {
        public string Issuer { get; set; }
        public string Scope { get; set; }
        public string ClientId { get; set; }
    }

    public class Code
    {
        public string Type { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }
        public Code ParentCode { get; set; }
    }

    public class CommunityCode : Code
    {
        public CommunityType CommunityType { get; set; }
        public string DistrictName { get; set; }
    }

    public class OutageInformation
    {
        public string Content { get; set; }
        public DateTime OutageStartDate { get; set; }
        public DateTime OutageEndDate { get; set; }
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

        [Description("District")]
        District,

        [Description("District Municipality")]
        DistrictMunicipality,

        [Description("Township")]
        Township,

        [Description("Indian GovernmentDistrict")]
        IndianGovernmentDistrict,

        [Description("Island Municipality")]
        IslandMunicipality,

        [Description("Island Trust")]
        IslandTrust,

        [Description("Mountain Resort Municipality")]
        MountainResortMunicipality,

        [Description("Municipality District")]
        MunicipalityDistrict,

        [Description("Regional District")]
        RegionalDistrict,

        [Description("Regional Municipality")]
        RegionalMunicipality,

        [Description("Resort Municipality")]
        ResortMunicipality,

        [Description("Rural Municipalities")]
        RuralMunicipalities
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
