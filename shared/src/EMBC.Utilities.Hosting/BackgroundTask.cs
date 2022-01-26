// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System;
using System.Threading;
using System.Threading.Tasks;
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NCrontab;

namespace EMBC.Utilities.Hosting
{
    public class BackgroundTask<T> : BackgroundService
        where T : IBackgroundTask
    {
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger<BackgroundTask<T>> logger;

        public BackgroundTask(IServiceProvider serviceProvider, ILogger<BackgroundTask<T>> logger)
        {
            this.serviceProvider = serviceProvider;
            this.logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var scope = serviceProvider.CreateScope();
            var initialTask = scope.ServiceProvider.GetRequiredService<T>();
            var schedule = CrontabSchedule.Parse(initialTask.Schedule, new CrontabSchedule.ParseOptions { IncludingSeconds = true });

            await Task.Delay(initialTask.InitialDelay);

            var now = DateTime.UtcNow;
            var nextExecutionDate = schedule.GetNextOccurrence(now);

            logger.LogDebug("first run is in {0}s", nextExecutionDate.Subtract(now).TotalSeconds);

            while (!stoppingToken.IsCancellationRequested)
            {
                logger.LogDebug("check after {0}s", DateTime.UtcNow.Subtract(now).TotalSeconds);
                now = DateTime.UtcNow;
                if (now >= nextExecutionDate)
                {
                    logger.LogInformation("running {0}", nextExecutionDate);

                    await initialTask.ExecuteAsync(stoppingToken);
                    nextExecutionDate = schedule.GetNextOccurrence(nextExecutionDate);
                    logger.LogDebug("next run in {0}s", nextExecutionDate.Subtract(now).TotalSeconds);
                }
                await Task.Delay(TimeSpan.FromSeconds(5));
            }
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            logger.LogInformation("starting");
            await base.StartAsync(cancellationToken);
        }

        public override async Task StopAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("stopping");
            await base.StopAsync(stoppingToken);
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
