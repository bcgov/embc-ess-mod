using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Teams;
using EMBC.Responders.API.Helpers;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Manages members within the team.
    /// The team is derived from the logged in user's security context
    /// </summary>
    [ApiController]
    [Route("api/team")]
    [Authorize]
    public partial class TeamsController : ControllerBase
    {
        private readonly IMessagingClient client;
        private readonly IMapper mapper;
        private string teamId => User.FindFirstValue("user_team");
        private ErrorParser errorParser;

        public TeamsController(IMessagingClient client, IMapper mapper)
        {
            this.client = client;
            this.mapper = mapper;
            this.errorParser = new ErrorParser();
        }

        /// <summary>
        /// Get all teams
        /// </summary>
        /// <returns>list of teams</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeams()
        {
            var response = await client.Send(new TeamsQuery { });
            return Ok(mapper.Map<IEnumerable<Team>>(response.Teams));
        }

        /// <summary>
        /// Get teams by community
        /// </summary>
        /// <param name="communityCode">communityCode</param>
        /// <returns>list of teams</returns>
        [HttpGet("community/{communityCode}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeamsByCommunity(string communityCode)
        {
            var response = await client.Send(new TeamsQuery { CommunityCode = communityCode });
            return Ok(mapper.Map<IEnumerable<Team>>(response.Teams));
        }
    }

    /// <summary>
    /// Team details
    /// </summary>
    public class Team
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string Name { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class TeamsMapping : Profile
    {
        public TeamsMapping()
        {
            CreateMap<ESS.Shared.Contracts.Teams.Team, Team>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.Name))
                .ForMember(d => d.IsActive, opts => opts.Ignore())
                ;
        }
    }
}
