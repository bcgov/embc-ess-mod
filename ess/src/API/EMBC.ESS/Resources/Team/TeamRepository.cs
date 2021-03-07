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
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Team
{
    public interface ITeamRepository
    {
        Task<Team> GetTeam(string id);

        Task<IEnumerable<TeamMember>> GetMembers(string teamId);

        Task<string> SaveMember(TeamMember teamMember);

        Task<string> SaveTeam(Team team);

        Task<bool> DeleteMember(string teamId, string teamMemberId);
    }

    public class Team
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<string> AssignedCommunitiesIds { get; set; }
    }

    public class Community
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class TeamMember
    {
        public string Id { get; set; }

        public string TeamId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string UserName { get; set; }

        public string Role { get; set; }
        public string Label { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public DateTime? AgreementSignDate { get; set; }

        public DateTime? LastSuccessfulLogin { get; set; }
        public bool IsActive { get; set; }
        public string ExternalUserId { get; set; }
    }

    public class TeamRepository : ITeamRepository
    {
        private readonly EssContext context;

        public TeamRepository(EssContext dynamicsClientContext)
        {
            this.context = dynamicsClientContext;
        }

        public async Task<IEnumerable<TeamMember>> GetMembers(string teamId)
        {
            await Task.CompletedTask;
            var teamUsers = context.era_essteamusers
                .Where(u => u._era_essteamid_value == Guid.Parse(teamId))
                .ToArray();

            context.DetachAll();

            return teamUsers.Select(m => new TeamMember
            {
                Id = m.era_essteamuserid.ToString(),
                FirstName = m.era_firstname,
                LastName = m.era_lastname,
                Email = m.era_email,
                Phone = null,
                UserName = null,
                ExternalUserId = m.era_bceidaccountguid,
                AgreementSignDate = m.era_electronicaccessagreementaccepteddate,
                IsActive = m.era_active ?? false,
                Role = null,
                Label = null,
                LastSuccessfulLogin = null,
                TeamId = teamId
            });
        }

        public async Task<Team> GetTeam(string id)
        {
            await Task.CompletedTask;
            var essTeam = GetEssTeam(id);
            if (essTeam == null) return null;

            var communities = context.era_essteamareas
                .Expand(a => a.era_JurisdictionID)
                .Where(a => a.era_ESSTeamID.era_essteamid == essTeam.era_essteamid)
                .ToArray();

            context.DetachAll();

            return new Team
            {
                Id = id,
                Name = essTeam.era_name,
                AssignedCommunitiesIds = communities.Select(c => c.era_JurisdictionID.era_jurisdictionid.Value.ToString()).ToArray()
            };
        }

        public async Task<string> SaveMember(TeamMember teamMember)
        {
            var essTeam = GetEssTeam(teamMember.TeamId);
            if (essTeam == null) throw new Exception($"team {teamMember.TeamId} not found");

            var essTeamUser = teamMember.Id == null
                ? CreateTeamUser()
                : GetEssTeamUsers(teamMember.TeamId).Where(u => u.era_essteamuserid == Guid.Parse(teamMember.Id)).SingleOrDefault();
            if (essTeamUser == null) throw new Exception($"team member {teamMember.Id} not found in team {teamMember.TeamId}");

            essTeamUser.era_firstname = teamMember.FirstName;
            essTeamUser.era_lastname = teamMember.LastName;
            essTeamUser.era_email = teamMember.Email;
            essTeamUser.era_active = teamMember.IsActive;
            essTeamUser.era_electronicaccessagreementaccepteddate = teamMember.AgreementSignDate;
            essTeamUser.era_bceidaccountguid = teamMember.ExternalUserId;

            context.UpdateObject(essTeamUser);
            context.AddLink(essTeam, nameof(era_essteam.era_essteamuser_ESSTeamId), essTeamUser);
            await context.SaveChangesAsync();

            context.DetachAll();

            return essTeamUser.era_essteamuserid.Value.ToString();
        }

        public async Task<string> SaveTeam(Team team)
        {
            var essTeam = GetEssTeam(team.Id);
            if (essTeam == null) throw new Exception($"team {team.Id} not found");

            var currentCommunities = context.era_essteamareas
                .Where(a => a.era_ESSTeamID.era_essteamid == essTeam.era_essteamid)
                .ToArray();

            foreach (var community in currentCommunities)
            {
                context.DeleteObject(community);
            }

            foreach (var community in team.AssignedCommunitiesIds)
            {
                var jurisdiction = new era_jurisdiction { era_jurisdictionid = Guid.Parse(community) };
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
            var essTeamUser = GetEssTeamUsers(teamId).Where(u => u.era_essteamuserid == Guid.Parse(teamMemberId)).SingleOrDefault();
            if (essTeamUser == null) return false;

            //TODO: change to soft delete
            context.DeleteObject(essTeamUser);

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

        private IQueryable<era_essteamuser> GetEssTeamUsers(string teamId) =>
            context.era_essteamusers
                .Where(u => u._era_essteamid_value == Guid.Parse(teamId));

        private era_essteam GetEssTeam(string teamId) =>
            context.era_essteams
                .GetSingleEntityByKey(new Dictionary<string, object> { { "era_essteamid", Guid.Parse(teamId) } })
                .GetValue();
    }
}
