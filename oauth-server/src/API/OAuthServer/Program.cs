using System;
using System.Runtime;
using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;

namespace OAuthServer
{
    public class Program
    {
        private static string appName => Environment.GetEnvironmentVariable("APP_NAME") ?? "oauth-server";

        public static int Main(string[] args)
        {
            GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;

            Log.Logger = new LoggerConfiguration()
               .MinimumLevel.Debug()
               .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
               .Enrich.FromLogContext()
               .WriteTo.Console(outputTemplate: Logging.LogOutputTemplate)
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
                .UseSerilog((ctx, services, config) => Logging.ConfigureSerilog(ctx, services, config, appName))
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        private static void MigrateOperationalDatabase(IHost host)
        {
            using var scope = host.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();

            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            var ctx = scope.ServiceProvider.GetService<PersistedGrantDbContext>();
            if (ctx == null) return;
            logger.LogInformation("Migrating PersistedGrantDbContext");
            ctx.Database.Migrate();
            logger.LogInformation("PersistedGrantDbContext migration completed");
        }
    }
}
