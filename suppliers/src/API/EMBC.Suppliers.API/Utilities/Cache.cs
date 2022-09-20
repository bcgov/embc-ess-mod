using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
    public interface ICache
    {
        Task<T?> GetOrSet<T>(string key, Func<Task<T>> getter, TimeSpan expiration, CancellationToken cancellationToken = default);
        Task<T?> Get<T>(string key, CancellationToken cancellationToken = default);
        Task Set<T>(string key, T value, TimeSpan expiration, CancellationToken cancellationToken = default);
        Task Remove(string key, CancellationToken cancellationToken = default);
        Task Refresh<T>(string key, Func<Task<T>> getter, TimeSpan expiration, CancellationToken cancellationToken = default);
    }

    internal class Cache : ICache
    {
        private readonly IDistributedCache cache;
        private readonly string keyPrefix;
        private readonly ILogger<Cache> logger;

        private string keyGen(string key) => $"{keyPrefix}:{key}";

        public Cache(IDistributedCache cache, IHostEnvironment env, ILogger<Cache> logger)
        {
            this.cache = cache;
            this.logger = logger;
            this.keyPrefix = Environment.GetEnvironmentVariable("APP_NAME") ?? env?.ApplicationName ?? string.Empty;
        }

        public async Task<T?> GetOrSet<T>(string key, Func<Task<T>> getter, TimeSpan expiration, CancellationToken cancellationToken = default)
        {
            var value = await Get<T?>(key);
            if (value == null || value.Equals(default(T)))
            {
                // cache miss
                logger.LogDebug("{0} cache miss", key);
                value = await getter();
                await Set(key, value, expiration, cancellationToken);
            }
            return value;
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
            await Set(key, await getter(), expiration, cancellationToken);
        }

        private static T? Deserialize<T>(byte[] data) => data == null || data.Length == 0 ? default(T?) : JsonSerializer.Deserialize<T?>(data);

        private static byte[] Serialize<T>(T obj) => obj == null ? Array.Empty<byte>() : JsonSerializer.SerializeToUtf8Bytes(obj);
    }
}
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
