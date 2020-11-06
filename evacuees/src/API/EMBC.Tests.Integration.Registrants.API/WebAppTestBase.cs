using System;
using EMBC.Registrants.API;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.Registrants.API
{
    public class WebAppTestBase : IClassFixture<WebApplicationFactory<Startup>>
    {
        //set to null to run tests in this class, requires to be on VPN and Dynamics params configured in secrets.xml
#if RELEASE
        protected const string RequiresDynamics = "Integration tests that requires Dynamics connection via VPN";
#else
        protected const string RequiresDynamics = null;
        private readonly LoggerFactory loggerFactory;
#endif

        protected readonly WebApplicationFactory<Startup> webApplicationFactory;

        protected IConfiguration configuration => webApplicationFactory.Services.GetRequiredService<IConfiguration>();
        protected IServiceProvider services => webApplicationFactory.Services;
        protected ILogger testLogger => loggerFactory.CreateLogger("SUT");

        public WebAppTestBase(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory)
        {
            loggerFactory = new LoggerFactory(new[] { new XUnitLoggerProvider(output) });

            this.webApplicationFactory = webApplicationFactory.WithWebHostBuilder(builder =>
            {
                builder
                    .ConfigureServices(services => { services.RemoveAll<ILoggerProvider>(); })
                    .ConfigureLogging(lb => { lb.ClearProviders().AddProvider(new XUnitLoggerProvider(output)); });
            });
        }
    }
}
