using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Teams;
using EMBC.Responders.API.Helpers;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Manages the list of communities under the management of a team.
    /// The team is derived from the logged in user's security context
    /// </summary>
    [ApiController]
    [Route("api/team/communities")]
    [Authorize]
    public class TeamCommunitiesAssignmentsController : ControllerBase
    {
        private string teamId => User.FindFirstValue("user_team");
        private readonly IMessagingClient messagingClient;
        private ErrorParser errorParser;

        public TeamCommunitiesAssignmentsController(IMessagingClient messagingClient)
        {
            this.messagingClient = messagingClient;
            this.errorParser = new ErrorParser();
        }

        /// <summary>
        /// Get all assigned communities
        /// </summary>
        /// <param name="forAllTeams">indicates if a list of communities assigned to all teams should be returned</param>
        /// <returns>list of communities and their associated teams</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<AssignedCommunity>>> GetAssignedCommunities([FromQuery] bool forAllTeams = false)
        {
            var query = new TeamsQuery();
            if (!forAllTeams) query.TeamId = teamId;

            var teams = (await messagingClient.Send(query)).Teams;

            var communities = teams.SelectMany(t => t.AssignedCommunities.Select(c => new { CommunityCode = c.Code, DateAssigned = c.DateAssigned, Team = t }));
            return Ok(communities.Select(c => new AssignedCommunity
            {
                TeamId = c.Team.Id,
                TeamName = c.Team.Name,
                CommunityCode = c.CommunityCode,
                DateAssigned = c.DateAssigned
            }));
        }

        /// <summary>
        /// Assign communities to the team, will ignore communities which were already associated with the team.
        /// It will fail if a community is already assigned to another team,
        /// </summary>
        /// <param name="communityCodes">list of community ids</param>
        /// <returns>Ok if successful, bad request if a community is not found or a community is associated with another team</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AssignCommunities([FromBody] IEnumerable<string> communityCodes)
        {
            try
            {
                await messagingClient.Send(new AssignCommunitiesToTeamCommand { TeamId = teamId, Communities = communityCodes });
                return Ok();
            }
            catch (Exception e)
            {
                return errorParser.Parse(e);
            }
        }

        /// <summary>
        /// Remove communities associations with the team, will ignore communities which are not associated
        /// </summary>
        /// <param name="communityCodes">list of community ids to disassociate</param>
        /// <returns>Ok if successful, bad request if a community is not found</returns>
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RemoveCommunities([FromQuery] IEnumerable<string> communityCodes)
        {
            await messagingClient.Send(new UnassignCommunitiesFromTeamCommand { TeamId = teamId, Communities = communityCodes });
            return Ok();
        }
    }

    /// <summary>
    /// An associated community and team
    /// </summary>
    public class AssignedCommunity
    {
        public string CommunityCode { get; set; }
        public string TeamId { get; set; }
        public string TeamName { get; set; }
        public DateTime DateAssigned { get; set; }
    }
}
