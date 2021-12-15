using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Utilities.Dynamics;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class DynamicsConnectivityTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly ITestOutputHelper output;
        private readonly WebApplicationFactory<Startup> webApplicationFactory;

#if RELEASE
        protected const string RequiresDynamics = "Integration tests that requires Dynamics connection via VPN";
#else
        protected const string RequiresDynamics = null;
#endif

        public DynamicsConnectivityTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory)
        {
            this.output = output;
            this.webApplicationFactory = webApplicationFactory;
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task GetSecurityToken()
        {
            var tokenProvider = webApplicationFactory.Services.GetRequiredService<ISecurityTokenProvider>();
            output.WriteLine("Authorization: Bearer {0}", await tokenProvider.AcquireToken());
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanConnectToDynamics()
        {
            var context = webApplicationFactory.Services.GetRequiredService<EssContext>();
            //await Should.NotThrowAsync(async () => await context.era_countries.GetAllPagesAsync());
            await context.era_countries.GetAllPagesAsync();
        }
    }
}
