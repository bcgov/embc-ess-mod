using System;
using System.Collections.Generic;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Xunit.Categories;

namespace EMBC.Tests.Integration.ESS
{
    public class WebAppTestFixture : WebApplicationFactory<WebAppTestFixture>
    {
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
                opts.AddInMemoryCollection(new[] { new KeyValuePair<string, string>("backgroundTask:enabled", "false") });
            }).ConfigureServices(services =>
            {
                services.Remove(new ServiceDescriptor(typeof(EMBC.ESS.Utilities.Cas.IWebProxy), typeof(EMBC.ESS.Utilities.Cas.WebProxy), ServiceLifetime.Transient));
                services.AddSingleton<EMBC.ESS.Utilities.Cas.IWebProxy, MockCasProxy>();
                //override grpc client configuration to make it work in the test web server
                services.AddGrpcClient<Utilities.Messaging.Grpc.Dispatcher.DispatcherClient>().ConfigurePrimaryHttpMessageHandler(() => this.Server.CreateHandler());
            });
        }
    }

    [IntegrationTest]
    public abstract class WebAppTestBase : IClassFixture<WebAppTestFixture>
    {
        protected readonly ITestOutputHelper output;

        public IServiceProvider Services { get; }

        protected WebAppTestBase(ITestOutputHelper output, WebAppTestFixture fixture)
        {
            var factory = fixture.WithWebHostBuilder(builder =>
           {
#pragma warning disable CS0618 // Type or member is obsolete
               builder.UseSerilog((ctx, cfg) =>
               {
                   cfg
                    .MinimumLevel.Override("System.Net.Http.HttpClient", LogEventLevel.Warning)
                    .MinimumLevel.Override("Microsoft.OData.Extensions.Client.DefaultODataClientActivator", LogEventLevel.Warning)
                    .WriteTo.TestOutput(output, outputTemplate: "[{Timestamp:HH:mm:ss.sss} {Level:u3} {SourceContext}] {Message:lj}{NewLine}{Exception}");
               });
#pragma warning restore CS0618 // Type or member is obsolete
           });
            this.Services = factory.Server.Services.CreateScope().ServiceProvider;
            this.output = output;
        }
    }
}
