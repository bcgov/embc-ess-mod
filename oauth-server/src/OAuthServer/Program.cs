using System;
using System.Net.Http;
using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;

namespace OAuthServer
{
    public class Program
    {
        public static int Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .CreateBootstrapLogger();

            try
            {
                var host = CreateHostBuilder(args).Build();
                MigrateOperationalDatabase(host);
                host.Run();
                return 0;
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly.");
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog((hostingContext, loggerConfiguration) =>
                {
                    loggerConfiguration
                        .ReadFrom.Configuration(hostingContext.Configuration)
                        .Enrich.FromLogContext()
                        .WriteTo.Console();

                    if (!hostingContext.HostingEnvironment.IsDevelopment())
                    {
                        var splunkUrl = hostingContext.Configuration.GetValue("SPLUNK_URL", string.Empty);
                        var splunkToken = hostingContext.Configuration.GetValue("SPLUNK_TOKEN", string.Empty);
                        if (string.IsNullOrWhiteSpace(splunkToken) || string.IsNullOrWhiteSpace(splunkUrl))
                        {
                            Log.Warning($"Logs will NOT be forwarded to Splunk: check SPLUNK_TOKEN and SPLUNK_URL env vars");
                        }
                        else
                        {
                            loggerConfiguration
                                .WriteTo.EventCollector(
                                    splunkHost: splunkUrl,
                                    eventCollectorToken: splunkToken,
                                    messageHandler: new HttpClientHandler
                                    {
                                        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                                    },
                                    renderTemplate: false);
                            Log.Warning($"Logs will be forwarded to Splunk");
                        }
                    }
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        private static void MigrateOperationalDatabase(IHost host)
        {
            using var scope = host.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();

            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Migrating PersistedGrantDbContext");
            scope.ServiceProvider.GetService<PersistedGrantDbContext>().Database.Migrate();
            logger.LogInformation("PersistedGrantDbContext migration completed");
        }
    }
}
