using System;
using System.Linq;
using EMBC.ESS.Managers.Teams;
using EMBC.ESS.Shared.Contracts.Teams;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Managers
{
    public class TeamsManagerTests : DynamicsWebAppTestBase
    {
        private readonly TeamsManager manager;

        public TeamsManagerTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            manager = Services.GetRequiredService<TeamsManager>();
        }

        [Fact]
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
                TeamId = TestData.Team1Id,
                UserName = $"username{Guid.NewGuid().ToString().Substring(0, 4)}"
            };

            var memberId = await manager.Handle(new SaveTeamMemberCommand { Member = newMember });

            memberId.ShouldNotBeNull();

            var existingMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.Team1Id, MemberId = memberId })).TeamMembers.ShouldHaveSingleItem();

            existingMember.Id.ShouldBe(memberId);
            existingMember.TeamId.ShouldBe(TestData.Team1Id);
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

        [Fact]
        public async Task CanActivateTeamMember()
        {
            var memberToUpdate = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.Team1Id })).TeamMembers.First();

            await manager.Handle(new ActivateTeamMemberCommand { TeamId = TestData.Team1Id, MemberId = memberToUpdate.Id });

            var updatedMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.Team1Id, MemberId = memberToUpdate.Id })).TeamMembers.Single();
            updatedMember.IsActive.ShouldBeTrue();
        }

        [Fact]
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
                TeamId = TestData.Team1Id,
                UserName = $"username{Guid.NewGuid().ToString().Substring(0, 4)}"
            };

            var memberId = await manager.Handle(new SaveTeamMemberCommand { Member = newMember });

            memberId.ShouldNotBeNull();

            await manager.Handle(new DeactivateTeamMemberCommand { TeamId = TestData.Team1Id, MemberId = memberId });

            var updatedMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.Team1Id, MemberId = memberId, IncludeActiveUsersOnly = false })).TeamMembers.Single();
            updatedMember.IsActive.ShouldBeFalse();
        }

        [Fact]
        public async Task RemoveLabel_TeamMemberWithLabel_LabelRemoved()
        {
            var memberToUpdate = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.Team1Id })).TeamMembers.First();
            if (string.IsNullOrEmpty(memberToUpdate.Label))
            {
                memberToUpdate.Label = "Volunteer";
                await manager.Handle(new SaveTeamMemberCommand { Member = memberToUpdate });
                memberToUpdate = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.Team1Id, MemberId = memberToUpdate.Id })).TeamMembers.Single();
            }
            memberToUpdate.Label.ShouldNotBeNull();
            memberToUpdate.Label = null;
            await manager.Handle(new SaveTeamMemberCommand { Member = memberToUpdate });

            var updatedMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.Team1Id, MemberId = memberToUpdate.Id })).TeamMembers.Single();
            updatedMember.Label.ShouldBeNull();
        }

        [Fact]
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
                TeamId = TestData.Team1Id,
                UserName = $"username{Guid.NewGuid().ToString().Substring(0, 4)}"
            };

            var memberId = await manager.Handle(new SaveTeamMemberCommand { Member = newMember });
            memberId.ShouldNotBeNull();

            await manager.Handle(new DeleteTeamMemberCommand { TeamId = TestData.Team1Id, MemberId = memberId });

            var teamMembers = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.Team1Id, MemberId = memberId })).TeamMembers;
            teamMembers.Where(m => m.Id == memberId).ShouldBeEmpty();
        }

        [Fact]
        public async Task CanValidateNewUserNameForExistingMember()
        {
            var aMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.Team1Id })).TeamMembers.First();
            aMember.UserName = Guid.NewGuid().ToString().Substring(0, 5);
            var validationResult = await manager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = aMember
            });
            validationResult.UniqueUserName.ShouldBeTrue();
        }

        [Fact]
        public async Task CanValidateSameUserNameForExistingMember()
        {
            var aMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.Team1Id })).TeamMembers.First();

            var validationResult = await manager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = aMember
            });
            validationResult.UniqueUserName.ShouldBeTrue();
        }

        [Fact]
        public async Task CanValidatExistingUserNameForExistingMember()
        {
            var members = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.Team1Id })).TeamMembers;
            var aMember = members.Skip(0).First();
            var bMember = members.Skip(1).First();

            aMember.UserName = bMember.UserName;
            var validationResult = await manager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = aMember
            });
            validationResult.UniqueUserName.ShouldBeFalse();
        }

        [Fact]
        public async Task CanValidateUniqueUserNameForNewMember()
        {
            var validationResult = await manager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = new TeamMember { UserName = Guid.NewGuid().ToString().Substring(0, 5) }
            });
            validationResult.UniqueUserName.ShouldBeTrue();
        }

        [Fact]
        public async Task CanValidateDuplicateUserNameForNewMember()
        {
            var aMember = (await manager.Handle(new TeamMembersQuery { TeamId = TestData.Team1Id })).TeamMembers.First();

            var validationResult = await manager.Handle(new ValidateTeamMemberCommand
            {
                TeamMember = new TeamMember { UserName = aMember.UserName }
            });
            validationResult.UniqueUserName.ShouldBeFalse();
        }

        [Fact]
        public async Task CanQuerySingleTeam()
        {
            var team = (await manager.Handle(new TeamsQuery { TeamId = TestData.Team1Id })).Teams.ShouldHaveSingleItem();
            team.Id.ShouldBe(TestData.Team1Id);
            team.Name.ShouldNotBeNull();
            team.AssignedCommunities.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task CanQueryTeamByCommunity()
        {
            var teams = (await manager.Handle(new TeamsQuery { CommunityCode = TestData.Team1CommunityId })).Teams;
            teams.ShouldNotBeEmpty();
            teams.ShouldAllBe(t => t.AssignedCommunities.Any(c => c.Code == TestData.Team1CommunityId));
        }

        [Fact]
        public async Task CanQueryAllTeams()
        {
            var teams = (await manager.Handle(new TeamsQuery())).Teams;

            teams.ShouldNotBeEmpty();
            teams.Single(t => t.Id == TestData.Team1Id).AssignedCommunities.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task CanAssignCommunitiesToTeam()
        {
            var communities = TestData.Commmunities;

            var assignedCommunities = (await manager.Handle(new TeamsQuery())).Teams.SelectMany(t => t.AssignedCommunities);

            var team = (await manager.Handle(new TeamsQuery { TeamId = TestData.Team1Id })).Teams.ShouldHaveSingleItem();

            var newCommunities = communities.Where(c => !assignedCommunities.Select(c => c.Code).Contains(c)).Take(5).ToList();
            if (!assignedCommunities.Any(c => c.Code == TestData.ActiveTaskCommunity) && !newCommunities.Any(c => c == TestData.ActiveTaskCommunity)) newCommunities.Add(TestData.ActiveTaskCommunity);

            await manager.Handle(new AssignCommunitiesToTeamCommand { TeamId = TestData.Team1Id, Communities = newCommunities });

            var updatedTeam = (await manager.Handle(new TeamsQuery { TeamId = TestData.Team1Id })).Teams.ShouldHaveSingleItem();

            updatedTeam.AssignedCommunities.Select(c => c.Code).OrderBy(c => c).ShouldBe(team.AssignedCommunities.Select(c => c.Code).Concat(newCommunities).OrderBy(c => c));
        }

        [Fact]
        public async Task AssignCommunities_Team_PreserveDateAssigned()
        {
            var now = DateTime.UtcNow;
            var communities = TestData.Commmunities;

            var assignedCommunities = (await manager.Handle(new TeamsQuery())).Teams.SelectMany(t => t.AssignedCommunities);

            var team = (await manager.Handle(new TeamsQuery { TeamId = TestData.Team1Id })).Teams.ShouldHaveSingleItem();

            var newCommunities = communities.Where(c => !assignedCommunities.Select(c => c.Code).Contains(c)).Take(5).ToList();
            if (!assignedCommunities.Any(c => c.Code == TestData.ActiveTaskCommunity) && !newCommunities.Any(c => c == TestData.ActiveTaskCommunity)) newCommunities.Add(TestData.ActiveTaskCommunity);

            await manager.Handle(new AssignCommunitiesToTeamCommand { TeamId = TestData.Team1Id, Communities = newCommunities });

            var updatedTeam = (await manager.Handle(new TeamsQuery { TeamId = TestData.Team1Id })).Teams.ShouldHaveSingleItem();

            updatedTeam.AssignedCommunities.Select(c => c.Code).OrderBy(c => c).ShouldBe(team.AssignedCommunities.Select(c => c.Code).Concat(newCommunities).OrderBy(c => c));

            var originalCommunities = updatedTeam.AssignedCommunities.Where(c => assignedCommunities.Any(ac => ac.Code == c.Code));
            originalCommunities.Select(c => c.DateAssigned).ShouldAllBe(d => d < now);

            var addedCommunities = updatedTeam.AssignedCommunities.Where(c => newCommunities.Any(nc => nc == c.Code));
            addedCommunities.Select(c => c.DateAssigned).ShouldAllBe(d => d >= now);
        }

        [Fact]
        public async Task CanUnassignCommunitiesToTeam()
        {
            var team = (await manager.Handle(new TeamsQuery { TeamId = TestData.Team1Id })).Teams.ShouldHaveSingleItem();

            var removedCommunities = team.AssignedCommunities.Where(c => c.Code != TestData.ActiveTaskCommunity).Take(2);

            await manager.Handle(new UnassignCommunitiesFromTeamCommand { TeamId = TestData.Team1Id, Communities = removedCommunities.Select(c => c.Code) });

            var updatedTeam = (await manager.Handle(new TeamsQuery { TeamId = TestData.Team1Id })).Teams.ShouldHaveSingleItem();

            updatedTeam.AssignedCommunities.Where(c => removedCommunities.Contains(c)).ShouldBeEmpty();
        }

        [Fact]
        public async Task Query_Suppliers_ReturnsAllSuppliersForTeam()
        {
            var searchResults = await manager.Handle(new SuppliersQuery { TeamId = TestData.Team1Id });

            foreach (var supplier in searchResults.Items)
            {
                supplier.PrimaryTeams.ShouldContain(s => s.Id == TestData.Team1Id);
                supplier.MutualAids.ShouldAllBe(ma => supplier.PrimaryTeams.Any(pt => pt.Id == ma.GivenByTeamId));
            }
        }

        [Fact]
        public async Task Query_Suppliers_ReturnsSuppliersById()
        {
            var searchResults = await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId });

            searchResults.Items.ShouldHaveSingleItem();
            searchResults.Items.ShouldAllBe(s => s.Id == TestData.SupplierAId);
        }

        [Fact]
        public async Task Query_Suppliers_ReturnsTeamInfo()
        {
            var testSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();

            if (!testSupplier.PrimaryTeams.Any())
            {
                await manager.Handle(new ClaimSupplierCommand { SupplierId = testSupplier.Id, TeamId = TestData.Team1Id });
                testSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = testSupplier.Id })).Items.ShouldHaveSingleItem();
            }

            testSupplier.PrimaryTeams.ShouldContain(s => s.Id == TestData.Team1Id);
            testSupplier.PrimaryTeams.ShouldContain(s => s.Name == TestData.Team1Name);
        }

        [Fact]
        public async Task QueryInActiveById_Suppliers_ReturnsNothing()
        {
            var searchResults = await manager.Handle(new SuppliersQuery { SupplierId = TestData.InactiveSupplierId });

            searchResults.Items.ShouldBeEmpty();
        }

        [Fact]
        public async Task QueryInActiveByName_Suppliers_ReturnsNothing()
        {
            var searchResults = await manager.Handle(new SuppliersQuery { LegalName = TestData.InactiveSupplierLegalName, GSTNumber = TestData.InactiveSupplierGST });

            searchResults.Items.ShouldBeEmpty();
        }

        [Fact]
        public async Task Query_Suppliers_ReturnsSuppliersByLegalNameAndGSTNumber()
        {
            var searchResults = await manager.Handle(new SuppliersQuery { LegalName = TestData.SupplierALegalName, GSTNumber = TestData.SupplierAGST });

            searchResults.Items.ShouldAllBe(s => s.LegalName == TestData.SupplierALegalName && s.GSTNumber == TestData.SupplierAGST);
        }

        [Fact]
        public async Task Create_Suppliers_NewSupplier()
        {
            var supplier = CreateSupplier(TestData.Team1Id);

            var supplierId = await manager.Handle(new SaveSupplierCommand { Supplier = supplier });

            var newSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = supplierId })).Items.ShouldHaveSingleItem();
            newSupplier.Status.ShouldBe(SupplierStatus.Active);
            newSupplier.MutualAids.ShouldBeEmpty();
            var primaryTeam = newSupplier.PrimaryTeams.ShouldHaveSingleItem();
            primaryTeam.Id.ShouldBe(TestData.Team1Id);
            primaryTeam.Name.ShouldNotBeNullOrEmpty();
        }

        [Fact]
        public async Task Update_Suppliers_SupplierUpdated()
        {
            var supplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();

            var currentCommunity = supplier.Address.Community;
            var newCommunity = currentCommunity == TestData.Team1CommunityId
                ? TestData.OtherCommunityId
                : TestData.Team1CommunityId;

            supplier.Address.Community = newCommunity;

            await manager.Handle(new SaveSupplierCommand { Supplier = supplier });

            var updatedSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();
            updatedSupplier.Address.Community.ShouldBe(newCommunity);
        }

        [Fact]
        public async Task Activate_Supplier_SupplierIsActive()
        {
            await manager.Handle(new ActivateSupplierCommand { TeamId = TestData.Team1Id, SupplierId = TestData.SupplierAId });

            var searchResults = await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId });
            var updatedSupplier = searchResults.Items.ShouldHaveSingleItem();
            updatedSupplier.Status.ShouldBe(SupplierStatus.Active);
        }

        [Fact]
        public async Task Deactivate_Suppliers_ReturnsSupplierId()
        {
            var supplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierCId })).Items.ShouldHaveSingleItem();

            if (!supplier.PrimaryTeams.Any())
            {
                await manager.Handle(new ClaimSupplierCommand { SupplierId = supplier.Id, TeamId = TestData.Team2Id });
            }

            var results = await manager.Handle(new DeactivateSupplierCommand { TeamId = TestData.Team2Id, SupplierId = TestData.SupplierCId });

            results.ShouldBe(TestData.SupplierCId);

            var updatedSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierCId })).Items.ShouldHaveSingleItem();
            updatedSupplier.Status.ShouldBe(SupplierStatus.Inactive);
        }

        [Fact]
        public async Task ClaimSupplier_TwoTeams_ClaimedByBoth()
        {
            var supplier = CreateSupplier(TestData.Team1Id);

            var supplierId = await manager.Handle(new SaveSupplierCommand { Supplier = supplier });

            (await manager.Handle(new ClaimSupplierCommand { SupplierId = supplierId, TeamId = TestData.Team2Id })).ShouldBe(supplierId);

            var actualSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = supplierId })).Items.ShouldHaveSingleItem();

            actualSupplier.PrimaryTeams.Count().ShouldBe(2);
            actualSupplier.PrimaryTeams.ShouldContain(t => t.Id == TestData.Team1Id);
            actualSupplier.PrimaryTeams.ShouldContain(t => t.Id == TestData.Team2Id);
        }

        [Fact]
        public async Task RemoveSupplier_Supplier_NotClaimedAndNoMutualAids()
        {
            await manager.Handle(new RemoveSupplierCommand { SupplierId = TestData.SupplierAId });

            var updatedSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = TestData.SupplierAId })).Items.ShouldHaveSingleItem();
            updatedSupplier.PrimaryTeams.ShouldBeEmpty();
            updatedSupplier.MutualAids.ShouldBeEmpty();
        }

        [Fact]
        public async Task ShareSupplier_Supplier_MutualAidAdded()
        {
            var supplier = CreateSupplier(TestData.Team1Id);
            var supplierId = await manager.Handle(new SaveSupplierCommand { Supplier = supplier });

            await manager.Handle(new ShareSupplierWithTeamCommand { TeamId = TestData.Team2Id, SharingTeamId = TestData.Team1Id, SupplierId = supplierId });

            var actualSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = supplierId })).Items.ShouldHaveSingleItem();

            actualSupplier.MutualAids.ShouldNotBeEmpty();
            actualSupplier.MutualAids.ShouldContain(ma => ma.GivenByTeamId == TestData.Team1Id && ma.GivenToTeam.Id == TestData.Team2Id);
        }

        [Fact]
        public async Task UnshareSupplier_Supplier_MutualAidRemoved()
        {
            var supplier = CreateSupplier(TestData.Team1Id);
            var supplierId = await manager.Handle(new SaveSupplierCommand { Supplier = supplier });
            await manager.Handle(new ShareSupplierWithTeamCommand { TeamId = TestData.Team2Id, SharingTeamId = TestData.Team1Id, SupplierId = supplierId });
            await manager.Handle(new UnshareSupplierWithTeamCommand { TeamId = TestData.Team2Id, SharingTeamId = TestData.Team1Id, SupplierId = supplierId });
            var actualSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = supplierId })).Items.ShouldHaveSingleItem();
            actualSupplier.MutualAids.ShouldBeEmpty();
        }

        [Fact]
        public async Task ShareSupplier_SupplierWithTwoPrimaryTeams_MutualAidAdded()
        {
            var supplier = CreateSupplier(TestData.Team1Id);
            supplier.PrimaryTeams = new[] {
                new SupplierTeam { Id = TestData.Team1Id },
                new SupplierTeam { Id = TestData.Team2Id }
            };
            var supplierId = await manager.Handle(new SaveSupplierCommand { Supplier = supplier });

            await manager.Handle(new ShareSupplierWithTeamCommand { TeamId = TestData.Team3Id, SharingTeamId = TestData.Team1Id, SupplierId = supplierId });
            await manager.Handle(new ShareSupplierWithTeamCommand { TeamId = TestData.Team4Id, SharingTeamId = TestData.Team2Id, SupplierId = supplierId });

            var actualSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = supplierId })).Items.ShouldHaveSingleItem();

            actualSupplier.PrimaryTeams.Count().ShouldBe(2);
            actualSupplier.MutualAids.Count().ShouldBe(2);
            actualSupplier.MutualAids.ShouldContain(ma => ma.GivenByTeamId == TestData.Team1Id && ma.GivenToTeam.Id == TestData.Team3Id);
            actualSupplier.MutualAids.ShouldContain(ma => ma.GivenByTeamId == TestData.Team2Id && ma.GivenToTeam.Id == TestData.Team4Id);
        }

        [Fact]
        public async Task UnshareSupplier_SupplierWithTwoPrimaryTeams_CorrectMutualAidRemoved()
        {
            var supplier = CreateSupplier(TestData.Team1Id);
            supplier.PrimaryTeams = new[] {
                new SupplierTeam { Id = TestData.Team1Id },
                new SupplierTeam { Id = TestData.Team2Id }
            };
            var supplierId = await manager.Handle(new SaveSupplierCommand { Supplier = supplier });

            await manager.Handle(new ShareSupplierWithTeamCommand { TeamId = TestData.Team3Id, SharingTeamId = TestData.Team1Id, SupplierId = supplierId });
            await manager.Handle(new ShareSupplierWithTeamCommand { TeamId = TestData.Team4Id, SharingTeamId = TestData.Team2Id, SupplierId = supplierId });
            await manager.Handle(new UnshareSupplierWithTeamCommand { TeamId = TestData.Team4Id, SharingTeamId = TestData.Team2Id, SupplierId = supplierId });

            var actualSupplier = (await manager.Handle(new SuppliersQuery { SupplierId = supplierId })).Items.ShouldHaveSingleItem();

            actualSupplier.PrimaryTeams.Count().ShouldBe(2);
            actualSupplier.MutualAids.Count().ShouldBe(1);
            actualSupplier.MutualAids.ShouldContain(ma => ma.GivenByTeamId == TestData.Team1Id && ma.GivenToTeam.Id == TestData.Team3Id);
            actualSupplier.MutualAids.ShouldNotContain(ma => ma.GivenByTeamId == TestData.Team2Id && ma.GivenToTeam.Id == TestData.Team4Id);
        }

        private Supplier CreateSupplier(string primaryTeamId)
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
                PrimaryTeams = new[] {new SupplierTeam
                {
                    Id = primaryTeamId
                } },
                Status = SupplierStatus.Active
            };

            return supplier;
        }
    }
}
