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
            {"t1", new EMBC.ESS.Resources.Team.Team { Id = "t1", Name = "team1", AssignedCommunities = new [] { "c1", "c2" } } },
            {"t2", new EMBC.ESS.Resources.Team.Team { Id = "t2", Name = "team2", AssignedCommunities = new [] { "c3", "c4" } } },
            {"t3", new EMBC.ESS.Resources.Team.Team { Id = "t3", Name = "team3 - no communities", AssignedCommunities = Array.Empty<string>() } }
        };

        public AdminManagerTests()
        {
            var mapper = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(Startup));
            }).CreateMapper();

            //wire team repository fake
            var teamRepository = A.Fake<ITeamRepository>();

            //get all
            A.CallTo(() => teamRepository.GetTeams(A<string>.That.IsNullOrEmpty()))
                .Returns(Task.FromResult((IEnumerable<EMBC.ESS.Resources.Team.Team>)stagedTeams.Values));

            //get single
            A.CallTo(() => teamRepository.GetTeams(A<string>.That.IsNotNull()))
                .ReturnsLazily(o => Task.FromResult(stagedTeams
                    .Where(t => t.Key == o.GetArgument<string>(0))
                    .Select(t => t.Value)));

            //update
            A.CallTo(() => teamRepository.SaveTeam(A<EMBC.ESS.Resources.Team.Team>.That.Matches(t => t.Id != null)))
                .ReturnsLazily(o =>
                {
                    var team = o.GetArgument<EMBC.ESS.Resources.Team.Team>(0);
                    stagedTeams[team.Id] = team;
                    return Task.FromResult(team.Id);
                });

            //add
            A.CallTo(() => teamRepository.SaveTeam(A<EMBC.ESS.Resources.Team.Team>.That.Matches(t => t.Id == null)))
                .ReturnsLazily(o =>
                {
                    var team = o.GetArgument<EMBC.ESS.Resources.Team.Team>(0);
                    team.Id = $"t{stagedTeams.Count() + 1}";
                    stagedTeams.Add(team.Id, team);
                    return Task.FromResult(team.Id);
                });

            adminManager = new AdminManager(teamRepository, mapper);
        }

        [Fact]
        public async Task AssignCommunities_AlreadyAssignedCommunity_Throws()
        {
            var team = stagedTeams.First().Value;
            var updatedAssignedCommunities = team.AssignedCommunities.Append("c3").ToArray();
            var exception = await adminManager.Handle(new AssignCommunitiesToTeamCommand
            {
                TeamId = team.Id,
                Communities = updatedAssignedCommunities
            }).ShouldThrowAsync<CommunitiesAlreadyAssignedException>();

            exception.CommunityIds.ShouldBe(new[] { "c3" });
        }

        [Fact]
        public async Task AssignCommunities_UnassignedCommuity_CommunitiesAdded()
        {
            var team = stagedTeams.First().Value;
            var updatedAssignedCommunities = team.AssignedCommunities.Append("c5").ToArray();
            var response = await adminManager.Handle(new AssignCommunitiesToTeamCommand
            {
                TeamId = team.Id,
                Communities = updatedAssignedCommunities
            });

            team.AssignedCommunities.OrderBy(c => c).ShouldBe(updatedAssignedCommunities.OrderBy(c => c));
        }
    }
}
