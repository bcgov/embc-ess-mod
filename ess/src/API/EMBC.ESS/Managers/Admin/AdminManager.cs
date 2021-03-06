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

        public async Task<TeamMembersQueryReply> Handle(TeamMembersByIdQueryRequest request)
        {
            var members = await teamRepository.GetMembers(request.TeamId);

            if (!string.IsNullOrEmpty(request.MemberId)) members = members.Where(m => m.Id == request.MemberId).ToArray();

            return new TeamMembersQueryReply { TeamId = request.TeamId, TeamMembers = mapper.Map<IEnumerable<TeamMember>>(members) };
        }

        public async Task<SaveTeamMemberReply> Handle(SaveTeamMemberCommand req)
        {
            var id = await teamRepository.SaveMember(mapper.Map<Resources.Team.TeamMember>(req.Member));

            return new SaveTeamMemberReply { TeamId = req.Member.TeamId, MemberId = id };
        }

        public async Task<DeactivateTeamMemberReply> Handle(DeactivateTeamMemberCommand cmd)
        {
            var member = (await teamRepository.GetMembers(cmd.TeamId)).SingleOrDefault(m => m.Id == cmd.MemberId);
            if (member == null) throw new Exception($"Member {cmd.MemberId} not found in team {cmd.TeamId}");

            member.IsActive = false;
            await teamRepository.SaveMember(member);

            return new DeactivateTeamMemberReply();
        }

        public async Task<ActivateTeamMemberReply> Handle(ActivateTeamMemberCommand cmd)
        {
            var member = (await teamRepository.GetMembers(cmd.TeamId)).SingleOrDefault(m => m.Id == cmd.MemberId);
            if (member == null) throw new Exception($"Member {cmd.MemberId} not found in team {cmd.TeamId}");

            member.IsActive = true;
            await teamRepository.SaveMember(member);

            return new ActivateTeamMemberReply();
        }
    }
}
