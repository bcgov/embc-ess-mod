using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class DynamicsConnectivityTests : WebAppTestBase
    {
        public DynamicsConnectivityTests(ITestOutputHelper output, WebAppTestFixture fixture) : base(output, fixture)
        {
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task GetSecurityToken()
        {
            var tokenProvider = Services.GetRequiredService<ISecurityTokenProvider>();
            output.WriteLine("Authorization: Bearer {0}", await tokenProvider.AcquireToken());
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanConnectToDynamics()
        {
            var context = Services.GetRequiredService<EssContext>();
            await context.era_countries.GetAllPagesAsync();
        }
    }
}
