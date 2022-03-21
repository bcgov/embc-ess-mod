using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Messaging;
using Microsoft.Extensions.Logging;

namespace EMBC.Registrants.API.Services
{
    public interface IProfileInviteService
    {
        Task<bool> ProcessInvite(string inviteId, string loggedInUserId);
    }

    public class ProfileInviteService : IProfileInviteService
    {
        private readonly IMessagingClient messagingClient;
        private readonly ILogger<ProfileInviteService> logger;

        public ProfileInviteService(IMessagingClient messagingClient, ILogger<ProfileInviteService> logger)
        {
            this.messagingClient = messagingClient;
            this.logger = logger;
        }

        public async Task<bool> ProcessInvite(string inviteId, string loggedInUserId)
        {
            try
            {
                await messagingClient.Send(new ProcessRegistrantInviteCommand { InviteId = inviteId, LoggedInUserId = loggedInUserId });
                return true;
            }
            catch (BusinessLogicException e)
            {
                logger.LogError(e, "Invite {0} for user {1}: {2} error", inviteId, loggedInUserId, e.Message);
                return false;
            }
        }
    }
}
