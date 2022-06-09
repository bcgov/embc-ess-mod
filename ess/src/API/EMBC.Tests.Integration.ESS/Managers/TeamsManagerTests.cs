using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Managers.Teams;
using EMBC.ESS.Shared.Contracts.Teams;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Managers
{
    public class TeamsManagerTests : DynamicsWebAppTestBase
    {
        private readonly TeamsManager manager;

        public TeamsManagerTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            manager = Services.GetRequiredService<TeamsManager>();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanCreateMember()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - now.Ticks % TimeSpan.TicksPerSecond, DateTimeKind.Unspecified);
            var uniqueSignature = TestData.TestPrefix + "-" + Guid.NewGuid().ToString().Substring(0, 4);

            var newMember = new TeamMember
            {
                Email = $"{uniqueSignature}eraunitest@test.gov.bc.ca",
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

            var memberId = await manager.Handle(new SaveTeamMemberCommand { Member = newMember });

            memberId.ShouldNotBeNull();

            var existingMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberId })).TeamMembers.ShouldHaveSingleItem();

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
            var memberToUpdate = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();

            await manager.Handle(new ActivateTeamMemberCommand { TeamId = TestData.TeamId, MemberId = memberToUpdate.Id });

            var updatedMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberToUpdate.Id })).TeamMembers.Single();
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
                Email = $"{uniqueSignature}eraunitest@test.gov.bc.ca",
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

            var memberId = await manager.Handle(new SaveTeamMemberCommand { Member = newMember });

            memberId.ShouldNotBeNull();

            await manager.Handle(new DeactivateTeamMemberCommand { TeamId = TestData.TeamId, MemberId = memberId });

            var updatedMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberId, IncludeActiveUsersOnly = false })).TeamMembers.Single();
            updatedMember.IsActive.ShouldBeFalse();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task RemoveLabel_TeamMemberWithLabel_LabelRemoved()
        {
            var memberToUpdate = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();
            if (string.IsNullOrEmpty(memberToUpdate.Label))
            {
                memberToUpdate.Label = "Volunteer";
                await manager.Handle(new SaveTeamMemberCommand { Member = memberToUpdate });
                memberToUpdate = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberToUpdate.Id })).TeamMembers.Single();
            }
            memberToUpdate.Label.ShouldNotBeNull();
            memberToUpdate.Label = null;
            await manager.Handle(new SaveTeamMemberCommand { Member = memberToUpdate });

            var updatedMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberToUpdate.Id })).TeamMembers.Single();
            updatedMember.Label.ShouldBeNull();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanDeleteTeamMember()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - now.Ticks % TimeSpan.TicksPerSecond, DateTimeKind.Unspecified);
            var uniqueSignature = TestData.TestPrefix + "-" + Guid.NewGuid().ToString().Substring(0, 4);

            var newMember = new TeamMember
            {
                Email = $"{uniqueSignature}eraunitest@test.gov.bc.ca",
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

            var memberId = await manager.Handle(new SaveTeamMemberCommand { Member = newMember });
            memberId.ShouldNotBeNull();

            await manager.Handle(new DeleteTeamMemberCommand { TeamId = TestData.TeamId, MemberId = memberId });

            var teamMembers = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId, MemberId = memberId })).TeamMembers;
            teamMembers.Where(m => m.Id == memberId).ShouldBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanValidateNewUserNameForExistingMember()
        {
            var aMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();
            aMember.UserName = Guid.NewGuid().ToString().Substring(0, 5);
            var validationResult = await manager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = aMember
            });
            validationResult.UniqueUserName.ShouldBeTrue();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanValidateSameUserNameForExistingMember()
        {
            var aMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();

            var validationResult = await manager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = aMember
            });
            validationResult.UniqueUserName.ShouldBeTrue();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanValidatExistingUserNameForExistingMember()
        {
            var members = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers;
            var aMember = members.Skip(0).First();
            var bMember = members.Skip(1).First();

            aMember.UserName = bMember.UserName;
            var validationResult = await manager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = aMember
            });
            validationResult.UniqueUserName.ShouldBeFalse();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanValidateUniqueUserNameForNewMember()
        {
            var validationResult = await manager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = new TeamMember { UserName = Guid.NewGuid().ToString().Substring(0, 5) }
            });
            validationResult.UniqueUserName.ShouldBeTrue();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanValidateDuplicateUserNameForNewMember()
        {
            var aMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.TeamId })).TeamMembers.First();

            var validationResult = await manager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = new TeamMember { UserName = aMember.UserName }
            });
            validationResult.UniqueUserName.ShouldBeFalse();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanQuerySingleTeam()
        {
            var team = (await manager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();
            team.Id.ShouldBe(TestData.TeamId);
            team.Name.ShouldNotBeNull();
            team.AssignedCommunities.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanQueryTeamByCommunity()
        {
            var teams = (await manager.Handle(new TeamsQuery { CommunityCode = TestData.TeamCommunityId })).Teams;
            teams.ShouldNotBeEmpty();
            teams.ShouldAllBe(t => t.AssignedCommunities.Any(c => c.Code == TestData.TeamCommunityId));
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanQueryAllTeams()
        {
            var teams = (await manager.Handle(new TeamsQuery())).Teams;

            teams.ShouldNotBeEmpty();
            teams.Single(t => t.Id == TestData.TeamId).AssignedCommunities.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanAssignCommunitiesToTeam()
        {
            var communities = TestData.Commmunities;

            var assignedCommunities = (await manager.Handle(new TeamsQuery())).Teams.SelectMany(t => t.AssignedCommunities);

            var team = (await manager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            var newCommunities = communities.Where(c => !assignedCommunities.Select(c => c.Code).Contains(c)).Take(5).ToList();
            if (!assignedCommunities.Any(c => c.Code == TestData.ActiveTaskCommunity) && !newCommunities.Any(c => c == TestData.ActiveTaskCommunity)) newCommunities.Add(TestData.ActiveTaskCommunity);

            await manager.Handle(new AssignCommunitiesToTeamCommand { TeamId = TestData.TeamId, Communities = newCommunities });

            var updatedTeam = (await manager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            updatedTeam.AssignedCommunities.Select(c => c.Code).OrderBy(c => c).ShouldBe(team.AssignedCommunities.Select(c => c.Code).Concat(newCommunities).OrderBy(c => c));
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task AssignCommunities_Team_PreserveDateAssigned()
        {
            var now = DateTime.UtcNow;
            var communities = TestData.Commmunities;

            var assignedCommunities = (await manager.Handle(new TeamsQuery())).Teams.SelectMany(t => t.AssignedCommunities);

            var team = (await manager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            var newCommunities = communities.Where(c => !assignedCommunities.Select(c => c.Code).Contains(c)).Take(5).ToList();
            if (!assignedCommunities.Any(c => c.Code == TestData.ActiveTaskCommunity) && !newCommunities.Any(c => c == TestData.ActiveTaskCommunity)) newCommunities.Add(TestData.ActiveTaskCommunity);

            await manager.Handle(new AssignCommunitiesToTeamCommand { TeamId = TestData.TeamId, Communities = newCommunities });

            var updatedTeam = (await manager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            updatedTeam.AssignedCommunities.Select(c => c.Code).OrderBy(c => c).ShouldBe(team.AssignedCommunities.Select(c => c.Code).Concat(newCommunities).OrderBy(c => c));

            var originalCommunities = updatedTeam.AssignedCommunities.Where(c => assignedCommunities.Any(ac => ac.Code == c.Code));
            originalCommunities.Select(c => c.DateAssigned).ShouldAllBe(d => d < now);

            var addedCommunities = updatedTeam.AssignedCommunities.Where(c => newCommunities.Any(nc => nc == c.Code));
            addedCommunities.Select(c => c.DateAssigned).ShouldAllBe(d => d >= now);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanUnassignCommunitiesToTeam()
        {
            var team = (await manager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            var removedCommunities = team.AssignedCommunities.Where(c => c.Code != TestData.ActiveTaskCommunity).Take(2);

            await manager.Handle(new UnassignCommunitiesFromTeamCommand { TeamId = TestData.TeamId, Communities = removedCommunities.Select(c => c.Code) });

            var updatedTeam = (await manager.Handle(new TeamsQuery { TeamId = TestData.TeamId })).Teams.ShouldHaveSingleItem();

            updatedTeam.AssignedCommunities.Where(c => removedCommunities.Contains(c)).ShouldBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Query_Suppliers_ReturnsAllSuppliersForTeam()
        {
            var searchResults = await manager.Handle(new SuppliersQuery { TeamId = TestData.TeamId });

            foreach (var supplier in searchResults.Items)
            {
                supplier.Team.ShouldNotBeNull().Id.ShouldNotBeNull();
                foreach (var sharedTeam in supplier.SharedWithTeams)
                {
                    sharedTeam.Id.ShouldNotBeNull();
                }
            }
            var primarySuppliers = searchResults.Items.Where(s => s.Team.Id == TestData.TeamId);
            var mutualAidSuppliers = searchResults.Items.Where(s => s.Team.Id != TestData.TeamId);

            foreach (var supplier in primarySuppliers)
            {
                supplier.SharedWithTeams.ShouldAllBe(t => t.Id == TestData.TeamId);
            }
            foreach (var supplier in mutualAidSuppliers)
            {
                supplier.SharedWithTeams.ShouldAllBe(t => t.Id != TestData.TeamId);
            }
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Query_Suppliers_ReturnsSuppliersById()
        {
            var searchResults = await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId });

            searchResults.Items.ShouldHaveSingleItem();
            searchResults.Items.ShouldAllBe(s => s.Id == TestData.SupplierAId);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Query_Suppliers_ReturnsTeamInfo()
        {
            var testSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();

            if (testSupplier.Team == null || testSupplier.Team.Id == null || testSupplier.Team.Name == null)
            {
                await manager.Handle(new ClaimSupplierCommand { SupplierId = testSupplier.Id, TeamId = TestData.TeamId });
                testSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();
            }

            testSupplier.Team.Id.ShouldBe(TestData.TeamId);
            testSupplier.Team.Name.ShouldBe(TestData.TeamName);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task QueryInActiveById_Suppliers_ReturnsNothing()
        {
            var searchResults = await manager.Handle(new SuppliersQuery { SupplierId = TestData.InactiveSupplierId });

            searchResults.Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task QueryInActiveByName_Suppliers_ReturnsNothing()
        {
            var searchResults = await manager.Handle(new SuppliersQuery { LegalName = TestData.InactiveSupplierLegalName, GSTNumber = TestData.InactiveSupplierGST });

            searchResults.Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Query_Suppliers_ReturnsSuppliersByLegalNameAndGSTNumber()
        {
            var searchResults = await manager.Handle(new SuppliersQuery { LegalName = TestData.SupplierALegalName, GSTNumber = TestData.SupplierAGST });

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
                    Email = $"{uniqueSignature}eraunitest@test.gov.bc.ca"
                },
                Team = new EMBC.ESS.Shared.Contracts.Teams.SupplierTeam
                {
                    Id = TestData.TeamId
                },
                Status = SupplierStatus.Active
            };

            var supplierId = await manager.Handle(new SaveSupplierCommand { Supplier = supplier });

            var newSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = supplierId })).Items.ShouldHaveSingleItem();
            newSupplier.Status.ShouldBe(SupplierStatus.Active);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Update_Suppliers_ReturnsSupplierId()
        {
            var supplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();

            var currentCommunity = supplier.Address.Community;
            var newCommunity = currentCommunity == TestData.TeamCommunityId
                ? TestData.OtherCommunityId
                : TestData.TeamCommunityId;

            supplier.Address.Community = newCommunity;

            await manager.Handle(new SaveSupplierCommand { Supplier = supplier });

            var updatedSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();
            updatedSupplier.Address.Community.ShouldBe(newCommunity);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Activate_Suppliers_ReturnsSupplierId()
        {
            var results = await manager.Handle(new ActivateSupplierCommand { TeamId = TestData.TeamId, SupplierId = TestData.SupplierAId });

            results.ShouldBe(TestData.SupplierAId);

            var searchResults = await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId });
            var updatedSupplier = searchResults.Items.ShouldHaveSingleItem();
            updatedSupplier.Status.ShouldBe(SupplierStatus.Active);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Deactivate_Suppliers_ReturnsSupplierId()
        {
            var supplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierCId })).Items.ShouldHaveSingleItem();

            if (supplier.Team == null)
            {
                await manager.Handle(new ClaimSupplierCommand { SupplierId = supplier.Id, TeamId = TestData.OtherTeamId });
            }

            var results = await manager.Handle(new DeactivateSupplierCommand { TeamId = TestData.OtherTeamId, SupplierId = TestData.SupplierCId });

            results.ShouldBe(TestData.SupplierCId);

            var updatedSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierCId })).Items.ShouldHaveSingleItem();
            updatedSupplier.Status.ShouldBe(SupplierStatus.Inactive);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Claim_Suppliers_ReturnsSupplierId()
        {
            var testSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();

            if (testSupplier.Team != null && testSupplier.Team.Id != null)
            {
                testSupplier.Team.Id = null;
                testSupplier.Team.Name = null;

                testSupplier.SharedWithTeams = Array.Empty<EMBC.ESS.Shared.Contracts.Teams.SupplierTeam>();

                await manager.Handle(new SaveSupplierCommand { Supplier = testSupplier });
                var updatedSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();

                updatedSupplier.Team.ShouldBe(null);
            }

            await manager.Handle(new ClaimSupplierCommand { SupplierId = testSupplier.Id, TeamId = TestData.TeamId });

            var twiceUpdatedSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();

            twiceUpdatedSupplier.Team.Id.ShouldBe(TestData.TeamId);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Remove_Suppliers_ReturnsSupplierId()
        {
            await manager.Handle(new RemoveSupplierCommand { SupplierId = TestData.SupplierAId });

            var updatedSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();
            updatedSupplier.Team.ShouldBe(null);
            updatedSupplier.SharedWithTeams.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task AddSharedWithTeam_Suppliers_ReturnsSupplierId()
        {
            var testSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();

            if (testSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId) != null)
            {
                testSupplier.SharedWithTeams = testSupplier.SharedWithTeams.Where(t => t.Id != TestData.OtherTeamId);
                await manager.Handle(new SaveSupplierCommand { Supplier = testSupplier });
                var updatedSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();

                updatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId).ShouldBe(null);
            }

            await manager.Handle(new ShareSupplierWithTeamCommand { SupplierId = testSupplier.Id, TeamId = TestData.OtherTeamId });

            var twiceUpdatedSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();

            twiceUpdatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId).ShouldNotBe(null);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task RemoveSharedWithTeam_Suppliers_ReturnsSupplierId()
        {
            var testSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();

            if (testSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId) == null)
            {
                var team = new EMBC.ESS.Shared.Contracts.Teams.SupplierTeam { Id = TestData.OtherTeamId };
                testSupplier.SharedWithTeams = testSupplier.SharedWithTeams.Concat(new[] { team });

                await manager.Handle(new SaveSupplierCommand { Supplier = testSupplier });
                var updatedSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();

                updatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId).ShouldNotBe(null);
            }

            await manager.Handle(new UnshareSupplierWithTeamCommand { SupplierId = testSupplier.Id, TeamId = TestData.OtherTeamId });

            var twiceUpdatedSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();

            twiceUpdatedSupplier.SharedWithTeams.SingleOrDefault(t => t.Id == TestData.OtherTeamId).ShouldBe(null);
        }
    }
}
