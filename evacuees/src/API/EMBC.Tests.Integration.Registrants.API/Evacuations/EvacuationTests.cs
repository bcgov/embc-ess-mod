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
            var evacuationFiles = await evacuationManager.GetEvacuations(testUserId);
            var evacuationFile = evacuationFiles.First();
            var currentCity = evacuationFile.EvacuatedFromAddress.Jurisdiction;
            var newCity = (await listsRepository.GetJurisdictions()).Skip(new Random().Next(100)).Take(1).First();

            evacuationFile.EvacuatedFromAddress.Jurisdiction = new Jurisdiction { Code = newCity.Code };

            await evacuationManager.SaveEvacuation(testUserId, evacuationFile.EssFileNumber, evacuationFile);

            var updatedEvacuationFiles = await evacuationManager.GetEvacuations(testUserId);
            var updatedEvacuationFile = updatedEvacuationFiles.FirstOrDefault();
            updatedEvacuationFile.EvacuatedFromAddress.Jurisdiction.Code.ShouldBe(newCity.Code);
            updatedEvacuationFile.EvacuatedFromAddress.Jurisdiction.Name.ShouldBe(newCity.Name);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateEvacuation()
        {
            string testUserId = "4PRCSME5JFAAGAV5OPLTZLQXBGDL7XYD";
            var evacuationFiles = await evacuationManager.GetEvacuations(testUserId);
            var baseEvacuationFile = evacuationFiles.LastOrDefault();

            var newEssFileNumber = await evacuationManager.SaveEvacuation(testUserId, null, baseEvacuationFile);

            var updatedEvacuationFiles = await evacuationManager.GetEvacuations(testUserId);
            var createdEvacuationFile = updatedEvacuationFiles
                .Where(ef => ef.EssFileNumber == newEssFileNumber).FirstOrDefault();

            createdEvacuationFile.ShouldNotBeNull().EssFileNumber.ShouldBe(newEssFileNumber);
        }
    }
}
