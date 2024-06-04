using System;
using System.Collections.Generic;
using System.Linq;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe.SupportCreationStrategies;

internal class ShelterAllowanceStrategy : ISelfServeSupportCreationStrategy<SelfServeShelterAllowanceSupport>
{
    private static SelfServeShelterAllowanceSupport Create(DateTime from, DateTime to, IEnumerable<SelfServeHouseholdMember> householdMembers)
    {
        var support = new SelfServeShelterAllowanceSupport
        {
            Nights = CreateSupportDays(from, to).Take(3).ToList(),
            IncludedHouseholdMembers = householdMembers.Select(hm => hm.Id).ToList(),
            TotalAmount = 0d
        };
        support.TotalAmount = CalculateSelfServeSupportAmount(support);
        return support;
    }

    private static double CalculateSelfServeSupportAmount(SelfServeShelterAllowanceSupport support) => support.IncludedHouseholdMembers.Any() ? 200d * support.Nights.Count() : 0d;

    private static IEnumerable<DateOnly> CreateSupportDays(DateTime from, DateTime to)
    {
        while (from.Date <= to.Date)
        {
            yield return DateOnly.FromDateTime(from.Date);
            from = from.AddDays(1);
        }
    }

    public SelfServeShelterAllowanceSupport Create(CreateSelfServeSupport cmd) => Create(cmd.From, cmd.To, cmd.HouseholdMembers);

    public SelfServeShelterAllowanceSupport Evaluate(SelfServeShelterAllowanceSupport support)
    {
        support.TotalAmount = CalculateSelfServeSupportAmount(support);
        return support;
    }

    public bool Validate(SelfServeShelterAllowanceSupport support) => support.TotalAmount > 0 && support.IncludedHouseholdMembers.Any() && support.Nights.Any();
}
