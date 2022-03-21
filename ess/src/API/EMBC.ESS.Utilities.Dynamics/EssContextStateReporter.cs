using System;
using System.Threading.Tasks;
using EMBC.Utilities.Caching;

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
            await cache.Set(cacheKey, new UnplannedOutage { Reason = reason, StartDate = DateTimeOffset.Now }, TimeSpan.FromSeconds(30));
        }

        public async Task ReportFixed()
        {
            await cache.Remove(cacheKey);
        }
    }
}
