using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BCeIDService;
using EMBC.ESS.Utilities.BceidWS;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Teams;

public class UserRepository(
    BCeIDServiceSoap bceidWebServiceClient,
    IBCeIDServiceSecurityContextProvider securityContextProvider,
    IEssContextFactory essContextFactory) : IUserRepository
{
    private readonly BCeIDServiceSoap bceidWebServiceClient = bceidWebServiceClient;
    private readonly IBCeIDServiceSecurityContextProvider securityContextProvider = securityContextProvider;

    public async Task<UserQueryResponse> Query(UserQuery query, CancellationToken ct = default)
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

    public async Task RecordAccessAudit(AccessAuditEntry auditEntry, CancellationToken ct = default)
    {
        var ctx = essContextFactory.Create();
        var user = await ctx.era_essteamusers.Where(u => u.era_essteamuserid == Guid.Parse(auditEntry.TeamMemberId)).SingleOrDefaultAsync(ct);
        if (user == null) throw new InvalidOperationException($"Team member {auditEntry.TeamMemberId} not found");

        var file = auditEntry.EvacuationFileId == null ? null : await ctx.era_evacuationfiles.Where(f => f.era_name == auditEntry.EvacuationFileId).SingleOrDefaultAsync(ct);
        var registrant = auditEntry.RegistrantId == null ? null : await ctx.contacts.Where(c => c.contactid == Guid.Parse(auditEntry.RegistrantId)).SingleOrDefaultAsync(ct);

        var auditRecord = new era_portalaccessauditlogs
        {
            era_portalaccessauditlogsid = Guid.NewGuid(),
            era_fileaccessreason = auditEntry.AccessReason,
        };
        ctx.AddToera_portalaccessauditlogses(auditRecord);
        if (file != null) ctx.SetLink(auditRecord, nameof(era_portalaccessauditlogs.era_ESSFileNumber), file);
        if (registrant != null) ctx.SetLink(auditRecord, nameof(era_portalaccessauditlogs.era_EvacueeProfile), registrant);
        ctx.SetLink(auditRecord, nameof(era_portalaccessauditlogs.era_Responder), user);

        await ctx.SaveChangesAsync(ct);
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
