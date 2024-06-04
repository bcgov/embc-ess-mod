using System;
using System.Collections.Generic;
using System.Linq;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe.SupportCreationStrategies;

internal class ClothingStrategy : ISelfServeSupportCreationStrategy<SelfServeClothingSupport>
{
    private static SelfServeClothingSupport Create(IEnumerable<SelfServeHouseholdMember> householdMembers)
    {
        var support = new SelfServeClothingSupport
        {
            IncludedHouseholdMembers = householdMembers.Select(hm => hm.Id).ToList(),
            TotalAmount = 0d
        };
        support.TotalAmount = CalculateSelfServeSupportAmount(support);
        return support;
    }

    private static double CalculateSelfServeSupportAmount(SelfServeClothingSupport support) => 150 * support.IncludedHouseholdMembers.Count();

    public SelfServeClothingSupport Create(CreateSelfServeSupport cmd) => Create(cmd.HouseholdMembers);

    public SelfServeClothingSupport Evaluate(SelfServeClothingSupport support)
    {
        support.TotalAmount = CalculateSelfServeSupportAmount(support);
        return support;
    }

    public bool Validate(SelfServeClothingSupport support) => support.TotalAmount > 0 && support.IncludedHouseholdMembers.Any();
}
