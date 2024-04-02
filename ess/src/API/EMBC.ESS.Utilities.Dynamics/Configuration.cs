using System;
using System.Net.Http;
using System.Threading.Tasks;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Telemetry;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;
using Microsoft.OData.Extensions.Client;
using Polly;
using Polly.Extensions.Http;

namespace EMBC.ESS.Utilities.Dynamics
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var services = configurationServices.Services;
            var configuration = configurationServices.Configuration;

            var options = configuration.GetSection("Dynamics").Get<DynamicsOptions>();

            services.Configure<DynamicsOptions>(opts => configuration.GetSection("Dynamics").Bind(opts));

            var adfsTokenErrorHandlingPolicy = HttpPolicyExtensions.HandleTransientHttpError()
                .CircuitBreakerAsync(
                        options.CircuitBreakerNumberOfErrors,
                        TimeSpan.FromSeconds(options.CircuitBreakerResetInSeconds),
                        OnBreak,
                        OnReset);

            services
                .AddHttpClient("adfs_token")
                .SetHandlerLifetime(TimeSpan.FromMinutes(30))
                .AddPolicyHandler((sp, request) =>
                {
                    var ctx = request.GetPolicyExecutionContext() ?? new Context();
                    ctx["_serviceprovider"] = sp;
                    ctx["_source"] = "adfs-circuitbreaker";
                    request.SetPolicyExecutionContext(ctx);
                    return adfsTokenErrorHandlingPolicy;
                })
               ;

            services.AddSingleton<ISecurityTokenProvider, ADFSSecurityTokenProvider>();

            var dynamicsErrorHandlingPolicy = HttpPolicyExtensions.HandleTransientHttpError()
                .Or<TaskCanceledException>() // when Dynamics API is rejecting requests
                .Or<DataServiceRequestException>()
                .Or<DataServiceTransportException>()
                .CircuitBreakerAsync(
                        options.CircuitBreakerNumberOfErrors,
                        TimeSpan.FromSeconds(options.CircuitBreakerResetInSeconds),
                        OnBreak,
                        OnReset);

            services
                .AddODataClient("dynamics")
                .AddODataClientHandler<DynamicsODataClientHandler>()
                .AddHttpClient()
                .ConfigureHttpClient(c => c.Timeout = options.HttpClientTimeout)
                .SetHandlerLifetime(TimeSpan.FromMinutes(30))
                .AddPolicyHandler((sp, request) =>
                {
                    var ctx = request.GetPolicyExecutionContext() ?? new Context();
                    ctx["_serviceprovider"] = sp;
                    ctx["_source"] = "dynamics-circuitbreaker";
                    request.SetPolicyExecutionContext(ctx);
                    return dynamicsErrorHandlingPolicy;
                })
                ;

            services.AddSingleton<IEssContextFactory, EssContextFactory>();
            services.AddTransient(sp => sp.GetRequiredService<IEssContextFactory>().Create());
            services.AddTransient<IEssContextStateReporter, EssContextStateReporter>();
            services.AddTransient<IVersionInformationProvider, DynamicSchemasVersionInformationProvider>();
        }

        private static void OnBreak(DelegateResult<HttpResponseMessage> r, TimeSpan time, Context ctx)
        {
            var source = (string)ctx["_source"];
            var sp = (IServiceProvider)ctx["_serviceprovider"];
            var logger = sp.GetRequiredService<ITelemetryProvider>().Get(source);
            logger.LogError(r.Exception, "BREAK: {0} {1}: {2}", time, r.Result?.StatusCode, r.Result?.RequestMessage?.RequestUri);
            var reporter = sp.GetRequiredService<IEssContextStateReporter>();
            reporter.ReportBroken($"{source}: {r.Exception?.Message ?? r.Result?.StatusCode.ToString()}").ConfigureAwait(false).GetAwaiter().GetResult();
        }

        private static void OnReset(Context ctx)
        {
            var source = (string)ctx["_source"];
            var sp = (IServiceProvider)ctx["_serviceprovider"];
            var logger = sp.GetRequiredService<ITelemetryProvider>().Get(source);
            logger.LogInformation("RESET");
            var reporter = sp.GetRequiredService<IEssContextStateReporter>();
            reporter.ReportFixed().ConfigureAwait(false).GetAwaiter().GetResult();
        }
    }
}
