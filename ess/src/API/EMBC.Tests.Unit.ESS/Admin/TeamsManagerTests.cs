using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Managers.Teams;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Resources.Suppliers;
using EMBC.ESS.Resources.Teams;
using EMBC.ESS.Shared.Contracts.Teams;
using EMBC.ESS.Utilities.Dynamics;
using FakeItEasy;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.ESS.Admin
{
    public class TeamsManagerTests
    {
        private TestTeamRepository teamRepository;
        private readonly TeamsManager adminManager;

        public TeamsManagerTests()
        {
            var mapper = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps("EMBC.ESS");
            }).CreateMapper();

            teamRepository = new TestTeamRepository();
            var essContextStatusReporter = A.Fake<IEssContextStateReporter>();
            var metadataRepository = A.Fake<IMetadataRepository>();
            var supplierRepository = A.Fake<ISupplierRepository>();
            adminManager = new TeamsManager(mapper, teamRepository, supplierRepository);
        }

        [Fact]
        public async Task AssignCommunities_AlreadyAssignedCommunity_Throws()
        {
            var team = teamRepository.stagedTeams.First().Value;
            var updatedAssignedCommunities = team.AssignedCommunities.Select(c => c.Code).Append("c3").ToArray();
            var exception = await adminManager.Handle(new AssignCommunitiesToTeamCommand
            {
                TeamId = team.Id,
                Communities = updatedAssignedCommunities
            }).ShouldThrowAsync<CommunitiesAlreadyAssignedException>();

            exception.Communities.ShouldBe(new[] { "c3" });
        }

        [Fact]
        public async Task AssignCommunities_UnassignedCommuity_CommunitiesAdded()
        {
            var team = teamRepository.stagedTeams.First().Value;
            var updatedAssignedCommunities = team.AssignedCommunities.Select(c => c.Code).Append("c5").ToArray();
            await adminManager.Handle(new AssignCommunitiesToTeamCommand
            {
                TeamId = team.Id,
                Communities = updatedAssignedCommunities
            });

            team.AssignedCommunities.Select(c => c.Code).OrderBy(c => c).ShouldBe(updatedAssignedCommunities.OrderBy(c => c));
        }

        [Fact]
        public async Task SaveMember_NewWithUniqueUserName_Added()
        {
            var team = teamRepository.stagedTeams.First().Value;
            var teamMember = new EMBC.ESS.Shared.Contracts.Teams.TeamMember
            {
                Id = null,
                FirstName = "newf",
                LastName = "lastf",
                UserName = "newunique",
                TeamId = team.Id
            };

            var memberId = await adminManager.Handle(new SaveTeamMemberCommand { Member = teamMember });
            memberId.ShouldNotBeNull();
            teamRepository.stagedTeamMembers.Keys.ShouldContain(memberId);
        }

        [Fact]
        public async Task SaveMember_NewWithExistingUserName_Throws()
        {
            var team = teamRepository.stagedTeams.First().Value;
            var existingTeamMember = teamRepository.stagedTeamMembers.First();
            var teamMember = new EMBC.ESS.Shared.Contracts.Teams.TeamMember
            {
                Id = null,
                FirstName = "newf",
                LastName = "lastf",
                UserName = existingTeamMember.Value.UserName,
                TeamId = team.Id
            };

            var exception = await adminManager.Handle(new SaveTeamMemberCommand { Member = teamMember }).ShouldThrowAsync<UsernameAlreadyExistsException>();
            exception.UserName.ShouldBe(teamMember.UserName);
        }
    }

    public class TestTeamRepository : ITeamRepository
    {
        public Dictionary<string, EMBC.ESS.Resources.Teams.Team> stagedTeams = new Dictionary<string, EMBC.ESS.Resources.Teams.Team>()
        {
            { "t1", new EMBC.ESS.Resources.Teams.Team { Id = "t1", Name = "team1", AssignedCommunities = new []
                    {
                        new EMBC.ESS.Resources.Teams.AssignedCommunity { Code = "c1", DateAssigned = DateTime.UtcNow },
                        new EMBC.ESS.Resources.Teams.AssignedCommunity { Code = "c2", DateAssigned = DateTime.UtcNow }
                    } }
            },
            { "t2", new EMBC.ESS.Resources.Teams.Team { Id = "t2", Name = "team2", AssignedCommunities = new []
                    {
                        new EMBC.ESS.Resources.Teams.AssignedCommunity { Code = "c3", DateAssigned = DateTime.UtcNow },
                        new EMBC.ESS.Resources.Teams.AssignedCommunity { Code = "c4", DateAssigned = DateTime.UtcNow }
                    } }
            },
            { "t3", new EMBC.ESS.Resources.Teams.Team { Id = "t3", Name = "team3", AssignedCommunities = Array.Empty<EMBC.ESS.Resources.Teams.AssignedCommunity>() }
            }
        };

        public Dictionary<string, EMBC.ESS.Resources.Teams.TeamMember> stagedTeamMembers = new Dictionary<string, EMBC.ESS.Resources.Teams.TeamMember>
        {
            { "t1m1", new EMBC.ESS.Resources.Teams.TeamMember{ Id = "t1m1", FirstName = "t1m1f", LastName = "t1m1l", IsActive = true, UserName = "t1m1un", TeamId = "t1" } },
            { "t1m2", new EMBC.ESS.Resources.Teams.TeamMember{ Id = "t1m2", FirstName = "t1m2f", LastName = "t1m2l", IsActive = true, UserName = "t1m2un", TeamId = "t1" } },

            { "t2m1", new EMBC.ESS.Resources.Teams.TeamMember{ Id = "t2m1", FirstName = "t2m1f", LastName = "t2m1l", IsActive = true, UserName = "t2m1un", TeamId = "t2" } },
            { "t2m2", new EMBC.ESS.Resources.Teams.TeamMember{ Id = "t2m2", FirstName = "t2m2f", LastName = "t2m2l", IsActive = true, UserName = "t2m2un", TeamId = "t2" } },

            { "t3m1", new EMBC.ESS.Resources.Teams.TeamMember{ Id = "t3m1", FirstName = "t3m1f", LastName = "t3m1l", IsActive = true, UserName = "t3m1un", TeamId = "t3" } },
            { "t3m2", new EMBC.ESS.Resources.Teams.TeamMember{ Id = "t3m2", FirstName = "t3m2f", LastName = "t3m2l", IsActive = true, UserName = "t3m2un", TeamId = "t3" } },
        };

        public async Task<bool> DeleteMember(string teamId, string teamMemberId)
        {
            await Task.CompletedTask;
            stagedTeamMembers.Remove(teamMemberId, out var memeber);

            return memeber != null;
        }

        public async Task<IEnumerable<EMBC.ESS.Resources.Teams.TeamMember>> GetMembers(string? teamId = null, string? userName = null, string? userId = null, TeamMemberStatus[]? includeStatuses = null)
        {
            includeStatuses = includeStatuses ?? new[] { TeamMemberStatus.Active };
            await Task.CompletedTask;
            return stagedTeamMembers.Values.Where(m =>
                (teamId == null || m.TeamId == teamId) &&
                (userId == null || m.Id == userId) &&
                (userName == null || m.UserName == userName) &&
                (includeStatuses.Contains(TeamMemberStatus.Active) && m.IsActive)
            );
        }

        public async Task<TeamQueryResponse> QueryTeams(TeamQuery query)
        {
            await Task.CompletedTask;
            if (query.Id != null) return new TeamQueryResponse { Items = stagedTeams.Values.Where(t => t.Id == query.Id) };
            if (query.AssignedCommunityCode != null) return new TeamQueryResponse { Items = stagedTeams.Values.Where(t => t.AssignedCommunities.Any(c => c.Code == query.AssignedCommunityCode)) };
            return new TeamQueryResponse { Items = stagedTeams.Values };
        }

        public async Task<string> SaveMember(EMBC.ESS.Resources.Teams.TeamMember teamMember)
        {
            await Task.CompletedTask;
            if (teamMember.Id == null)
            {
                teamMember.Id = $"{teamMember.TeamId}m{stagedTeamMembers.Count + 1}";
                stagedTeamMembers.Add(teamMember.Id, teamMember);
            }
            else
                stagedTeamMembers[teamMember.Id] = teamMember;

            return teamMember.Id;
        }

        public async Task<string> SaveTeam(EMBC.ESS.Resources.Teams.Team team)
        {
            await Task.CompletedTask;
            if (team.Id == null)
            {
                team.Id = $"t{stagedTeams.Count + 1}";
                stagedTeams.Add(team.Id, team);
            }
            else
                stagedTeams[team.Id] = team;

            return team.Id;
        }
    }
}
