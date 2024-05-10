using System;
using System.IO;
using System.Text.Json;
using System.Text.Json.Nodes;
using EMBC.ESS.Managers.Events.Notifications;
using EMBC.Utilities.Caching;
using EMBC.Utilities.Telemetry;
using EMBC.Utilities.Transformation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Hosting.Internal;
using Serilog;
using Serilog.Extensions.Hosting;
using Xunit.Abstractions;

namespace EMBC.Tests.Unit.ESS
{
    public static class TestHelper
    {
        public static IServiceCollection CreateDIContainer()
        {
            var services = new ServiceCollection();
            services.AddLogging(builder => builder.AddSerilog());
            services.AddSingleton<IConfiguration>(new ConfigurationBuilder().Build());
            return services;
        }

        public static IServiceCollection AddLogging(this IServiceCollection services, ITestOutputHelper output)
        {
            Log.Logger = new LoggerConfiguration().WriteTo.TestOutput(output).CreateLogger();
            services.AddSingleton<ITelemetryProvider>(new TelemetryProvider(new DiagnosticContext(Log.Logger)));

            return services;
        }

        public static IServiceCollection AddTemplateBuilding(this IServiceCollection services, ITestOutputHelper output)
        {
            services.AddTransient<ITransformator, HbsTransformator>();

            services.AddTransient<EmailTemplateProvider>();
            services.AddTransient<ITemplateProviderResolver>(sp =>
            {
                Func<NotificationChannelType, ITemplateProvider> resolverFunc = (type) => type switch
                {
                    NotificationChannelType.Email => sp.GetRequiredService<EmailTemplateProvider>(),
                    _ => throw new NotImplementedException($"No template provider was registered for {type}")
                };
                return new TemplateProviderResolver(resolverFunc);
            });

            return services;
        }

        public static TelemetryProvider CreateTelemetryProvider(ITestOutputHelper output)
        {
            Log.Logger = new LoggerConfiguration().WriteTo.TestOutput(output).CreateLogger();
            return new TelemetryProvider(new DiagnosticContext(Log.Logger));
        }

        public static IServiceProvider Build(this IServiceCollection services)
        {
            return services.BuildServiceProvider(validateScopes: true);
        }

        public static IServiceCollection AddTestCache(this IServiceCollection services)
        {
            services.AddDistributedMemoryCache();
            services.AddSingleton<IHostEnvironment>(new HostingEnvironment { EnvironmentName = Environments.Development });
            services.AddSingleton<CacheSyncManager>();
            services.AddSingleton<ICache, Cache>();

            return services;
        }

        public static IConfigurationBuilder AddConfigurationOptions(this IConfigurationBuilder configurationBuilder, string sectionName, object options)
        {
            var configJson = new JsonObject();
            configJson.Add(sectionName, JsonSerializer.SerializeToNode(options));

            var ms = new MemoryStream();

            var jsonWriter = new Utf8JsonWriter(ms);

            configJson.WriteTo(jsonWriter);
            jsonWriter.Flush();
            ms.Position = 0;
            configurationBuilder.AddJsonStream(ms);

            return configurationBuilder;
        }
    }
}
