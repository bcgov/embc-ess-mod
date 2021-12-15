using System;
using EMBC.ESS;
using EMBC.ESS.Utilities.Dynamics;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class DynamicsWebAppFixture : WebApplicationFactory<Startup>
    {
        public DynamicsTestData TestData { get; }

        public DynamicsWebAppFixture()
        {
            this.TestData = new DynamicsTestData(Services.CreateScope().ServiceProvider.GetRequiredService<IEssContextFactory>().Create());
        }
    }

    [CollectionDefinition("DynamicsFixture")]
    public class WebAppTestCollection : ICollectionFixture<DynamicsWebAppFixture>
    {
    }

    [Collection("DynamicsFixture")]
    public class WebAppTestBase
    {
#if RELEASE
        protected const string RequiresDynamics = "Integration tests that requires Dynamics connection via VPN";
#else
        protected const string RequiresDynamics = null;
#endif

        private readonly LoggerFactory loggerFactory;
        private readonly DynamicsWebAppFixture fixture;

        public IServiceProvider services => new Lazy<IServiceProvider>(() => this.fixture.Services.CreateScope().ServiceProvider).Value;
        public ILogger testLogger => loggerFactory.CreateLogger("SUT");
        public DynamicsTestData TestData => fixture.TestData;

        public WebAppTestBase(ITestOutputHelper output, DynamicsWebAppFixture fixture)
        {
            loggerFactory = new LoggerFactory(new[] { new XUnitLoggerProvider(output) });
            this.fixture = fixture;
        }
    }
}
