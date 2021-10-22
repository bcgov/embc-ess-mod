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
        private readonly string teamOneId = "b4fe0e73-f980-eb11-b825-00505683fbf4";
        private readonly string ACBSupplierId = "a4481e78-5998-ea11-b818-00505683fbf4";
        private readonly string legalName = "ABC General Store";
        private readonly string gstNumber = "678953424 RT 0001";
        private readonly string testSupplierId = "72c7fccb-32d7-4791-b21d-55247af39da0";
        private readonly string inactiveSupplierId = "062e897a-790a-ec11-b82d-00505683fbf4";
        private readonly string inactiveSupplierName = "Test Inactive Supplier Ltd.";
        private readonly string inactiveSupplierGSTNumber = "678953424 RT 1111";
        private readonly string abbotsfordCommunityId = "7069dfaf-9f97-ea11-b813-005056830319";

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
        public async Task CanQueryTeamByCommunity()
        {
            var teams = (await adminManager.Handle(new TeamsQuery { CommunityCode = abbotsfordCommunityId })).Teams;
            teams.ShouldNotBeEmpty();
            teams.ShouldAllBe(t => t.AssignedCommunities.Any(c => c.Code == abbotsfordCommunityId));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanQueryAllTeams()
        {
            var teams = (await adminManager.Handle(new TeamsQuery())).Teams;

            teams.ShouldNotBeEmpty();
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

            var primarySuppliers = searchResults.Items.Where(s => s.Team.Id == teamId);
            var mutualAidSuppliers = searchResults.Items.Where(s => s.Team.Id != teamId);

            primarySuppliers.ShouldAllBe(s => !s.SharedWithTeams.Any(t => t.Id == teamId));
            mutualAidSuppliers.ShouldAllBe(s => s.SharedWithTeams.Any(t => t.Id == teamId));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Query_Suppliers_ReturnsSuppliersById()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { SupplierId = ACBSupplierId });

            searchResults.Items.ShouldHaveSingleItem();
            searchResults.Items.ShouldAllBe(s => s.Id == ACBSupplierId);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task QueryInActiveById_Suppliers_ReturnsNothing()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { SupplierId = inactiveSupplierId });

            searchResults.Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task QueryInActiveByName_Suppliers_ReturnsNothing()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { LegalName = inactiveSupplierName, GSTNumber = inactiveSupplierGSTNumber });

            searchResults.Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Query_Suppliers_ReturnsSuppliersByLegalNameAndGSTNumber()
        {
            var teamId = teamDemoId;
            var searchResults = await adminManager.Handle(new SuppliersQuery { LegalName = legalName, GSTNumber = gstNumber });

            searchResults.Items.ShouldAllBe(s => s.LegalName == legalName && s.GSTNumber == gstNumber);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Create_Suppliers_ReturnsSupplierId()
        {
            var uniqueSignature = Guid.NewGuid().ToString().Substring(0, 4);
            Supplier supplier = new Supplier
            {
                Name = $"{uniqueSignature}-Test Supplier",
                LegalName = $"{uniqueSignature}-Test Supplier Ltd.",
                GSTNumber = "123456789 RT 1234",
                Address = new Address
                {
                    AddressLine1 = "123 Test St.",
                    Country = "CAN",
                    StateProvince = "BC",
                    PostalCode = "v1v 1v1",
                    Community = "226adfaf-9f97-ea11-b813-005056830319"
                },
                Contact = new SupplierContact
                {
                    FirstName = $"{uniqueSignature}-Test",
                    LastName = $"{uniqueSignature}-Contact",
                    Phone = "6049877897",
                    Email = "suppliercontact@email.com"
                },
                Team = new EMBC.ESS.Shared.Contracts.Suppliers.Team
                {
                    Id = teamDemoId
                },
                Status = SupplierStatus.Active
            };

            var supplierId = await adminManager.Handle(new SaveSupplierCommand { Supplier = supplier });

            var newSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = supplierId })).Items.SingleOrDefault();
            newSupplier.Status.ShouldBe(SupplierStatus.Active);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Update_Suppliers_ReturnsSupplierId()
        {
            var supplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = ACBSupplierId })).Items.SingleOrDefault();

            var currentCommunity = supplier.Address.Community;
            var newCommunity = currentCommunity == "406adfaf-9f97-ea11-b813-005056830319"
                ? "226adfaf-9f97-ea11-b813-005056830319"
                : "406adfaf-9f97-ea11-b813-005056830319";

            supplier.Address.Community = newCommunity;

            await adminManager.Handle(new SaveSupplierCommand { Supplier = supplier });

            var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = ACBSupplierId })).Items.SingleOrDefault();
            updatedSupplier.Address.Community.ShouldBe(newCommunity);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Activate_Suppliers_ReturnsSupplierId()
        {
            var results = await adminManager.Handle(new ActivateSupplierCommand { TeamId = teamDemoId, SupplierId = ACBSupplierId });

            results.ShouldBe(ACBSupplierId);

            var searchResults = await adminManager.Handle(new SuppliersQuery { SupplierId = ACBSupplierId });
            var updatedSupplier = searchResults.Items.SingleOrDefault();
            updatedSupplier.Status.ShouldBe(SupplierStatus.Active);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Deactivate_Suppliers_ReturnsSupplierId()
        {
            var results = await adminManager.Handle(new DeactivateSupplierCommand { TeamId = teamDemoId, SupplierId = ACBSupplierId });

            results.ShouldBe(ACBSupplierId);

            var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = ACBSupplierId })).Items.SingleOrDefault();
            updatedSupplier.Status.ShouldBe(SupplierStatus.Inactive);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Claim_Suppliers_ReturnsSupplierId()
        {
            var testSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplierId })).Items.SingleOrDefault();

            if (testSupplier.Team != null && testSupplier.Team.Id != null)
            {
                testSupplier.Team.Id = null;
                testSupplier.Team.Name = null;

                testSupplier.SharedWithTeams = Array.Empty<EMBC.ESS.Shared.Contracts.Suppliers.Team>();

                await adminManager.Handle(new SaveSupplierCommand { Supplier = testSupplier });
                var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.SingleOrDefault();

                updatedSupplier.Team.ShouldBe(null);
            }

            await adminManager.Handle(new ClaimSupplierCommand { SupplierId = testSupplier.Id, TeamId = teamDemoId });

            var twiceUpdatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.SingleOrDefault();

            twiceUpdatedSupplier.Team.Id.ShouldBe(teamDemoId);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Remove_Suppliers_ReturnsSupplierId()
        {
            await adminManager.Handle(new RemoveSupplierCommand { SupplierId = testSupplierId });

            var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplierId })).Items.SingleOrDefault();
            updatedSupplier.Team.ShouldBe(null);
            updatedSupplier.SharedWithTeams.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task AddSharedWithTeam_Suppliers_ReturnsSupplierId()
        {
            var testSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplierId })).Items.SingleOrDefault();

            if (testSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == teamOneId) != null)
            {
                testSupplier.SharedWithTeams = testSupplier.SharedWithTeams.Where(t => t.Id != teamOneId);
                await adminManager.Handle(new SaveSupplierCommand { Supplier = testSupplier });
                var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.SingleOrDefault();

                updatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == teamOneId).ShouldBe(null);
            }

            await adminManager.Handle(new AddSupplierSharedWithTeamCommand { SupplierId = testSupplier.Id, TeamId = teamOneId });

            var twiceUpdatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.SingleOrDefault();

            twiceUpdatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == teamOneId).ShouldNotBe(null);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task RemoveSharedWithTeam_Suppliers_ReturnsSupplierId()
        {
            var testSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplierId })).Items.SingleOrDefault();

            if (testSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == teamOneId) == null)
            {
                var team = new EMBC.ESS.Shared.Contracts.Suppliers.Team { Id = teamOneId };
                testSupplier.SharedWithTeams = testSupplier.SharedWithTeams.Concat(new[] { team });

                await adminManager.Handle(new SaveSupplierCommand { Supplier = testSupplier });
                var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.SingleOrDefault();

                updatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == teamOneId).ShouldNotBe(null);
            }

            await adminManager.Handle(new RemoveSupplierSharedWithTeamCommand { SupplierId = testSupplier.Id, TeamId = teamOneId });

            var twiceUpdatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.SingleOrDefault();

            twiceUpdatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == teamOneId).ShouldBe(null);
        }
    }
}
