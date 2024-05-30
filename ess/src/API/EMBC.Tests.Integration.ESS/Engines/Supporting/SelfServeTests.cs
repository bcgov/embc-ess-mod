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
        var eligibility = await RunEligibilityTest(file.Id, true);
        eligibility.EligibleSupportTypes.ShouldBeEmpty();
    }

    [Fact]
    public async Task ValidateEligibility_ShelterReferral_False()
    {
        var (file, _) = await CreateTestSubjects(needs: [IdentifiedNeed.ShelterReferral, IdentifiedNeed.Clothing, IdentifiedNeed.Food], homeAddress: TestHelper.CreateSelfServeEligibleAddress());

        await RunEligibilityTest(file.Id, false, "Evacuee requested support referrals");
    }

    [Fact]
    public async Task ValidateEligibility_PartialEnabledSupports_False()
    {
        var (file, _) = await CreateTestSubjects(needs: [IdentifiedNeed.ShelterAllowance, IdentifiedNeed.Incidentals, IdentifiedNeed.Clothing, IdentifiedNeed.Food], homeAddress: TestHelper.CreatePartialSelfServeEligibleAddress());

        await RunEligibilityTest(file.Id, false, "Requested supports are not enabled: Clothing,ShelterAllowance");
    }

    [Fact]
    public async Task ValidateEligibility_PartialEnabledSupports_True()
    {
        var (file, _) = await CreateTestSubjects(needs: [IdentifiedNeed.Food], homeAddress: TestHelper.CreatePartialSelfServeEligibleAddress());

        var eligibility = await RunEligibilityTest(file.Id, true);
        eligibility.EligibleSupportTypes.ShouldHaveSingleItem().ShouldBe(SelfServeSupportType.FoodRestaurant);
    }

    [Fact]
    public async Task ValidateEligibility_ActiveSupports_False()
    {
        var (file, _) = await CreateTestSubjects(taskNumber: TestData.SelfServeActiveTaskId, homeAddress: TestHelper.CreateSelfServeEligibleAddress());
        var previousSupports = new[]
        {
            new ShelterAllowanceSupport{FileId = file.Id, From = DateTime.Now, To = DateTime.Now.AddHours(72), IncludedHouseholdMembers = file.NeedsAssessment.HouseholdMembers.Select(hm=>hm.Id), SupportDelivery = new Referral() }
        };
        await SaveSupports(file.Id, previousSupports);
        var support = (await GetFile(file.Id)).Supports.ShouldHaveSingleItem();

        await RunEligibilityTest(file.Id, false, $"Supports {support.Id} are still active");
    }

    [Fact]
    public async Task ValidateEligibility_DuplicateSupports_False()
    {
        var (file1, registrant) = await CreateTestSubjects(taskNumber: TestData.SelfServeActiveTaskId, homeAddress: TestHelper.CreateSelfServeEligibleAddress());
        var previousSupports = new[]
        {
            new ShelterAllowanceSupport{FileId = file1.Id, From = DateTime.Now, To = DateTime.Now.AddHours(72), IncludedHouseholdMembers = file1.NeedsAssessment.HouseholdMembers.Select(hm=>hm.Id), SupportDelivery = new Referral() }
        };
        await SaveSupports(file1.Id, previousSupports);

        var (file2, _) = await CreateTestSubjects(taskNumber: TestData.SelfServeActiveTaskId, homeAddress: TestHelper.CreateSelfServeEligibleAddress(), existingRegistrant: registrant);
        await RunEligibilityTest(file2.Id, false, "Overlapping supports found");
    }

    [Fact]
    public async Task ValidateEligibility_NotDuplicateSupport_True()
    {
        var (file, _) = await CreateTestSubjects(taskNumber: TestData.SelfServeActiveTaskId, homeAddress: TestHelper.CreateSelfServeEligibleAddress());
        var previousSupports = new[]
        {
            new ShelterAllowanceSupport
            {
                FileId = file.Id,
                From = DateTime.Now.AddDays(-7),
                To = DateTime.Now.AddDays(-7).AddHours(72),
                IncludedHouseholdMembers = file.NeedsAssessment.HouseholdMembers.Select(hm=>hm.Id),
                SupportDelivery = new Referral()
            }
        };
        await SaveSupports(file.Id, previousSupports);

        await RunEligibilityTest(file.Id, true);
    }

    [Fact]
    public async Task GenerateSelfServeSupports_ShelterAllowance_Generated()
    {
        var (file, _) = await CreateTestSubjects();
        var task = await GetTask(TestData.SelfServeActiveTaskId);
        var now = DateTime.UtcNow.ToPST();
        var response = (GenerateSelfServeSupportsResponse)await supportingEngine.Generate(
            new GenerateSelfServeSupports(
                [SelfServeSupportType.ShelterAllowance],
                task.StartDate.ToPST(),
                task.EndDate.ToPST(),
                now,
                now.AddHours(72),
                file.NeedsAssessment.HouseholdMembers.Select(hm => new SelfServeHouseholdMember(hm.Id, hm.IsMinor))));
        var supports = response.Supports;
        supports.ShouldNotBeEmpty();
        var support = supports.Where(s => s is SelfServeShelterAllowanceSupport).ShouldHaveSingleItem().ShouldBeOfType<SelfServeShelterAllowanceSupport>();
        support.Nights.Count().ShouldBe(3);
        support.IncludedHouseholdMembers.Order().ShouldBe(file.NeedsAssessment.HouseholdMembers.Select(hm => hm.Id).Order());
    }

    [Fact]
    public async Task ValidateExtensionEligibility_MoreHouseholdMembers_False()
    {
        var (file, _) = await CreateTestSubjects(numberOfHoldholdMembers: 2, needs: [IdentifiedNeed.Food], homeAddress: TestHelper.CreateSelfServeEligibleAddress());

        var newHouseholdMember = file.HouseholdMembers.Last() with { Id = null, IsPrimaryRegistrant = false, DateOfBirth = "1/19/2002" };
        await UpdateTestFile(file, householdMembers: file.NeedsAssessment.HouseholdMembers.Append(newHouseholdMember));
        await RunEligibilityTest(file.Id, false, "Current needs assessment has more household members from the previous needs asessment");
    }

    [Fact]
    public async Task ValidateExtensionEligibility_LessHouseholdMembers_True()
    {
        var (file, _) = await CreateTestSubjects(needs: [IdentifiedNeed.Food], homeAddress: TestHelper.CreateSelfServeEligibleAddress());

        var updatedHouseholdMembers = file.HouseholdMembers.Take(4).Select(hm => hm with { });
        await UpdateTestFile(file, householdMembers: updatedHouseholdMembers);
        await RunEligibilityTest(file.Id, true);
    }

    [Fact]
    public async Task ValidateExtensionEligibility_ChangedHouseholdMembers_False()
    {
        var (file, _) = await CreateTestSubjects(needs: [IdentifiedNeed.Food], homeAddress: TestHelper.CreateSelfServeEligibleAddress());

        var updatedHouseholdMembers = file.HouseholdMembers.Select(hm => hm with { }).ToList();
        updatedHouseholdMembers[updatedHouseholdMembers.Count - 1].DateOfBirth = "1/19/2002";
        await UpdateTestFile(file, householdMembers: updatedHouseholdMembers);
        await RunEligibilityTest(file.Id, false, $"Household member {updatedHouseholdMembers[updatedHouseholdMembers.Count - 1].Id} was modified");
    }

    [Fact]
    public async Task ValidateExtensionEligibility_NonExtensibleSupport_True()
    {
        var (file, _) = await CreateTestSubjects(taskNumber: TestData.SelfServeActiveTaskId, homeAddress: TestHelper.CreateSelfServeEligibleAddress());
        var eligibility1 = await RunEligibilityTest(file.Id, true);
        eligibility1.EligibleSupportTypes.ShouldContain(SelfServeSupportType.Incidentals);
        eligibility1.OneTimePastSupportTypes.ShouldBeEmpty();

        var previousSupports = new[]
        {
            new IncidentalsSupport
            {
                FileId = file.Id,
                From = DateTime.Now.AddDays(-7),
                To = DateTime.Now.AddDays(-7).AddHours(72),
                IncludedHouseholdMembers = file.NeedsAssessment.HouseholdMembers.Select(hm=>hm.Id),
                SupportDelivery = new Interac(),
                IsSelfServe = true
            }
        };
        await SaveSupports(file.Id, previousSupports);

        await UpdateTestFile(file);

        var eligibility2 = await RunEligibilityTest(file.Id, true);
        eligibility2.EligibleSupportTypes.ShouldNotContain(SelfServeSupportType.Incidentals);
        eligibility2.OneTimePastSupportTypes.ShouldBe([SelfServeSupportType.Incidentals]);
    }

    [Fact]
    public async Task ValidateEligibility_PreviousOnetimeSupports_TrueWithoutOneTimeSupports()
    {
        var (file1, registrant) = await CreateTestSubjects(taskNumber: TestData.ActiveTaskId, homeAddress: TestHelper.CreateSelfServeEligibleAddress());
        var previousSupports = new[]
        {
            new ClothingSupport
            {
                FileId = file1.Id,
                From = DateTime.Now.AddDays(-3).AddHours(-3),
                To = DateTime.Now.AddHours(-3),
                IncludedHouseholdMembers = file1.NeedsAssessment.HouseholdMembers.Select(hm=>hm.Id),
                SupportDelivery = new Referral()
            }
        };
        await SaveSupports(file1.Id, previousSupports);

        var (file2, _) = await CreateTestSubjects(taskNumber: TestData.SelfServeActiveTaskId, homeAddress: TestHelper.CreateSelfServeEligibleAddress(), existingRegistrant: registrant);
        var eligibility = await RunEligibilityTest(file2.Id, true);
        eligibility.EligibleSupportTypes.ShouldNotContain(SelfServeSupportType.Clothing);
    }

    private async Task<SelfServeSupportEligibility> RunEligibilityTest(string fileId, bool expectedResult, string? reason = null)
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

    private async Task<(EvacuationFile file, RegistrantProfile registrantProfile)> CreateTestSubjects(
        string? taskNumber = null,
        int numberOfHoldholdMembers = 5,
        Address? homeAddress = null,
        IEnumerable<IdentifiedNeed>? needs = null,
        RegistrantProfile? existingRegistrant = null)
    {
        var registrant = existingRegistrant ?? TestHelper.CreateRegistrantProfile();
        registrant.HomeAddress = homeAddress;

        registrant.Id = await SaveRegistrant(registrant);
        var file = TestHelper.CreateNewTestEvacuationFile(registrant, taskNumber, numberOfHoldholdMembers);
        file.PrimaryRegistrantId = registrant.Id;
        file.PrimaryRegistrantUserId = registrant.UserId;
        file.NeedsAssessment.HouseholdMembers = file.NeedsAssessment.HouseholdMembers.Take(numberOfHoldholdMembers).ToList();
        file.NeedsAssessment.Needs = needs ?? [IdentifiedNeed.ShelterAllowance, IdentifiedNeed.Clothing, IdentifiedNeed.Incidentals, IdentifiedNeed.Food];

        file.Id = await SaveFile(file);

        var savedFile = await GetFile(file.Id);
        return (savedFile, registrant);
    }

    private async Task<EvacuationFile> UpdateTestFile(EvacuationFile file, IEnumerable<HouseholdMember>? householdMembers = null)
    {
        file.NeedsAssessment = file.NeedsAssessment with { HouseholdMembers = householdMembers ?? file.NeedsAssessment.HouseholdMembers };
        await SaveFile(file);
        return file;
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
