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
using EMBC.ESS.Shared.Contracts.Profile;
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

            if (!string.IsNullOrEmpty(cmd.MemberId)) members = members.Where(m => m.Id == cmd.MemberId);

            return new TeamMembersQueryResponse { TeamMembers = mapper.Map<IEnumerable<TeamMember>>(members) };
        }

        public async Task<SaveTeamMemberResponse> Handle(SaveTeamMemberCommand cmd)
        {
            var teamMembersWithSameUserName = await teamRepository.GetMembers(userName: cmd.Member.UserName);
            //filter this user if exists
            if (cmd.Member.Id != null) teamMembersWithSameUserName = teamMembersWithSameUserName.Where(m => m.Id != cmd.Member.Id);
            if (teamMembersWithSameUserName.Any()) throw new UsernameAlreadyExistsException(cmd.Member.UserName);

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
            var members = await teamRepository.GetMembers(userName: cmd.TeamMember.UserName);
            //filter this user if exists
            if (!string.IsNullOrEmpty(cmd.TeamMember.Id)) members = members.Where(m => m.Id != cmd.TeamMember.Id);
            return new ValidateTeamMemberResponse
            {
                UniqueUserName = !members.Any()
            };
        }

        public async Task<AssignCommunitiesToTeamResponse> Handle(AssignCommunitiesToTeamCommand cmd)
        {
            var allTeams = await teamRepository.GetTeams();
            var team = allTeams.SingleOrDefault(t => t.Id == cmd.TeamId);
            if (team == null) throw new NotFoundException($"Team {cmd.TeamId} not found", cmd.TeamId);

            var allAssignedCommunities = allTeams.Where(t => t.Id != cmd.TeamId).SelectMany(t => t.AssignedCommunities).Select(c => c.Code);
            var alreadyAssignedCommunities = cmd.Communities.Intersect(allAssignedCommunities).ToArray();
            if (alreadyAssignedCommunities.Any()) throw new CommunitiesAlreadyAssignedException(alreadyAssignedCommunities);

            var now = DateTime.Now;
            var newCommunities = cmd.Communities
                .Where(c => !team.AssignedCommunities.Any(ac => ac.Code == c))
                .Select(c => new Resources.Team.AssignedCommunity { Code = c, DateAssigned = now });
            team.AssignedCommunities = team.AssignedCommunities.Concat(newCommunities).ToArray();
            await teamRepository.SaveTeam(team);

            return new AssignCommunitiesToTeamResponse();
        }

        public async Task<UnassignCommunitiesFromTeamResponse> Handle(UnassignCommunitiesFromTeamCommand cmd)
        {
            var team = (await teamRepository.GetTeams(id: cmd.TeamId)).SingleOrDefault();
            if (team == null) throw new NotFoundException($"Team {cmd.TeamId} not found", cmd.TeamId);

            team.AssignedCommunities = team.AssignedCommunities.Where(c => !cmd.Communities.Contains(c.Code));
            await teamRepository.SaveTeam(team);

            return new UnassignCommunitiesFromTeamResponse();
        }

        public async Task<LogInUserResponse> Handle(LogInUserCommand cmd)
        {
            var member = (await teamRepository.GetMembers(userName: cmd.UserName)).SingleOrDefault();
            if (member == null) return new FailedLogin { Reason = $"User {cmd.UserName} not found" };
            if (member.ExternalUserId != null && member.ExternalUserId != cmd.UserId)
                throw new Exception($"User {cmd.UserName} has external id {member.ExternalUserId} but trying to log in with user id {cmd.UserId}");
            if (member.ExternalUserId == null && member.LastSuccessfulLogin.HasValue)
                throw new Exception($"User {cmd.UserName} has no external id but somehow logged in already");

            if (!member.LastSuccessfulLogin.HasValue || string.IsNullOrEmpty(member.ExternalUserId))
            {
                member.ExternalUserId = cmd.UserId;
            }

            member.LastSuccessfulLogin = DateTime.Now;

            await teamRepository.SaveMember(member);

            return new SuccessfulLogin { Profile = mapper.Map<UserProfile>(member) };
        }

        public async Task<SignResponderAgreementResponse> Handle(SignResponderAgreementCommand cmd)
        {
            var member = (await teamRepository.GetMembers(userName: cmd.UserName)).SingleOrDefault();
            if (member == null) throw new NotFoundException($"team member not found", cmd.UserName);

            member.AgreementSignDate = cmd.SignatureDate;
            await teamRepository.SaveMember(member);
            return new SignResponderAgreementResponse();
        }
    }
}
