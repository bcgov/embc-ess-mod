using System;
using System.IO;
using System.Linq;
using System.Reflection;
using EMBC.Utilities.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Extensions.Logging;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class WebAppTestFixture : WebApplicationFactory<WebAppTestFixture>
    {
        protected override IHostBuilder? CreateHostBuilder()
        {
            var assemblies = Directory.GetFiles(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? string.Empty, "EMBC.*.dll", SearchOption.TopDirectoryOnly)
                .Select(assembly => Assembly.LoadFrom(assembly))
                .ToArray();

            return Host.CreateDefaultBuilder()
             .ConfigureWebHostDefaults(webBuilder =>
             {
                 webBuilder.ConfigureServices((ctx, services) =>
                 {
                     services.AddHttpContextAccessor();
                     services.AddDataProtection();
                     services.AddDistributedMemoryCache();
                     services.AddAutoMapper((sp, cfg) => { cfg.ConstructServicesUsing(t => sp.GetRequiredService(t)); }, assemblies);
                     Configurer.ConfigureComponentServices(services, ctx.Configuration, ctx.HostingEnvironment, new SerilogLoggerFactory(Log.Logger).CreateLogger(nameof(WebAppTestFixture)), assemblies);
                 })
                 .Configure((WebHostBuilderContext ctx, IApplicationBuilder app) =>
                 {
                     Configurer.ConfigureComponentPipeline(app, ctx.Configuration, ctx.HostingEnvironment, new SerilogLoggerFactory(Log.Logger).CreateLogger(nameof(WebAppTestFixture)), assemblies);
                 });
             }).UseEnvironment(Environments.Development);
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
               builder.UseSerilog((ctx, cfg) => { cfg.WriteTo.TestOutput(output, outputTemplate: "[{Timestamp:HH:mm:ss.sss} {Level:u3} {SourceContext}] {Message:lj}{NewLine}{Exception}"); });
           });
            this.Services = factory.Server.Services.CreateScope().ServiceProvider;
            this.output = output;
        }
    }
}
