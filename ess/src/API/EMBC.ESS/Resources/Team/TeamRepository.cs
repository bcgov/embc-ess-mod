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

        public async Task<IEnumerable<TeamMember>> GetMembers(string teamId = null, string userName = null)
        {
            var teamUsers = GetEssTeamUsers();

            if (!string.IsNullOrEmpty(teamId)) teamUsers = teamUsers.Where(u => u._era_essteamid_value == Guid.Parse(teamId));
            if (!string.IsNullOrEmpty(userName)) teamUsers = teamUsers.Where(u => u.era_bceidaccountguid == userName);

            var users = teamUsers.ToArray();
            context.DetachAll();

            return await Task.FromResult(mapper.Map<IEnumerable<TeamMember>>(users));
        }

        public async Task<IEnumerable<Team>> GetTeams(string id = null)
        {
            await Task.CompletedTask;

            IQueryable<era_essteam> essTeams = context.era_essteams.Where(t => t.statuscode == DynamicsActiveStatus);
            IQueryable<era_essteamarea> communities = context.era_essteamareas.Expand(a => a.era_JurisdictionID);

            if (!string.IsNullOrEmpty(id))
            {
                essTeams = essTeams.Where(t => t.era_essteamid == Guid.Parse(id));
                communities = communities.Where(a => a.era_ESSTeamID.era_essteamid == Guid.Parse(id));
            }

            var teams = essTeams.ToArray();
            var assignedCommunities = communities.ToArray();

            context.DetachAll();

            return teams.Select(t =>
            {
                var team = mapper.Map<Team>(t);
                team.AssignedCommunities = assignedCommunities
                    .Where(c => c._era_essteamid_value == t.era_essteamid)
                    .Select(c => new AssignedCommunity
                    {
                        Code = c.era_JurisdictionID.era_jurisdictionid.Value.ToString(),
                        DateAssigned = c.createdon.Value.Date
                    })
                    .ToArray();
                return team;
            }).ToArray();
        }

        public async Task<string> SaveMember(TeamMember teamMember)
        {
            var essTeam = GetEssTeam(teamMember.TeamId);
            if (essTeam == null || essTeam.statuscode == DynamicsInactiveStatus) throw new Exception($"team {teamMember.TeamId} not found");

            var essTeamUser = teamMember.Id == null
                ? CreateTeamUser()
                : GetEssTeamUsers()
                .Where(u => u._era_essteamid_value == Guid.Parse(teamMember.TeamId) && u.era_essteamuserid == Guid.Parse(teamMember.Id))
                .SingleOrDefault();
            if (essTeamUser == null) throw new Exception($"team member {teamMember.Id} not found in team {teamMember.TeamId}");

            essTeamUser.era_firstname = teamMember.FirstName;
            essTeamUser.era_lastname = teamMember.LastName;
            essTeamUser.era_email = teamMember.Email;
            essTeamUser.era_bceidaccountguid = teamMember.ExternalUserId;
            essTeamUser.era_externalsystemtype = null; // TODO: map
            essTeamUser.era_externalsystemusername = teamMember.UserName;
            essTeamUser.era_electronicaccessagreementaccepteddate = teamMember.AgreementSignDate;
            if (teamMember.IsActive)
            {
                context.ActivateObject(essTeamUser);
            }
            else
            {
                context.DeactivateObject(essTeamUser);
            }

            context.UpdateObject(essTeamUser);
            context.AddLink(essTeam, nameof(era_essteam.era_essteamuser_ESSTeamId), essTeamUser);
            await context.SaveChangesAsync();

            context.DetachAll();

            return essTeamUser.era_essteamuserid.Value.ToString();
        }

        public async Task<string> SaveTeam(Team team)
        {
            var essTeam = GetEssTeam(team.Id);
            if (essTeam == null || essTeam.statuscode == DynamicsInactiveStatus) throw new Exception($"team {team.Id} not found");

            var currentAssignments = context.era_essteamareas
                .Expand(a => a.era_JurisdictionID)
                .Where(a => a.era_ESSTeamID.era_essteamid == essTeam.era_essteamid)
                .ToArray();

            var teamCommunities = team.AssignedCommunities.Select(c => Guid.Parse(c.Code)).Distinct().ToArray();

            var assignementsToDelete = currentAssignments.Where(c => !teamCommunities.Contains(c.era_JurisdictionID.era_jurisdictionid.Value)).ToArray();

            foreach (var assignmnent in assignementsToDelete)
            {
                context.DeleteObject(assignmnent);
            }

            var assignementsToAdd = teamCommunities.Where(c => !currentAssignments.Any(a => a.era_JurisdictionID.era_jurisdictionid == c)).ToArray();

            foreach (var communityId in assignementsToAdd)
            {
                var jurisdiction = new era_jurisdiction { era_jurisdictionid = communityId };
                var teamArea = new era_essteamarea
                {
                    era_essteamareaid = Guid.NewGuid(),
                    era_ESSTeamID = essTeam,
                };
                context.AddToera_essteamareas(teamArea);
                context.AttachTo(nameof(context.era_jurisdictions), jurisdiction);
                context.SetLink(teamArea, nameof(era_essteamarea.era_JurisdictionID), jurisdiction);
                context.AddLink(essTeam, nameof(essTeam.era_ESSTeam_ESSTeamArea_ESSTeamID), teamArea);
            }

            context.UpdateObject(essTeam);
            await context.SaveChangesAsync();

            context.DetachAll();

            return team.Id;
        }

        public async Task<bool> DeleteMember(string teamId, string teamMemberId)
        {
            var essTeamUser = GetEssTeamUsers()
                .Where(u => u._era_essteamid_value == Guid.Parse(teamId) && u.era_essteamuserid == Guid.Parse(teamMemberId))
                .SingleOrDefault();
            if (essTeamUser == null) return false;

            context.SoftDeleteObject(essTeamUser);

            await context.SaveChangesAsync();
            context.DetachAll();
            return true;
        }

        private era_essteamuser CreateTeamUser()
        {
            var newUser = new era_essteamuser { era_essteamuserid = Guid.NewGuid() };
            context.AddToera_essteamusers(newUser);
            return newUser;
        }

        private IQueryable<era_essteamuser> GetEssTeamUsers() =>
            context.era_essteamusers
                .Expand(u => u.era_ESSTeamId)
                .Where(u => u.statuscode != (int)EntityStatus.SoftDelete);

        private era_essteam GetEssTeam(string teamId) =>
            context.era_essteams
                .GetSingleEntityByKey(new Dictionary<string, object> { { "era_essteamid", Guid.Parse(teamId) } })
                .GetValue();
    }
}
