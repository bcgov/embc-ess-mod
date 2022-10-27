using System;
using System.Linq;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Resources.Teams;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class TeamRepositoryTests : DynamicsWebAppTestBase
    {
        private readonly ITeamRepository teamRepository;
        private string teamId => TestData.Team1Id;

        public TeamRepositoryTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            teamRepository = Services.GetRequiredService<ITeamRepository>();
        }

        [Fact]
        public async Task CanQueryAllTeams()
        {
            (await teamRepository.QueryTeams(new TeamQuery())).Items.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task CanQueryTeamById()
        {
            var team = (await teamRepository.QueryTeams(new TeamQuery { Id = teamId })).Items.ShouldHaveSingleItem();
            team.ShouldNotBeNull();
            team.Id.ShouldBe(teamId);
            team.Name.ShouldNotBeNull();
            team.AssignedCommunities.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task CanQueryTeamByAssignedCommunity()
        {
            var originalTeam = (await teamRepository.QueryTeams(new TeamQuery { Id = teamId })).Items.ShouldHaveSingleItem();
            var communityCode = originalTeam.AssignedCommunities.First().Code;
            var team = (await teamRepository.QueryTeams(new TeamQuery { AssignedCommunityCode = communityCode })).Items.ShouldHaveSingleItem();
            team.ShouldNotBeNull().Id.ShouldBe(originalTeam.Id);
            team.Name.ShouldNotBeNull();
            team.AssignedCommunities.Where(c => c.Code == communityCode).ShouldHaveSingleItem();
        }

        [Fact]
        public async Task CanSaveTeam()
        {
            var metaDataRepository = Services.GetRequiredService<IMetadataRepository>();
            var unavailableCommunities = (await teamRepository.QueryTeams(new TeamQuery())).Items.SelectMany(t => t.AssignedCommunities).Select(c => c.Code).ToArray();
            var allCommunities = TestData.Commmunities;
            var availableCommunities = allCommunities.Where(c => !unavailableCommunities.Any(uc => uc == c)).ToArray();

            var team = (await teamRepository.QueryTeams(new TeamQuery { Id = teamId })).Items.ShouldHaveSingleItem();
            var toAssign = availableCommunities.Take(10).Select(c => new AssignedCommunity { Code = c, DateAssigned = DateTime.UtcNow }).ToList();
            if (!toAssign.Any(c => c.Code == TestData.ActiveTaskCommunity)) toAssign.Add(new AssignedCommunity { Code = TestData.ActiveTaskCommunity, DateAssigned = DateTime.UtcNow });
            team.AssignedCommunities = toAssign;

            var updatedTeamId = await teamRepository.SaveTeam(team);

            var updatedTeam = (await teamRepository.QueryTeams(new TeamQuery { Id = teamId })).Items.ShouldHaveSingleItem();
            updatedTeam.AssignedCommunities.Select(c => c.Code).OrderBy(c => c).ToArray().ShouldBe(team.AssignedCommunities.Select(c => c.Code).OrderBy(c => c).ToArray());
        }

        [Fact]
        public async Task CanGetTeamMembers()
        {
            var members = await teamRepository.GetMembers(teamId);

            members.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task CanAddTeamMember()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), DateTimeKind.Unspecified);
            var uniqueSignature = TestData.TestPrefix + "-" + Guid.NewGuid().ToString().Substring(0, 4);

            var newTeamMember = new TeamMember
            {
                Id = null,
                TeamId = teamId,
                FirstName = uniqueSignature + "-first",
                LastName = uniqueSignature + "-last",
                Email = "email@email.com",
                Phone = "123456",
                AgreementSignDate = now,
                LastSuccessfulLogin = now,
                Label = "Volunteer",
                Role = "Tier1",
                ExternalUserId = uniqueSignature + "-extid",
                UserName = $"username{Guid.NewGuid().ToString().Substring(0, 4)}",
                IsActive = true,
            };
            var newMemberId = await teamRepository.SaveMember(newTeamMember);

            var members = await teamRepository.GetMembers(teamId);

            var newMember = members.Where(m => m.Id == newMemberId).ShouldHaveSingleItem();
            newMember.Id.ShouldNotBeNull();
            newMember.TeamId.ShouldBe(newTeamMember.TeamId);
            newMember.TeamName.ShouldNotBeNull();
            newMember.FirstName.ShouldBe(newTeamMember.FirstName);
            newMember.LastName.ShouldBe(newTeamMember.LastName);
            newMember.Email.ShouldBe(newTeamMember.Email);
            newMember.Phone.ShouldBe(newTeamMember.Phone);
            newMember.Label.ShouldBe(newTeamMember.Label);
            newMember.Role.ShouldBe(newTeamMember.Role);
            newMember.UserName.ShouldBe(newTeamMember.UserName);
            newMember.ExternalUserId.ShouldBe(newTeamMember.ExternalUserId);
            newMember.IsActive.ShouldBe(newTeamMember.IsActive);
            newMember.LastSuccessfulLogin.ShouldNotBeNull().ShouldBe(newTeamMember.LastSuccessfulLogin.Value);
            newMember.AgreementSignDate.ShouldNotBeNull().Date.ShouldBe(newTeamMember.AgreementSignDate.Value.Date);
        }

        [Fact]
        public async Task CanUpdateTeamMember()
        {
            var members = await teamRepository.GetMembers(teamId);

            var now = DateTime.UtcNow;

            var memberToUpdate = members.First();
            memberToUpdate.AgreementSignDate.ShouldNotBe(now);

            memberToUpdate.AgreementSignDate = now;

            var updatedMemberId = await teamRepository.SaveMember(memberToUpdate);

            var updatedMembers = await teamRepository.GetMembers(teamId);

            var updatedMember = updatedMembers.Single(m => m.Id == updatedMemberId);
            updatedMember.AgreementSignDate.ShouldNotBeNull().ShouldBe(now.Date);
        }

        [Fact]
        public async Task CanDeleteTeamMember()
        {
            var uniqueSignature = TestData.TestPrefix + "-" + Guid.NewGuid().ToString().Substring(0, 4);
            var memberId = await teamRepository.SaveMember(new TeamMember { FirstName = uniqueSignature + "-to-delete", LastName = uniqueSignature + "-to-delete", TeamId = teamId, IsActive = true });

            await teamRepository.DeleteMember(teamId, memberId);

            var newMembers = await teamRepository.GetMembers(teamId);

            newMembers.SingleOrDefault(m => m.Id == memberId).ShouldBeNull();
        }
    }
}
