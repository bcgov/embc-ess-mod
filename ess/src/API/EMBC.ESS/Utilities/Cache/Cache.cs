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
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;

namespace EMBC.ESS.Utilities.Cache
{
    public interface ICache
    {
        Task<T> GetOrSet<T>(string key, Func<Task<T>> getter, DateTimeOffset? expiration = null);

        Task<T> Get<T>(string key);

        Task Set<T>(string key, T item, DateTimeOffset? expiration = null);
    }

    public class Cache : ICache
    {
        private readonly IDistributedCache cache;

        public Cache(IDistributedCache cache)
        {
            this.cache = cache;
        }

        public async Task<T> GetOrSet<T>(string key, Func<Task<T>> getter, DateTimeOffset? expiration = null)
        {
            var cachedValue = await cache.GetAsync(key);
            if (cachedValue == null)
            {
                var value = await getter();

                await cache.SetAsync(key, Serialize(value), new DistributedCacheEntryOptions { AbsoluteExpiration = expiration });
                return value;
            }
            else
            {
                return Deserialize<T>(cachedValue);
            }
        }

        public async Task<T> Get<T>(string key) => Deserialize<T>(await cache.GetAsync(key));

        public async Task Set<T>(string key, T item, DateTimeOffset? expiration = null) =>
            await cache.SetAsync(key, Serialize(item), new DistributedCacheEntryOptions { AbsoluteExpiration = expiration });

        private static T Deserialize<T>(byte[] data) => data == null ? default(T) : JsonSerializer.Deserialize<T>(data);

        private static byte[] Serialize<T>(T obj) => obj == null ? null : JsonSerializer.SerializeToUtf8Bytes(obj);
    }
}
