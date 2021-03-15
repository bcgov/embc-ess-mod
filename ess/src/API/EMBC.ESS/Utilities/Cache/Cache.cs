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
using System.Collections.Concurrent;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;

namespace EMBC.ESS.Utilities.Cache
{
    public interface ICache
    {
        Task<T> GetOrAdd<T>(string key, Func<Task<T>> getter, DateTimeOffset? expiration = null);
    }

    public class Cache : ICache
    {
        private readonly IDistributedCache distributedCache;

        public Cache(IDistributedCache distributedCache)
        {
            this.distributedCache = distributedCache;
        }

        private static readonly ConcurrentDictionary<string, SemaphoreSlim> keyLocks = new ConcurrentDictionary<string, SemaphoreSlim>();

        public async Task<T> GetOrAdd<T>(string key, Func<Task<T>> getter, DateTimeOffset? expiration = null)
        {
            var value = await Get<T>(key);
            if (value != null) return value;

            var locker = keyLocks.GetOrAdd(key, new SemaphoreSlim(1, 1));
            await locker.WaitAsync();
            try
            {
                value = await Get<T>(key);
                if (value != null) return value;

                value = await getter();
                await Set(key, value, expiration);
                return value;
            }
            finally
            {
                locker.Release();
            }
        }

        private async Task<T> Get<T>(string key) =>
            Deserialize<T>(await distributedCache.GetAsync(key));

        private async Task Set<T>(string key, T item, DateTimeOffset? expiration = null) =>
            await distributedCache.SetAsync(key, Serialize(item), new DistributedCacheEntryOptions { AbsoluteExpiration = expiration });

        private static T Deserialize<T>(byte[] data) =>
            data == null ? default(T) : JsonSerializer.Deserialize<T>(data);

        private static byte[] Serialize<T>(T obj) =>
            obj == null ? null : JsonSerializer.SerializeToUtf8Bytes(obj);
    }
}
