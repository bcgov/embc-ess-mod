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

namespace EMBC.Responders.API.Utilities
{
    public static class DistributedCacheEx
    {
        //TODO: semaphore per key would yield a better performance
        private static readonly SemaphoreSlim monitor = new SemaphoreSlim(1, 1);

        public static async Task<T> GetOrAdd<T>(this IDistributedCache cache, string key, Func<Task<T>> factory, DateTimeOffset? expiration)
        {
            var cachedVal = Deserialize<T>(await cache.GetStringAsync(key));
            if (cachedVal == null)
            {
                await monitor.WaitAsync();
                try
                {
                    cachedVal = Deserialize<T>(await cache.GetStringAsync(key));
                    if (cachedVal == null)
                    {
                        cachedVal = await factory();
                        await cache.SetStringAsync(key, Serialize(cachedVal), new DistributedCacheEntryOptions { AbsoluteExpiration = expiration });
                    }
                }
                finally
                {
                    monitor.Release();
                }
            }
            return cachedVal;
        }

        public static async Task SetAsync<T>(this IDistributedCache cache, string key, T val, DateTimeOffset? expiration = null) =>
            await cache.SetStringAsync(key, Serialize(val), new DistributedCacheEntryOptions { AbsoluteExpiration = expiration });

        public static async Task<T> GetAsync<T>(this IDistributedCache cache, string key) =>
            Deserialize<T>(await cache.GetStringAsync(key));

        private static string Serialize<T>(T obj) => JsonSerializer.Serialize(obj);

        private static T Deserialize<T>(string serializedObj) => serializedObj == null ? default : JsonSerializer.Deserialize<T>(serializedObj);
    }
}
