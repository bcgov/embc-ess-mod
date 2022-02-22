﻿using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts.Events;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Managers.Events
{
    public class SearchTests : DynamicsWebAppTestBase
    {
        private readonly EventsManager manager;

        private static EvacuationFileStatus[] tier1FileStatuses = new[] { EvacuationFileStatus.Pending, EvacuationFileStatus.Active, EvacuationFileStatus.Expired };
        private static EvacuationFileStatus[] tier2andAboveFileStatuses = new[] { EvacuationFileStatus.Pending, EvacuationFileStatus.Active, EvacuationFileStatus.Expired, EvacuationFileStatus.Completed };

        private async Task<RegistrantProfile> GetRegistrantByUserId(string userId) => (await TestHelper.GetRegistrantByUserId(manager, userId)).ShouldNotBeNull();

        public SearchTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            manager = Services.GetRequiredService<EventsManager>();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanSearchRegistrantsByUserId()
        {
            var userId = TestData.ContactUserId;
            var registrant = (await manager.Handle(new RegistrantsQuery { UserId = userId })).Items.SingleOrDefault();

            var profile = registrant.ShouldNotBeNull().ShouldNotBeNull();
            profile.UserId.ShouldBe(userId);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanSearchRegistrantsByNonExistentValues()
        {
            (await manager.Handle(new RegistrantsQuery
            {
                UserId = "__nouser__"
            })).Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanSearchEvacuationFilesByRegistrantUserName()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var files = (await manager.Handle(new EvacuationFilesQuery { PrimaryRegistrantUserId = registrant.UserId })).Items;

            files.ShouldNotBeEmpty();
            files.ShouldAllBe(f => f.PrimaryRegistrantId == registrant.Id);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanSearchEvacuationFilesByLinkedRegistrantId()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var statuses = new[] { EvacuationFileStatus.Active, EvacuationFileStatus.Archived, EvacuationFileStatus.Completed, EvacuationFileStatus.Expired, EvacuationFileStatus.Pending };

            var files = (await manager.Handle(new EvacuationFilesQuery { LinkedRegistrantId = registrant.Id, IncludeFilesInStatuses = statuses })).Items;

            files.ShouldNotBeEmpty();

            files.ShouldAllBe(f => f.HouseholdMembers.Any(h => h.LinkedRegistrantId == registrant.Id));
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanSearchEvacuationFilesByBCServicesCardId()
        {
            var statuses = new[] { EvacuationFileStatus.Active, EvacuationFileStatus.Pending };

            var files = (await manager.Handle(new EvacuationFilesQuery { PrimaryRegistrantUserId = TestData.ContactUserId, IncludeFilesInStatuses = statuses })).Items;

            files.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
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

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Search_EvacuationFiles_IncludeRegistrantProfilesOnly()
        {
            var firstName = TestData.ContactFirstName;
            var lastName = TestData.ContactLastName;
            var dateOfBirth = TestData.ContactDateOfBirth;

            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = firstName, LastName = lastName, DateOfBirth = dateOfBirth, IncludeRegistrantProfilesOnly = true, IncludeRestrictedAccess = true });

            searchResults.EvacuationFiles.ShouldBeEmpty();
            searchResults.Profiles.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Search_EvacuationFiles_IncludeEvacuationFilesOnly()
        {
            var firstName = $"{TestData.TestPrefix}-member-no-registrant-first";
            var lastName = $"{TestData.TestPrefix}-member-no-registrant-last";
            var dateOfBirth = "01/02/1998";

            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = firstName, LastName = lastName, DateOfBirth = dateOfBirth, IncludeEvacuationFilesOnly = true, IncludeRestrictedAccess = true });

            searchResults.EvacuationFiles.ShouldNotBeEmpty();
            searchResults.Profiles.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Search_EvacuationFiles_IncludeBoth()
        {
            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = TestData.ContactFirstName, LastName = TestData.ContactLastName, DateOfBirth = TestData.ContactDateOfBirth, IncludeRestrictedAccess = true });

            searchResults.EvacuationFiles.ShouldNotBeEmpty();
            searchResults.Profiles.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Search_EvacuationFilesWithPaperId_IncludeEvacuationFilesOnly()
        {
            var firstName = TestData.ContactFirstName;
            var lastName = TestData.ContactLastName;
            var dateOfBirth = TestData.ContactDateOfBirth;

            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = firstName, LastName = lastName, DateOfBirth = dateOfBirth, IncludeRestrictedAccess = true });
            searchResults.EvacuationFiles.ShouldContain(e => e.ExternalReferenceId == TestData.PaperEvacuationFilePaperId);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanSearchEvacuationFilesByPaperId()
        {
            var files = (await manager.Handle(new EvacuationFilesQuery { ExternalReferenceId = TestData.PaperEvacuationFilePaperId })).Items;
            files.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Search_RegistrantsWith_Tier1User()
        {
            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = TestData.ContactFirstName, LastName = TestData.ContactLastName, DateOfBirth = TestData.ContactDateOfBirth, InStatuses = tier1FileStatuses });
            searchResults.EvacuationFiles.ShouldNotContain(e => e.Status == EvacuationFileStatus.Completed);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task Search_RegistrantsWith_Tier2User()
        {
            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = TestData.ContactFirstName, LastName = TestData.ContactLastName, DateOfBirth = TestData.ContactDateOfBirth, InStatuses = tier2andAboveFileStatuses });
            searchResults.EvacuationFiles.ShouldContain(e => e.Status == EvacuationFileStatus.Completed);
        }
    }
}
