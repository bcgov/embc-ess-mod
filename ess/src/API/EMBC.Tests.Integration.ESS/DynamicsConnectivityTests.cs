using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Polly.CircuitBreaker;
using Polly.Timeout;
using Shouldly;
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
        public void CanTriggerCricuitBreaker()
        {
            var essContextFactory = Services.GetRequiredService<IEssContextFactory>();
            var call = () =>
            {
                try
                {
                    var context = essContextFactory.Create();
                    context.era_countries.ToArray();
                    return null;
                }
                catch (Exception e)
                {
                    return e.InnerException ?? e;
                }
                finally
                {
                    //Thread.Sleep(TimeSpan.FromSeconds(Random.Shared.Next(1, 5)));
                }
            };

            var sw = Stopwatch.StartNew();

            var results = Enumerable.Range(1, 10).Select(i => new { i, sw.Elapsed, exeption = call() }).ToArray();
            sw.Stop();

            foreach (var r in results)
            {
                output.WriteLine("{0} {1}: {2}", r.i, r.Elapsed, r.exeption?.GetType().Name);
            }
            results.Length.ShouldBe(10);
            results.First().exeption?.GetType().ShouldBe(typeof(TimeoutRejectedException));
            results.Skip(1).ShouldAllBe(r => r.exeption != null && r.exeption.GetType().Equals(typeof(BrokenCircuitException)));
        }
    }
}
