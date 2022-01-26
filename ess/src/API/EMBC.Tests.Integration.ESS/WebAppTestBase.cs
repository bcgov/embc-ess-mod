using System;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class WebAppTestFixture : WebApplicationFactory<WebAppTestFixture>
    {
        protected override IHostBuilder? CreateHostBuilder()
        {
            var host = new Utilities.Hosting.Host("ess-tests");
            return host.CreateHost("EMBC").ConfigureHostConfiguration(opts =>
            {
                // add secerts from host assembly
                opts.AddUserSecrets(Assembly.LoadFile($"{Environment.CurrentDirectory}/EMBC.ESS.Host.dll"), false, true);
                opts.AddJsonFile("appsettings.json", false).AddJsonFile("appsettings.Development.json", true);
            });
        }
    }

    public abstract class WebAppTestBase : IClassFixture<WebAppTestFixture>
    {
#if RELEASE
        protected const string RequiresVpnConnectivity = "Integration test that requires a VPN connection";
#else
        protected const string RequiresVpnConnectivity = null;
#endif
        protected readonly ITestOutputHelper output;

        public IServiceProvider Services { get; }

        public WebAppTestBase(ITestOutputHelper output, WebAppTestFixture fixture)
        {
            var factory = fixture.WithWebHostBuilder(builder =>
           {
               builder.UseSerilog((ctx, cfg) =>
               {
                   cfg
                    .MinimumLevel.Override("System.Net.Http.HttpClient", LogEventLevel.Warning)
                    .MinimumLevel.Override("Microsoft.OData.Extensions.Client.DefaultODataClientActivator", LogEventLevel.Warning)
                    .WriteTo.TestOutput(output, outputTemplate: "[{Timestamp:HH:mm:ss.sss} {Level:u3} {SourceContext}] {Message:lj}{NewLine}{Exception}");
               });
           });
            this.Services = factory.Server.Services.CreateScope().ServiceProvider;
            this.output = output;
        }
    }
}
