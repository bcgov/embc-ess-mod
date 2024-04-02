using System;
using System.Net.Http;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics;
using FakeItEasy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Hosting.Internal;
using Polly.CircuitBreaker;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Unit.ESS.Utilities
{
    public class DynamicsTests
    {
        private readonly ServiceProvider services;
        private readonly DynamicsOptions options;

        public DynamicsTests(ITestOutputHelper output)
        {
            var diServices = TestHelper.CreateDIContainer().AddLogging(output).AddTestCache();

            options = new DynamicsOptions
            {
                DynamicsApiBaseUri = new Uri("https://no.where"),
                DynamicsApiEndpoint = new Uri("https://no.where"),
                CircuitBreakerNumberOfErrors = 5,
                CircuitBreakerResetInSeconds = 1
            };

            var config = new ConfigurationBuilder().AddConfigurationOptions("dynamics", options).Build();
            new Configuration().ConfigureServices(new EMBC.Utilities.Configuration.ConfigurationServices
            {
                Services = diServices,
                Environment = new HostingEnvironment { EnvironmentName = Environments.Development },
                Logger = TestHelper.CreateTelemetryProvider(output).Get("test"),
                Configuration = config
            });

            diServices.AddTransient(sp => A.Fake<ISecurityTokenProvider>());
            diServices.AddTransient<IEssContextStateReporter, EssContextStateReporter>();

            this.services = diServices.BuildServiceProvider(validateScopes: true);
        }

        [Fact]
        public async Task CircuitBreaker_HttpError_Break()
        {
            var ctx = services.GetRequiredService<IEssContextFactory>().Create();

            Func<Task> call = () => ctx.contacts.GetAllPagesAsync();

            for (int i = 0; i < options.CircuitBreakerNumberOfErrors; i++)
            {
                (await Should.ThrowAsync<AggregateException>(call)).InnerException?.InnerException?.InnerException.ShouldBeAssignableTo<HttpRequestException>();
            }
           (await Should.ThrowAsync<AggregateException>(call)).InnerException?.InnerException?.InnerException.ShouldBeAssignableTo<BrokenCircuitException>();
        }

        [Fact]
        public async Task IsBroken_HttpErrorInResetPeriod_ReportOutage()
        {
            var ctx = services.GetRequiredService<IEssContextFactory>().Create();
            var reporter = services.GetRequiredService<IEssContextStateReporter>();

            Func<Task> call = () => ctx.contacts.GetAllPagesAsync();

            for (int i = 0; i < options.CircuitBreakerNumberOfErrors; i++)
            {
                (await reporter.IsBroken()).ShouldBeFalse();
                await Should.ThrowAsync<AggregateException>(call);
            }
            (await reporter.IsBroken()).ShouldBeTrue();
        }

        [Fact]
        public async Task IsBroken_AferResetPeriod_ClearOutage()
        {
            var ctx = services.GetRequiredService<IEssContextFactory>().Create();
            var reporter = services.GetRequiredService<IEssContextStateReporter>();

            Func<Task> call = () => ctx.contacts.GetAllPagesAsync();

            for (int i = 0; i < options.CircuitBreakerNumberOfErrors; i++)
            {
                await Should.ThrowAsync<AggregateException>(call);
            }
            (await reporter.IsBroken()).ShouldBeTrue();
            await Task.Delay(TimeSpan.FromSeconds(options.CircuitBreakerResetInSeconds).Add(TimeSpan.FromMilliseconds(1000)));
            //TODO: add mocked odata server to enable connectivity recovery
            //(await reporter.IsBroken()).ShouldBeFalse();
        }
    }
}
