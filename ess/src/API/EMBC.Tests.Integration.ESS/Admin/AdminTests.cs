using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Managers.Admin;
using EMBC.ESS.Managers.Metadata;
using EMBC.ESS.Shared.Contracts.Metadata;
using EMBC.ESS.Shared.Contracts.Suppliers;
using EMBC.ESS.Shared.Contracts.Team;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Admin
{
    public class AdminTests : WebAppTestBase
    {
        private readonly AdminManager adminManager;

        private string teamId = "98275853-2581-eb11-b825-00505683fbf4";
        private readonly string teamDemoId = "80ff138b-fa96-eb11-b827-00505683fbf4";

        public AdminTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            adminManager = services.GetRequiredService<AdminManager>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateMember()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), DateTimeKind.Unspecified);

            var newMember = new TeamMember
            {
                Email = "email@email.com",
                FirstName = "first",
                LastName = "last",
                IsActive = true,
                Label = "Volunteer",
                Role = "Tier1",
                AgreementSignDate = now,
                LastSuccessfulLogin = now,
                ExternalUserId = "extid",
                Phone = "1234",
                TeamId = teamId,
                UserName = $"username{Guid.NewGuid().ToString().Substring(0, 4)}"
            };

            var memberId = await adminManager.Handle(new SaveTeamMemberCommand { Member = newMember });

            memberId.ShouldNotBeNull();

            var existingMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = teamId, MemberId = memberId })).TeamMembers.ShouldHaveSingleItem();

            existingMember.Id.ShouldBe(memberId);
            existingMember.TeamId.ShouldBe(teamId);
            existingMember.TeamName.ShouldNotBeNull();
            existingMember.Email.ShouldBe(newMember.Email);
            existingMember.Phone.ShouldBe(newMember.Phone);
            existingMember.FirstName.ShouldBe(newMember.FirstName);
            existingMember.LastName.ShouldBe(newMember.LastName);
            existingMember.UserName.ShouldBe(newMember.UserName);
            existingMember.ExternalUserId.ShouldBe(newMember.ExternalUserId);
            existingMember.IsActive.ShouldBe(newMember.IsActive);
            existingMember.LastSuccessfulLogin.ShouldBe(newMember.LastSuccessfulLogin);
            existingMember.AgreementSignDate.ShouldBe(newMember.AgreementSignDate.Value.Date);
            existingMember.Label.ShouldBe(newMember.Label);
            existingMember.Role.ShouldBe(newMember.Role);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanActivateTeamMember()
        {
            var memberToUpdate = (await adminManager.Handle(new TeamMembersQuery { TeamId = teamId })).TeamMembers.First();

            await adminManager.Handle(new ActivateTeamMemberCommand { TeamId = teamId, MemberId = memberToUpdate.Id });

            var updatedMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = teamId, MemberId = memberToUpdate.Id })).TeamMembers.Single();
            updatedMember.IsActive.ShouldBeTrue();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanDeactivateTeamMember()
        {
            var memberToUpdate = (await adminManager.Handle(new TeamMembersQuery { TeamId = teamId })).TeamMembers.First();

            await adminManager.Handle(new DeactivateTeamMemberCommand { TeamId = teamId, MemberId = memberToUpdate.Id });

            var updatedMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = teamId, MemberId = memberToUpdate.Id, IncludeActiveUsersOnly = false })).TeamMembers.Single();
            updatedMember.IsActive.ShouldBeFalse();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanDeleteTeamMember()
        {
            var memberToDelete = (await adminManager.Handle(new TeamMembersQuery { TeamId = teamId })).TeamMembers.First();

            await adminManager.Handle(new DeleteTeamMemberCommand { TeamId = teamId, MemberId = memberToDelete.Id });

            var teamMembers = (await adminManager.Handle(new TeamMembersQuery { TeamId = teamId, MemberId = memberToDelete.Id })).TeamMembers;
            teamMembers.Where(m => m.Id == memberToDelete.Id).ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanValidateNewUserNameForExistingMember()
        {
            var aMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = teamId })).TeamMembers.First();
            aMember.UserName = Guid.NewGuid().ToString().Substring(0, 5);
            var validationResult = await adminManager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = aMember
            });
            validationResult.UniqueUserName.ShouldBeTrue();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanValidateSameUserNameForExistingMember()
        {
            var aMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = teamId })).TeamMembers.First();

            var validationResult = await adminManager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = aMember
            });
            validationResult.UniqueUserName.ShouldBeTrue();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanValidatExistingUserNameForExistingMember()
        {
            var members = (await adminManager.Handle(new TeamMembersQuery { TeamId = teamId })).TeamMembers;
            var aMember = members.Skip(0).First();
            var bMember = members.Skip(1).First();

            aMember.UserName = bMember.UserName;
            var validationResult = await adminManager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = aMember
            });
            validationResult.UniqueUserName.ShouldBeFalse();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanValidateUniqueUserNameForNewMember()
        {
            var validationResult = await adminManager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = new TeamMember { UserName = Guid.NewGuid().ToString().Substring(0, 5) }
            });
            validationResult.UniqueUserName.ShouldBeTrue();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanValidateDuplicateUserName1ForNewMember()
        {
            var aMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = teamId })).TeamMembers.First();

            var validationResult = await adminManager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = new TeamMember { UserName = aMember.UserName }
            });
            validationResult.UniqueUserName.ShouldBeFalse();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanQuerySingleTeam()
        {
            var team = (await adminManager.Handle(new TeamsQuery { TeamId = teamId })).Teams.ShouldHaveSingleItem();
            team.Id.ShouldBe(teamId);
            team.Name.ShouldNotBeNull();
            team.AssignedCommunities.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanQueryAllTeams()
        {
            var teams = (await adminManager.Handle(new TeamsQuery())).Teams;

            teams.Count().ShouldNotBe(0);
            teams.Single(t => t.Id == teamId).AssignedCommunities.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanAssignCommunitiesToTeam()
        {
            var metadataManager = services.GetRequiredService<MetadataManager>();
            var communities = (await metadataManager.Handle(new CommunitiesQuery())).Items;

            var assignedCommunities = (await adminManager.Handle(new TeamsQuery())).Teams.SelectMany(t => t.AssignedCommunities);

            var team = (await adminManager.Handle(new TeamsQuery { TeamId = teamId })).Teams.ShouldHaveSingleItem();

            var newCommunities = communities.Where(c => !assignedCommunities.Select(c => c.Code).Contains(c.Code)).Take(5).Select(c => c.Code);

            await adminManager.Handle(new AssignCommunitiesToTeamCommand { TeamId = teamId, Communities = newCommunities });

            var updatedTeam = (await adminManager.Handle(new TeamsQuery { TeamId = teamId })).Teams.ShouldHaveSingleItem();

            updatedTeam.AssignedCommunities.Select(c => c.Code).OrderBy(c => c).ShouldBe(team.AssignedCommunities.Select(c => c.Code).Concat(newCommunities).OrderBy(c => c));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUnassignCommunitiesToTeam()
        {
            var team = (await adminManager.Handle(new TeamsQuery { TeamId = teamId })).Teams.ShouldHaveSingleItem();

            var removedCommunities = team.AssignedCommunities.Take(2);

            await adminManager.Handle(new UnassignCommunitiesFromTeamCommand { TeamId = teamId, Communities = removedCommunities.Select(c => c.Code) });

            var updatedTeam = (await adminManager.Handle(new TeamsQuery { TeamId = teamId })).Teams.ShouldHaveSingleItem();

            updatedTeam.AssignedCommunities.Where(c => removedCommunities.Contains(c)).ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Query_Suppliers_ReturnsAllSuppliersForTeam()
        {
            var teamId = teamDemoId;
            var searchResults = await adminManager.Handle(new SuppliersQuery { TeamId = teamId });

            searchResults.Items.ShouldAllBe(s => s.Team.Id == teamId);
        }
    }
}
