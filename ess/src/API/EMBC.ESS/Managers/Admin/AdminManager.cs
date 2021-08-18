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
using EMBC.ESS.Resources.Suppliers;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Profile;
using EMBC.ESS.Shared.Contracts.Suppliers;
using EMBC.ESS.Shared.Contracts.Team;

namespace EMBC.ESS.Managers.Admin
{
    public class AdminManager
    {
        private readonly Resources.Team.ITeamRepository teamRepository;
        private readonly ISupplierRepository supplierRepository;
        private readonly IMapper mapper;

        public AdminManager(Resources.Team.ITeamRepository teamRepository, ISupplierRepository supplierRepository, IMapper mapper)
        {
            this.teamRepository = teamRepository;
            this.supplierRepository = supplierRepository;
            this.mapper = mapper;
        }

        public async Task<TeamsQueryResponse> Handle(TeamsQuery cmd)
        {
            var teams = await teamRepository.GetTeams(id: cmd.TeamId);

            return new TeamsQueryResponse { Teams = mapper.Map<IEnumerable<EMBC.ESS.Shared.Contracts.Team.Team>>(teams) };
        }

        public async Task<TeamMembersQueryResponse> Handle(TeamMembersQuery cmd)
        {
            var members = await teamRepository.GetMembers(cmd.TeamId, cmd.UserName, cmd.MemberId, cmd.IncludeActiveUsersOnly);

            return new TeamMembersQueryResponse { TeamMembers = mapper.Map<IEnumerable<TeamMember>>(members) };
        }

        public async Task<string> Handle(SaveTeamMemberCommand cmd)
        {
            var teamMembersWithSameUserName = await teamRepository.GetMembers(userName: cmd.Member.UserName);
            //filter this user if exists
            if (cmd.Member.Id != null) teamMembersWithSameUserName = teamMembersWithSameUserName.Where(m => m.Id != cmd.Member.Id);
            if (teamMembersWithSameUserName.Any()) throw new UsernameAlreadyExistsException(cmd.Member.UserName);

            var id = await teamRepository.SaveMember(mapper.Map<Resources.Team.TeamMember>(cmd.Member));

            return id;
        }

        public async Task Handle(DeleteTeamMemberCommand cmd)
        {
            var result = await teamRepository.DeleteMember(cmd.TeamId, cmd.MemberId);
            if (!result) throw new NotFoundException($"Member {cmd.MemberId} not found in team {cmd.TeamId}", cmd.MemberId);
        }

        public async Task Handle(DeactivateTeamMemberCommand cmd)
        {
            var member = (await teamRepository.GetMembers(cmd.TeamId, onlyActive: false)).SingleOrDefault(m => m.Id == cmd.MemberId);
            if (member == null) throw new NotFoundException($"Member {cmd.MemberId} not found in team {cmd.TeamId}", cmd.MemberId);

            member.IsActive = false;
            await teamRepository.SaveMember(member);
        }

        public async Task Handle(ActivateTeamMemberCommand cmd)
        {
            var member = (await teamRepository.GetMembers(cmd.TeamId, onlyActive: false)).SingleOrDefault(m => m.Id == cmd.MemberId);
            if (member == null) throw new NotFoundException($"Member {cmd.MemberId} not found in team {cmd.TeamId}", cmd.MemberId);

            member.IsActive = true;
            await teamRepository.SaveMember(member);
        }

        public async Task<ValidateTeamMemberResponse> Handle(ValidateTeamMemberCommand cmd)
        {
            var members = await teamRepository.GetMembers(userName: cmd.TeamMember.UserName, onlyActive: true);
            //filter this user if exists
            if (!string.IsNullOrEmpty(cmd.TeamMember.Id)) members = members.Where(m => m.Id != cmd.TeamMember.Id);
            return new ValidateTeamMemberResponse
            {
                UniqueUserName = !members.Any()
            };
        }

        public async Task Handle(AssignCommunitiesToTeamCommand cmd)
        {
            var allTeams = await teamRepository.GetTeams();
            var team = allTeams.SingleOrDefault(t => t.Id == cmd.TeamId);
            if (team == null) throw new NotFoundException($"Team {cmd.TeamId} not found", cmd.TeamId);

            var allAssignedCommunities = allTeams.Where(t => t.Id != cmd.TeamId).SelectMany(t => t.AssignedCommunities).Select(c => c.Code);
            var alreadyAssignedCommunities = cmd.Communities.Intersect(allAssignedCommunities).ToArray();
            if (alreadyAssignedCommunities.Any()) throw new CommunitiesAlreadyAssignedException(alreadyAssignedCommunities);

            var now = DateTime.UtcNow;
            var newCommunities = cmd.Communities
                .Where(c => !team.AssignedCommunities.Any(ac => ac.Code == c))
                .Select(c => new Resources.Team.AssignedCommunity { Code = c, DateAssigned = now });
            team.AssignedCommunities = team.AssignedCommunities.Concat(newCommunities).ToArray();
            await teamRepository.SaveTeam(team);
        }

        public async Task Handle(UnassignCommunitiesFromTeamCommand cmd)
        {
            var team = (await teamRepository.GetTeams(id: cmd.TeamId)).SingleOrDefault();
            if (team == null) throw new NotFoundException($"Team {cmd.TeamId} not found", cmd.TeamId);

            team.AssignedCommunities = team.AssignedCommunities.Where(c => !cmd.Communities.Contains(c.Code));
            await teamRepository.SaveTeam(team);
        }

        public async Task<LogInUserResponse> Handle(LogInUserCommand cmd)
        {
            var member = (await teamRepository.GetMembers(userName: cmd.UserName, onlyActive: true)).SingleOrDefault();
            if (member == null) return new FailedLogin { Reason = $"User {cmd.UserName} not found" };
            if (member.ExternalUserId != null && member.ExternalUserId != cmd.UserId)
                throw new Exception($"User {cmd.UserName} has external id {member.ExternalUserId} but trying to log in with user id {cmd.UserId}");
            if (member.ExternalUserId == null && member.LastSuccessfulLogin.HasValue)
                throw new Exception($"User {cmd.UserName} has no external id but somehow logged in already");

            if (!member.LastSuccessfulLogin.HasValue || string.IsNullOrEmpty(member.ExternalUserId))
            {
                member.ExternalUserId = cmd.UserId;
            }

            member.LastSuccessfulLogin = DateTime.UtcNow;

            await teamRepository.SaveMember(member);

            return new SuccessfulLogin { Profile = mapper.Map<UserProfile>(member) };
        }

        public async Task Handle(SignResponderAgreementCommand cmd)
        {
            var member = (await teamRepository.GetMembers(userName: cmd.UserName, onlyActive: true)).SingleOrDefault();
            if (member == null) throw new NotFoundException($"team member not found", cmd.UserName);

            member.AgreementSignDate = cmd.SignatureDate;
            await teamRepository.SaveMember(member);
        }

        public async Task<SuppliersQueryResult> Handle(SuppliersQuery query)
        {
            if (!string.IsNullOrEmpty(query.TeamId))
            {
                var suppliers = (await supplierRepository.QuerySupplier(new SuppliersByTeamQuery
                {
                    TeamId = query.TeamId,
                })).Items;

                var res = mapper.Map<IEnumerable<Shared.Contracts.Suppliers.Supplier>>(suppliers);
                return new SuppliersQueryResult { Items = res };
            }
            else if (!string.IsNullOrEmpty(query.SupplierId) || !string.IsNullOrEmpty(query.LegalName) || !string.IsNullOrEmpty(query.GSTNumber))
            {
                var suppliers = (await supplierRepository.QuerySupplier(new SupplierSearchQuery
                {
                    SupplierId = query.SupplierId,
                    LegalName = query.LegalName,
                    GSTNumber = query.GSTNumber
                })).Items;

                var res = mapper.Map<IEnumerable<Shared.Contracts.Suppliers.Supplier>>(suppliers);
                return new SuppliersQueryResult { Items = res };
            }
            else
            {
                throw new Exception($"Unknown query type");
            }
        }
    }
}
