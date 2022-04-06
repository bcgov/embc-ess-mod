using System;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Hosting;

namespace EMBC.ESS.Managers.Events
{
    public class SupportProcessingBackgroundTask : IBackgroundTask
    {
        private readonly EventsManager eventsManager;

        public string Schedule => "*/1 * * * *";

        public int DegreeOfParallelism => 1;

        public TimeSpan InitialDelay => TimeSpan.FromSeconds(30);

        public TimeSpan InactivityTimeout => TimeSpan.FromSeconds(60);

        public SupportProcessingBackgroundTask(EventsManager eventsManager)
        {
            this.eventsManager = eventsManager;
        }

        public async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            await eventsManager.Handle(new ProcessPendingSupportsCommand());
        }
    }
}
