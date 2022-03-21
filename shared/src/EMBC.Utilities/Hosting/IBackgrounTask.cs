using System;
using System.Threading;
using System.Threading.Tasks;

namespace EMBC.Utilities.Hosting
{
    public interface IBackgroundTask
    {
        public string Schedule { get; }
        public int DegreeOfParallelism { get; }
        public TimeSpan InitialDelay { get; }
        TimeSpan InactivityTimeout { get; }

        public Task ExecuteAsync(CancellationToken cancellationToken);
    }
}
