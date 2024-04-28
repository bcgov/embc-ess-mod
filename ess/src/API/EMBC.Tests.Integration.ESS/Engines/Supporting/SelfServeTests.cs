using System.Linq;
using System.Threading;
using EMBC.ESS.Engines.Supporting;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts.Events;
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
        var ct = CancellationToken.None;
        var registrant = TestHelper.CreateRegistrantProfile();
        registrant.HomeAddress = TestHelper.CreateBcscValidAddress();
        var file = TestHelper.CreateNewTestEvacuationFile(registrant, null);
        file.NeedsAssessment.HouseholdMembers = file.NeedsAssessment.HouseholdMembers.Take(5).ToList();
        var fileId = await SaveFile(registrant, file);

        var expectedEligibilityResult = true;

        var eligibilityResponse = (ValidateSelfServeSupportsEligibilityResponse)await supportingEngine.Validate(new ValidateSelfServeSupportsEligibility(fileId), ct);
        eligibilityResponse.ShouldNotBeNull();
        eligibilityResponse.Eligibility.Eligible.ShouldBe(expectedEligibilityResult, eligibilityResponse.Eligibility.Reason);
    }

    private async Task<string> SaveFile(RegistrantProfile registrant, EvacuationFile evacuationFile)
    {
        var mgr = Services.GetRequiredService<EventsManager>();
        var registrantId = await mgr.Handle(new SaveRegistrantCommand() { Profile = registrant });
        evacuationFile.PrimaryRegistrantId = registrantId;
        return await mgr.Handle(new SubmitEvacuationFileCommand() { File = evacuationFile });
    }
}
