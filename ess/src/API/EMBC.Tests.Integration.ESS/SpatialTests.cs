using System.Threading;
using EMBC.ESS.Utilities.Spatial;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS;

public class SpatialTests : WebAppTestBase
{
    private readonly IAddressLocator addressLocator;

    public SpatialTests(ITestOutputHelper output, WebAppTestFixture fixture) : base(output, fixture)
    {
        addressLocator = Services.GetRequiredService<IAddressLocator>();
    }

    [Theory]
    [InlineData("1949 ROSEALEE LANE WEST KELOWNA BC", "1234", 100)]
    [InlineData("1950 ROSEALEE LANE WEST KELOWNA BC", null, 100)]
    [InlineData("2750 SMITH CREEK RD WEST KELOWNA BC", null, 100)]
    [InlineData("2755 SMITH CREEK RD WEST KELOWNA BC", "5678", 100)]
    [InlineData("3363 MCCONACHIE CRK RD FORT NELSON BC", "NBC", 100)]
    [InlineData("101 MCCONACHIE CRK RD FORT NELSON BC", null, 100)]
    [InlineData("1432 ROSE HILL PL WEST KELOWNA BC", "1111", 100)]
    [InlineData("1423 ROSE HILL PL WEST KELOWNA BC", null, 100)]
    public async Task CanResolveAddressToTask(string address, string? expectedTaskNumber, double score)
    {
        score.ShouldBeGreaterThan(60);
        var info = (await addressLocator.LocateAsync(new Location(address), CancellationToken.None)).ShouldNotBeNull();
        var attributes = info.Attributes;
        if (expectedTaskNumber == null)
        {
            attributes.ShouldBeNull();
        }
        else
        {
            attributes.ShouldNotBeNull();
            attributes.ShouldContain(a => a.Name == "ESS_TASK_NUMBER" && a.Value == expectedTaskNumber);
            //attributes.ShouldNotBeNull().ShouldContain(a => a.Name == "ESS_STATUS" && a.Value == "Active");
        }
    }
}
