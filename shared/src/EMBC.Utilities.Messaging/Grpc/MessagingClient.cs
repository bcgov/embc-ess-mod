using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts;
using EMBC.Utilities.Telemetry;

namespace EMBC.Utilities.Messaging.Grpc
{
    internal class MessagingClient : IMessagingClient
    {
        private readonly Dispatcher.DispatcherClient dispatcherClient;
        private readonly ITelemetryProvider telemetryProvider;

        public MessagingClient(Dispatcher.DispatcherClient dispatcherClient, ITelemetryProvider telemetryProvider)
        {
            this.dispatcherClient = dispatcherClient;
            this.telemetryProvider = telemetryProvider;
        }

        public async Task Publish(Event evt)
        {
            var logger = telemetryProvider.Get<MessagingClient>();
            logger.LogDebug("Publishing event {0}", evt.GetType().FullName);
            await dispatcherClient.DispatchAsync<string>(evt);
        }

        public async Task<string?> Send(Command command)
        {
            var logger = telemetryProvider.Get<MessagingClient>();
            logger.LogDebug("Sending command {0}", command.GetType().FullName);
            var response = await dispatcherClient.DispatchAsync<string>(command);
            return response;
        }

        public async Task<TResponse?> Send<TResponse>(Query<TResponse> command)
        {
            var logger = telemetryProvider.Get<MessagingClient>();
            logger.LogDebug("Sending query {0}", command.GetType().FullName);
            var response = await dispatcherClient.DispatchAsync<TResponse>(command);
            return response;
        }
    }
}
