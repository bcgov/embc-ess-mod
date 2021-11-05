using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace OAuthServer
{
    public class Program
    {
        public static int Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            MigrateOperationalDatabase(host);

            host.Run();
            return 0;
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
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

            //logger.LogInformation("Migrating ConfigurationDbContext");
            //scope.ServiceProvider.GetService<ConfigurationDbContext>().Database.Migrate();
            //logger.LogInformation("ConfigurationDbContext migration completed");

        }
    }
}
