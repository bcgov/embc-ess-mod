using System;
using System.IO;
using System.Text.Json;
using System.Text.Json.Nodes;
using EMBC.Utilities.Caching;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Hosting.Internal;
using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

namespace EMBC.Tests.Unit.ESS
{
    public static class TestHelper
    {
        public static IServiceCollection CreateDIContainer(ITestOutputHelper output)
        {
            var services = new ServiceCollection();
            services.AddLogging(builder => builder.AddXunit(output));
            services.AddSingleton<IConfiguration>(new ConfigurationBuilder().Build());
            return services;
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
