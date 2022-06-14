using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Enrichers.Span;
using Serilog.Events;
using Serilog.Exceptions;

namespace EMBC.Utilities.Hosting
{
    internal static class Logging
    {
        public const string LogOutputTemplate = "[{Timestamp:HH:mm:ss} {Level:u3} {SourceContext}] {Message:lj}{NewLine}{Exception}";

        public static void ConfigureSerilog(HostBuilderContext hostBuilderContext, IServiceProvider services, LoggerConfiguration loggerConfiguration, string appName)
        {
            loggerConfiguration
                .ReadFrom.Configuration(hostBuilderContext.Configuration)
                .ReadFrom.Services(services)
                .Enrich.WithMachineName()
                .Enrich.FromLogContext()
                .Enrich.WithExceptionDetails()
                .Enrich.WithProperty("app", appName)
                .Enrich.WithEnvironmentName()
                .Enrich.WithEnvironmentUserName()
                .Enrich.WithCorrelationId()
                .Enrich.WithCorrelationIdHeader()
                .Enrich.WithClientAgent()
                .Enrich.WithClientIp()
                .Enrich.WithSpan()
                .WriteTo.Console(outputTemplate: LogOutputTemplate)
                ;

            var splunkUrl = hostBuilderContext.Configuration.GetValue("SPLUNK_URL", string.Empty);
            var splunkToken = hostBuilderContext.Configuration.GetValue("SPLUNK_TOKEN", string.Empty);
            if (string.IsNullOrWhiteSpace(splunkToken) || string.IsNullOrWhiteSpace(splunkUrl))
            {
                Log.Warning($"Logs will NOT be forwarded to Splunk: check SPLUNK_TOKEN and SPLUNK_URL env vars");
            }
            else
            {
#pragma warning disable S4830 // Server certificates should be verified during SSL/TLS connections
                loggerConfiguration
                    .WriteTo.EventCollector(
                        splunkHost: splunkUrl,
                        eventCollectorToken: splunkToken,
                        messageHandler: new HttpClientHandler
                        {
                            ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                        },
                        renderTemplate: false);
#pragma warning restore S4830 // Server certificates should be verified during SSL/TLS connections
                Log.Information($"Logs will be forwarded to Splunk");
            }
        }

        public static IApplicationBuilder SetDefaultRequestLogging(this IApplicationBuilder applicationBuilder)
        {
            applicationBuilder.UseSerilogRequestLogging(opts =>
            {
                opts.IncludeQueryInRequestPath = true;
                opts.GetLevel = ExcludeHealthChecks;
                opts.EnrichDiagnosticContext = (diagCtx, httpCtx) =>
                {
                    diagCtx.Set("User", httpCtx.User.Identity?.Name ?? string.Empty);
                    diagCtx.Set("Host", httpCtx.Request.Host.Value);
                    diagCtx.Set("ContentLength", httpCtx.Response.ContentLength?.ToString() ?? string.Empty);
                    diagCtx.Set("Protocol", httpCtx.Request.Protocol);
                    diagCtx.Set("Scheme", httpCtx.Request.Scheme);
                };
            });

            return applicationBuilder;
        }

        private static LogEventLevel ExcludeHealthChecks(HttpContext ctx, double _, Exception ex)
        {
            if (ex != null || ctx.Response.StatusCode >= (int)HttpStatusCode.InternalServerError) return LogEventLevel.Error;
            return ctx.Request.Path.StartsWithSegments("/hc", StringComparison.InvariantCultureIgnoreCase)
                    ? LogEventLevel.Verbose
                    : LogEventLevel.Information;
        }

        public static IServiceCollection AddOpenTelemetry(this IServiceCollection services, string appName)
        {
            //services.AddOpenTelemetryTracing(builder =>
            //{
            //    builder
            //        .AddConsoleExporter()
            //        .AddSource(appName)
            //        .SetResourceBuilder(ResourceBuilder
            //            .CreateDefault()
            //            .AddService(serviceName: appName, serviceVersion: Environment.GetEnvironmentVariable("VERSION")))
            //        .AddHttpClientInstrumentation()
            //        .AddAspNetCoreInstrumentation()
            //        .AddGrpcCoreInstrumentation()
            //        .AddGrpcClientInstrumentation()
            //        .AddRedisInstrumentation()
            //        .AddConsoleExporter();
            //});

            //services.AddSingleton(TracerProvider.Default.GetTracer(appName));

            var listener = new SerilogTraceListener.SerilogTraceListener();
            Trace.Listeners.Add(listener);

            return services;
        }
    }
}
