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
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.Caching;
using Polly.Caching.Distributed;

namespace EMBC.ESS.Utilities.Cache
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var keyPrefix = Environment.GetEnvironmentVariable("APP_NAME") ?? configurationServices.Environment.ApplicationName;
            configurationServices.Services.AddSingleton(sp => new CacheSyncManager(sp.GetRequiredService<ILogger<CacheSyncManager>>()));
            configurationServices.Services.AddTransient<ICache>(sp =>
            {
                var cache = sp.GetRequiredService<IDistributedCache>();
                var cacheSyncManager = sp.GetRequiredService<CacheSyncManager>();
                var policy = Policy.CacheAsync(cache.AsAsyncCacheProvider<byte[]>(), new ContextualTtl());
                return new Cache(cache, cacheSyncManager, policy, keyPrefix);
            });
        }
    }
}
