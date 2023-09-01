using System;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Hosting;

namespace EMBC.ESS.Managers.Events
{
    public class PaymentReconciliationSatBackgroundTask : IBackgroundTask
    {
        private readonly EventsManager eventsManager;

        public string Schedule => "0 */15 13-3 * * SAT"; //Every 15 minutes, between 06:00 AM and 06:59 PM, only on Saturday

        public int DegreeOfParallelism => 1;

        public TimeSpan InitialDelay => TimeSpan.FromSeconds(30);

        public TimeSpan InactivityTimeout => TimeSpan.FromMinutes(5);

        public PaymentReconciliationSatBackgroundTask(EventsManager eventsManager)
        {
            this.eventsManager = eventsManager;
        }

        public async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            await eventsManager.Handle(new ReconcilePaymentsCommand());
        }
    }
}
