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
using Polly.Caching;

namespace EMBC.ESS.Utilities.Cache
{
    public interface ICache
    {
        Task<T?> GetOrSet<T>(string key, Func<Task<T>> getter, TimeSpan? expiration = null);

        Task<T?> Get<T>(string key);

        Task Set<T>(string key, Func<Task<T>> getter, TimeSpan? expiration = null);
    }

    internal class Cache : ICache
    {
        private readonly IDistributedCache cache;
        private readonly string keyPrefix;
        private readonly IAsyncPolicy<byte[]> policy;

        private string keyGen(string key) => $"{keyPrefix}:{key}";

        public Cache(IDistributedCache cache, IAsyncPolicy<byte[]> policy, string keyPrefix)
        {
            this.cache = cache;
            this.keyPrefix = keyPrefix;
            this.policy = policy;
        }

        public async Task<T?> GetOrSet<T>(string key, Func<Task<T>> getter, TimeSpan? expiration = null)
        {
            return Deserialize<T?>(await policy.ExecuteAsync(async ctx => Serialize(await getter()), CreateContext(key, expiration)));
        }

        public async Task Set<T>(string key, Func<Task<T>> getter, TimeSpan? expiration = null)
        {
            await cache.SetAsync(keyGen(key), Serialize(await getter()), new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = expiration });
        }

        public async Task<T?> Get<T>(string key)
        {
            return Deserialize<T?>(await cache.GetAsync(keyGen(key)));
        }

        private Context CreateContext(string key, TimeSpan? expiration)
        {
            var context = new Context(keyGen(key));
            if (expiration.HasValue) context[ContextualTtl.TimeSpanKey] = expiration;
            return context;
        }

        private static T? Deserialize<T>(byte[] data) => data == null ? default : JsonSerializer.Deserialize<T>(data);

        private static byte[] Serialize<T>(T obj) => obj == null ? Array.Empty<byte>() : JsonSerializer.SerializeToUtf8Bytes(obj);
    }
}
