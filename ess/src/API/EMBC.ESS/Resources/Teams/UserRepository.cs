using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Teams;

public class UserRepository(IEssContextFactory essContextFactory) : IUserRepository
{
    public async Task RecordAccessAudit(AccessAuditEntry auditEntry, CancellationToken ct = default)
    {
        var ctx = essContextFactory.Create();
        var user = await ctx.era_essteamusers.Where(u => u.era_essteamuserid == Guid.Parse(auditEntry.TeamMemberId)).SingleOrDefaultAsync(ct);
        if (user == null) throw new InvalidOperationException($"Team member {auditEntry.TeamMemberId} not found");

        var file = auditEntry.EvacuationFileNumber == null ? null : await ctx.era_evacuationfiles.Where(f => f.era_name == auditEntry.EvacuationFileNumber).SingleOrDefaultAsync(ct);
        var registrant = auditEntry.RegistrantId == null ? null : await ctx.contacts.Where(c => c.contactid == Guid.Parse(auditEntry.RegistrantId)).SingleOrDefaultAsync(ct);

        var auditRecord = new era_portalaccessauditlogs
        {
            era_portalaccessauditlogsid = Guid.NewGuid(),
            era_fileaccessreason = auditEntry.AccessReason,
            era_datetimeaccessed = DateTime.UtcNow,
        };
        ctx.AddToera_portalaccessauditlogses(auditRecord);
        if (file != null) ctx.SetLink(auditRecord, nameof(era_portalaccessauditlogs.era_ESSFileNumber), file);
        if (registrant != null) ctx.SetLink(auditRecord, nameof(era_portalaccessauditlogs.era_EvacueeProfile), registrant);
        ctx.SetLink(auditRecord, nameof(era_portalaccessauditlogs.era_Responder), user);

        await ctx.SaveChangesAsync(ct);
    }
}
