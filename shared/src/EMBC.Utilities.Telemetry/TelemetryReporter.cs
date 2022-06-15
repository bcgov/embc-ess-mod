using System;
using Serilog;
using Serilog.Events;

namespace EMBC.Utilities.Telemetry
{
    internal class TelemetryReporter : ITelemetryReporter
    {
        private readonly IDiagnosticContext diagnosticContext;
        private readonly ILogger logger;

        public TelemetryReporter(IDiagnosticContext diagnosticContext, ILogger logger)
        {
            this.diagnosticContext = diagnosticContext;
            this.logger = logger;
        }

        public void Report(ReportType reportType, string template, Exception? e = null, params object?[] args)
        {
            switch (reportType)
            {
                case ReportType.Debug when logger.IsEnabled(LogEventLevel.Debug):
                    Log(LogEventLevel.Debug, template, e, args);
                    break;

                case ReportType.Info when logger.IsEnabled(LogEventLevel.Information):
                    Log(LogEventLevel.Information, template, e, args);
                    break;

                case ReportType.Warning when logger.IsEnabled(LogEventLevel.Warning):
                    Log(LogEventLevel.Warning, template, e, args);
                    break;

                case ReportType.Error when logger.IsEnabled(LogEventLevel.Error):
                    Log(LogEventLevel.Error, template, e, args);
                    break;

                case ReportType.Event:
                    Report(reportType, template, args);
                    break;

                default:
                    break;
            }
        }

        private void Report(ReportType logLevel, string template, params object?[] args) => diagnosticContext.Set($"{logLevel}", string.Format(template, args));

        private void Log(LogEventLevel level, string template, Exception? e, params object?[] args) => logger.Write(level, e, template, args);
    }
}
