using System;
using System.Net.Http;
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Debugging;
using Serilog.Enrichers.Span;
using Serilog.Exceptions;
using Serilog.Formatting.Elasticsearch;

namespace EMBC.Suppliers.API
{
    public static class Program
    {
        public const string LogOutputTemplate = "[{Timestamp:HH:mm:ss} {Level:u3} {SourceContext}] {Message:lj}{NewLine}{Exception}";

        public static void Main(string[] args)
        {
            SelfLog.Enable(Console.Error);
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog((hostingContext, loggerConfiguration) =>
                 {
                     loggerConfiguration
                        .ReadFrom.Configuration(hostingContext.Configuration)
                        .Enrich.WithMachineName()
                        .Enrich.FromLogContext()
                        .Enrich.WithExceptionDetails()
                        .Enrich.WithProperty("app", Environment.GetEnvironmentVariable("APP_NAME") ?? "EMBC.Suppliers.API")
                        .Enrich.WithEnvironmentName()
                        .Enrich.WithEnvironmentUserName()
                        .Enrich.WithCorrelationId()
                        .Enrich.WithCorrelationIdHeader()
                        .Enrich.WithClientAgent()
                        .Enrich.WithClientIp()
                        .Enrich.WithSpan()
                        .WriteTo.Console(outputTemplate: LogOutputTemplate)
                        ;

                     if (hostingContext.HostingEnvironment.IsDevelopment())
                     {
                         loggerConfiguration.WriteTo.Console();
                     }
                     else
                     {
                         var splunkUrl = hostingContext.Configuration.GetValue("SPLUNK_URL", string.Empty);
                         var splunkToken = hostingContext.Configuration.GetValue("SPLUNK_TOKEN", string.Empty);
                         if (string.IsNullOrWhiteSpace(splunkToken) || string.IsNullOrWhiteSpace(splunkUrl))
                         {
                             Log.Warning($"Splunk logging sink is not configured properly, check SPLUNK_TOKEN and SPLUNK_URL env vars");
                         }
                         else
                         {
                             loggerConfiguration
                                 .WriteTo.EventCollector(
                                     splunkHost: splunkUrl,
                                     eventCollectorToken: splunkToken,
                                     messageHandler: new HttpClientHandler
                                     {
                                         ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
                                     },
                                     renderTemplate: false);
                         }
                     }
                 })
                .ConfigureServices((context, services) =>
                {
                    services.Configure<KestrelServerOptions>(
                        context.Configuration.GetSection("Kestrel"));
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                }).ConfigureServices((ctx, services) =>
                {
                    services.AddHostedService<ConfigurationServiceWorker>();
                });
    }
}
