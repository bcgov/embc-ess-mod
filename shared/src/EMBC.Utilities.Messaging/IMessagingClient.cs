using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts;

namespace EMBC.Utilities.Messaging
{
    public interface IMessagingClient
    {
        Task<TResponse?> Send<TResponse>(Query<TResponse> command, CancellationToken cancellationToken = default);

        Task<string?> Send(Command command, CancellationToken cancellationToken = default);

        Task Publish(Event evt, CancellationToken cancellationToken = default);
    }
}
