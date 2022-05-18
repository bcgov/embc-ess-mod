using System;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Cronos;
using Medallion.Threading;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EMBC.Utilities.Hosting
{
    internal class BackgroundTask<T> : BackgroundService
        where T : IBackgroundTask
    {
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger<T> logger;
        private readonly IDistributedSemaphoreProvider distributedSemaphoreProvider;
        private readonly CronExpression schedule;
        private readonly TimeSpan startupDelay;
        private readonly bool enabled;
        private readonly IDistributedSemaphore semaphore;
        private long runNumber = 0;

        public BackgroundTask(IServiceProvider serviceProvider, ILogger<T> logger, IDistributedSemaphoreProvider distributedSemaphoreProvider)
        {
            this.serviceProvider = serviceProvider;
            this.logger = logger;
            this.distributedSemaphoreProvider = distributedSemaphoreProvider;
            using (var scope = serviceProvider.CreateScope())
            {
                var configuration = serviceProvider.GetRequiredService<IConfiguration>().GetSection($"backgroundtask:{typeof(T).Name}");
                var task = scope.ServiceProvider.GetRequiredService<T>();
                var appName = Environment.GetEnvironmentVariable("APP_NAME") ?? Assembly.GetEntryAssembly()?.GetName().Name ?? string.Empty;

                schedule = CronExpression.Parse(configuration.GetValue("schedule", task.Schedule), CronFormat.IncludeSeconds);
                startupDelay = configuration.GetValue("initialDelay", task.InitialDelay);
                enabled = configuration.GetValue("enabled", true);
                var degreeOfParallelism = configuration.GetValue("degreeOfParallelism", task.DegreeOfParallelism);

                if (!string.IsNullOrEmpty(appName)) appName += "-";
                semaphore = distributedSemaphoreProvider.CreateSemaphore($"{appName}backgroundtask:{typeof(T).Name}", degreeOfParallelism);

                logger.LogInformation("starting background task: initial delay {0}, schedule: {1}, parallelism: {2}",
                    this.startupDelay, this.schedule.ToString(), task.DegreeOfParallelism);
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            if (!enabled)
            {
                logger.LogWarning($"background task is disabled, check configuration flag 'backgroundTask:{typeof(T).Name}'");
                return;
            }

            await Task.Delay(startupDelay, stoppingToken);

            var nextExecutionDelay = CalculateNextExecutionDelay(DateTime.UtcNow);

            while (!stoppingToken.IsCancellationRequested)
            {
                runNumber++;
                logger.LogDebug("next run in {0}s", nextExecutionDelay.TotalSeconds);

                // get a lock
                var handle = await semaphore.TryAcquireAsync(TimeSpan.FromSeconds(5), stoppingToken);

                // wait in the lock
                try
                {
                    await Task.Delay(nextExecutionDelay, stoppingToken);
                    if (handle == null)
                    {
                        // no lock
                        logger.LogDebug("skipping run {0}", runNumber);
                        continue;
                    }
                    try
                    {
                        // do work
                        logger.LogDebug("executing run # {0}", runNumber);
                        using (var executionScope = serviceProvider.CreateScope())
                        {
                            var task = executionScope.ServiceProvider.GetRequiredService<T>();
                            await task.ExecuteAsync(stoppingToken);
                        }
                    }
                    catch (Exception e)
                    {
                        logger.LogError(e, "error in run # {0}: {1}", runNumber, e.Message);
                    }
                }
                catch (TaskCanceledException)
                {
                    //do nothing if wait was interrupted
                }
                finally
                {
                    nextExecutionDelay = CalculateNextExecutionDelay(DateTime.UtcNow);
                    // release the lock
                    if (handle != null) await handle.DisposeAsync();
                }
            }
        }

        private TimeSpan CalculateNextExecutionDelay(DateTime utcNow)
        {
            var nextDate = schedule.GetNextOccurrence(utcNow);
            if (nextDate == null) throw new InvalidOperationException("Cannot calculate the next execution date, stopping the background task");

            return nextDate.Value.Subtract(utcNow);
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            logger.LogInformation("starting");
            await base.StartAsync(cancellationToken);
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            logger.LogInformation("stopping");
            await base.StopAsync(cancellationToken);
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
