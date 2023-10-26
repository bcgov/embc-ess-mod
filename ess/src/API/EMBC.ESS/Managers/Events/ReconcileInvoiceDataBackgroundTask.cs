using System;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Hosting;

namespace EMBC.ESS.Managers.Events
{
    public class ReconcileInvoiceDataBackgroundTask : IBackgroundTask
    {
        private readonly EventsManager eventsManager;

        public string Schedule => "0 */10 13-3 * * SAT-SUN"; //Every 10 minutes, between 06:00 AM and 08:59 PM, Saturday and Sunday

        public int DegreeOfParallelism => 1;

        public TimeSpan InitialDelay => TimeSpan.FromSeconds(30);

        public TimeSpan InactivityTimeout => TimeSpan.FromMinutes(5);

        public ReconcileInvoiceDataBackgroundTask(EventsManager eventsManager)
        {
            this.eventsManager = eventsManager;
        }

        public async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            await eventsManager.Handle(new FullReconcilePaymentsCommand());
        }
    }
}
