using System;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Hosting;

namespace EMBC.ESS.Managers.Events;

public class PendingSupportsProcessingBackgroundTask(EventsManager eventsManager) : IBackgroundTask
{
    private readonly EventsManager eventsManager = eventsManager;

    public string Schedule => "";

    public int DegreeOfParallelism => 1;

    public TimeSpan InitialDelay => TimeSpan.FromSeconds(30);

    public TimeSpan InactivityTimeout => TimeSpan.FromSeconds(60);

    public async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        await eventsManager.Handle(new ProcessPendingSupportsCommand());
    }
}
