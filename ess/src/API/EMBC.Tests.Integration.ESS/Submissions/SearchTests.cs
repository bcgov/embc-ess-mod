using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Managers.Submissions;
using EMBC.ESS.Shared.Contracts.Submissions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Submissions
{
    public class SearchTests : WebAppTestBase
    {
        private readonly SubmissionsManager manager;

        private async Task<RegistrantProfile> GetRegistrantByUserId(string userId) => await TestHelper.GetRegistrantByUserId(manager, userId);

        public SearchTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            manager = services.GetRequiredService<SubmissionsManager>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchRegistrantsByUserId()
        {
            var userId = TestData.ContactUserId;
            var registrant = (await manager.Handle(new RegistrantsQuery { UserId = userId })).Items.SingleOrDefault();

            var profile = registrant.ShouldNotBeNull().ShouldNotBeNull();
            profile.UserId.ShouldBe(userId);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchRegistrantsByNonExistentValues()
        {
            (await manager.Handle(new RegistrantsQuery
            {
                UserId = "__nouser__"
            })).Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchEvacuationFilesByRegistrantUserName()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var files = (await manager.Handle(new EvacuationFilesQuery { PrimaryRegistrantUserId = registrant.UserId })).Items;

            files.ShouldNotBeEmpty();
            files.ShouldAllBe(f => f.PrimaryRegistrantId == registrant.Id);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchEvacuationFilesByLinkedRegistrantId()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var statuses = new[] { EvacuationFileStatus.Active, EvacuationFileStatus.Archived, EvacuationFileStatus.Completed, EvacuationFileStatus.Expired, EvacuationFileStatus.Pending };

            var files = (await manager.Handle(new EvacuationFilesQuery { LinkedRegistrantId = registrant.Id, IncludeFilesInStatuses = statuses })).Items;

            files.ShouldNotBeEmpty();

            files.ShouldAllBe(f => f.HouseholdMembers.Any(h => h.LinkedRegistrantId == registrant.Id));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchEvacuationFilesByBCServicesCardId()
        {
            var statuses = new[] { EvacuationFileStatus.Active, EvacuationFileStatus.Pending };

            var files = (await manager.Handle(new EvacuationFilesQuery { PrimaryRegistrantUserId = TestData.ContactUserId, IncludeFilesInStatuses = statuses })).Items;

            files.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchEvacueesByName()
        {
            var firstName = TestData.ContactFirstName;
            var lastName = TestData.ContactLastName;
            var dateOfBirth = TestData.ContactDateOfBirth;

            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = firstName, LastName = lastName, DateOfBirth = dateOfBirth, IncludeRestrictedAccess = true });

            var registrants = searchResults.Profiles;
            registrants.ShouldNotBeEmpty();
            registrants.ShouldAllBe(r => r.FirstName.Equals(firstName, StringComparison.OrdinalIgnoreCase) && r.LastName.Equals(lastName, StringComparison.OrdinalIgnoreCase));

            var files = searchResults.EvacuationFiles;
            files.ShouldNotBeEmpty();
            files.ShouldAllBe(f => f.HouseholdMembers
                .Any(m => m.FirstName.Equals(firstName, StringComparison.OrdinalIgnoreCase) &&
                m.LastName.Equals(lastName, StringComparison.OrdinalIgnoreCase) &&
                m.DateOfBirth == dateOfBirth));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Search_EvacuationFiles_IncludeRegistrantProfilesOnly()
        {
            var firstName = TestData.ContactFirstName;
            var lastName = TestData.ContactLastName;
            var dateOfBirth = TestData.ContactDateOfBirth;

            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = firstName, LastName = lastName, DateOfBirth = dateOfBirth, IncludeRegistrantProfilesOnly = true, IncludeRestrictedAccess = true });

            searchResults.EvacuationFiles.ShouldBeEmpty();
            searchResults.Profiles.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Search_EvacuationFiles_IncludeEvacuationFilesOnly()
        {
            var firstName = $"{TestData.TestPrefix}-member-no-registrant-first";
            var lastName = $"{TestData.TestPrefix}-member-no-registrant-last";
            var dateOfBirth = "01/02/1998";

            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = firstName, LastName = lastName, DateOfBirth = dateOfBirth, IncludeEvacuationFilesOnly = true, IncludeRestrictedAccess = true });

            searchResults.EvacuationFiles.ShouldNotBeEmpty();
            searchResults.Profiles.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Search_EvacuationFiles_IncludeBoth()
        {
            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = TestData.ContactFirstName, LastName = TestData.ContactLastName, DateOfBirth = TestData.ContactDateOfBirth, IncludeRestrictedAccess = true });

            searchResults.EvacuationFiles.ShouldNotBeEmpty();
            searchResults.Profiles.ShouldNotBeEmpty();
        }
    }
}
