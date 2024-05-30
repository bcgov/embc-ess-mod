using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
                    SelfServeShelterAllowanceSupport s => CalculateSelfServeSupportAmount(s),

                    _ => throw new NotImplementedException($"{item.GetType().Name}")
                };
            }

            return await Task.FromResult(new GenerateSelfServeSupportsResponse(req.Supports));
        }

        private async Task<GenerateResponse> Handle(GenerateSelfServeSupports req, CancellationToken ct)
        {
            var householdMembers = req.HouseholdMembersIds.ToArray();
            var supports = req.SupportTypes.Select(n => CreateSupportsForNeed(n, req.SupportPeriodFrom, req.SupportPeriodTo, householdMembers)).ToList();
            return await Task.FromResult(new GenerateSelfServeSupportsResponse(supports));
        }

        private static IEnumerable<DateOnly> CreateSupportDays(DateTime from, DateTime to)
        {
            while (from.Date < to.Date)
            {
                yield return DateOnly.FromDateTime(from.Date);
                from = from.AddDays(1);
            }
        }

        private static SelfServeSupport CreateSupportsForNeed(SelfServeSupportType type, DateTime from, DateTime to, IEnumerable<SelfServeHouseholdMember> householdMembers) =>
            type switch
            {
                SelfServeSupportType.FoodGroceries => CreateSelfServeFoodGroceriesSupport(from, to, householdMembers),
                SelfServeSupportType.FoodRestaurant => CreateSelfServeFoodRestaurantSupport(from, to, householdMembers),
                SelfServeSupportType.Incidentals => CreateIncidentalsSupport(householdMembers),
                SelfServeSupportType.Clothing => CreateClothingSupport(householdMembers),
                SelfServeSupportType.ShelterAllowance => CreateShelterAllowanceSupport(from, to, householdMembers),

                _ => throw new NotImplementedException($"{type}")
            };

        private static SelfServeClothingSupport CreateClothingSupport(IEnumerable<SelfServeHouseholdMember> householdMembers)
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

        private static SelfServeIncidentalsSupport CreateIncidentalsSupport(IEnumerable<SelfServeHouseholdMember> householdMembers)
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

        private static SelfServeShelterAllowanceSupport CreateShelterAllowanceSupport(DateTime from, DateTime to, IEnumerable<SelfServeHouseholdMember> householdMembers)
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

        private static SelfServeFoodGroceriesSupport CreateSelfServeFoodGroceriesSupport(DateTime from, DateTime to, IEnumerable<SelfServeHouseholdMember> householdMembers)
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

        private static SelfServeFoodRestaurantSupport CreateSelfServeFoodRestaurantSupport(DateTime from, DateTime to, IEnumerable<SelfServeHouseholdMember> householdMembers)
        {
            var support = new SelfServeFoodRestaurantSupport
            {
                Meals = CalculateMealPlan(from, to),
                IncludedHouseholdMembers = householdMembers.Select(hm => hm.Id).ToList(),
                TotalAmount = 0d
            };
            support.TotalAmount = CalculateSelfServeSupportAmount(support);
            return support;
        }

        private static IEnumerable<SupportDayMeals> CalculateMealPlan(DateTime from, DateTime to)
        {
            var meals = new Dictionary<DateOnly, SupportDayMeals>();

            var startingTime = from;
            var endingTime = to;

            // allow previous day dinner if breakfast is selected for first day
            if (startingTime.Hour < 11)
            {
                var prevDay = DateOnly.FromDateTime(from.AddDays(-1));
                meals.Add(prevDay, new SupportDayMeals(prevDay) { Dinner = false });
            }

            while (startingTime < endingTime)
            {
                var day = DateOnly.FromDateTime(startingTime);
                var meal = meals.ContainsKey(day) ? meals[day] : new SupportDayMeals(day);
                switch (startingTime.Hour)
                {
                    case >= 1 and < 11:
                        meal.Breakfast = meals.Values.Count(m => m.Breakfast == true) < 3;
                        startingTime = new DateTime(day, new TimeOnly(11, 1), DateTimeKind.Unspecified);
                        break;

                    case >= 11 and < 15:
                        meal.Lunch = meals.Values.Count(m => m.Lunch == true) < 3;
                        startingTime = new DateTime(day, new TimeOnly(15, 1), DateTimeKind.Unspecified);
                        break;

                    case (>= 15 and <= 24) or (>= 0 and < 1):
                        meal.Dinner = meals.Values.Count(m => m.Dinner == true) < 3;
                        startingTime = new DateTime(day.AddDays(1), new TimeOnly(1, 1), DateTimeKind.Unspecified);
                        break;
                }
                meals[day] = meal;
            }

            return meals.Values;
        }

        private static double CalculateSelfServeSupportAmount(SelfServeFoodRestaurantSupport support)
        {
            var numberOfHouseholdMembers = support.IncludedHouseholdMembers.Count();
            var amount = 0d;
            foreach (var meal in support.Meals)
            {
                if (meal.Breakfast == true) amount += 12.75d * numberOfHouseholdMembers;
                if (meal.Lunch == true) amount += 14.75d * numberOfHouseholdMembers;
                if (meal.Dinner == true) amount += 25.50d * numberOfHouseholdMembers;
            }
            return amount;
        }
    }
}
