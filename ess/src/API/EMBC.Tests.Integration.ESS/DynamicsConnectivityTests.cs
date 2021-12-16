using System;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Utilities.Dynamics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class DynamicsConnectivityTests : WebAppTestBase
    {
        public DynamicsConnectivityTests(ITestOutputHelper output, WebAppTestFixture<Startup> fixture) : base(output, fixture)
        {
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task GetSecurityToken()
        {
            var tokenProvider = Services.GetRequiredService<ISecurityTokenProvider>();
            var logger = Services.GetRequiredService<ILogger<DynamicsConnectivityTests>>();
            logger.LogInformation("Authorization: Bearer {0}", await tokenProvider.AcquireToken());
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanConnectToDynamics()
        {
            var context = Services.GetRequiredService<EssContext>();
            //await Should.NotThrowAsync(async () => await context.era_countries.GetAllPagesAsync());
            await context.era_countries.GetAllPagesAsync();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanTriggerCricuitBreaker()
        {
            var context = Services.GetRequiredService<EssContext>();
            var logger = Services.GetRequiredService<ILogger<DynamicsConnectivityTests>>();

            var call = async () =>
            {
                try
                {
                    await context.era_countries.GetAllPagesAsync();
                    return null;
                }
                catch (Exception e)
                {
                    return e;
                }
            };

            for (int i = 0; i < 5; i++)
            {
                var exception = await call();
                logger.LogInformation(exception.GetType().Name);
            }
        }
    }
}
