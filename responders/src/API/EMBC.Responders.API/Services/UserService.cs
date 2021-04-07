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

using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Team;
using EMBC.Responders.API.Utilities;
using Microsoft.Extensions.Logging;

namespace EMBC.Responders.API.Services
{
    public interface IUserService
    {
        Task<ClaimsPrincipal> CreatePrincipalForUser(ClaimsPrincipal tokenPrincipal);
    }

    public class UserService : IUserService
    {
        private readonly IMessagingClient messagingClient;
        private readonly ICache cache;
        private readonly ILogger<UserService> logger;

        public UserService(IMessagingClient messagingClient, ICache cache, ILogger<UserService> logger)
        {
            this.messagingClient = messagingClient;
            this.cache = cache;
            this.logger = logger;
        }

        public async Task<ClaimsPrincipal> CreatePrincipalForUser(ClaimsPrincipal tokenPrincipal)
        {
            var userName = tokenPrincipal.FindFirstValue(ClaimTypes.Upn).Split('@')[0];
            try
            {
                var teamMember = await cache.GetOrAdd($"_{nameof(UserService.CreatePrincipalForUser)}_{userName}", async () => await GetTeamMember(userName), DateTimeOffset.Now.AddMinutes(10));
                if (teamMember == null) return tokenPrincipal;

                var essClaims = new[]
                {
                    new Claim("user_role", teamMember.Role),
                    new Claim("user_team", teamMember.TeamId)
                };
                var principal = new ClaimsPrincipal(new ClaimsIdentity(tokenPrincipal.Identity, tokenPrincipal.Claims.Concat(essClaims)));

                return principal;
            }
            catch (Exception e)
            {
                logger.LogError(e, $"Failed to transform JWT principal for user {userName} to ESS user principal");
                throw;
            }
        }

        private async Task<TeamMember> GetTeamMember(string userName)
        {
            var reply = await messagingClient.Send(new TeamMembersQueryCommand { UserName = userName });
            return reply.TeamMembers.SingleOrDefault();
        }
    }
}
