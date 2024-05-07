using System;
using System.Collections.Generic;
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
        var (file, _) = await CreateTestSubjects(needs: []);
        await RunEligibilityTest(file.Id, false, "Evacuee didn't identify any needs");
    }

    [Fact]
    public async Task ValidateEligibility_ShelterReferral_False()
    {
        var (file, _) = await CreateTestSubjects(needs: [IdentifiedNeed.ShelterReferral, IdentifiedNeed.Clothing, IdentifiedNeed.Food]);

        await RunEligibilityTest(file.Id, false, "Evacuee requested referrals");
    }

    [Fact]
    public async Task ValidateEligibility_DuplicateSupport_False()
    {
        var (file, _) = await CreateTestSubjects();
        var actualFile = await GetFile(file.Id);
        var previousSupports = new[]
        {
            new ShelterAllowanceSupport{FileId = file.Id, From = DateTime.Now, To = DateTime.Now.AddHours(72), IncludedHouseholdMembers = actualFile.NeedsAssessment.HouseholdMembers.Select(hm=>hm.Id), SupportDelivery = new Referral() }
        };
        await SaveSupports(file.Id, previousSupports);

        await RunEligibilityTest(file.Id, false, "Duplicate supports found");
    }

    [Fact]
    public async Task ValidateEligibility_NotDuplicateSupport_True()
    {
        var (file, _) = await CreateTestSubjects();
        var actualFile = await GetFile(file.Id);
        var previousSupports = new[]
        {
            new ShelterAllowanceSupport
            {
                FileId = file.Id,
                From = DateTime.Now.AddDays(-7),
                To = DateTime.Now.AddDays(-7).AddHours(72),
                IncludedHouseholdMembers = actualFile.NeedsAssessment.HouseholdMembers.Select(hm=>hm.Id),
                SupportDelivery = new Referral()
            }
        };
        await SaveSupports(file.Id, previousSupports);

        await RunEligibilityTest(file.Id, true, null);
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
        IEnumerable<IdentifiedNeed>? needs = null)
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
        file.NeedsAssessment.Needs = needs ?? [IdentifiedNeed.ShelterAllowance, IdentifiedNeed.Clothing, IdentifiedNeed.Incidentals, IdentifiedNeed.Food];

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

    private async Task<EvacuationFile> GetFile(string fileId)
    {
        var mgr = Services.GetRequiredService<EventsManager>();
        return (await mgr.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.Single();
    }

    private async Task SaveSupports(string fileId, IEnumerable<Support> supports)
    {
        var mgr = Services.GetRequiredService<EventsManager>();
        await mgr.Handle(new ProcessSupportsCommand { FileId = fileId, Supports = supports, RequestingUserId = TestData.Tier4TeamMemberId });
    }
}
