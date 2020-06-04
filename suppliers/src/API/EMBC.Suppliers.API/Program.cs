// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

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
