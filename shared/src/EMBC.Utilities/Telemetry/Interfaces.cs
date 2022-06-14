using System;

namespace EMBC.Utilities.Telemetry
{
    public interface ITelemetryProvider
    {
        ITelemetryReporter Get<TCategory>();

        ITelemetryReporter Get(string category);
    }

    public interface ITelemetryReporter
    {
        void Report(ReportType reportType, string template, Exception? e = null, params object?[] args);
    }

    public enum ReportType
    {
        Debug,
        Info,
        Warning,
        Error,
        Event
    }

    public static class ITelemetryReporterEx
    {
        public static void LogInformation(this ITelemetryReporter reporter, string message, params object?[] args)
        {
            reporter.Report(ReportType.Info, message, null, args);
        }

        public static void LogWarning(this ITelemetryReporter reporter, string message, params object?[] args)
        {
            reporter.Report(ReportType.Warning, message, null, args);
        }

        public static void LogError(this ITelemetryReporter reporter, Exception e, string message, params object?[] args)
        {
            reporter.Report(ReportType.Error, message, e, args);
        }

        public static void LogError(this ITelemetryReporter reporter, string message, params object?[] args)
        {
            reporter.Report(ReportType.Error, message, null, args);
        }

        public static void LogDebug(this ITelemetryReporter reporter, string message, params object?[] args)
        {
            reporter.Report(ReportType.Debug, message, null, args);
        }

        public static void Enrich(this ITelemetryReporter reporter, string message, params object?[] args)
        {
            reporter.Report(ReportType.Event, message, null, args);
        }
    }
}
