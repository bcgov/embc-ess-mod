using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts;
using EMBC.Utilities.Telemetry;
using Microsoft.Extensions.Logging;

namespace EMBC.Utilities.Messaging
{
    public interface IMessagingClient
    {
        Task<TResponse?> Send<TResponse>(Query<TResponse> command);

        Task<string?> Send(Command command);
    }

    internal class MessagingClient : IMessagingClient
    {
        private readonly Dispatcher.DispatcherClient dispatcherClient;
        private readonly ITelemetryProvider telemetryProvider;

        public MessagingClient(Dispatcher.DispatcherClient dispatcherClient, ITelemetryProvider telemetryProvider)
        {
            this.dispatcherClient = dispatcherClient;
            this.telemetryProvider = telemetryProvider;
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
