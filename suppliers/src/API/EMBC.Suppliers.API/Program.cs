using System;
using System.Net.Http;
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Debugging;
using Serilog.Exceptions;
using Serilog.Formatting.Elasticsearch;

namespace EMBC.Suppliers.API
{
    public static class Program
    {
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
                        .Enrich.WithProcessId()
                        .Enrich.WithProcessName()
                        .Enrich.FromLogContext()
                        .Enrich.WithExceptionDetails()
                        ;

                     if (hostingContext.HostingEnvironment.IsDevelopment())
                     {
                         loggerConfiguration.WriteTo.Console();
                     }
                     else
                     {
                         loggerConfiguration.WriteTo.Console(formatter: new ElasticsearchJsonFormatter());
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
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>()
                    .UseKestrel(options =>
                    {
                        options.Limits.MaxRequestBodySize = 104857600; // 100MB
                    });
                }).ConfigureServices((ctx, services) =>
                {
                    services.AddHostedService<ConfigurationServiceWorker>();
                });
    }
}
