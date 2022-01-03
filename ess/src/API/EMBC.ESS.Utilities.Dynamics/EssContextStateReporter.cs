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
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Cache;

namespace EMBC.ESS.Utilities.Dynamics
{
    public interface IEssContextStateReporter
    {
        Task ReportBroken(string reason);

        Task ReportFixed();

        Task<bool> IsBroken();
    }

    public class UnplannedOutage
    {
        public string Reason { get; set; } = string.Empty;
        public DateTimeOffset StartDate { get; set; } = DateTimeOffset.Now;
    }

    public class EssContextStateReporter : IEssContextStateReporter
    {
        private readonly ICache cache;
        private const string cacheKey = "unplannedoutage";

        public EssContextStateReporter(ICache cache)
        {
            this.cache = cache;
        }

        public async Task<bool> IsBroken()
        {
            return await cache.Get<UnplannedOutage>(cacheKey) != null;
        }

        public async Task ReportBroken(string reason)
        {
            await cache.Set(cacheKey, () => Task.FromResult(new UnplannedOutage { Reason = reason, StartDate = DateTimeOffset.Now }), TimeSpan.FromSeconds(30));
        }

        public async Task ReportFixed()
        {
            await cache.Set(cacheKey, () => Task.FromResult((UnplannedOutage?)null), TimeSpan.FromSeconds(5));
        }
    }
}
