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
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Team
{
    //TODO: refactor to message based interface
    public interface ITeamRepository
    {
        Task<IEnumerable<Team>> GetTeams(string id = null);

        Task<IEnumerable<TeamMember>> GetMembers(string teamId = null, string userName = null, string userId = null, bool onlyActive = true);

        Task<string> SaveMember(TeamMember teamMember);

        Task<string> SaveTeam(Team team);

        Task<bool> DeleteMember(string teamId, string teamMemberId);
    }

    public class Team
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<AssignedCommunity> AssignedCommunities { get; set; }
    }

    public class AssignedCommunity
    {
        public string Code { get; set; }
        public DateTime DateAssigned { get; set; }
    }

    public class TeamMember
    {
        public string Id { get; set; }

        public string TeamId { get; set; }
        public string TeamName { get; set; }

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
}
