using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime;
using System.Threading.Tasks;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Extensions;
using EMBC.Utilities.Telemetry;
using Hellang.Middleware.ProblemDetails;
using Medallion.Threading;
using Medallion.Threading.Redis;
using Medallion.Threading.WaitHandles;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Events;
using Serilog.Extensions.Hosting;
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
    /// </summary>
    public class Host
    {
        private readonly string appName;
        private TelemetryProvider telemetryProvider = null!;
        private ITelemetryReporter hostReporter = null!;

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
            GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;

            Log.Logger = new LoggerConfiguration()
               .MinimumLevel.Debug()
               .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
               .Enrich.FromLogContext()
               .WriteTo.Console(outputTemplate: Logging.LogOutputTemplate)
               .CreateBootstrapLogger();

            try
            {
                await CreateHost(assembliesPrefix).Build().RunAsync();
                Log.Information("Stopped");
                return 0;
            }
            catch (Exception e)
            {
                Log.Fatal(e, "An unhandled exception occurred during bootstrapping");
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public IHostBuilder CreateHost(string? assembliesPrefix = null)
        {
#pragma warning disable S3885 // "Assembly.Load" should be used
            var assemblies = Directory.GetFiles(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) ?? string.Empty, "*.dll", SearchOption.TopDirectoryOnly)
                 .Where(assembly =>
                 {
                     var assemblyName = Path.GetFileName(assembly);
                     return !assemblyName.StartsWith("System.") && !assemblyName.StartsWith("Microsoft.") && (string.IsNullOrEmpty(assembliesPrefix) || assemblyName.StartsWith(assembliesPrefix));
                 })
                 .Select(assembly => Assembly.LoadFrom(assembly))
                 .ToArray();
#pragma warning restore S3885 // "Assembly.Load" should be used

            telemetryProvider = new TelemetryProvider(new DiagnosticContext(Log.Logger.ForContext<Host>()));
            hostReporter = telemetryProvider.Get<Host>();
            return CreateHost(assemblies);
        }

        protected virtual IHostBuilder CreateHost(params Assembly[] assemblies) =>
             Microsoft.Extensions.Hosting.Host.CreateDefaultBuilder()
                 .ConfigureHostConfiguration(opts =>
                 {
                     // add secrets json file if exists in the hosting assembly
                     opts.AddUserSecrets(Assembly.GetEntryAssembly(), true, true);
                 })
                .UseSerilog((ctx, services, config) => Logging.ConfigureSerilog(ctx, services, config, appName))
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureServices((ctx, services) =>
                    {
                        ConfigureServices(services, ctx.Configuration, ctx.HostingEnvironment, assemblies);
                    })
                    .Configure((WebHostBuilderContext ctx, IApplicationBuilder app) =>
                    {
                        Configure(app, ctx.Configuration, ctx.HostingEnvironment, assemblies);
                    }).ConfigureLogging(logging =>
                    {
                        //logging.AddOpenTelemetry(opts => opts.AddConsoleExporter());
                    });
                });

        protected virtual void ConfigureServices(IServiceCollection services, IConfiguration configuration, IHostEnvironment hostEnvironment, params Assembly[] assemblies)
        {
            var logger = hostReporter;
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

                services.AddSingleton<IDistributedSemaphoreProvider>(new RedisDistributedSynchronizationProvider(ConnectionMultiplexer.Connect(redisConnectionString).GetDatabase()));
            }
            else
            {
                logger.LogInformation("Configuring in-memory cache");
                var dataProtectionPath = configuration.GetValue("KEY_RING_PATH", string.Empty);
                services.AddDistributedMemoryCache();
                var dpBuilder = services.AddDataProtection()
                    .SetApplicationName(appName);

                if (!string.IsNullOrEmpty(dataProtectionPath)) dpBuilder.PersistKeysToFileSystem(new DirectoryInfo(dataProtectionPath));

                services.AddSingleton<IDistributedSemaphoreProvider>(new WaitHandleDistributedSynchronizationProvider());
            }

            services.AddDefaultHealthChecks();

            services
                .AddHttpContextAccessor()
                .AddResponseCompression(opts => opts.EnableForHttps = true)
                .AddProblemDetails(opts =>
                {
                    opts.IncludeExceptionDetails = (ctx, ex) => hostEnvironment.IsDevelopment();
                    opts.ShouldLogUnhandledException = (ctx, ex, problem) => false;
                });

            var mvcBuilder = services.AddControllers();
            foreach (var assembly in assemblies)
            {
                mvcBuilder.AddApplicationPart(assembly).AddControllersAsServices();
            }

            services.AddAutoMapper((sp, cfg) => { cfg.ConstructServicesUsing(t => sp.GetRequiredService(t)); }, assemblies);
            services.AddCors(opts => opts.AddDefaultPolicy(policy =>
            {
                // try to get array of origins from section array
                var corsOrigins = configuration.GetSection("cors:origins").GetChildren().Select(c => c.Value).ToArray();
                // try to get array of origins from value
                if (!corsOrigins.Any()) corsOrigins = configuration.GetValue("cors:origins", string.Empty).Split(',');
                corsOrigins = corsOrigins.Where(o => !string.IsNullOrWhiteSpace(o)).ToArray();
                if (corsOrigins.Any())
                {
                    policy.SetIsOriginAllowedToAllowWildcardSubdomains().WithOrigins(corsOrigins);
                }
            }));
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.All;
                options.KnownNetworks.Clear();
                options.KnownProxies.Clear();
            });

            services.Configure<ExceptionHandlerOptions>(opts => opts.AllowStatusCode404Response = true);

            services.ConfigureComponentServices(configuration, hostEnvironment, telemetryProvider, assemblies);

            services.AddOpenTelemetry(appName);

            // add background tasks
            if (configuration.GetValue("backgroundTask:enabled", true))
            {
                logger.LogInformation("Background tasks are enabled");
                services.AddBackgroundTasks(telemetryProvider, assemblies);
            }
            else
            {
                logger.LogWarning("Background tasks are disabled and not registered");
            }

            // add version providers
            services.AddTransient<IVersionInformationProvider, HostVersionInformationProvider>();
        }

        protected virtual void Configure(IApplicationBuilder app, IConfiguration configuration, IWebHostEnvironment env, params Assembly[] assemblies)
        {
            var logger = hostReporter;

            logger.LogInformation("Starting configuration of {appName}", appName);

            app.UseProblemDetails();
            app.UseResponseCompression();
            app.UseForwardedHeaders();
            app.SetDefaultRequestLogging();
            app.UseRouting();
            app.UseCors();

            app.ConfigureComponentPipeline(configuration, env, telemetryProvider, assemblies);

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapDefaultHealthChecks();

                endpoints.MapVersionsEndpoint();

                //map gRPC services
                var grpcServices = assemblies.SelectMany(a => a.CreateInstancesOf<IHaveGrpcServices>()).SelectMany(p => p.GetGrpcServiceTypes()).ToArray();
                var grpcRegistrationMethodInfo = typeof(GrpcEndpointRouteBuilderExtensions).GetMethod(nameof(GrpcEndpointRouteBuilderExtensions.MapGrpcService)) ?? null!;
                foreach (var service in grpcServices)
                {
                    logger.LogInformation("Registering gRPC service {0}", service.FullName);
                    grpcRegistrationMethodInfo.MakeGenericMethod(service).Invoke(null, new[] { endpoints });
                }
            });
        }
    }
}
