using System;
using System.Collections.Generic;
using System.Linq;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe.SupportCreationStrategies;

internal class IncidentalsStrategy : ISelfServeSupportCreationStrategy<SelfServeIncidentalsSupport>
{
    private static SelfServeIncidentalsSupport Create(IEnumerable<SelfServeHouseholdMember> householdMembers)
    {
        var support = new SelfServeIncidentalsSupport()
        {
            IncludedHouseholdMembers = householdMembers.Select(hm => hm.Id).ToList(),
            TotalAmount = 0d
        };
        support.TotalAmount = CalculateSelfServeSupportAmount(support);
        return support;
    }

    private static double CalculateSelfServeSupportAmount(SelfServeIncidentalsSupport support) => 50 * support.IncludedHouseholdMembers.Count();

    public SelfServeIncidentalsSupport Create(CreateSelfServeSupport cmd) => Create(cmd.HouseholdMembers);

    public SelfServeIncidentalsSupport Evaluate(SelfServeIncidentalsSupport support)
    {
        support.TotalAmount = CalculateSelfServeSupportAmount(support);
        return support;
    }

    public bool Validate(SelfServeIncidentalsSupport support) => support.TotalAmount > 0 && support.IncludedHouseholdMembers.Any();
}
