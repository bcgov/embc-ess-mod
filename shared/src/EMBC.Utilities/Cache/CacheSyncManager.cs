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
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.Logging;

namespace EMBC.ESS.Utilities.Cache
{
    public class CacheSyncManager : ConcurrentDictionary<string, SemaphoreSlim>, IBackgroundTask
    {
        private readonly ILogger logger;

        public CacheSyncManager(ILogger logger)
        {
            this.logger = logger;
        }

        public string Schedule => "* 5 * * * *";

        public int DegreeOfParallelism => 1;

        public TimeSpan InitialDelay => TimeSpan.FromSeconds(10);

        public async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            logger.LogInformation("start cache lockers prunning");
            var prunned = 0;
            this.AsParallel().ForAll(item =>
            {
                if (item.Value.CurrentCount == 0)
                {
                    TryRemove(item.Key, out var locker);
                    locker.Dispose();
                    prunned++;
                }
            });

            logger.LogInformation($"end cache lockers prunning: {0} prunned", prunned);
            await Task.CompletedTask;
        }
    }
}
