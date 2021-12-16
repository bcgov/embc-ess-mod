using System;
using EMBC.ESS;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class WebAppTestFixture<TStartup> : WebApplicationFactory<TStartup>
        where TStartup : class
    {
    }

    public abstract class WebAppTestBase : IClassFixture<WebAppTestFixture<Startup>>
    {
#if RELEASE
        protected const string RequiresNetworkConnectivity = "Integration test that requires a VPN connection";
#else
        protected const string RequiresVpnConnectivity = null;
#endif

        public IServiceProvider Services { get; }

        public WebAppTestBase(ITestOutputHelper output, WebAppTestFixture<Startup> fixture)
        {
            var factory = fixture.WithWebHostBuilder(builder =>
           {
               builder.UseSerilog((ctx, cfg) =>
               {
                   cfg.WriteTo.TestOutput(output);
               });
           });
            this.Services = factory.Server.Services.CreateScope().ServiceProvider;
        }
    }
}
