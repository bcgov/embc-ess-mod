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
using System.Threading.Tasks;
using BCeIDService;
using EMBC.ESS.Utilities.BceidWS;

namespace EMBC.ESS.Resources.Team
{
    public class UserRepository : IUserRepository
    {
        private readonly BCeIDServiceSoap bceidWebServiceClient;
        private readonly IBCeIDServiceSecurityContextProvider securityContextProvider;

        public UserRepository(BCeIDServiceSoap bceidWebServiceClient, IBCeIDServiceSecurityContextProvider securityContextProvider)
        {
            this.bceidWebServiceClient = bceidWebServiceClient;
            this.securityContextProvider = securityContextProvider;
        }

        public async Task<UserQueryResponse> Query(UserQuery query)
        {
            var securityContext = securityContextProvider.GetSecurityContext();

            //search business account and if not found basic account
            var account = await GetBceidAccount(securityContext, query.ByBceidUserId, BCeIDAccountTypeCode.Business);
            if (account == null) account = await GetBceidAccount(securityContext, query.ByBceidUserId, BCeIDAccountTypeCode.Individual);

            if (account == null) return new UserQueryResponse();
            return new UserQueryResponse
            {
                Items = new[]
                {
                    new User { Id = account.guid.value, OrgId = account.business.guid.isAllowed ? account.business.guid.value : null }
                }
            };
        }

        private async Task<BCeIDAccount> GetBceidAccount(BCeIDSecurityContext securityContext, string userId, BCeIDAccountTypeCode userType)
        {
            var result = await bceidWebServiceClient.getAccountDetailAsync(new AccountDetailRequest
            {
                onlineServiceId = securityContext.OnlineServiceId,
                requesterAccountTypeCode = securityContext.RequesterBusinessType,
                requesterUserGuid = securityContext.RequesterGuid,
                userId = userId,
                accountTypeCode = userType
            });
            if (result.code == ResponseCode.Failed)
            {
                if (result.failureCode == FailureCode.NoResults) return null;
                throw new Exception($"Failed to call BCeID web service: {result.failureCode}: {result.message}");
            }

            return result.account;
        }
    }
}
