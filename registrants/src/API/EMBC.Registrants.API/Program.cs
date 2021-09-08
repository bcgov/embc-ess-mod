// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
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
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Formatting.Compact;

namespace EMBC.Registrants.API
{
    public static class Program
    {
        public static int Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
             .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
             .Enrich.FromLogContext()
             .WriteTo.Console(formatter: new RenderedCompactJsonFormatter())
             .CreateBootstrapLogger();

            try
            {
                CreateHostBuilder(args).Build().Run();
                Log.Information("Stopped");
                return 0;
            }
            catch (Exception e)
            {
                Log.Fatal(e, "An unhandled exception occured during bootstrapping");
                return 1;
            }
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
                      var splunkUrl = hostingContext.Configuration.GetValue("SPLUNK_URL", string.Empty);
                      var splunkToken = hostingContext.Configuration.GetValue("SPLUNK_TOKEN", string.Empty);
                      if (string.IsNullOrWhiteSpace(splunkToken) || string.IsNullOrWhiteSpace(splunkUrl))
                      {
                          loggerConfiguration.WriteTo.Console(formatter: new RenderedCompactJsonFormatter());
                          Log.Warning($"Splunk logging sink is not configured properly, check SPLUNK_TOKEN and SPLUNK_URL env vars");
                      }
                      else
                      {
                          loggerConfiguration
                            .WriteTo.Console(formatter: new RenderedCompactJsonFormatter())
                            .WriteTo.EventCollector(
                                  splunkHost: splunkUrl,
                                  eventCollectorToken: splunkToken,
                                  messageHandler: new HttpClientHandler
                                  {
                                      ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                                  },
                                  renderTemplate: false);
                      }
                  }
              })
              .ConfigureWebHostDefaults(webBuilder =>
              {
                  webBuilder.UseStartup<Startup>();
              });
    }
}
