using System;
using System.Net.Http;
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using Jasper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Debugging;
using Serilog.Exceptions;
using Serilog.Formatting.Compact;

namespace EMBC.Suppliers.API
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            SelfLog.Enable(Console.Error);
            CreateHostBuilder(args).RunJasper(args);
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseJasper<ApiJasperOptions>()
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
                         loggerConfiguration.WriteTo.Console(formatter: new RenderedCompactJsonFormatter());
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
                    webBuilder.UseStartup<Startup>();
                }).ConfigureServices((ctx, services) =>
                {
                    services.AddHostedService<ConfigurationServiceWorker>();
                });
    }

    public class ApiJasperOptions : JasperOptions
    {
        public ApiJasperOptions()
        {
            Endpoints.DefaultLocalQueue.NotDurable();
        }
    }
}
