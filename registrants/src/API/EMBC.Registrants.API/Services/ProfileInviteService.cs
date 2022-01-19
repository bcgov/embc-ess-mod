// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Submissions;
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
