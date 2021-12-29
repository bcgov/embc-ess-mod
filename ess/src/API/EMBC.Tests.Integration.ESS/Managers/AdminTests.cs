using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Managers.Admin;
using EMBC.ESS.Shared.Contracts.Metadata;
using EMBC.ESS.Shared.Contracts.Suppliers;
using EMBC.ESS.Shared.Contracts.Team;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Managers
{
    public class AdminTests : DynamicsWebAppTestBase
    {
        private readonly AdminManager adminManager;

        public AdminTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            adminManager = Services.GetRequiredService<AdminManager>();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanCreateMember()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - now.Ticks % TimeSpan.TicksPerSecond, DateTimeKind.Unspecified);
            var uniqueSignature = TestData.TestPrefix + "-" + Guid.NewGuid().ToString().Substring(0, 4);

            var newMember = new TeamMember
            {
                Email = "email@email.com",
                FirstName = uniqueSignature + "-first",
                LastName = uniqueSignature + "-last",
                IsActive = true,
                Label = "Volunteer",
                Role = "Tier1",
                AgreementSignDate = now,
                LastSuccessfulLogin = now,
                ExternalUserId = uniqueSignature + "-extid",
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

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanActivateTeamMember()
        {
            var memberToUpdate = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();

            await adminManager.Handle(new ActivateTeamMemberCommand { TeamId = TestData.TeamId, MemberId = memberToUpdate.Id });

            var updatedMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberToUpdate.Id })).TeamMembers.Single();
            updatedMember.IsActive.ShouldBeTrue();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanDeactivateTeamMember()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - now.Ticks % TimeSpan.TicksPerSecond, DateTimeKind.Unspecified);
            var uniqueSignature = TestData.TestPrefix + "-" + Guid.NewGuid().ToString().Substring(0, 4);

            var newMember = new TeamMember
            {
                Email = "email@email.com",
                FirstName = uniqueSignature + "-to-deactivate",
                LastName = uniqueSignature + "-to-deactivate",
                IsActive = true,
                Label = "Volunteer",
                Role = "Tier1",
                AgreementSignDate = now,
                LastSuccessfulLogin = now,
                ExternalUserId = "deactivate-extid",
                Phone = "1234",
                TeamId = TestData.TeamId,
                UserName = $"username{Guid.NewGuid().ToString().Substring(0, 4)}"
            };

            var memberId = await adminManager.Handle(new SaveTeamMemberCommand { Member = newMember });

            memberId.ShouldNotBeNull();

            await adminManager.Handle(new DeactivateTeamMemberCommand { TeamId = TestData.TeamId, MemberId = memberId });

            var updatedMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberId, IncludeActiveUsersOnly = false })).TeamMembers.Single();
            updatedMember.IsActive.ShouldBeFalse();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanDeleteTeamMember()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - now.Ticks % TimeSpan.TicksPerSecond, DateTimeKind.Unspecified);
            var uniqueSignature = TestData.TestPrefix + "-" + Guid.NewGuid().ToString().Substring(0, 4);

            var newMember = new TeamMember
            {
                Email = "email@email.com",
                FirstName = uniqueSignature + "-to-deactivate",
                LastName = uniqueSignature + "-to-deactivate",
                IsActive = true,
                Label = "Volunteer",
                Role = "Tier1",
                AgreementSignDate = now,
                LastSuccessfulLogin = now,
                ExternalUserId = "deactivate-extid",
                Phone = "1234",
                TeamId = TestData.TeamId,
                UserName = $"username{Guid.NewGuid().ToString().Substring(0, 4)}"
            };

            var memberId = await adminManager.Handle(new SaveTeamMemberCommand { Member = newMember });
            memberId.ShouldNotBeNull();

            await adminManager.Handle(new DeleteTeamMemberCommand { TeamId = TestData.TeamId, MemberId = memberId });

            var teamMembers = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberId })).TeamMembers;
            teamMembers.Where(m => m.Id == memberId).ShouldBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
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

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanValidateSameUserNameForExistingMember()
        {
            var aMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();

            var validationResult = await adminManager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = aMember
            });
            validationResult.UniqueUserName.ShouldBeTrue();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
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

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanValidateUniqueUserNameForNewMember()
        {
            var validationResult = await adminManager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = new TeamMember { UserName = Guid.NewGuid().ToString().Substring(0, 5) }
            });
            validationResult.UniqueUserName.ShouldBeTrue();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanValidateDuplicateUserNameForNewMember()
        {
            var aMember = (await adminManager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();

            var validationResult = await adminManager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = new TeamMember { UserName = aMember.UserName }
            });
            validationResult.UniqueUserName.ShouldBeFalse();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanQuerySingleTeam()
        {
            var team = (await adminManager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();
            team.Id.ShouldBe(TestData.TeamId);
            team.Name.ShouldNotBeNull();
            team.AssignedCommunities.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanQueryTeamByCommunity()
        {
            var teams = (await adminManager.Handle(new TeamsQuery { CommunityCode = TestData.TeamCommunityId })).Teams;
            teams.ShouldNotBeEmpty();
            teams.ShouldAllBe(t => t.AssignedCommunities.Any(c => c.Code == TestData.TeamCommunityId));
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanQueryAllTeams()
        {
            var teams = (await adminManager.Handle(new TeamsQuery())).Teams;

            teams.ShouldNotBeEmpty();
            teams.Single(t => t.Id == TestData.TeamId).AssignedCommunities.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanAssignCommunitiesToTeam()
        {
            var manager = Services.GetRequiredService<AdminManager>();
            var communities = (await manager.Handle(new CommunitiesQuery())).Items;

            var assignedCommunities = (await adminManager.Handle(new TeamsQuery())).Teams.SelectMany(t => t.AssignedCommunities);

            var team = (await adminManager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            var newCommunities = communities.Where(c => !assignedCommunities.Select(c => c.Code).Contains(c.Code)).Take(5).Select(c => c.Code).ToList();
            if (!assignedCommunities.Any(c => c.Code == TestData.ActiveTaskCommunity) && !newCommunities.Any(c => c == TestData.ActiveTaskCommunity)) newCommunities.Add(TestData.ActiveTaskCommunity);

            await adminManager.Handle(new AssignCommunitiesToTeamCommand { TeamId = TestData.TeamId, Communities = newCommunities });

            var updatedTeam = (await adminManager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            updatedTeam.AssignedCommunities.Select(c => c.Code).OrderBy(c => c).ShouldBe(team.AssignedCommunities.Select(c => c.Code).Concat(newCommunities).OrderBy(c => c));
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanUnassignCommunitiesToTeam()
        {
            var team = (await adminManager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            var removedCommunities = team.AssignedCommunities.Where(c => c.Code != TestData.ActiveTaskCommunity).Take(2);

            await adminManager.Handle(new UnassignCommunitiesFromTeamCommand { TeamId = TestData.TeamId, Communities = removedCommunities.Select(c => c.Code) });

            var updatedTeam = (await adminManager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            updatedTeam.AssignedCommunities.Where(c => removedCommunities.Contains(c)).ShouldBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Query_Suppliers_ReturnsAllSuppliersForTeam()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { TeamId = TestData.TeamId });

            var primarySuppliers = searchResults.Items.Where(s => s.Team.Id == TestData.TeamId);
            var mutualAidSuppliers = searchResults.Items.Where(s => s.Team.Id != TestData.TeamId);

            primarySuppliers.ShouldAllBe(s => !s.SharedWithTeams.Any(t => t.Id == TestData.TeamId));
            mutualAidSuppliers.ShouldAllBe(s => s.SharedWithTeams.Any(t => t.Id == TestData.TeamId));
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Query_Suppliers_ReturnsSuppliersById()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId });

            searchResults.Items.ShouldHaveSingleItem();
            searchResults.Items.ShouldAllBe(s => s.Id == TestData.SupplierAId);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task QueryInActiveById_Suppliers_ReturnsNothing()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.InactiveSupplierId });

            searchResults.Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task QueryInActiveByName_Suppliers_ReturnsNothing()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { LegalName = TestData.InactiveSupplierLegalName, GSTNumber = TestData.InactiveSupplierGST });

            searchResults.Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Query_Suppliers_ReturnsSuppliersByLegalNameAndGSTNumber()
        {
            var searchResults = await adminManager.Handle(new SuppliersQuery { LegalName = TestData.SupplierALegalName, GSTNumber = TestData.SupplierAGST });

            searchResults.Items.ShouldAllBe(s => s.LegalName == TestData.SupplierALegalName && s.GSTNumber == TestData.SupplierAGST);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Create_Suppliers_ReturnsSupplierId()
        {
            var uniqueSignature = TestData.TestPrefix + "-" + Guid.NewGuid().ToString().Substring(0, 4);
            var supplier = new Supplier
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

            var newSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = supplierId })).Items.ShouldHaveSingleItem();
            newSupplier.Status.ShouldBe(SupplierStatus.Active);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Update_Suppliers_ReturnsSupplierId()
        {
            var supplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();

            var currentCommunity = supplier.Address.Community;
            var newCommunity = currentCommunity == TestData.TeamCommunityId
                ? TestData.OtherCommunityId
                : TestData.TeamCommunityId;

            supplier.Address.Community = newCommunity;

            await adminManager.Handle(new SaveSupplierCommand { Supplier = supplier });

            var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();
            updatedSupplier.Address.Community.ShouldBe(newCommunity);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Activate_Suppliers_ReturnsSupplierId()
        {
            var results = await adminManager.Handle(new ActivateSupplierCommand { TeamId = TestData.TeamId, SupplierId = TestData.SupplierAId });

            results.ShouldBe(TestData.SupplierAId);

            var searchResults = await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId });
            var updatedSupplier = searchResults.Items.ShouldHaveSingleItem();
            updatedSupplier.Status.ShouldBe(SupplierStatus.Active);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Deactivate_Suppliers_ReturnsSupplierId()
        {
            var results = await adminManager.Handle(new DeactivateSupplierCommand { TeamId = TestData.TeamId, SupplierId = TestData.SupplierCId });

            results.ShouldBe(TestData.SupplierCId);

            var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierCId })).Items.ShouldHaveSingleItem();
            updatedSupplier.Status.ShouldBe(SupplierStatus.Inactive);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Claim_Suppliers_ReturnsSupplierId()
        {
            var testSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();

            if (testSupplier.Team != null && testSupplier.Team.Id != null)
            {
                testSupplier.Team.Id = null;
                testSupplier.Team.Name = null;

                testSupplier.SharedWithTeams = Array.Empty<EMBC.ESS.Shared.Contracts.Suppliers.Team>();

                await adminManager.Handle(new SaveSupplierCommand { Supplier = testSupplier });
                var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();

                updatedSupplier.Team.ShouldBe(null);
            }

            await adminManager.Handle(new ClaimSupplierCommand { SupplierId = testSupplier.Id, TeamId = TestData.TeamId });

            var twiceUpdatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();

            twiceUpdatedSupplier.Team.Id.ShouldBe(TestData.TeamId);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Remove_Suppliers_ReturnsSupplierId()
        {
            await adminManager.Handle(new RemoveSupplierCommand { SupplierId = TestData.SupplierAId });

            var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();
            updatedSupplier.Team.ShouldBe(null);
            updatedSupplier.SharedWithTeams.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task AddSharedWithTeam_Suppliers_ReturnsSupplierId()
        {
            var testSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();

            if (testSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId) != null)
            {
                testSupplier.SharedWithTeams = testSupplier.SharedWithTeams.Where(t => t.Id != TestData.OtherTeamId);
                await adminManager.Handle(new SaveSupplierCommand { Supplier = testSupplier });
                var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();

                updatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId).ShouldBe(null);
            }

            await adminManager.Handle(new ShareSupplierWithTeamCommand { SupplierId = testSupplier.Id, TeamId = TestData.OtherTeamId });

            var twiceUpdatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();

            twiceUpdatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId).ShouldNotBe(null);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task RemoveSharedWithTeam_Suppliers_ReturnsSupplierId()
        {
            var testSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();

            if (testSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId) == null)
            {
                var team = new EMBC.ESS.Shared.Contracts.Suppliers.Team { Id = TestData.OtherTeamId };
                testSupplier.SharedWithTeams = testSupplier.SharedWithTeams.Concat(new[] { team });

                await adminManager.Handle(new SaveSupplierCommand { Supplier = testSupplier });
                var updatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();

                updatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId).ShouldNotBe(null);
            }

            await adminManager.Handle(new UnshareSupplierWithTeamCommand { SupplierId = testSupplier.Id, TeamId = TestData.OtherTeamId });

            var twiceUpdatedSupplier = (await adminManager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();

            twiceUpdatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId).ShouldBe(null);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanGetCountries()
        {
            var manager = Services.GetRequiredService<AdminManager>();

            var reply = await manager.Handle(new CountriesQuery());

            reply.ShouldNotBeNull().Items.ShouldNotBeEmpty();
            reply.Items.ShouldAllBe(c => c.Code != null && c.Name != null);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanGetStateProvinces()
        {
            var manager = Services.GetRequiredService<AdminManager>();

            var reply = await manager.Handle(new StateProvincesQuery());

            reply.ShouldNotBeNull().Items.ShouldNotBeEmpty();
            reply.Items.ShouldAllBe(c => c.Code != null && c.Name != null && c.CountryCode != null);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanGetCommunities()
        {
            var manager = Services.GetRequiredService<AdminManager>();

            var reply = await manager.Handle(new CommunitiesQuery());

            reply.ShouldNotBeNull().Items.ShouldNotBeEmpty();
            reply.Items.ShouldAllBe(c => c.Code != null && c.Name != null && c.CountryCode != null);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanGetSecurityQuestions()
        {
            var manager = Services.GetRequiredService<AdminManager>();

            var reply = await manager.Handle(new SecurityQuestionsQuery());

            reply.ShouldNotBeNull().Items.ShouldNotBeEmpty();
            reply.Items.ShouldAllBe(c => !string.IsNullOrEmpty(c));
        }
    }
}
