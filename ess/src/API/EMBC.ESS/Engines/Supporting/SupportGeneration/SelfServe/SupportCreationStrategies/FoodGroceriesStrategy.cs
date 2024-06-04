using System;
using System.Collections.Generic;
using System.Linq;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe.SupportCreationStrategies;

internal class FoodGroceriesStrategy : ISelfServeSupportCreationStrategy<SelfServeFoodGroceriesSupport>
{
    private static SelfServeFoodGroceriesSupport Create(DateTime from, DateTime to, IEnumerable<SelfServeHouseholdMember> householdMembers)
    {
        var support = new SelfServeFoodGroceriesSupport
        {
            Nights = CreateSupportDays(from, to).Take(3).ToList(),
            IncludedHouseholdMembers = householdMembers.Select(hm => hm.Id).ToList(),
            TotalAmount = 0d
        };
        support.TotalAmount = CalculateSelfServeSupportAmount(support);
        return support;
    }

    private static double CalculateSelfServeSupportAmount(SelfServeFoodGroceriesSupport support) => support.IncludedHouseholdMembers.Count() * support.Nights.Count() * 22.5d;

    private static IEnumerable<DateOnly> CreateSupportDays(DateTime from, DateTime to)
    {
        while (from.Date <= to.Date)
        {
            yield return DateOnly.FromDateTime(from.Date);
            from = from.AddDays(1);
        }
    }

    public SelfServeFoodGroceriesSupport Create(CreateSelfServeSupport cmd) => Create(cmd.From, cmd.To, cmd.HouseholdMembers);

    public SelfServeFoodGroceriesSupport Evaluate(SelfServeFoodGroceriesSupport support)
    {
        support.TotalAmount = CalculateSelfServeSupportAmount(support);
        return support;
    }

    public bool Validate(SelfServeFoodGroceriesSupport support) => support.TotalAmount > 0 && support.IncludedHouseholdMembers.Any() && support.Nights.Any();
}
