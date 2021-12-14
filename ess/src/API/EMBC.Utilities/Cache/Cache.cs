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
using Polly;
using Polly.Caching.Distributed;

namespace EMBC.ESS.Utilities.Cache
{
    public interface ICache
    {
        Task<T> GetOrSet<T>(string key, Func<Task<T>> getter, DateTimeOffset? expiration = null);
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
            var entryOptions = new DistributedCacheEntryOptions { AbsoluteExpiration = expiration };
            var policy = Policy.CacheAsync(cache.AsAsyncCacheProvider<byte[]>(), entryOptions.AsTtlStrategy());
            return Deserialize<T>(await policy.ExecuteAsync(async ctx => Serialize(await getter()), new Context(key)));
        }

        private static T Deserialize<T>(byte[] data) => data == null ? default(T) : JsonSerializer.Deserialize<T>(data);

        private static byte[] Serialize<T>(T obj) => obj == null ? Array.Empty<byte>() : JsonSerializer.SerializeToUtf8Bytes(obj);
    }
}
