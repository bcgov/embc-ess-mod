using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Registrants.API;
using EMBC.Registrants.API.LocationModule;
using EMBC.Registrants.API.EvacuationsModule;
using EMBC.Registrants.API.Shared;
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
            string testUserId = "4PRCSME5JFAAGAV5OPLTZLQXBGDL7XYD";
            var evacuationFiles = await evacuationManager.GetEvacuations(testUserId);
            var evacuationFile = evacuationFiles.First();

            evacuationFiles.ShouldNotBeNull();
            evacuationFile.ShouldNotBeNull();
            evacuationFile.NeedsAssessments.First().CanEvacueeProvideClothing.ShouldBe(true);
            evacuationFile.NeedsAssessments.First().CanEvacueeProvideFood.ShouldBe(true);
            evacuationFile.NeedsAssessments.First().CanEvacueeProvideIncidentals.ShouldBe(true);
            evacuationFile.NeedsAssessments.First().CanEvacueeProvideLodging.ShouldBe(true);
            evacuationFile.EvacuatedFromAddress.ShouldNotBeNull().AddressLine1.ShouldBe("9837 Douglas St");
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateEvacuation()
        {
            string testUserId = "4PRCSME5JFAAGAV5OPLTZLQXBGDL7XYD";
            string testEssFileNumber = "100615";
            var evacuationFile = await evacuationManager.GetEvacuation(testUserId, testEssFileNumber);
            var currentAddress = evacuationFile.EvacuatedFromAddress.AddressLine1;
            var newAddress = "1530 Party Ave.";

            evacuationFile.EvacuatedFromAddress.AddressLine1 = newAddress;

            var essFileNumber = await evacuationManager.SaveEvacuation(testUserId, evacuationFile.EssFileNumber, evacuationFile);
            essFileNumber.ShouldBe(testEssFileNumber);

            var updatedEvacuationFile = await evacuationManager.GetEvacuation(testUserId, testEssFileNumber);

            updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(newAddress);

            evacuationFile.EvacuatedFromAddress.AddressLine1 = currentAddress;

            essFileNumber = await evacuationManager.SaveEvacuation(testUserId, evacuationFile.EssFileNumber, evacuationFile);
            essFileNumber.ShouldBe(testEssFileNumber);

            updatedEvacuationFile = await evacuationManager.GetEvacuation(testUserId, testEssFileNumber);
            updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(currentAddress);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateEvacuation()
        {
            string testUserId = "4PRCSME5JFAAGAV5OPLTZLQXBGDL7XYD";
            string testEssFileNumber = "100615";
            var evacuationFile = await evacuationManager.GetEvacuation(testUserId, testEssFileNumber);

            var newEssFileNumber = await evacuationManager.SaveEvacuation(testUserId, null, evacuationFile);

            var createdEvacuationFile = await evacuationManager.GetEvacuation(testUserId, newEssFileNumber);

            createdEvacuationFile.ShouldNotBeNull();

            await evacuationManager.DeleteEvacuation(testUserId, newEssFileNumber);
        }
    }
}
