using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using EMBC.Utilities.Telemetry;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EMBC.Utilities.Caching
{
    internal class Cache : ICache
    {
        private readonly IDistributedCache cache;
        private readonly CacheSyncManager cacheSyncManager;
        private readonly ITelemetryReporter logger;
        private readonly string keyPrefix;

        private string keyGen(string key) => $"{keyPrefix}:{key}";

        public Cache(IDistributedCache cache, CacheSyncManager cacheSyncManager, IHostEnvironment env, ITelemetryProvider telemetryProvider)
        {
            this.cache = cache;
            this.cacheSyncManager = cacheSyncManager;
            this.logger = telemetryProvider.Get<Cache>();
            this.keyPrefix = Environment.GetEnvironmentVariable("APP_NAME") ?? env?.ApplicationName ?? string.Empty;
        }

        public async Task<T?> GetOrSet<T>(string key, Func<Task<T>> getter, TimeSpan expiration, CancellationToken cancellationToken = default)
        {
            var locker = cacheSyncManager.GetOrAdd(key, new SemaphoreSlim(1, 1));
            while (!await locker.WaitAsync(TimeSpan.FromSeconds(5), cancellationToken))
            {
                logger.LogDebug("{0} retrying to obtain lock", key);
            }
            try
            {
                var value = await Get<T?>(key);
                if (value == null || value.Equals(default(T)))
                {
                    //cache miss
                    logger.LogDebug("{0} cache miss", key);
                    value = await getter();
                    await Set(key, value, expiration, cancellationToken);
                }
                return value;
            }
            finally
            {
                locker.Release();
            }
        }

        public async Task Set<T>(string key, T value, TimeSpan expiration, CancellationToken cancellationToken = default)
        {
            await cache.SetAsync(keyGen(key), Serialize(value), new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = expiration }, cancellationToken);
        }

        public async Task<T?> Get<T>(string key, CancellationToken cancellationToken = default)
        {
            return Deserialize<T?>(await cache.GetAsync(keyGen(key), cancellationToken));
        }

        public async Task Remove(string key, CancellationToken cancellationToken = default)
        {
            await cache.RemoveAsync(key, cancellationToken);
        }

        public async Task Refresh<T>(string key, Func<Task<T>> getter, TimeSpan expiration, CancellationToken cancellationToken = default)
        {
            var locker = cacheSyncManager.GetOrAdd(key, new SemaphoreSlim(1, 1));
            while (!await locker.WaitAsync(TimeSpan.FromSeconds(5), cancellationToken))
            {
                logger.LogDebug("{0} retrying to obtain lock", key);
            }
            try
            {
                await Set(key, await getter(), expiration, cancellationToken);
            }
            finally
            {
                locker.Release();
            }
        }

        private static T? Deserialize<T>(byte[] data) => data == null || data.Length == 0 ? default(T?) : JsonSerializer.Deserialize<T?>(data);

        private static byte[] Serialize<T>(T obj) => obj == null ? Array.Empty<byte>() : JsonSerializer.SerializeToUtf8Bytes(obj);
    }
}
