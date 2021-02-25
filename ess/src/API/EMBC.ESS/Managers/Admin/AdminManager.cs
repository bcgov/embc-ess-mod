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

using System.Collections.Generic;
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

            return new TeamMembersQueryReply { TeamId = request.TeamId, TeamMembers = mapper.Map<IEnumerable<TeamMember>>(members) };
        }

        public async Task<SaveTeamMemberReply> Handle(SaveTeamMemberCommand req)
        {
            var id = await teamRepository.SaveMember(new Resources.Team.TeamMember { });

            return new SaveTeamMemberReply { TeamId = req.Member.TeamId, MemberId = id };
        }
    }
}
