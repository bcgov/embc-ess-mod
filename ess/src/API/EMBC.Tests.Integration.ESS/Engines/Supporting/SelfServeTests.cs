using System;
using System.Collections.Generic;
using System.Linq;
using EMBC.ESS.Engines.Supporting;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;
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
        var (file, _) = await CreateTestSubjects(homeAddress: TestHelper.CreateSelfServeEligibleAddress());
        var eligibility = await RunEligibilityTest(file.Id, true, null);
        eligibility.From.ShouldNotBeNull();
        eligibility.To.ShouldNotBeNull();
        eligibility.HomeAddressReferenceId.ShouldNotBeNull();
    }

    [Fact]
    public async Task ValidateEligibility_MoreThan5HouseholdMembers_False()
    {
        var (file, _) = await CreateTestSubjects(numberOfHoldholdMembers: 6, homeAddress: TestHelper.CreateSelfServeEligibleAddress());
        await RunEligibilityTest(file.Id, false, "File has more than 5 household members");
    }

    [Fact]
    public async Task ValidateEligibility_NotEligibleAddress_False()
    {
        var (file, _) = await CreateTestSubjects(homeAddress: TestHelper.CreateSelfServeIneligibleAddress());
        await RunEligibilityTest(file.Id, false, "No suitable task found for home address");
    }

    [Fact]
    public async Task ValidateEligibility_NotHomeAddress_False()
    {
        var (file, _) = await CreateTestSubjects(homeAddress: null);
        await RunEligibilityTest(file.Id, false, "Registarnt has no home address");
    }

    [Fact]
    public async Task ValidateEligibility_NoNeeds_True()
    {
        var (file, _) = await CreateTestSubjects(needs: [], homeAddress: TestHelper.CreateSelfServeEligibleAddress());
        var eligibility = await RunEligibilityTest(file.Id, true, null);
        eligibility.eligibleSupportTypes.ShouldBeEmpty();
    }

    [Fact]
    public async Task ValidateEligibility_ShelterReferral_False()
    {
        var (file, _) = await CreateTestSubjects(needs: [IdentifiedNeed.ShelterReferral, IdentifiedNeed.Clothing, IdentifiedNeed.Food], homeAddress: TestHelper.CreateSelfServeEligibleAddress());

        await RunEligibilityTest(file.Id, false, "Evacuee requested support referrals");
    }

    [Fact]
    public async Task ValidateEligibility_DuplicateSupport_False()
    {
        var (file, _) = await CreateTestSubjects(taskNumber: TestData.ActiveTaskId, homeAddress: TestHelper.CreateSelfServeEligibleAddress());
        var actualFile = await GetFile(file.Id);
        var previousSupports = new[]
        {
            new ShelterAllowanceSupport{FileId = file.Id, From = DateTime.Now, To = DateTime.Now.AddHours(72), IncludedHouseholdMembers = actualFile.NeedsAssessment.HouseholdMembers.Select(hm=>hm.Id), SupportDelivery = new Referral() }
        };
        await SaveSupports(file.Id, previousSupports);

        await RunEligibilityTest(file.Id, false, "Duplicate supports found");
    }

    [Fact]
    public async Task ValidateEligibility_PartialEnabledSupports_False()
    {
        var (file, _) = await CreateTestSubjects(needs: [IdentifiedNeed.ShelterAllowance, IdentifiedNeed.Incidentals, IdentifiedNeed.Clothing, IdentifiedNeed.Food], homeAddress: TestHelper.CreatePartialSelfServeEligibleAddress());

        await RunEligibilityTest(file.Id, false, "Requested supports are not enabled: Incidentals,FoodGroceries,ShelterAllowance");
    }

    [Fact]
    public async Task ValidateEligibility_NotDuplicateSupport_True()
    {
        var (file, _) = await CreateTestSubjects(taskNumber: TestData.ActiveTaskId, homeAddress: TestHelper.CreateSelfServeEligibleAddress());
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

    [Fact]
    public async Task GenerateSelfServeSupports_ShelterAllowance_Generated()
    {
        var (file, _) = await CreateTestSubjects();
        var task = await GetTask(TestData.SelfServeActiveTaskId);
        var response = (GenerateSelfServeSupportsResponse)await supportingEngine.Generate(
            new GenerateSelfServeSupports(
                [SelfServeSupportType.ShelterAllowance],
                DateTime.Now.ToPST(),
                DateTime.Now.ToPST().AddHours(72),
                task.StartDate.ToPST(),
                task.EndDate.ToPST(),
                file.NeedsAssessment.HouseholdMembers.Select(hm => new SelfServeHouseholdMember(hm.Id, hm.IsMinor))));
        var supports = response.Supports;
        supports.ShouldNotBeEmpty();
        var support = supports.Where(s => s is SelfServeShelterAllowanceSupport).ShouldHaveSingleItem().ShouldBeOfType<SelfServeShelterAllowanceSupport>();
        support.Nights.Count().ShouldBe(3);
        support.IncludedHouseholdMembers.Order().ShouldBe(file.NeedsAssessment.HouseholdMembers.Select(hm => hm.Id).Order());
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

    private async Task<(EvacuationFile file, RegistrantProfile registrantProfile)> CreateTestSubjects(string? taskNumber = null, int numberOfHoldholdMembers = 5, Address? homeAddress = null, IEnumerable<IdentifiedNeed>? needs = null)
    {
        var registrant = TestHelper.CreateRegistrantProfile();
        registrant.HomeAddress = homeAddress;

        registrant.Id = await SaveRegistrant(registrant);
        var file = TestHelper.CreateNewTestEvacuationFile(registrant, taskNumber, numberOfHoldholdMembers);
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
