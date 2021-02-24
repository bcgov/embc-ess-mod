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
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Location;
using EMBC.ESS.Shared.Contracts.Team;
using EMBC.ESS.Utilities.Cache;

namespace EMBC.ESS.Managers.Admin
{
    public class AdminManager
    {
        private readonly Resources.Team.ITeamRepository teamRepository;
        private readonly Resources.Location.ILocationRepository locationRepository;
        private readonly IMapper mapper;
        private readonly ICache cache;

        public AdminManager(Resources.Team.ITeamRepository teamRepository, Resources.Location.ILocationRepository locationRepository, IMapper mapper, ICache cache)
        {
            this.teamRepository = teamRepository;
            this.locationRepository = locationRepository;
            this.mapper = mapper;
            this.cache = cache;
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

        public async Task<CountriesQueryReply> Handle(CountriesQueryRequest req)
        {
            var countries = await cache.GetOrAdd("location:countries", () => locationRepository.GetCountries());

            return new CountriesQueryReply { Items = mapper.Map<IEnumerable<Country>>(countries) };
        }

        public async Task<StateProvincesQueryReply> Handle(StateProvincesQueryRequest req)
        {
            var stateProvinces = await cache.GetOrAdd("location:state_provinces", () => locationRepository.GetStateProvinces());
            if (!string.IsNullOrEmpty(req.CountryCode))
            {
                stateProvinces = stateProvinces.Where(sp => sp.CountryCode == req.CountryCode);
            }
            return new StateProvincesQueryReply { Items = mapper.Map<IEnumerable<StateProvince>>(stateProvinces) };
        }

        public async Task<CommunitiesQueryReply> Handle(CommunitiesQueryRequest req)
        {
            var communities = await cache.GetOrAdd("location:communities", () => locationRepository.GetCommunities());

            return new CommunitiesQueryReply { Items = mapper.Map<IEnumerable<Community>>(communities) };
        }
    }
}
