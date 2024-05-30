using System;
using System.Collections.Generic;
using System.Reflection;
using MartinCostello.Logging.XUnit;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;
using Xunit.Categories;

namespace EMBC.Tests.Integration.ESS
{
    public class WebAppTestFixture : WebApplicationFactory<Program>, ITestOutputHelperAccessor
    {
        public ITestOutputHelper? OutputHelper { get; set; }

        protected override IHostBuilder? CreateHostBuilder()
        {
            var host = new Utilities.Hosting.Host("ess-tests");
            return host.CreateHost("EMBC").ConfigureHostConfiguration(opts =>
            {
                // add secrets from host assembly
#pragma warning disable S3885 // "Assembly.Load" should be used
                opts.AddUserSecrets(Assembly.LoadFile($"{Environment.CurrentDirectory}/EMBC.ESS.Host.dll"), true, false);
#pragma warning restore S3885 // "Assembly.Load" should be used
                opts.AddJsonFile("appsettings.json", false, false).AddJsonFile("appsettings.Development.json", true, false).AddJsonFile(Environment.GetEnvironmentVariable("secrets_file_path") ?? "secrets.json", true, false);
                // disable background tasks during tests
                opts.AddInMemoryCollection([new KeyValuePair<string, string?>("backgroundTask:enabled", "false")]);
            }).ConfigureServices(services =>
            {
                services.AddLogging(loggingBuilder => loggingBuilder.ClearProviders().AddXUnit(this));
                services.Remove(new ServiceDescriptor(typeof(EMBC.ESS.Utilities.Cas.IWebProxy), typeof(EMBC.ESS.Utilities.Cas.WebProxy), ServiceLifetime.Transient));
                services.AddSingleton<EMBC.ESS.Utilities.Cas.IWebProxy, MockCasProxy>();
                //override grpc client configuration to make it work in the test web server
                services.AddGrpcClient<Utilities.Messaging.Grpc.Dispatcher.DispatcherClient>().ConfigurePrimaryHttpMessageHandler(() => this.Server.CreateHandler());
            }).UseSerilog((ctx, cfg) =>
            {
                cfg
                    .MinimumLevel.Override("System", LogEventLevel.Warning)
                    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                    .MinimumLevel.Override("System.Net.Http.HttpClient", LogEventLevel.Warning)
                    .MinimumLevel.Debug();
            }, writeToProviders: true);
        }
    }

    [IntegrationTest]
    public abstract class WebAppTestBase : IClassFixture<WebAppTestFixture>, IAsyncLifetime
    {
        private readonly IServiceScope serviceScope;
        protected readonly ITestOutputHelper output;
        protected readonly WebAppTestFixture fixture;

        public IServiceProvider Services => serviceScope.ServiceProvider;

        protected WebAppTestBase(ITestOutputHelper output, WebAppTestFixture fixture)
        {
            fixture.OutputHelper = output;
            serviceScope = fixture.Server.Services.CreateScope();
            this.output = output;
            this.fixture = fixture;
        }

        public virtual async Task InitializeAsync()
        {
            await Task.CompletedTask;
        }

        public virtual async Task DisposeAsync()
        {
            await Task.CompletedTask;
            if (serviceScope != null) serviceScope.Dispose();
        }
    }
}
