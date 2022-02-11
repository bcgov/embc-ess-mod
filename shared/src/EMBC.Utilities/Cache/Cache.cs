// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EMBC.ESS.Utilities.Cache
{
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
        private readonly CacheSyncManager cacheSyncManager;
        private readonly ILogger<Cache> logger;
        private readonly string keyPrefix;

        private string keyGen(string key) => $"{keyPrefix}:{key}";

        public Cache(IDistributedCache cache, CacheSyncManager cacheSyncManager, IHostEnvironment env, ILogger<Cache> logger)
        {
            this.cache = cache;
            this.cacheSyncManager = cacheSyncManager;
            this.logger = logger;
            this.keyPrefix = Environment.GetEnvironmentVariable("APP_NAME") ?? env.ApplicationName;
        }

        public async Task<T?> GetOrSet<T>(string key, Func<Task<T>> getter, TimeSpan expiration, CancellationToken cancellationToken = default)
        {
            var locker = cacheSyncManager.GetOrAdd(key, new SemaphoreSlim(1, 1));
            while (!await locker.WaitAsync(TimeSpan.FromSeconds(5), cancellationToken))
            {
                logger.LogDebug("{0} retrying to obtain lock", key);
                continue;
            }
            try
            {
                var value = await Get<T>(key);
                if (value == null)
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
            while (!await locker.WaitAsync(TimeSpan.FromSeconds(5), cancellationToken)) continue;
            try
            {
                await Set(key, await getter(), expiration, cancellationToken);
            }
            finally
            {
                locker.Release();
            }
        }

        private static T? Deserialize<T>(byte[] data) => data == null || data.Length == 0 ? default : JsonSerializer.Deserialize<T>(data);

        private static byte[] Serialize<T>(T obj) => obj == null ? Array.Empty<byte>() : JsonSerializer.SerializeToUtf8Bytes(obj);
    }
}
