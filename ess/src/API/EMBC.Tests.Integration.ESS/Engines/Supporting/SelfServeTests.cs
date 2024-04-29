using System.Linq;
using EMBC.ESS.Engines.Supporting;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Extensions;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Engines.Supporting;

public class SelfServeTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : DynamicsWebAppTestBase(output, fixture)
{
    private ISupportingEngine supportingEngine;

    public override async Task InitializeAsync()
    {
        await base.InitializeAsync();
        supportingEngine = Services.GetRequiredService<ISupportingEngine>();
    }

    [Fact]
    public async Task CheckHouseholdMembers()
    {
        var (file, _) = await CreateTestSubjects();

        var expectedEligibilityResult = true;

        var eligibilityResponse = (ValidateSelfServeSupportsEligibilityResponse)await supportingEngine.Validate(new ValidateSelfServeSupportsEligibility(file.Id));
        eligibilityResponse.ShouldNotBeNull();
        eligibilityResponse.Eligibility.Eligible.ShouldBe(expectedEligibilityResult, eligibilityResponse.Eligibility.Reason);
    }

    [Fact]
    public async Task GenerateSelfServSupports()
    {
        var (file, _) = await CreateTestSubjects();
        var task = await GetTask("1234");
        var supports = (GenerateSelfServeSupportsResponse)await supportingEngine.Generate(
            new GenerateSelfServeSupports(
                file.NeedsAssessment.Needs,
                task.StartDate.ToPST(),
                task.StartDate.ToPST().AddHours(72),
                task.StartDate.ToPST(),
                task.EndDate.ToPST(),
                file.NeedsAssessment.HouseholdMembers.Select(hm => new SelfServeHouseholdMember(hm.Id, hm.IsMinor))));
        supports.Supports.ShouldNotBeEmpty();
    }

    private async Task<(EvacuationFile file, RegistrantProfile registrantProfile)> CreateTestSubjects(int numberOfHoldholdMembers = 5)
    {
        var registrant = TestHelper.CreateRegistrantProfile();
        registrant.HomeAddress = TestHelper.CreateBcscValidAddress();
        registrant.Id = await SaveRegistrant(registrant);

        var file = TestHelper.CreateNewTestEvacuationFile(registrant, null);
        file.PrimaryRegistrantId = registrant.Id;
        file.NeedsAssessment.HouseholdMembers = file.NeedsAssessment.HouseholdMembers.Take(numberOfHoldholdMembers).ToList();
        file.NeedsAssessment.Needs = [IdentifiedNeed.ShelterAllowance, IdentifiedNeed.Clothing, IdentifiedNeed.Incidentals, IdentifiedNeed.Food];

        file.Id = await SaveFile(file);
        return (file, registrant);
    }

    private async Task<string> SaveFile(EvacuationFile evacuationFile)
    {
        var mgr = Services.GetRequiredService<EventsManager>();
        return await mgr.Handle(new SubmitEvacuationFileCommand() { File = evacuationFile });
    }

    private async Task<string> SaveRegistrant(RegistrantProfile registrant)
    {
        var mgr = Services.GetRequiredService<EventsManager>();
        return await mgr.Handle(new SaveRegistrantCommand() { Profile = registrant });
    }

    private async Task<IncidentTask> GetTask(string taskNumber)
    {
        var mgr = Services.GetRequiredService<EventsManager>();
        return (await mgr.Handle(new TasksSearchQuery { TaskId = taskNumber })).Items.Single(t => t.Status == IncidentTaskStatus.Active);
    }
}
