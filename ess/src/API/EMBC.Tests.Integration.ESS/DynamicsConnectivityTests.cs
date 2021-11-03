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

        public DynamicsConnectivityTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory)
        {
            this.output = output;
            this.webApplicationFactory = webApplicationFactory;
        }

#if RELEASE
        [Fact(Skip = "requires VPN access")]
#else
        [Fact]
#endif
        public async Task GetSecurityToken()
        {
            var tokenProvider = webApplicationFactory.Services.GetRequiredService<ISecurityTokenProvider>();
            output.WriteLine("Authorization: Bearer {0}", await tokenProvider.AcquireToken());
        }
    }
}
