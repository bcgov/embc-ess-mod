using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class DistributedCacheTests : WebAppTestBase
    {
        public DistributedCacheTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSetAndGetItems()
        {
            var cache = services.GetRequiredService<IDistributedCache>();

            var key = "test_key";
            var value = "test_value";

            await cache.SetStringAsync(key, value);

            var actualValue = await cache.GetStringAsync(key);

            actualValue.ShouldBe(value);
        }
    }
}
