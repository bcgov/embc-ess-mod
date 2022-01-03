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
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using EMBC.Utilities.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;
using Serilog.Exceptions;
using Serilog.Extensions.Logging;
using StackExchange.Redis;

namespace EMBC.Utilities.Hosting
{
    /// <summary>
    /// A generic web host that support api, gRPC self discovered endpoints.
    /// The host will:
    /// - configure distributed cache (in memory or redis)
    /// - configure data protection (on disk or redis)
    /// - Serilog console and Splunk (if configured)
    /// - health check endpoints
    /// - AutoMapper helper services
    /// - default routing and controllers
    /// - discover and invoke IConfigureComponentServices, IConfigureComponentPipeline, IHaveGrpcServices implementations in dependant assemblies
    /// testing symlink changes
    /// </summary>
    public class Host
    {
        private const string HealthCheckReadyTag = "ready";
        private const string HealthCheckAliveTag = "alive";
        private const string logOutputTemplate = "[{Timestamp:HH:mm:ss} {Level:u3} {SourceContext}] {Message:lj}{NewLine}{Exception}";
        private readonly string appName;

        public Host(string appName)
        {
            this.appName = appName;
        }

        /// <summary>
        /// Build and run the host
        /// </summary>
        /// <param name="assembliesPrefix">a prefix to detect which assemblies to scan for configuration dependencies</param>
        /// <returns>awaitable Task that returns the status code of the host on exit</returns>
        public async Task<int> Run(string? assembliesPrefix = null)
        {
            Log.Logger = new LoggerConfiguration()
               .MinimumLevel.Debug()
               .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
               .Enrich.FromLogContext()
               .WriteTo.Console(outputTemplate: logOutputTemplate)
               .CreateBootstrapLogger();

            var assemblies = Directory.GetFiles(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? string.Empty, "*.dll", SearchOption.TopDirectoryOnly)
                .Where(assembly =>
                {
                    var assemblyName = Path.GetFileName(assembly);
                    return !assemblyName.StartsWith("System.") && !assemblyName.StartsWith("Microsoft.") && (string.IsNullOrEmpty(assembliesPrefix) || assemblyName.StartsWith(assembliesPrefix));
                })
                .Select(assembly => Assembly.LoadFrom(assembly))
                .ToArray();

            try
            {
                await CreateHost(assemblies).RunAsync();
                Log.Information("Stopped");
                return 0;
            }
            catch (Exception e)
            {
                Log.Fatal(e, "An unhandled exception occured during bootstrapping");
                return 1;
            }
        }

        protected virtual IHost CreateHost(params Assembly[] assemblies) =>
             Microsoft.Extensions.Hosting.Host.CreateDefaultBuilder()
                .UseSerilog(ConfigureSerilog)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureServices((ctx, services) =>
                    {
                        ConfigureServices(services, ctx.Configuration, ctx.HostingEnvironment, assemblies);
                    })
                    .Configure((WebHostBuilderContext ctx, IApplicationBuilder app) =>
                    {
                        Configure(app, ctx.Configuration, ctx.HostingEnvironment, assemblies);
                    });
                })
                .Build();

        protected virtual void ConfigureSerilog(HostBuilderContext hostBuilderContext, LoggerConfiguration loggerConfiguration)
        {
            loggerConfiguration
                .ReadFrom.Configuration(hostBuilderContext.Configuration)
                .Enrich.WithMachineName()
                .Enrich.WithProcessId()
                .Enrich.WithProcessName()
                .Enrich.FromLogContext()
                .Enrich.WithExceptionDetails()
                .WriteTo.Console(outputTemplate: logOutputTemplate)
                ;

            var splunkUrl = hostBuilderContext.Configuration.GetValue("SPLUNK_URL", string.Empty);
            var splunkToken = hostBuilderContext.Configuration.GetValue("SPLUNK_TOKEN", string.Empty);
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
                Log.Information($"Logs will be forwarded to Splunk");
            }
        }

        protected virtual void ConfigureServices(IServiceCollection services, IConfiguration configuration, IHostEnvironment hostEnvironment, params Assembly[] assemblies)
        {
            var logger = new SerilogLoggerFactory(Log.Logger).CreateLogger<Host>();

            logger.LogInformation("Starting service configuration of {appName}", appName);

            var redisConnectionString = configuration.GetValue("REDIS_CONNECTIONSTRING", string.Empty);
            if (!string.IsNullOrEmpty(redisConnectionString))
            {
                logger.LogInformation("Configuring Redis cache");
                services.AddStackExchangeRedisCache(options =>
                {
                    options.Configuration = redisConnectionString;
                });
                services.AddDataProtection()
                    .SetApplicationName(appName)
                    .PersistKeysToStackExchangeRedis(ConnectionMultiplexer.Connect(redisConnectionString), $"{appName}-data-protection-keys");
            }
            else
            {
                logger.LogInformation("Configuring in-memory cache");
                services.AddDistributedMemoryCache();
                var dpBuilder = services.AddDataProtection()
                    .SetApplicationName(appName);

                var dataProtectionPath = configuration.GetValue("KEY_RING_PATH", string.Empty);
                if (!string.IsNullOrEmpty(dataProtectionPath)) dpBuilder.PersistKeysToFileSystem(new DirectoryInfo(dataProtectionPath));
            }
            services.AddHealthChecks()
                .AddCheck($"ready hc", () => HealthCheckResult.Healthy("ready"), new[] { HealthCheckReadyTag })
                .AddCheck($"live hc", () => HealthCheckResult.Healthy("alive"), new[] { HealthCheckAliveTag });
            services.AddHttpContextAccessor();
            services.AddControllers();
            services.AddAutoMapper((sp, cfg) => { cfg.ConstructServicesUsing(t => sp.GetRequiredService(t)); }, assemblies);
            Configurer.ConfigureComponentServices(services, configuration, hostEnvironment, logger, assemblies);
        }

        protected virtual void Configure(IApplicationBuilder app, IConfiguration configuration, IWebHostEnvironment env, params Assembly[] assemblies)
        {
            var logger = app.ApplicationServices.GetRequiredService<ILogger<Host>>();

            logger.LogInformation("Starting configuration of {appName}", appName);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseSerilogRequestLogging(opts =>
            {
                opts.GetLevel = ExcludeHealthChecks;
                opts.EnrichDiagnosticContext = (diagCtx, httpCtx) =>
                {
                    diagCtx.Set("App", appName);
                    diagCtx.Set("User", httpCtx.User.Identity?.Name);
                    diagCtx.Set("Host", httpCtx.Request.Host);
                    diagCtx.Set("UserAgent", httpCtx.Request.Headers["User-Agent"].ToString());
                    diagCtx.Set("RemoteIP", httpCtx.Connection.RemoteIpAddress?.ToString());
                    diagCtx.Set("ConnectionId", httpCtx.Connection.Id);
                    diagCtx.Set("Forwarded", httpCtx.Request.Headers["Forwarded"].ToString());
                    diagCtx.Set("ContentLength", httpCtx.Response.ContentLength);
                };
            });

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHealthChecks("/hc/ready", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckReadyTag) });
                endpoints.MapHealthChecks("/hc/live", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckAliveTag) });
                endpoints.MapHealthChecks("/hc/startup", new HealthCheckOptions() { Predicate = _ => false });

                var grpcServices = assemblies.SelectMany(a => a.CreateInstancesOf<IHaveGrpcServices>()).SelectMany(p => p.GetGrpcServiceTypes()).ToArray();
                var grpcRegistrationMethodInfo = typeof(GrpcEndpointRouteBuilderExtensions).GetMethod(nameof(GrpcEndpointRouteBuilderExtensions.MapGrpcService)) ?? null!;
                foreach (var service in grpcServices)
                {
                    logger.LogInformation("Registering gRPC service {0}", service.FullName);
                    grpcRegistrationMethodInfo.MakeGenericMethod(service).Invoke(null, new[] { endpoints });
                }
            });

            Configurer.ConfigureComponentPipeline(app, configuration, env, logger, assemblies);
        }

        private static LogEventLevel ExcludeHealthChecks(HttpContext ctx, double _, Exception ex) =>
        ex != null
            ? LogEventLevel.Error
            : ctx.Response.StatusCode >= (int)HttpStatusCode.InternalServerError
                ? LogEventLevel.Error
                : ctx.Request.Path.StartsWithSegments("/hc", StringComparison.InvariantCultureIgnoreCase)
                    ? LogEventLevel.Verbose
                    : LogEventLevel.Information;
    }
}
