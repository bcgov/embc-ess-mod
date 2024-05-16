using System;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Hosting;

namespace EMBC.ESS.Managers.Events;

public class ReconcileSupplierIdsBackgroundTask(EventsManager eventsManager) : IBackgroundTask
{
    public string Schedule => "";

    public int DegreeOfParallelism => 1;

    public TimeSpan InitialDelay => TimeSpan.FromSeconds(30);

    public TimeSpan InactivityTimeout => TimeSpan.FromMinutes(5);

    public async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        await eventsManager.Handle(new ReconcileSupplierInfoCommand());
    }
}
