using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace EMBC.ESS.Engines.Supporting.SupportCompliance
{
    internal class DuplicateSupportComplianceCheck : ISupportComplianceCheck
    {
        private readonly IEssContextFactory essContextFactory;

        public DuplicateSupportComplianceCheck(IEssContextFactory essContextFactory)
        {
            this.essContextFactory = essContextFactory;
        }

        public async Task<IEnumerable<SupportFlag>> CheckCompliance(Support support)
        {
            if (support.Id == null) throw new ArgumentNullException(nameof(support.Id));

            var ctx = essContextFactory.CreateReadOnly();

            var checkedSupport = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(s => s.era_name == support.Id)).GetAllPagesAsync()).SingleOrDefault();
            if (checkedSupport == null) throw new ArgumentException($"Support {support.Id} not found", nameof(support));

            ctx.AttachTo(nameof(ctx.era_evacueesupports), checkedSupport);
            await ctx.LoadPropertyAsync(checkedSupport, nameof(era_evacueesupport.era_era_householdmember_era_evacueesupport));

            var from = checkedSupport.era_validfrom.Value;
            var to = checkedSupport.era_validto.Value;
            var type = checkedSupport.era_supporttype.Value;
            var householdMembers = checkedSupport.era_era_householdmember_era_evacueesupport.ToList();

            List<era_evacueesupport> similarSupports;

            //EMBCESSMOD-4653 - treat 'Food - Groceries' and 'Food - Restaurant Meals' as the same support type
            if (type == (int)SupportType.Food_Groceries ||
                    type == (int)SupportType.Food_Restaurant)
            {
                similarSupports = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(s =>
                s.era_name != checkedSupport.era_name && (s.era_supporttype == (int)SupportType.Food_Groceries || s.era_supporttype == (int)SupportType.Food_Restaurant) &&
                s.statuscode.Value != (int)Resources.Supports.SupportStatus.Cancelled && s.statuscode.Value != (int)Resources.Supports.SupportStatus.Void &&
                ((s.era_validfrom >= from && s.era_validfrom <= to) || (s.era_validto >= from && s.era_validto <= to) || (s.era_validfrom < from && s.era_validto > to))))
                .GetAllPagesAsync()).ToList();
            }
            else
            {
                similarSupports = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(s =>
                s.era_name != checkedSupport.era_name && s.era_supporttype == type &&
                s.statuscode.Value != (int)Resources.Supports.SupportStatus.Cancelled && s.statuscode.Value != (int)Resources.Supports.SupportStatus.Void &&
                ((s.era_validfrom >= from && s.era_validfrom <= to) || (s.era_validto >= from && s.era_validto <= to) || (s.era_validfrom < from && s.era_validto > to))))
                .GetAllPagesAsync()).ToList();
            }

            similarSupports.AsParallel().ForAll(s =>
            {
                ctx.AttachTo(nameof(ctx.era_evacueesupports), s);
                ctx.LoadProperty(s, nameof(era_evacueesupport.era_era_householdmember_era_evacueesupport));
                ctx.Detach(s);
            });

            Func<era_householdmember, era_householdmember, bool> householdMemberMatcher = (m1, m2) =>
                m1.era_firstname.Equals(m2.era_firstname, StringComparison.InvariantCultureIgnoreCase) &&
                m1.era_lastname.Equals(m2.era_lastname, StringComparison.InvariantCultureIgnoreCase) &&
                m1.era_dateofbirth.Value.Equals(m2.era_dateofbirth);

            var duplicateSupports = similarSupports
                .Where(s =>
                    s.era_era_householdmember_era_evacueesupport.Any(m => householdMembers.Exists(cm => householdMemberMatcher(cm, m))));

            var duplicates = duplicateSupports.Select(s => new DuplicateSupportFlag { DuplicatedSupportId = s.era_name }).ToList();

            ctx.DetachAll();

            return duplicates;
        }
    }
}
