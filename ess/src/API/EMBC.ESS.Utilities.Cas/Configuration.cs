using System;
using System.Net.Http;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Telemetry;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Extensions.Http;

namespace EMBC.ESS.Utilities.Cas
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var configuration = configurationServices.Configuration;
            var services = configurationServices.Services;

            var options = configuration.GetSection("CAS").Get<CasConfiguration>();

            services.Configure<CasConfiguration>(opts => configuration.GetSection("CAS").Bind(opts));

            var adfsTokenErrorHandlingPolicy = HttpPolicyExtensions.HandleTransientHttpError()
                .CircuitBreakerAsync(
                        options.CircuitBreakerNumberOfErrors,
                        TimeSpan.FromSeconds(options.CircuitBreakerResetInSeconds),
                        OnBreak,
                        OnReset);

            services
                .AddHttpClient("cas", (sp, client) =>
                {
                    var options = sp.GetRequiredService<IOptions<CasConfiguration>>().Value;
                    client.BaseAddress = options.BaseUrl;
                })
                .SetHandlerLifetime(TimeSpan.FromMinutes(30))
                .AddPolicyHandler((sp, request) =>
                {
                    var ctx = request.GetPolicyExecutionContext() ?? new Context();
                    ctx["_serviceprovider"] = sp;
                    ctx["_source"] = "cas-circuitbreaker";
                    request.SetPolicyExecutionContext(ctx);
                    return adfsTokenErrorHandlingPolicy;
                })
 ;

            services.TryAddTransient<IWebProxy, WebProxy>();
        }

        private static void OnBreak(DelegateResult<HttpResponseMessage> r, TimeSpan time, Context ctx)
        {
            var source = (string)ctx["_source"];
            var sp = (IServiceProvider)ctx["_serviceprovider"];
            var logger = sp.GetRequiredService<ITelemetryProvider>().Get(source);
            logger.LogError(r.Exception, "BREAK: {0} {1}: {2}", time, r.Result?.StatusCode, r.Result?.RequestMessage?.RequestUri);
        }

        private static void OnReset(Context ctx)
        {
            var source = (string)ctx["_source"];
            var sp = (IServiceProvider)ctx["_serviceprovider"];
            var logger = sp.GetRequiredService<ITelemetryProvider>().Get(source);
            logger.LogInformation("RESET");
        }
    }

    public class CasConfiguration
    {
        public Uri BaseUrl { get; set; } = null!;
        public string ClientId { get; set; } = null!;
        public string ClientSecret { get; set; } = null!;
        public int CircuitBreakerNumberOfErrors { get; set; } = 3;
        public int CircuitBreakerResetInSeconds { get; set; } = 120;
    }
}
