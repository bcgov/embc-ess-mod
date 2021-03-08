using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Resources.Team;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class TeamRepositoryTests : WebAppTestBase
    {
        private readonly ITeamRepository teamRepository;

        public TeamRepositoryTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            teamRepository = services.GetRequiredService<ITeamRepository>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetTeam()
        {
            var teamId = "3f132f42-b74f-eb11-b822-00505683fbf4";

            var team = (await teamRepository.GetTeams(teamId)).ShouldHaveSingleItem();
            team.ShouldNotBeNull();
            team.Name.ShouldNotBeNull();
            team.AssignedCommunitiesIds.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSaveTeam()
        {
            var metaDataRepository = services.GetRequiredService<IMetadataRepository>();
            var teamId = "3f132f42-b74f-eb11-b822-00505683fbf4";

            var team = (await teamRepository.GetTeams(teamId)).ShouldHaveSingleItem();

            team.AssignedCommunitiesIds = (await metaDataRepository.GetCommunities()).Take(10).Select(c => c.Code);

            var updatedTeamId = await teamRepository.SaveTeam(team);

            var updatedTeam = (await teamRepository.GetTeams(updatedTeamId)).ShouldHaveSingleItem();
            updatedTeam.AssignedCommunitiesIds.OrderBy(c => c).ShouldBe(team.AssignedCommunitiesIds.OrderBy(c => c));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetTeamMembers()
        {
            var teamId = "3f132f42-b74f-eb11-b822-00505683fbf4";
            var members = await teamRepository.GetMembers(teamId);

            members.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanAddTeamMember()
        {
            var teamId = "3f132f42-b74f-eb11-b822-00505683fbf4";

            var newTeamMember = new TeamMember
            {
                Id = null,
                TeamId = teamId,
                FirstName = "first",
                LastName = "last",
                Email = "email@email.com",
                Phone = "123456",
                AgreementSignDate = DateTime.Now,
                LastSuccessfulLogin = DateTime.Now,
                Label = "label",
                Role = "role",
                ExternalUserId = "extid",
                UserName = "username",
                IsActive = true,
            };
            var newMemberId = await teamRepository.SaveMember(newTeamMember);

            var members = await teamRepository.GetMembers(teamId);

            var newMember = members.Where(m => m.Id == newMemberId).ShouldHaveSingleItem();
            newMember.Id.ShouldNotBeNull();
            newMember.TeamId.ShouldBe(newTeamMember.TeamId);
            newMember.FirstName.ShouldBe(newTeamMember.FirstName);
            newMember.LastName.ShouldBe(newTeamMember.LastName);
            newMember.Email.ShouldBe(newTeamMember.Email);
            //newMember.Phone.ShouldBe(newTeamMember.Phone);
            //newMember.Label.ShouldBe(newTeamMember.Label);
            //newMember.Role.ShouldBe(newTeamMember.Role);
            //newMember.UserName.ShouldBe(newTeamMember.UserName);
            newMember.ExternalUserId.ShouldBe(newTeamMember.ExternalUserId);
            newMember.IsActive.ShouldBe(newTeamMember.IsActive);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateTeamMember()
        {
            var teamId = "3f132f42-b74f-eb11-b822-00505683fbf4";
            var members = await teamRepository.GetMembers(teamId);

            var now = DateTime.Now;

            var memberToUpdate = members.First();
            memberToUpdate.AgreementSignDate.ShouldNotBe(now);

            memberToUpdate.AgreementSignDate = now;

            var updatedMemberId = await teamRepository.SaveMember(memberToUpdate);

            var updatedMembers = await teamRepository.GetMembers(teamId);

            var updatedMember = updatedMembers.Single(m => m.Id == updatedMemberId);
            updatedMember.AgreementSignDate.ShouldNotBeNull().ShouldBe(now.Date);
        }
    }
}
