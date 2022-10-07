using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts;

namespace EMBC.Utilities.Messaging
{
    public interface IMessagingClient
    {
        Task<TResponse?> Send<TResponse>(Query<TResponse> command);

        Task<string?> Send(Command command);

        Task Publish(Event evt);
    }
}
