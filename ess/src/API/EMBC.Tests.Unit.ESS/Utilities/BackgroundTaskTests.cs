using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using EMBC.Utilities.Caching;
using EMBC.Utilities.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Unit.ESS.Utilities
{
    public class BackgroundTaskTests
    {
        private readonly IServiceProvider services;

        public BackgroundTaskTests(ITestOutputHelper output)
        {
            var services = TestHelper.CreateDIContainer(output);
            services.AddTransient<TestTask>();
            services.AddTestCache();

            this.services = services.Build();
        }

        [Fact]
        public async Task Execute_DoPOne_OnlyOneExecutes()
        {
            var task = new BackgroundTask<TestTask>(services, services.GetRequiredService<ILogger<TestTask>>());

            await task.StartAsync(CancellationToken.None);
        }

        [Fact]
        public async Task TryRegister_DopOf1AndOtherInstanceBeforeTimeout_False()
        {
            var manager = new BackgroundTaskConcurrencyManager(services.GetRequiredService<ICache>(), "testtask", 1, TimeSpan.FromMilliseconds(500));
            (await manager.TryRegister("instance1")).ShouldBeTrue();
            await Task.Delay(50);
            (await manager.TryRegister("instance2")).ShouldBeFalse();
        }

        [Fact]
        public async Task TryRegister_DopOf1AndOtherInstanceAfterTimeout_True()
        {
            var manager = new BackgroundTaskConcurrencyManager(services.GetRequiredService<ICache>(), "testtask", 1, TimeSpan.FromMilliseconds(100));
            (await manager.TryRegister("instance1")).ShouldBeTrue();
            await Task.Delay(150);
            (await manager.TryRegister("instance2")).ShouldBeTrue();
        }

        [Fact]
        public async Task TryRegister_DopOf1AndSameInstance_True()
        {
            var manager = new BackgroundTaskConcurrencyManager(services.GetRequiredService<ICache>(), "testtask", 1, TimeSpan.FromMilliseconds(100));
            (await manager.TryRegister("instance1")).ShouldBeTrue();
            (await manager.TryRegister("instance1")).ShouldBeTrue();
        }

        [Fact]
        public async Task TryRegister_DopOf2AndOtherInstanceBeforeTimeout_False()
        {
            var manager = new BackgroundTaskConcurrencyManager(services.GetRequiredService<ICache>(), "testtask", 2, TimeSpan.FromMilliseconds(100));
            (await manager.TryRegister("instance1")).ShouldBeTrue();
            (await manager.TryRegister("instance2")).ShouldBeTrue();
            (await manager.TryRegister("instance3")).ShouldBeFalse();
        }

        [Fact]
        public async Task TryRegister_DopOf2AndOtherInstanceAfterTimeout_True()
        {
            var manager = new BackgroundTaskConcurrencyManager(services.GetRequiredService<ICache>(), "testtask", 2, TimeSpan.FromMilliseconds(100));
            (await manager.TryRegister("instance1")).ShouldBeTrue();
            await Task.Delay(150);
            (await manager.TryRegister("instance2")).ShouldBeTrue();
            (await manager.TryRegister("instance3")).ShouldBeTrue();
            (await manager.TryRegister("instance1")).ShouldBeFalse();
        }

        [Fact]
        public async Task TryRegister_DopOf2AndSameInstance_True()
        {
            var manager = new BackgroundTaskConcurrencyManager(services.GetRequiredService<ICache>(), "testtask", 2, TimeSpan.FromMilliseconds(100));
            (await manager.TryRegister("instance1")).ShouldBeTrue();
            await Task.Delay(50);
            (await manager.TryRegister("instance1")).ShouldBeTrue();
        }

        [Fact]
        public async Task TryRegister_DopOfInfinite_AlwaysTrue()
        {
            var manager = new BackgroundTaskConcurrencyManager(services.GetRequiredService<ICache>(), "testtask", -1, TimeSpan.FromMilliseconds(100));
            (await manager.TryRegister("instance1")).ShouldBeTrue();
            await Task.Delay(50);
            (await manager.TryRegister("instance1")).ShouldBeTrue();
            await Task.Delay(150);
            (await manager.TryRegister("instance1")).ShouldBeTrue();
        }

        [Fact]
        public async Task TryRegister_DopOf1Instance1DeregisterAndRegisterInstance2_True()
        {
            var manager = new BackgroundTaskConcurrencyManager(services.GetRequiredService<ICache>(), "testtask", 1, TimeSpan.FromMilliseconds(500));
            (await manager.TryRegister("instance1")).ShouldBeTrue();
            await Task.Delay(50);
            await manager.Deregister("instance1");
            await Task.Delay(50);
            (await manager.TryRegister("instance2")).ShouldBeTrue();
        }

        [Fact]
        public async Task TryRegister_DopOf2Instance1DeregisterAndRegisterMoreInstances_True()
        {
            var manager = new BackgroundTaskConcurrencyManager(services.GetRequiredService<ICache>(), "testtask", 2, TimeSpan.FromMilliseconds(500));
            (await manager.TryRegister("instance1")).ShouldBeTrue();
            (await manager.TryRegister("instance2")).ShouldBeTrue();
            (await manager.TryRegister("instance3")).ShouldBeFalse();
            await manager.Deregister("instance1");
            (await manager.TryRegister("instance3")).ShouldBeTrue();
        }

        [Fact]
        public async Task Deregister_AfterCacheTimeout_NoError()
        {
            var manager = new BackgroundTaskConcurrencyManager(services.GetRequiredService<ICache>(), "testtask", 2, TimeSpan.FromMilliseconds(50));
            (await manager.TryRegister("instance1")).ShouldBeTrue();
            await Task.Delay(100);
            await manager.Deregister("instance1");
        }
    }

    public class TestTask : IBackgroundTask
    {
        public static ConcurrentDictionary<int, DateTime> executionLog = new ConcurrentDictionary<int, DateTime>();
        private readonly ILogger logger;

        public TestTask(ILogger<TestTask> logger)
        {
            this.logger = logger;
        }

        public string Schedule => "*/1 * * * *";

        public int DegreeOfParallelism => 1;

        public TimeSpan InitialDelay => TimeSpan.Zero;

        public TimeSpan InactivityTimeout => TimeSpan.FromMilliseconds(100);

        public async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            await Task.CompletedTask;
            logger.LogDebug("Executing {0}", DateTime.Now);
        }
    }
}
