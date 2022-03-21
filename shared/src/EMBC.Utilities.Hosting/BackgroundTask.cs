using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.Utilities.Caching;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NCrontab;

namespace EMBC.Utilities.Hosting
{
    internal class BackgroundTask<T> : BackgroundService
        where T : IBackgroundTask
    {
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger<T> logger;
        private readonly CrontabSchedule schedule;
        private readonly TimeSpan startupDelay;
        private readonly BackgroundTaskConcurrencyManager concurrencyManager;
        private string instanceName => Environment.MachineName;

        public BackgroundTask(IServiceProvider serviceProvider, ILogger<T> logger)
        {
            this.serviceProvider = serviceProvider;
            this.logger = logger;
            using (var scope = serviceProvider.CreateScope())
            {
                var initialTask = scope.ServiceProvider.GetRequiredService<T>();
                schedule = CrontabSchedule.Parse(initialTask.Schedule, new CrontabSchedule.ParseOptions { IncludingSeconds = false });
                startupDelay = initialTask.InitialDelay;

                concurrencyManager = new BackgroundTaskConcurrencyManager(
                    scope.ServiceProvider.GetRequiredService<ICache>(),
                    typeof(T).FullName ?? null!,
                    initialTask.DegreeOfParallelism,
                    initialTask.InactivityTimeout);
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await Task.Delay(startupDelay, stoppingToken);
            var now = DateTime.UtcNow;
            var nextExecutionDate = schedule.GetNextOccurrence(now);

            logger.LogDebug("first run is {0} in {1}s", nextExecutionDate, nextExecutionDate.Subtract(now).TotalSeconds);

            while (!stoppingToken.IsCancellationRequested)
            {
                now = DateTime.UtcNow;
                if (now >= nextExecutionDate)
                {
                    try
                    {
                        if (!await concurrencyManager.TryRegister(instanceName, stoppingToken))
                        {
                            logger.LogDebug("skipping {0}", nextExecutionDate);
                        }
                        else
                        {
                            logger.LogInformation("running {0}", nextExecutionDate);
                            using (var executionScope = serviceProvider.CreateScope())
                            {
                                var task = executionScope.ServiceProvider.GetRequiredService<T>();
                                await task.ExecuteAsync(stoppingToken);
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        logger.LogError(e, "error running {0}: {1}", nextExecutionDate, e.Message);
                    }
                    finally
                    {
                        nextExecutionDate = schedule.GetNextOccurrence(now);
                        logger.LogDebug("next run is {0} in {1}s", nextExecutionDate, nextExecutionDate.Subtract(DateTime.UtcNow).TotalSeconds);
                    }
                }
                await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
            }
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            logger.LogInformation("starting");
            await base.StartAsync(cancellationToken);
        }

        public override async Task StopAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("deregistrering instance");
            await concurrencyManager.Deregister(instanceName, stoppingToken);
            logger.LogInformation("stopping");
            await base.StopAsync(stoppingToken);
        }
    }

    internal class BackgroundTaskConcurrencyManager
    {
        private readonly string cacheKey;
        private readonly int concurrency;
        private readonly TimeSpan timeout;
        private readonly ICache cache;
        private readonly SemaphoreSlim locker;

        public BackgroundTaskConcurrencyManager(ICache cache, string taskName, int concurrency, TimeSpan timeout)
        {
            this.cacheKey = $"task-{taskName}";
            this.concurrency = concurrency;
            this.timeout = timeout;
            this.cache = cache;
            this.locker = new SemaphoreSlim(1, 1);
        }

        public async Task<bool> TryRegister(string serviceInstanceName, CancellationToken cancellationToken = default)
        {
            if (concurrency < 0) return true; // always register - no state

            await locker.WaitAsync(cancellationToken);
            try
            {
                // get state
                var now = DateTime.UtcNow;
                var state = await cache.GetOrSet(cacheKey,
                    async () => await Task.FromResult(new ConcurrencyState { { serviceInstanceName, now } }),
                    TimeSpan.FromMinutes(30), cancellationToken) ?? null!;

                // trim expired services
                state.Trim(timeout);

                // check if the instance is already registered
                if (state.ContainsKey(serviceInstanceName)) return true;

                // register if allowed
                if (state.Count < concurrency)
                {
                    state.Add(serviceInstanceName, now);
                    await cache.Set(cacheKey, state, TimeSpan.FromMinutes(30), cancellationToken);
                    return true;
                }

                // not allowed and not registered
                return false;
            }
            finally
            {
                locker.Release();
            }
        }

        public async Task Deregister(string serviceInstanceName, CancellationToken cancellationToken = default)
        {
            var state = await cache.Get<ConcurrencyState>(cacheKey);
            if (state != null && state.ContainsKey(serviceInstanceName))
            {
                state.Remove(serviceInstanceName);
                state.Trim(timeout);
                await cache.Set(cacheKey, state, TimeSpan.FromMinutes(30), cancellationToken);
            }
        }
    }

    public class ConcurrencyState : Dictionary<string, DateTime>
    {
        public void Trim(TimeSpan timeout)
        {
            var now = DateTime.UtcNow;
            foreach (var s in this.Where(s => now.Subtract(s.Value) > timeout).ToArray())
            {
                Remove(s.Key);
            }
        }
    }

    public static class BackgroundTaskEx
    {
        public static IServiceCollection AddBackgroundTask<T>(this IServiceCollection services)
            where T : class, IBackgroundTask
        {
            services.TryAddTransient<T>();
            services.AddHostedService<BackgroundTask<T>>();

            return services;
        }
    }
}
