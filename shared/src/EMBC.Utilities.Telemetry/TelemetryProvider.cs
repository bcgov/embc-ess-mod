using Serilog;

namespace EMBC.Utilities.Telemetry
{
    public class TelemetryProvider : ITelemetryProvider
    {
        private readonly IDiagnosticContext diagnosticContext;

        public TelemetryProvider(IDiagnosticContext diagnosticContext)
        {
            this.diagnosticContext = diagnosticContext;
        }

        public ITelemetryReporter Get<TCategory>()
        {
            return new TelemetryReporter(diagnosticContext, Log.Logger.ForContext<TCategory>());
        }

        public ITelemetryReporter Get(string category)
        {
            return new TelemetryReporter(diagnosticContext, Log.Logger.ForContext("SourceContext", category));
        }
    }
}
