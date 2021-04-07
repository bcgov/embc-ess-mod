using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS;
using EMBC.ESS.Managers.Admin;
using EMBC.ESS.Resources.Team;
using EMBC.ESS.Shared.Contracts.Team;
using FakeItEasy;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.ESS.Admin
{
    public class AdminManagerTests
    {
        private readonly AdminManager adminManager;

        private Dictionary<string, EMBC.ESS.Resources.Team.Team> stagedTeams = new Dictionary<string, EMBC.ESS.Resources.Team.Team>()
        {
            { "t1", new EMBC.ESS.Resources.Team.Team { Id = "t1", Name = "team1", AssignedCommunities = new []
                    {
                        new EMBC.ESS.Resources.Team.AssignedCommunity { Code = "c1", DateAssigned = DateTime.Now },
                        new EMBC.ESS.Resources.Team.AssignedCommunity { Code = "c2", DateAssigned = DateTime.Now }
                    } }
            },
            { "t2", new EMBC.ESS.Resources.Team.Team { Id = "t2", Name = "team2", AssignedCommunities = new []
                    {
                        new EMBC.ESS.Resources.Team.AssignedCommunity { Code = "c3", DateAssigned = DateTime.Now },
                        new EMBC.ESS.Resources.Team.AssignedCommunity { Code = "c4", DateAssigned = DateTime.Now }
                    } }
            },
            { "t3", new EMBC.ESS.Resources.Team.Team { Id = "t3", Name = "team3", AssignedCommunities = Array.Empty<EMBC.ESS.Resources.Team.AssignedCommunity>() }
            }
        };

        private Dictionary<string, EMBC.ESS.Resources.Team.TeamMember> stagedTeamMembers = new Dictionary<string, EMBC.ESS.Resources.Team.TeamMember>
        {
            { "t1m1", new EMBC.ESS.Resources.Team.TeamMember{ Id = "t1m1", FirstName = "t1m1f", LastName = "t1m1l", IsActive = true, UserName = "t1m1un", TeamId = "t1" } },
            { "t1m2", new EMBC.ESS.Resources.Team.TeamMember{ Id = "t1m2", FirstName = "t1m2f", LastName = "t1m2l", IsActive = true, UserName = "t1m2un", TeamId = "t1" } },

            { "t2m1", new EMBC.ESS.Resources.Team.TeamMember{ Id = "t2m1", FirstName = "t2m1f", LastName = "t2m1l", IsActive = true, UserName = "t2m1un", TeamId = "t2" } },
            { "t2m2", new EMBC.ESS.Resources.Team.TeamMember{ Id = "t2m2", FirstName = "t2m2f", LastName = "t2m2l", IsActive = true, UserName = "t2m2un", TeamId = "t2" } },

            { "t3m1", new EMBC.ESS.Resources.Team.TeamMember{ Id = "t3m1", FirstName = "t3m1f", LastName = "t3m1l", IsActive = true, UserName = "t3m1un", TeamId = "t3" } },
            { "t3m2", new EMBC.ESS.Resources.Team.TeamMember{ Id = "t3m2", FirstName = "t3m2f", LastName = "t3m2l", IsActive = true, UserName = "t3m2un", TeamId = "t3" } },
        };

        public AdminManagerTests()
        {
            var mapper = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(Startup));
            }).CreateMapper();

            //wire team repository fake
            var teamRepository = A.Fake<ITeamRepository>();

            //get all teams
            A.CallTo(() => teamRepository.GetTeams(A<string>.That.IsNullOrEmpty()))
                .Returns(Task.FromResult((IEnumerable<EMBC.ESS.Resources.Team.Team>)stagedTeams.Values));

            //get single team
            A.CallTo(() => teamRepository.GetTeams(A<string>.That.IsNotNull()))
                .ReturnsLazily(o => Task.FromResult(stagedTeams
                    .Where(t => t.Key == o.GetArgument<string>(0))
                    .Select(t => t.Value)));

            //update team
            A.CallTo(() => teamRepository.SaveTeam(A<EMBC.ESS.Resources.Team.Team>.That.Matches(t => t.Id != null)))
                .ReturnsLazily(o =>
                {
                    var team = o.GetArgument<EMBC.ESS.Resources.Team.Team>(0);
                    stagedTeams[team.Id] = team;
                    return Task.FromResult(team.Id);
                });

            //add team
            A.CallTo(() => teamRepository.SaveTeam(A<EMBC.ESS.Resources.Team.Team>.That.Matches(t => t.Id == null)))
                .ReturnsLazily(o =>
                {
                    var team = o.GetArgument<EMBC.ESS.Resources.Team.Team>(0);
                    team.Id = $"t{stagedTeams.Count() + 1}";
                    stagedTeams.Add(team.Id, team);
                    return Task.FromResult(team.Id);
                });

            //get team members for a team
            A.CallTo(() => teamRepository.GetMembers(A<string>.That.IsNotNull(), A<string>.That.IsNullOrEmpty(), A<string>.That.IsNullOrEmpty(), true))
                .ReturnsLazily(o =>
                {
                    return Task.FromResult(stagedTeamMembers.Values.Where(m => m.TeamId == o.GetArgument<string>(0)));
                });

            //get team members by user name
            A.CallTo(() => teamRepository.GetMembers(A<string>.That.IsNullOrEmpty(), A<string>.That.IsNotNull(), A<string>.That.IsNullOrEmpty(), true))
                .ReturnsLazily(o =>
                {
                    return Task.FromResult(stagedTeamMembers.Values.Where(m => m.UserName == o.GetArgument<string>(1)));
                });

            //get team members by user id
            A.CallTo(() => teamRepository.GetMembers(A<string>.That.IsNullOrEmpty(), A<string>.That.IsNullOrEmpty(), A<string>.That.IsNotNull(), true))
                .ReturnsLazily(o =>
                {
                    return Task.FromResult(stagedTeamMembers.Values.Where(m => m.ExternalUserId == o.GetArgument<string>(2)));
                });

            //add team member
            A.CallTo(() => teamRepository.SaveMember(A<EMBC.ESS.Resources.Team.TeamMember>.That.Matches(m => m.Id == null)))
                .ReturnsLazily(o =>
                {
                    var teamMember = o.GetArgument<EMBC.ESS.Resources.Team.TeamMember>(0);
                    teamMember.Id = $"{teamMember.TeamId}m{stagedTeamMembers.Where(m => m.Value.TeamId == teamMember.TeamId).Count() + 1}";
                    stagedTeamMembers.Add(teamMember.Id, teamMember);
                    return Task.FromResult(teamMember.Id);
                });

            //update team member
            A.CallTo(() => teamRepository.SaveMember(A<EMBC.ESS.Resources.Team.TeamMember>.That.Matches(m => m.Id != null)))
                .ReturnsLazily(o =>
                {
                    var teamMember = o.GetArgument<EMBC.ESS.Resources.Team.TeamMember>(0);
                    stagedTeamMembers[teamMember.Id] = teamMember;
                    return Task.FromResult(teamMember.Id);
                });
            adminManager = new AdminManager(teamRepository, mapper);
        }

        [Fact]
        public async Task AssignCommunities_AlreadyAssignedCommunity_Throws()
        {
            var team = stagedTeams.First().Value;
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
            var team = stagedTeams.First().Value;
            var updatedAssignedCommunities = team.AssignedCommunities.Select(c => c.Code).Append("c5").ToArray();
            var response = await adminManager.Handle(new AssignCommunitiesToTeamCommand
            {
                TeamId = team.Id,
                Communities = updatedAssignedCommunities
            });

            team.AssignedCommunities.Select(c => c.Code).OrderBy(c => c).ShouldBe(updatedAssignedCommunities.OrderBy(c => c));
        }

        [Fact]
        public async Task SaveMember_NewWithUniqueUserName_Added()
        {
            var team = stagedTeams.First().Value;
            var teamMember = new EMBC.ESS.Shared.Contracts.Team.TeamMember
            {
                Id = null,
                FirstName = "newf",
                LastName = "lastf",
                UserName = "newunique",
                TeamId = team.Id
            };

            var result = await adminManager.Handle(new SaveTeamMemberCommand { Member = teamMember });
            result.TeamId.ShouldBe(team.Id);
            result.MemberId.ShouldNotBeNull();
            stagedTeamMembers.Keys.ShouldContain(result.MemberId);
        }

        [Fact]
        public async Task SaveMember_NewWithExistingUserName_Throws()
        {
            var team = stagedTeams.First().Value;
            var existingTeamMember = stagedTeamMembers.First();
            var teamMember = new EMBC.ESS.Shared.Contracts.Team.TeamMember
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
}
