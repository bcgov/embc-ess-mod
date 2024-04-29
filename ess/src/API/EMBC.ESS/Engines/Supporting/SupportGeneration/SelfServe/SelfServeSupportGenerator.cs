using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe
{
    internal class SelfServeSupportGenerator : ISupportGenerationStrategy
    {
        public Task<GenerateResponse> Generate(GenerateRequest request, CancellationToken ct)
        {
            return request switch
            {
                GenerateSelfServeSupports req => Handle(req, ct),
                CalculateSelfServeSupports req => Handle(req, ct),

                _ => throw new NotImplementedException($"{request.GetType().Name}")
            };
        }

        private async Task<GenerateResponse> Handle(CalculateSelfServeSupports req, CancellationToken ct)
        {
            foreach (var item in req.Supports)
            {
                item.TotalAmount = item switch
                {
                    SelfServeClothingSupport s => CalculateSelfServeSupportAmount(s),
                    SelfServeFoodGroceriesSupport s => CalculateSelfServeSupportAmount(s),
                    SelfServeFoodRestaurantSupport s => CalculateSelfServeSupportAmount(s),
                    SelfServeIncidentalsSupport s => CalculateSelfServeSupportAmount(s),
                    SelfServeShelterAllowanceSupport s => CalculateSelfServeSupportAmount(s, req.HouseholdMembersIds),

                    _ => throw new NotImplementedException($"{item.GetType().Name}")
                };
            }

            return await Task.FromResult(new GenerateSelfServeSupportsResponse(req.Supports));
        }

        private async Task<GenerateResponse> Handle(GenerateSelfServeSupports req, CancellationToken ct)
        {
            var householdMembers = req.HouseholdMembersIds.ToArray();
            var days = CalculateSupportDays(req.SupportPeriodFrom, req.SupportPeriodTo).ToArray();
            var supports = req.Needs.Select(n => CreateSupportsForNeed(n, days, householdMembers)).SelectMany(s => s).ToList();
            return await Task.FromResult(new GenerateSelfServeSupportsResponse(supports));
        }

        private static IEnumerable<DateTime> CalculateSupportDays(DateTime from, DateTime to)
        {
            while (from < to)
            {
                yield return from;
                from = from.AddDays(1);
            }
        }

        private static IEnumerable<SelfServeSupport> CreateSupportsForNeed(IdentifiedNeed need, DateTime[] days, IEnumerable<SelfServeHouseholdMember> householdMembers) =>
            need switch
            {
                IdentifiedNeed.Food => [CreateSelfServeFoodGroceriesSupport(days, householdMembers), CreateSelfServeFoodRestaurantSupport(days, householdMembers)],
                IdentifiedNeed.Incidentals => [CreateIncidentalsSupport(householdMembers)],
                IdentifiedNeed.Clothing => [CreateClothingSupport(householdMembers)],
                IdentifiedNeed.ShelterAllowance => [CreateShelterAllowanceSupport(days, householdMembers)],

                _ => throw new NotImplementedException($"{need}")
            };

        private static SelfServeClothingSupport CreateClothingSupport(IEnumerable<SelfServeHouseholdMember> householdMembers)
        {
            var support = new SelfServeClothingSupport
            {
                IncludedHouseholdMembers = householdMembers.Select(hm => hm.Id),
                TotalAmount = 0d
            };
            support.TotalAmount = CalculateSelfServeSupportAmount(support);
            return support;
        }

        private static double CalculateSelfServeSupportAmount(SelfServeClothingSupport support) => 150 * support.IncludedHouseholdMembers.Count();

        private static SelfServeIncidentalsSupport CreateIncidentalsSupport(IEnumerable<SelfServeHouseholdMember> householdMembers)
        {
            var support = new SelfServeIncidentalsSupport()
            {
                IncludedHouseholdMembers = householdMembers.Select(hm => hm.Id),
                TotalAmount = 0d
            };
            support.TotalAmount = CalculateSelfServeSupportAmount(support);
            return support;
        }

        private static double CalculateSelfServeSupportAmount(SelfServeIncidentalsSupport support) => 50 * support.IncludedHouseholdMembers.Count();

        private static SelfServeShelterAllowanceSupport CreateShelterAllowanceSupport(IEnumerable<DateTime> days, IEnumerable<SelfServeHouseholdMember> householdMembers)
        {
            var support = new SelfServeShelterAllowanceSupport { Nights = days.Select(d => new SupportDay(DateOnly.FromDateTime(d), householdMembers.Select(hm => hm.Id))), TotalAmount = 0d };
            support.TotalAmount = CalculateSelfServeSupportAmount(support, householdMembers);
            return support;
        }

        private static double CalculateSelfServeSupportAmount(SelfServeShelterAllowanceSupport support, IEnumerable<SelfServeHouseholdMember> householdMembers)
        {
            var amount = 0d;
            var hmList = householdMembers.ToList();
            foreach (var hmId in support.Nights.SelectMany(d => d.IncludedHouseholdMembers))
            {
                if (amount == 0d)
                {
                    // first occupant
                    amount = 30d;
                    continue;
                }
                var hm = hmList.Find(i => i.Id == hmId)!;
                // adult or minor additional amount
                amount += hm.IsMinor ? 5d : 10d;
            }
            return amount;
        }

        private static SelfServeFoodGroceriesSupport CreateSelfServeFoodGroceriesSupport(DateTime[] days, IEnumerable<SelfServeHouseholdMember> householdMembers)
        {
            var support = new SelfServeFoodGroceriesSupport { Nights = days.Select(d => new SupportDay(DateOnly.FromDateTime(d), householdMembers.Select(hm => hm.Id))), TotalAmount = 0d };
            support.TotalAmount = CalculateSelfServeSupportAmount(support);
            return support;
        }

        private static double CalculateSelfServeSupportAmount(SelfServeFoodGroceriesSupport support) => support.Nights.Aggregate(0d, (amount, night) => amount + night.IncludedHouseholdMembers.Count() * 22.5d);

        private static SelfServeFoodRestaurantSupport CreateSelfServeFoodRestaurantSupport(DateTime[] days, IEnumerable<SelfServeHouseholdMember> householdMembers)
        {
            var support = new SelfServeFoodRestaurantSupport { Meals = CalculateMealPlan(days), IncludedHouseholdMembers = householdMembers.Select(hm => hm.Id), TotalAmount = 0d };
            support.TotalAmount = CalculateSelfServeSupportAmount(support);
            return support;
        }

        private static IEnumerable<SupportDayMeals> CalculateMealPlan(DateTime[] days)
        {
            if (days.Length == 0) yield break;
            // add previous day with no meals if the first eligible day
            // to add - check if task start date allows for the extra day
            if (days[0].Hour <= 11) yield return new SupportDayMeals(DateOnly.FromDateTime(days[0].AddDays(-1)), false, false, false);
            foreach (var day in days)
            {
                var breakfast = day.Hour >= 1 && day.Hour <= 11;
                var lunch = day.Hour > 11 && day.Hour <= 15;
                var dinner = day.Hour > 15 && day.AddDays(1).Hour < 1;
                yield return new SupportDayMeals(DateOnly.FromDateTime(day), breakfast, lunch, dinner);
            }
        }

        private static double CalculateSelfServeSupportAmount(SelfServeFoodRestaurantSupport support)
        {
            var numberOfHouseholdMembers = support.IncludedHouseholdMembers.Count();
            var amount = 0d;
            foreach (var meal in support.Meals)
            {
                if (meal.Breakfast) amount += 12.75d * numberOfHouseholdMembers;
                if (meal.Lunch) amount += 14.75d * numberOfHouseholdMembers;
                if (meal.Dinner) amount += 25.50d * numberOfHouseholdMembers;
            }
            return amount;
        }
    }
}