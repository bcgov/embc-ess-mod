using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Registrants.API;
using EMBC.Registrants.API.EvacuationsModule;
using EMBC.Registrants.API.LocationModule;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.Registrants.API.Evacuations
{
    public class EvacuationTests : WebAppTestBase
    {
        private readonly IEvacuationManager evacuationManager;
        private readonly IListsRepository listsRepository;

        public EvacuationTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            evacuationManager = services.GetRequiredService<IEvacuationManager>();
            listsRepository = services.GetRequiredService<IListsRepository>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuations()
        {
            string testUserId = "CHRIS-TEST";
            var evacuationFiles = await evacuationManager.GetEvacuations(testUserId);
            evacuationFiles.ShouldNotBeEmpty();

            var evacuationFile = evacuationFiles.First();
            evacuationFile.ShouldNotBeNull();

            var needsAssessment = evacuationFile.NeedsAssessments.ShouldHaveSingleItem();
            needsAssessment.CanEvacueeProvideClothing.ShouldBe(true);
            needsAssessment.CanEvacueeProvideFood.ShouldBe(true);
            needsAssessment.CanEvacueeProvideIncidentals.ShouldBe(true);
            needsAssessment.CanEvacueeProvideLodging.ShouldBe(true);
            needsAssessment.CanEvacueeProvideLodging.ShouldBe(true);
            needsAssessment.HouseholdMembers.ShouldNotBeEmpty();
            evacuationFile.EvacuatedFromAddress.ShouldNotBeNull();
            evacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe("9837 Douglas St");
            evacuationFile.EvacuatedFromAddress.Jurisdiction.ShouldNotBeNull().Name.ShouldBe("Port Edward");
            evacuationFile.EvacuatedFromAddress.StateProvince.ShouldNotBeNull().Code.ShouldBe("BC");
            evacuationFile.EvacuatedFromAddress.Country.ShouldNotBeNull().Code.ShouldBe("CAN");
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateEvacuation()
        {
            string testUserId = "CHRIS-TEST";
            string testEssFileNumber = "100615";
            var evacuationFile = await evacuationManager.GetEvacuation(testUserId, testEssFileNumber);
            var currentAddress = evacuationFile.EvacuatedFromAddress.AddressLine1;
            var newAddress = $"1530 Party Ave.{Guid.NewGuid().ToString().Substring(0, 4)}";

            evacuationFile.EvacuatedFromAddress.AddressLine1 = newAddress;

            var essFileNumber = await evacuationManager.SaveEvacuation(testUserId, evacuationFile.EssFileNumber, evacuationFile);
            essFileNumber.ShouldBe(testEssFileNumber);

            var updatedEvacuationFile = await evacuationManager.GetEvacuation(testUserId, testEssFileNumber);

            updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(newAddress);
            updatedEvacuationFile.NeedsAssessments.First().HouseholdMembers.ShouldNotBeEmpty();

            evacuationFile.EvacuatedFromAddress.AddressLine1 = currentAddress;

            essFileNumber = await evacuationManager.SaveEvacuation(testUserId, evacuationFile.EssFileNumber, evacuationFile);
            essFileNumber.ShouldBe(testEssFileNumber);

            updatedEvacuationFile = await evacuationManager.GetEvacuation(testUserId, testEssFileNumber);
            updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(currentAddress);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateEvacuation()
        {
            string testUserId = "CHRIS-TEST";
            string testEssFileNumber = "100615";
            var evacuationFile = await evacuationManager.GetEvacuation(testUserId, testEssFileNumber);
            evacuationFile.NeedsAssessments.First().HouseholdMembers.ShouldNotBeEmpty();
            var newEssFileNumber = await evacuationManager.SaveEvacuation(testUserId, null, evacuationFile);

            var createdEvacuationFile = await evacuationManager.GetEvacuation(testUserId, newEssFileNumber);
            evacuationFile.NeedsAssessments.First().HouseholdMembers.ShouldNotBeEmpty();

            createdEvacuationFile.ShouldNotBeNull();

            await evacuationManager.DeleteEvacuation(testUserId, newEssFileNumber);
        }
    }
}
