using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using EMBC.Utilities.Extensions;
using Microsoft.OData.Client;

namespace EMBC.ESS.Engines.Supporting.SupportCompliance
{
    internal class DuplicateSupportComplianceCheck(IEssContextFactory essContextFactory) : ISupportComplianceCheck
    {
        public async Task<IEnumerable<SupportFlag>> CheckCompliance(Support support, CancellationToken ct)
        {
            if (support.Id == null) throw new ArgumentNullException(nameof(support.Id));

            var ctx = essContextFactory.CreateReadOnly();

            var checkedSupport = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(s => s.era_name == support.Id)).SingleOrDefaultAsync(ct));
            if (checkedSupport == null) throw new ArgumentException($"Support {support.Id} not found", nameof(support));

            ctx.AttachTo(nameof(ctx.era_evacueesupports), checkedSupport);
            await ctx.LoadPropertyAsync(checkedSupport, nameof(era_evacueesupport.era_era_householdmember_era_evacueesupport), ct);
            ctx.Detach(checkedSupport);

            var from = checkedSupport.era_validfrom.Value;
            var to = checkedSupport.era_validto.Value;
            var type = checkedSupport.era_supporttype.Value;
            var householdMembers = checkedSupport.era_era_householdmember_era_evacueesupport.ToList();

            var similarSupportTypes = SimilarSupportTypes(Enum.Parse<SupportType>(type.ToString())).Cast<int>().ToArray();

            var duplicateSupports = (await householdMembers
                .SelectManyAsync(async hm => await GetDuplicateSupportsForHouseholdMember(ctx, support, hm, similarSupportTypes, from, to, ct)))
                .DistinctBy(s => s.era_name).ToList();

            var duplicates = duplicateSupports.Select(s => new DuplicateSupportFlag { DuplicatedSupportId = s.era_name }).ToList();

            ctx.DetachAll();

            return duplicates;
        }

        private static async Task<IEnumerable<era_evacueesupport>> GetDuplicateSupportsForHouseholdMember(EssContext ctx, Support support, era_householdmember hm, int[] similarSupportTypes, DateTimeOffset from, DateTimeOffset to, CancellationToken ct)
        {
            return await ctx.era_evacueesupports
                .WhereIn(s => s.era_supporttype.Value, similarSupportTypes)
                .WhereNotIn(s => s.statuscode.Value, [(int)Resources.Supports.SupportStatus.Cancelled, (int)Resources.Supports.SupportStatus.Void])
                .Where(s => s.era_name != support.Id)
                .Where(s =>
                        s.era_era_householdmember_era_evacueesupport.Any(h => h.era_dateofbirth == hm.era_dateofbirth && h.era_firstname == hm.era_firstname && h.era_lastname == hm.era_lastname) &&
                        ((s.era_validfrom >= from && s.era_validfrom <= to) || (s.era_validto >= from && s.era_validto <= to) || (s.era_validfrom < from && s.era_validto > to)))
            .GetAllPagesAsync(ct);
        }

        private static SupportType[] SimilarSupportTypes(SupportType type) =>
            type switch
            {
                SupportType.Food_Groceries or SupportType.Food_Restaurant => [SupportType.Food_Groceries, SupportType.Food_Restaurant],
                SupportType.Lodging_Group or SupportType.Lodging_Billeting or SupportType.Lodging_Hotel or SupportType.Lodging_Shelter => [SupportType.Lodging_Group, SupportType.Lodging_Billeting, SupportType.Lodging_Hotel, SupportType.Lodging_Shelter],
                SupportType.Transportation_Other or SupportType.Transportation_Taxi => [SupportType.Transportation_Other, SupportType.Transportation_Taxi],

                _ => [type]
            };

        private enum SupportType
        {
            Food_Groceries = 174360000,
            Food_Restaurant = 174360001,
            Lodging_Hotel = 174360002,
            Lodging_Billeting = 174360003,
            Lodging_Group = 174360004,
            Incidentals = 174360005,
            Clothing = 174360006,
            Transportation_Taxi = 174360007,
            Transportation_Other = 174360008,
            Lodging_Shelter = 174360009,
        }
    }
}
