using System;
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
    public async Task ValidateEligibility_EligibleFile_True()
    {
        var (file, _) = await CreateTestSubjects();
        var eligibility = await RunEligibilityTest(file.Id, true, null);
        eligibility.From.ShouldNotBeNull();
        eligibility.To.ShouldNotBeNull();
        eligibility.HomeAddressReferenceId.ShouldNotBeNull();
    }

    [Fact]
    public async Task ValidateEligibility_MoreThan5HouseholdMembers_False()
    {
        var (file, _) = await CreateTestSubjects(numberOfHoldholdMembers: 6);
        await RunEligibilityTest(file.Id, false, "File has more than 5 household members");
    }

    [Fact]
    public async Task ValidateEligibility_NotEligibleAddress_False()
    {
        var (file, _) = await CreateTestSubjects(eligibleAddress: false);
        await RunEligibilityTest(file.Id, false, "No suitable task found for home address");
    }

    [Fact]
    public async Task ValidateEligibility_NotHomeAddress_False()
    {
        var (file, _) = await CreateTestSubjects(eligibleAddress: null);
        await RunEligibilityTest(file.Id, false, "Registarnt has no home address");
    }

    [Fact]
    public async Task ValidateEligibility_NoNeeds_False()
    {
        var (file, _) = await CreateTestSubjects(noNeeds: true);
        await RunEligibilityTest(file.Id, false, "Evacuee didn't identify any needs");
    }

    private async Task<SelfServeSupportEligibility> RunEligibilityTest(string fileId, bool expectedResult, string? reason)
    {
        var eligibilityResponse = (ValidateSelfServeSupportsEligibilityResponse)await supportingEngine.Validate(new ValidateSelfServeSupportsEligibility(fileId));
        eligibilityResponse.ShouldNotBeNull();
        eligibilityResponse.Eligibility.Eligible.ShouldBe(expectedResult, eligibilityResponse.Eligibility.Reason);
        if (string.IsNullOrEmpty(reason))
            eligibilityResponse.Eligibility.Reason.ShouldBeNullOrEmpty();
        else
            eligibilityResponse.Eligibility.Reason.ShouldContain(reason);

        return eligibilityResponse.Eligibility;
    }

    [Fact]
    public async Task GenerateSelfServeSupports_ShelterAllowance_Generated()
    {
        var (file, _) = await CreateTestSubjects();
        var task = await GetTask("1234");
        var supports = (GenerateSelfServeSupportsResponse)await supportingEngine.Generate(
            new GenerateSelfServeSupports(
                [IdentifiedNeed.ShelterAllowance],
                DateTime.Now.ToPST(),
                DateTime.Now.ToPST().AddHours(72),
                task.StartDate.ToPST(),
                task.EndDate.ToPST(),
                file.NeedsAssessment.HouseholdMembers.Select(hm => new SelfServeHouseholdMember(hm.Id, hm.IsMinor))));
        supports.Supports.ShouldNotBeEmpty();
    }

    private async Task<(EvacuationFile file, RegistrantProfile registrantProfile)> CreateTestSubjects(
        int numberOfHoldholdMembers = 5,
        bool? eligibleAddress = true,
        bool noNeeds = false)
    {
        var registrant = TestHelper.CreateRegistrantProfile();
        if (eligibleAddress == null)
            registrant.HomeAddress = null;
        else if (eligibleAddress.Value)
            registrant.HomeAddress = TestHelper.CreateSelfServeEligibleAddress();
        else
            registrant.HomeAddress = TestHelper.CreateSelfServeIneligibleAddress();

        registrant.Id = await SaveRegistrant(registrant);
        var file = TestHelper.CreateNewTestEvacuationFile(registrant, null);
        file.PrimaryRegistrantId = registrant.Id;
        file.NeedsAssessment.HouseholdMembers = file.NeedsAssessment.HouseholdMembers.Take(numberOfHoldholdMembers).ToList();
        if (noNeeds)
            file.NeedsAssessment.Needs = [];
        else
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
