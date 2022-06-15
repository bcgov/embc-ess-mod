using System;
using System.Threading;
using System.Threading.Tasks;
using EMBC.Utilities.Caching;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Hosting.Internal;
using Microsoft.Extensions.Options;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Unit.ESS.Utilities
{
    public class CacheTests
    {
        private readonly MemoryDistributedCache underlyingDistributedCache;
        private readonly CacheSyncManager cacheSyncManager;
        private readonly ICache cache;

        public CacheTests(ITestOutputHelper output)
        {
            var env = new HostingEnvironment { EnvironmentName = Environments.Development };
            var opts = Options.Create(new MemoryDistributedCacheOptions());
            underlyingDistributedCache = new MemoryDistributedCache(opts);
            var telemetryProvider = TestHelper.CreateTelemetryProvider(output);
            cacheSyncManager = new CacheSyncManager(telemetryProvider);
            cache = new Cache(underlyingDistributedCache, cacheSyncManager, env, telemetryProvider);
        }

        [Fact]
        public async Task GetOrSet_ReferenceType_Success()
        {
            var key = $"test-{Random.Shared.Next()}";
            Guid? value = Guid.NewGuid();
            var storedValue = await cache.GetOrSet(key, async () => await Task.FromResult(value), TimeSpan.FromSeconds(5));
            storedValue.ShouldNotBeNull().ShouldBe(value.Value);
        }

        [Fact]
        public async Task GetOrSet_ValueType_Success()
        {
            var key = $"test-{Random.Shared.Next()}";
            Guid value = Guid.NewGuid();
            var storedValue = await cache.GetOrSet(key, async () => await Task.FromResult(value), TimeSpan.FromSeconds(5));
            storedValue.ShouldBe(value);
        }

        [Fact]
        public async Task GetOrSet_PruneLocksWhenDone_Pruned()
        {
            var key = $"test-{Random.Shared.Next()}";
            Guid? value = Guid.NewGuid();
            await cache.GetOrSet(key, async () => await Task.FromResult(value), TimeSpan.FromSeconds(5));
            cacheSyncManager.ContainsKey(key).ShouldBeTrue();
            await cacheSyncManager.ExecuteAsync(CancellationToken.None);
            cacheSyncManager.ContainsKey(key).ShouldBeFalse();
        }

        [Fact]
        public async Task GetOrSet_PruneLocksWhileCacheMiss_NotPruned()
        {
            var key = $"test-{Random.Shared.Next()}";
            Guid? value = Guid.NewGuid();
            cacheSyncManager.ContainsKey(key).ShouldBeFalse();
            await cache.GetOrSet(key, () =>
                Task.Delay(1000)
                  .ContinueWith(t => cacheSyncManager.ContainsKey(key).ShouldBeTrue())
                  .ContinueWith(t => cacheSyncManager.ExecuteAsync(CancellationToken.None))
                  .ContinueWith(t => cacheSyncManager.ContainsKey(key).ShouldBeTrue())
                  .ContinueWith(t => value),
                TimeSpan.FromSeconds(15));
            cacheSyncManager.ContainsKey(key).ShouldBeTrue();
            await cacheSyncManager.ExecuteAsync(CancellationToken.None);
            cacheSyncManager.ContainsKey(key).ShouldBeFalse();
        }
    }
}
