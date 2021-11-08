using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Managers.Admin;
using EMBC.ESS.Managers.Metadata;
using EMBC.ESS.Shared.Contracts.Metadata;
using EMBC.ESS.Shared.Contracts.Suppliers;
using EMBC.ESS.Shared.Contracts.Team;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Admin
{
    public class AdminTests : WebAppTestBase
    {
        private readonly AdminManager adminManager;

        public AdminTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
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
                TeamId = TestData.TeamId,
                UserName = $"username{Guid.NewGuid().ToString().Substring(0, 4)}"
            };

            var memberId = await adminManager.Handle(new SaveTeamMemberCommand { Member = newMember });

            memberId.ShouldNotBeNull();

            var existingMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberId })).TeamMembers.ShouldHaveSingleItem();

            existingMember.Id.ShouldBe(memberId);
            existingMember.TeamId.ShouldBe(TestData.TeamId);
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
            var memberToUpdate = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();

            await adminManager.Handle(new ActivateTeamMemberCommand { TeamId = TestData.TeamId, MemberId = memberToUpdate.Id });

            var updatedMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberToUpdate.Id })).TeamMembers.Single();
            updatedMember.IsActive.ShouldBeTrue();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanDeactivateTeamMember()
        {
            var memberToUpdate = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();

            await adminManager.Handle(new DeactivateTeamMemberCommand { TeamId = TestData.TeamId, MemberId = memberToUpdate.Id });

            var updatedMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberToUpdate.Id, IncludeActiveUsersOnly = false })).TeamMembers.Single();
            updatedMember.IsActive.ShouldBeFalse();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanDeleteTeamMember()
        {
            var memberToDelete = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();

            await adminManager.Handle(new DeleteTeamMemberCommand { TeamId = TestData.TeamId, MemberId = memberToDelete.Id });

            var teamMembers = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberToDelete.Id })).TeamMembers;
            teamMembers.Where(m => m.Id == memberToDelete.Id).ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanValidateNewUserNameForExistingMember()
        {
            var aMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();
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
            var aMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();

            var validationResult = await adminManager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = aMember
            });
            validationResult.UniqueUserName.ShouldBeTrue();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanValidatExistingUserNameForExistingMember()
        {
            var members = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers;
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
        public async Task CanValidateDuplicateUserNameForNewMember()
        {
            var aMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();

            var validationResult = await adminManager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = new TeamMember { UserName = aMember.UserName }
            });
            validationResult.UniqueUserName.ShouldBeFalse();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanQuerySingleTeam()
        {
            var team = (await adminManager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();
            team.Id.ShouldBe(TestData.TeamId);
            team.Name.ShouldNotBeNull();
            team.AssignedCommunities.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanQueryTeamByCommunity()
        {
            var teams = (await adminManager.Handle(new TeamsQuery { CommunityCode = TestData.TeamCommunityId })).Teams;
            teams.ShouldNotBeEmpty();
            teams.ShouldAllBe(t => t.AssignedCommunities.Any(c => c.Code == TestData.TeamCommunityId));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanQueryAllTeams()
        {
            var teams = (await adminManager.Handle(new TeamsQuery())).Teams;

            teams.ShouldNotBeEmpty();
            teams.Single(t => t.Id == TestData.TeamId).AssignedCommunities.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanAssignCommunitiesToTeam()
        {
            var metadataManager = services.GetRequiredService<MetadataManager>();
            var communities = (await metadataManager.Handle(new CommunitiesQuery())).Items;

            var assignedCommunities = (await adminManager.Handle(new TeamsQuery())).Teams.SelectMany(t => t.AssignedCommunities);

            var team = (await adminManager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            var newCommunities = communities.Where(c => !assignedCommunities.Select(c => c.Code).Contains(c.Code)).Take(5).Select(c => c.Code);

            await adminManager.Handle(new AssignCommunitiesToTeamCommand { TeamId = TestData.TeamId, Communities = newCommunities });

            var updatedTeam = (await adminManager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            updatedTeam.AssignedCommunities.Select(c => c.Code).OrderBy(c => c).ShouldBe(team.AssignedCommunities.Select(c => c.Code).Concat(newCommunities).OrderBy(c => c));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUnassignCommunitiesToTeam()
        {
            var team = (await adminManager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            var removedCommunities = team.AssignedCommunities.Take(2);

            await adminManager.Handle(new UnassignCommunitiesFromTeamCommand { TeamId = TestData.TeamId, Communities = removedCommunities.Select(c => c.Code) });

            var updatedTeam = (await adminManager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            updatedTeam.AssignedCommunities.Where(c => removedCommunities.Contains(c)).ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Query_Suppliers_ReturnsAllSuppliersForTeam()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { TeamId = TestData.TeamId });

            var primarySuppliers = searchResults.Items.Where(s => s.Team.Id == TestData.TeamId);
            var mutualAidSuppliers = searchResults.Items.Where(s => s.Team.Id != TestData.TeamId);

            primarySuppliers.ShouldAllBe(s => !s.SharedWithTeams.Any(t => t.Id == TestData.TeamId));
            mutualAidSuppliers.ShouldAllBe(s => s.SharedWithTeams.Any(t => t.Id == TestData.TeamId));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Query_Suppliers_ReturnsSuppliersById()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId });

            searchResults.Items.ShouldHaveSingleItem();
            searchResults.Items.ShouldAllBe(s => s.Id == TestData.SupplierAId);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task QueryInActiveById_Suppliers_ReturnsNothing()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.InactiveSupplierId });

            searchResults.Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task QueryInActiveByName_Suppliers_ReturnsNothing()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { LegalName = TestData.InactiveSupplierLegalName, GSTNumber = TestData.InactiveSupplierGST });

            searchResults.Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Query_Suppliers_ReturnsSuppliersByLegalNameAndGSTNumber()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { LegalName = TestData.SupplierALegalName, GSTNumber = TestData.SupplierAGST });

            searchResults.Items.ShouldAllBe(s => s.LegalName == TestData.SupplierALegalName && s.GSTNumber == TestData.SupplierAGST);
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
                    Id = TestData.TeamId
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
            var supplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.SingleOrDefault();

            var currentCommunity = supplier.Address.Community;
            var newCommunity = currentCommunity == TestData.TeamCommunityId
                ? TestData.OtherCommunityId
                : TestData.TeamCommunityId;

            supplier.Address.Community = newCommunity;

            await adminManager.Handle(new SaveSupplierCommand { Supplier = supplier });

            var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.SingleOrDefault();
            updatedSupplier.Address.Community.ShouldBe(newCommunity);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Activate_Suppliers_ReturnsSupplierId()
        {
            var results = await adminManager.Handle(new ActivateSupplierCommand { TeamId = TestData.TeamId, SupplierId = TestData.SupplierAId });

            results.ShouldBe(TestData.SupplierAId);

            var searchResults = await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId });
            var updatedSupplier = searchResults.Items.SingleOrDefault();
            updatedSupplier.Status.ShouldBe(SupplierStatus.Active);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Deactivate_Suppliers_ReturnsSupplierId()
        {
            var results = await adminManager.Handle(new DeactivateSupplierCommand { TeamId = TestData.TeamId, SupplierId = TestData.SupplierAId });

            results.ShouldBe(TestData.SupplierAId);

            var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.SingleOrDefault();
            updatedSupplier.Status.ShouldBe(SupplierStatus.Inactive);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Claim_Suppliers_ReturnsSupplierId()
        {
            var testSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.SingleOrDefault();

            if (testSupplier.Team != null && testSupplier.Team.Id != null)
            {
                testSupplier.Team.Id = null;
                testSupplier.Team.Name = null;

                testSupplier.SharedWithTeams = Array.Empty<EMBC.ESS.Shared.Contracts.Suppliers.Team>();

                await adminManager.Handle(new SaveSupplierCommand { Supplier = testSupplier });
                var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.SingleOrDefault();

                updatedSupplier.Team.ShouldBe(null);
            }

            await adminManager.Handle(new ClaimSupplierCommand { SupplierId = testSupplier.Id, TeamId = TestData.TeamId });

            var twiceUpdatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.SingleOrDefault();

            twiceUpdatedSupplier.Team.Id.ShouldBe(TestData.TeamId);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Remove_Suppliers_ReturnsSupplierId()
        {
            await adminManager.Handle(new RemoveSupplierCommand { SupplierId = TestData.SupplierAId });

            var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.SingleOrDefault();
            updatedSupplier.Team.ShouldBe(null);
            updatedSupplier.SharedWithTeams.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task AddSharedWithTeam_Suppliers_ReturnsSupplierId()
        {
            var testSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.SingleOrDefault();

            if (testSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId) != null)
            {
                testSupplier.SharedWithTeams = testSupplier.SharedWithTeams.Where(t => t.Id != TestData.OtherTeamId);
                await adminManager.Handle(new SaveSupplierCommand { Supplier = testSupplier });
                var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.SingleOrDefault();

                updatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId).ShouldBe(null);
            }

            await adminManager.Handle(new AddSupplierSharedWithTeamCommand { SupplierId = testSupplier.Id, TeamId = TestData.OtherTeamId });

            var twiceUpdatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.SingleOrDefault();

            twiceUpdatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId).ShouldNotBe(null);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task RemoveSharedWithTeam_Suppliers_ReturnsSupplierId()
        {
            var testSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.SingleOrDefault();

            if (testSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId) == null)
            {
                var team = new EMBC.ESS.Shared.Contracts.Suppliers.Team { Id = TestData.OtherTeamId };
                testSupplier.SharedWithTeams = testSupplier.SharedWithTeams.Concat(new[] { team });

                await adminManager.Handle(new SaveSupplierCommand { Supplier = testSupplier });
                var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.SingleOrDefault();

                updatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId).ShouldNotBe(null);
            }

            await adminManager.Handle(new RemoveSupplierSharedWithTeamCommand { SupplierId = testSupplier.Id, TeamId = TestData.OtherTeamId });

            var twiceUpdatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.SingleOrDefault();

            twiceUpdatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId).ShouldBe(null);
        }
    }
}
