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
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace EMBC.ESS.Resources.Team
{
    public class TeamRepository : ITeamRepository
    {
        private readonly EssContext context;
        private readonly IMapper mapper;
        private const int DynamicsActiveStatus = 1;
        private const int DynamicsInactiveStatus = 2;

        public TeamRepository(EssContext dynamicsClientContext, IMapper mapper)
        {
            this.context = dynamicsClientContext;
            this.mapper = mapper;
        }

        public async Task<TeamQueryResponse> QueryTeams(TeamQuery query)
        {
            IQueryable<era_essteam> teamsQuery = context.era_essteams
                .Expand(t => t.era_ESSTeam_ESSTeamArea_ESSTeamID)
                .Where(t => t.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(query.Id)) teamsQuery = teamsQuery.Where(t => t.era_essteamid == Guid.Parse(query.Id));

            var teams = (await ((DataServiceQuery<era_essteam>)teamsQuery).GetAllPagesAsync()).ToArray();
            foreach (var team in teams)
            {
                await context.LoadPropertyAsync(team, nameof(era_essteam.era_ESSTeam_ESSTeamArea_ESSTeamID));
                await context.LoadPropertyAsync(team, nameof(era_essteam.era_essteamuser_ESSTeamId));
            }

            if (!string.IsNullOrEmpty(query.AssignedCommunityCode))
                teams = teams.Where(t => t.era_ESSTeam_ESSTeamArea_ESSTeamID.Any(a => a._era_jurisdictionid_value == Guid.Parse(query.AssignedCommunityCode))).ToArray();

            return new TeamQueryResponse { Items = mapper.Map<IEnumerable<Team>>(teams) };
        }

        public async Task<IEnumerable<TeamMember>> GetMembers(string teamId = null, string userName = null, string userId = null, TeamMemberStatus[] includeStatuses = null)
        {
            includeStatuses = includeStatuses ?? new[] { TeamMemberStatus.Active };
            var query = EssTeamUsers;

            if (!string.IsNullOrEmpty(teamId)) query = query.Where(u => u._era_essteamid_value == Guid.Parse(teamId));
            if (!string.IsNullOrEmpty(userName)) query = query.Where(u => u.era_externalsystemusername.Equals(userName, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(userId)) query = query.Where(u => u.era_essteamuserid == Guid.Parse(userId));

            var users = query.ToArray();
            context.DetachAll();

            if (includeStatuses != null && includeStatuses.Any()) users = users.Where(u => includeStatuses.Any(s => (int)s == u.statuscode)).ToArray();

            return await Task.FromResult(mapper.Map<IEnumerable<TeamMember>>(users));
        }

        public async Task<string> SaveMember(TeamMember teamMember)
        {
            var essTeam = EssTeam(Guid.Parse(teamMember.TeamId));
            if (essTeam == null || essTeam.statuscode == DynamicsInactiveStatus) throw new Exception($"team {teamMember.TeamId} not found");

            era_essteamuser essTeamUser;
            if (teamMember.Id == null)
            {
                essTeamUser = new era_essteamuser { era_essteamuserid = Guid.NewGuid() };
                context.AddToera_essteamusers(essTeamUser);
            }
            else
            {
                essTeamUser = context.era_essteamusers
                    .Where(u => u._era_essteamid_value == Guid.Parse(teamMember.TeamId) && u.era_essteamuserid == Guid.Parse(teamMember.Id))
                    .SingleOrDefault();
                if (essTeamUser == null) throw new Exception($"team member {teamMember.Id} not found in team {teamMember.TeamId}");
            }

            //TODO: move to automapper profile
            essTeamUser.era_firstname = teamMember.FirstName;
            essTeamUser.era_lastname = teamMember.LastName;
            essTeamUser.era_email = teamMember.Email;
            essTeamUser.era_phone = teamMember.Phone;
            essTeamUser.era_externalsystemuser = teamMember.ExternalUserId;
            essTeamUser.era_externalsystemtype = (int)ExternalSystemOptionSet.Bceid;
            essTeamUser.era_externalsystemusername = teamMember.UserName;
            essTeamUser.era_electronicaccessagreementaccepteddate = teamMember.AgreementSignDate;
            essTeamUser.era_label = string.IsNullOrEmpty(teamMember.Label) ? (int?)null : (int)Enum.Parse<TeamUserLabelOptionSet>(teamMember.Label);
            essTeamUser.era_role = string.IsNullOrEmpty(teamMember.Role) ? (int?)null : (int)Enum.Parse<TeamUserRoleOptionSet>(teamMember.Role);
            essTeamUser.era_lastsuccessfullogin = teamMember.LastSuccessfulLogin;

            if (teamMember.IsActive)
            {
                context.ActivateObject(essTeamUser, (int)TeamMemberStatus.Active);
            }
            else
            {
                context.ActivateObject(essTeamUser, (int)TeamMemberStatus.Inactive);
            }

            context.UpdateObject(essTeamUser);
            context.AddLink(essTeam, nameof(era_essteam.era_essteamuser_ESSTeamId), essTeamUser);
            await context.SaveChangesAsync();

            context.DetachAll();

            return essTeamUser.era_essteamuserid.Value.ToString();
        }

        public async Task<string> SaveTeam(Team team)
        {
            if (string.IsNullOrEmpty(team.Id)) throw new ArgumentException($"Team ID cannot be empty", nameof(team.Id));
            var essTeam = EssTeam(Guid.Parse(team.Id));
            if (essTeam == null) throw new Exception($"Team {team.Id} not found");

            await context.LoadPropertyAsync(essTeam, nameof(era_essteam.era_ESSTeam_ESSTeamArea_ESSTeamID));

            //delete current assigned communities
            foreach (var community in essTeam.era_ESSTeam_ESSTeamArea_ESSTeamID)
            {
                context.DeleteObject(community);
            }

            //add all assigned communities
            foreach (var community in team.AssignedCommunities)
            {
                var teamArea = new era_essteamarea
                {
                    era_essteamareaid = Guid.NewGuid(),
                    era_ESSTeamID = essTeam,
                    createdon = community.DateAssigned
                };
                context.AddToera_essteamareas(teamArea);
                context.AddLink(essTeam, nameof(essTeam.era_ESSTeam_ESSTeamArea_ESSTeamID), teamArea);
                var jurisdiction = new era_jurisdiction { era_jurisdictionid = Guid.Parse(community.Code) };
                context.AttachTo(nameof(context.era_jurisdictions), jurisdiction);
                context.SetLink(teamArea, nameof(era_essteamarea.era_JurisdictionID), jurisdiction);
            }

            await context.SaveChangesAsync();

            context.DetachAll();

            return team.Id;
        }

        public async Task<bool> DeleteMember(string teamId, string teamMemberId)
        {
            var member = EssTeamUsers
                .Where(u => u._era_essteamid_value == Guid.Parse(teamId) && u.era_essteamuserid == Guid.Parse(teamMemberId))
                .SingleOrDefault();

            if (member == null) return false;

            context.DeactivateObject(member, (int)TeamMemberStatus.SoftDelete);

            await context.SaveChangesAsync();
            context.DetachAll();
            return true;
        }

        private era_essteam EssTeam(Guid id) =>
            context.era_essteams
            .Where(t => t.era_essteamid == id && t.statecode == (int)EntityState.Active)
            .SingleOrDefault();

        private IQueryable<era_essteamuser> EssTeamUsers =>
            context.era_essteamusers
                .Expand(u => u.era_ESSTeamId)
                .Where(u => u.statuscode != (int)TeamMemberStatus.SoftDelete);
    }
}
