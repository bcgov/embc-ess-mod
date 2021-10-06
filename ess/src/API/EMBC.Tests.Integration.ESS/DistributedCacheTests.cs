using System.Threading.Tasks;
using EMBC.ESS;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class DistributedCacheTests : WebAppTestBase
    {
        public DistributedCacheTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
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
