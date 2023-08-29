using System;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Hosting;

namespace EMBC.ESS.Managers.Events
{
    public class PaymentReconciliationBackgroundTask : IBackgroundTask
    {
        private readonly EventsManager eventsManager;

        public string Schedule => "0 */15 9-19 * * ?"; //Every 15 minutes, between 09:00 AM and 07:59 PM

        public int DegreeOfParallelism => 1;

        public TimeSpan InitialDelay => TimeSpan.FromSeconds(30);

        public TimeSpan InactivityTimeout => TimeSpan.FromMinutes(5);

        public PaymentReconciliationBackgroundTask(EventsManager eventsManager)
        {
            this.eventsManager = eventsManager;
        }

        public async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            await eventsManager.Handle(new ReconcilePaymentsCommand());
        }
    }
}
