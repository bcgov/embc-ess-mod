using System.Threading;
using EMBC.ESS.Utilities.Spatial;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS;

public class SpatialTests : WebAppTestBase
{
    private readonly ILocationService locationService;

    public SpatialTests(ITestOutputHelper output, WebAppTestFixture fixture) : base(output, fixture)
    {
        locationService = Services.GetRequiredService<ILocationService>();
    }

    [Theory]
    [InlineData("1949 ROSEALEE LANE WEST KELOWNA BC", 100)]
    [InlineData("1950 ROSEALEE LANE WEST KELOWNA BC", 100)]
    [InlineData("2750 SMITH CREEK RD WEST KELOWNA BC", 100)]
    [InlineData("2755 SMITH CREEK RD WEST KELOWNA BC", 100)]
    [InlineData("3363 MCCONACHIE CRK RD FORT NELSON BC", 100)]
    [InlineData("101 MCCONACHIE CRK RD FORT NELSON BC", 100)]
    [InlineData("1432 ROSE HILL PL WEST KELOWNA BC", 100)]
    [InlineData("1423 ROSE HILL PL WEST KELOWNA BC", 100)]
    public async Task CanResolveGeocode(string address, int score)
    {
        score.ShouldBeGreaterThan(60);
        var geocode = (await locationService.ResolveGeocode(new Location(address), CancellationToken.None)).ShouldNotBeNull();
        geocode.Score.ShouldBe(score);
    }

    [Theory]
    [InlineData("1949 ROSEALEE LANE WEST KELOWNA BC", "1234")]
    [InlineData("1950 ROSEALEE LANE WEST KELOWNA BC", null)]
    [InlineData("2750 SMITH CREEK RD WEST KELOWNA BC", null)]
    [InlineData("2755 SMITH CREEK RD WEST KELOWNA BC", "5678")]
    [InlineData("3363 MCCONACHIE CRK RD FORT NELSON BC", "NBC")]
    [InlineData("101 MCCONACHIE CRK RD FORT NELSON BC", null)]
    [InlineData("1432 ROSE HILL PL WEST KELOWNA BC", "1111")]
    [InlineData("1423 ROSE HILL PL WEST KELOWNA BC", null)]
    public async Task CanGetGeocodeLocationProperties(string address, string? expectedTaskNumber)
    {
        var geocode = (await locationService.ResolveGeocode(new Location(address), CancellationToken.None)).ShouldNotBeNull();
        var features = (await locationService.GetGeocodeAttributes(geocode.Coordinates, CancellationToken.None)).ShouldNotBeNull();
        if (expectedTaskNumber == null)
        {
            features.ShouldBeEmpty();
        }
        else
        {
            features.ShouldNotBeEmpty();
            foreach (var feature in features)
            {
                feature.ShouldContain(a => a.Name == "ESS_TASK_NUMBER" && a.Value == expectedTaskNumber);
            }
        }
    }
}
