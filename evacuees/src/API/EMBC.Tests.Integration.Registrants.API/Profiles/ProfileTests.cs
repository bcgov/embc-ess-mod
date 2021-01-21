using System.Threading.Tasks;
using EMBC.Registrants.API;
using EMBC.Registrants.API.ProfilesModule;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.Registrants.API.Profiles
{
    public class ProfileTests : WebAppTestBase
    {
        public ProfileTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetProfile()
        {
            var profileManager = this.services.GetRequiredService<IProfileManager>();

            var profile = await profileManager.GetProfileByBceid("test");

            profile.ShouldNotBeNull();
        }
    }
}
