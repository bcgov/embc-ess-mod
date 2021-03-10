using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Managers.Location;
using EMBC.ESS.Shared.Contracts.Location;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Location
{
    public class LocationTests : WebAppTestBase
    {
        public LocationTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetCountries()
        {
            var locationManager = base.services.GetRequiredService<LocationManager>();

            var reply = await locationManager.Handle(new CountriesQueryCommand());

            reply.ShouldNotBeNull().Items.ShouldNotBeEmpty();
            reply.Items.ShouldAllBe(c => c.Code != null && c.Name != null);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetStateProvinces()
        {
            var locationManager = base.services.GetRequiredService<LocationManager>();

            var reply = await locationManager.Handle(new StateProvincesQueryCommand());

            reply.ShouldNotBeNull().Items.ShouldNotBeEmpty();
            reply.Items.ShouldAllBe(c => c.Code != null && c.Name != null && c.CountryCode != null);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetCommunities()
        {
            var locationManager = base.services.GetRequiredService<LocationManager>();

            var reply = await locationManager.Handle(new CommunitiesQueryCommand());

            reply.ShouldNotBeNull().Items.ShouldNotBeEmpty();
            reply.Items.ShouldAllBe(c => c.Code != null && c.Name != null && c.CountryCode != null);
        }
    }
}
