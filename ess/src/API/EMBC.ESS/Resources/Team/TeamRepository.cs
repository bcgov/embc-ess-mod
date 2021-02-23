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
using EMBC.ESS.Utilities.Dynamics;

namespace EMBC.ESS.Resources.Team
{
    public interface ITeamRepository
    {
        Task<Team> GetTeam(string id);

        Task<IEnumerable<TeamMember>> GetMembers(string teamId);

        Task<string> SaveMember(TeamMember teamMember);

        Task ActivateMember(string teamMemberId);

        Task DeactivateMember(string teamMemberId);

        Task<string> SaveTeam(Team team);
    }

    public class Team
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Community> AssignedCommunities { get; set; }
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
    }

    public class TeamRepository : ITeamRepository
    {
        private readonly EssContext dynamicsClientContext;

        public TeamRepository(EssContext dynamicsClientContext)
        {
            this.dynamicsClientContext = dynamicsClientContext;
        }

        public async Task ActivateMember(string teamMemberId)
        {
            await Task.CompletedTask;
        }

        public async Task DeactivateMember(string teamMemberId)
        {
            await Task.CompletedTask;
        }

        public async Task<IEnumerable<TeamMember>> GetMembers(string teamId)
        {
            var members = new[]
            {
                new TeamMember { Id = "1", FirstName = "one_f", LastName = "one_l", IsActive = true, Email = "1@email.com", UserName = "one", TeamId = teamId, Role = "r1", Label = "l1", AgreementSignDate = DateTime.Now },
                new TeamMember { Id = "2", FirstName = "two_f", LastName = "two_l", IsActive = true, Email = "2@email.com", UserName = "two", TeamId = teamId, Role = "r2", Label = "l2", AgreementSignDate = DateTime.Now },
                new TeamMember { Id = "3", FirstName = "three_f", LastName = "three_l", IsActive = true, Email = "3@email.com", UserName = "three", TeamId = teamId, Role = "r3", Label = "l3", AgreementSignDate = DateTime.Now },
                new TeamMember { Id = "4", FirstName = "four_f", LastName = "four_l", IsActive = true, Email = "4@email.com", UserName = "four", TeamId = teamId, Role = "r4", Label = "l4", AgreementSignDate = DateTime.Now },
            };

            return await Task.FromResult(members);
        }

        public async Task<Team> GetTeam(string id)
        {
            return await Task.FromResult(new Team
            {
                Id = "team1",
                Name = "team 1",
                AssignedCommunities = new[]
                {
                    new Community { Id = "c1", Name = "comm 1" }
                }
            });
        }

        public async Task<string> SaveMember(TeamMember teamMember)
        {
            return await Task.FromResult(Guid.Empty.ToString("D"));
        }

        public async Task<string> SaveTeam(Team team)
        {
            return await Task.FromResult(Guid.Empty.ToString("D"));
        }
    }
}
