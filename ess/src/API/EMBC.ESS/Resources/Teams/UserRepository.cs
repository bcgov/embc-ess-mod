using System;
using System.Threading.Tasks;
using BCeIDService;
using EMBC.ESS.Utilities.BceidWS;

namespace EMBC.ESS.Resources.Teams
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
                throw new InvalidOperationException($"Failed to call BCeID web service: {result.failureCode}: {result.message}");
            }

            return result.account;
        }
    }
}
