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
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Team;

namespace EMBC.ESS.Managers.Admin
{
    public class AdminManager
    {
        private readonly Resources.Team.ITeamRepository teamRepository;
        private readonly IMapper mapper;

        public AdminManager(Resources.Team.ITeamRepository teamRepository, IMapper mapper)
        {
            this.teamRepository = teamRepository;
            this.mapper = mapper;
        }

        public async Task<TeamsQueryResponse> Handle(TeamsQueryCommand cmd)
        {
            var teams = await teamRepository.GetTeams(id: cmd.TeamId);

            return new TeamsQueryResponse { Teams = mapper.Map<IEnumerable<Team>>(teams) };
        }

        public async Task<TeamMembersQueryResponse> Handle(TeamMembersQueryCommand cmd)
        {
            var members = await teamRepository.GetMembers(cmd.TeamId);

            if (!string.IsNullOrEmpty(cmd.MemberId)) members = members.Where(m => m.Id == cmd.MemberId).ToArray();

            return new TeamMembersQueryResponse { TeamId = cmd.TeamId, TeamMembers = mapper.Map<IEnumerable<TeamMember>>(members) };
        }

        public async Task<SaveTeamMemberResponse> Handle(SaveTeamMemberCommand cmd)
        {
            var teamMembersWithSameUserName = await teamRepository.GetMembers(userName: cmd.Member.UserName);
            if (teamMembersWithSameUserName.Any()) throw new Exception($"A team member with user name {cmd.Member.UserName} already exists");

            var id = await teamRepository.SaveMember(mapper.Map<Resources.Team.TeamMember>(cmd.Member));

            return new SaveTeamMemberResponse { TeamId = cmd.Member.TeamId, MemberId = id };
        }

        public async Task<DeleteTeamMemberResponse> Handle(DeleteTeamMemberCommand cmd)
        {
            var result = await teamRepository.DeleteMember(cmd.TeamId, cmd.MemberId);
            if (!result) throw new NotFoundException($"Member {cmd.MemberId} not found in team {cmd.TeamId}", cmd.MemberId);

            return new DeleteTeamMemberResponse();
        }

        public async Task<DeactivateTeamMemberResponse> Handle(DeactivateTeamMemberCommand cmd)
        {
            var member = (await teamRepository.GetMembers(cmd.TeamId)).SingleOrDefault(m => m.Id == cmd.MemberId);
            if (member == null) throw new NotFoundException($"Member {cmd.MemberId} not found in team {cmd.TeamId}", cmd.MemberId);

            member.IsActive = false;
            await teamRepository.SaveMember(member);

            return new DeactivateTeamMemberResponse();
        }

        public async Task<ActivateTeamMemberResponse> Handle(ActivateTeamMemberCommand cmd)
        {
            var member = (await teamRepository.GetMembers(cmd.TeamId)).SingleOrDefault(m => m.Id == cmd.MemberId);
            if (member == null) throw new NotFoundException($"Member {cmd.MemberId} not found in team {cmd.TeamId}", cmd.MemberId);

            member.IsActive = true;
            await teamRepository.SaveMember(member);

            return new ActivateTeamMemberResponse();
        }

        public async Task<ValidateTeamMemberResponse> Handle(ValidateTeamMemberCommand cmd)
        {
            var members = await teamRepository.GetMembers(userName: cmd.UniqueUserName);

            return new ValidateTeamMemberResponse { UniqueUserName = !members.Any() };
        }

        public async Task<AssignCommunitiesToTeamResponse> Handle(AssignCommunitiesToTeamCommand cmd)
        {
            var allTeams = await teamRepository.GetTeams();
            var team = allTeams.SingleOrDefault(t => t.Id == cmd.TeamId);
            if (team == null) throw new NotFoundException($"Team {cmd.TeamId} not found", cmd.TeamId);

            var allAssignedCommunities = allTeams.Where(t => t.Id != cmd.TeamId).SelectMany(t => t.AssignedCommunities);
            var alreadyAssignedCommunities = cmd.Communities.Intersect(allAssignedCommunities).ToArray();
            if (alreadyAssignedCommunities.Any()) throw new CommunitiesAlreadyAssignedException(alreadyAssignedCommunities);

            team.AssignedCommunities = team.AssignedCommunities.Concat(cmd.Communities).Distinct();
            await teamRepository.SaveTeam(team);

            return new AssignCommunitiesToTeamResponse();
        }

        public async Task<UnassignCommunitiesFromTeamResponse> Handle(UnassignCommunitiesFromTeamCommand cmd)
        {
            var team = (await teamRepository.GetTeams(id: cmd.TeamId)).SingleOrDefault();
            if (team == null) throw new NotFoundException($"Team {cmd.TeamId} not found", cmd.TeamId);

            team.AssignedCommunities = team.AssignedCommunities.Where(c => !cmd.Communities.Contains(c));
            await teamRepository.SaveTeam(team);

            return new UnassignCommunitiesFromTeamResponse();
        }
    }
}
