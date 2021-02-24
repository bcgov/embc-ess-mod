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

namespace EMBC.ESS.Utilities.Cache
{
    public interface ICache
    {
        Task Set<T>(string key, T item);

        Task<T> Get<T>(string key);
    }

    public class Cache : ICache
    {
        private readonly IDistributedCache distributedCache;

        public Cache(IDistributedCache distributedCache)
        {
            this.distributedCache = distributedCache;
        }

        public async Task<T> Get<T>(string key)
        {
            return Deserialize<T>(await distributedCache.GetAsync(key));
        }

        public async Task Set<T>(string key, T item)
        {
            await distributedCache.SetAsync(key, Serialize(item));
        }

        private static T Deserialize<T>(byte[] data) => data == null ? default(T) : JsonSerializer.Deserialize<T>(data);

        private static byte[] Serialize<T>(T obj) => obj == null ? null : JsonSerializer.SerializeToUtf8Bytes(obj);
    }

    public static class CacheEx
    {
        private static SemaphoreSlim locker = new SemaphoreSlim(1, 1);

        public static async Task<T> GetOrAdd<T>(this ICache cache, string key, Func<Task<T>> getter)
        {
            await locker.WaitAsync();
            try
            {
                var value = await cache.Get<T>(key);
                if (value == null)
                {
                    value = await getter();
                    await cache.Set(key, value);
                }

                return value;
            }
            finally
            {
                locker.Release();
            }
        }
    }
}
