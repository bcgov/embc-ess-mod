using System;
using System.Collections;
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
                item.TotalAmount = 100d;
            }
            return await Task.FromResult(new GenerateSelfServeSupportsResponse(req.Supports));
        }

        private async Task<GenerateResponse> Handle(GenerateSelfServeSupports req, CancellationToken ct)
        {
            var householdMembers = req.HouseholdMembersIds.ToArray();
            var days = CalculateSupportDays(req.From, req.To);
            var supports = new List<SelfServeSupport>();
            foreach (var need in req.Needs)
            {
                supports.AddRange(CreateSupportForNeed(need, days, householdMembers));
            }

            return await Task.FromResult(new GenerateSelfServeSupportsResponse(supports));
        }

        private static IEnumerable<DateOnly> CalculateSupportDays(DateTimeOffset from, DateTimeOffset to)
        {
            while (from < to)
            {
                yield return DateOnly.FromDateTime(from.Date);
                from = from.AddDays(1);
            }
        }

        private static IEnumerable<SelfServeSupport> CreateSupportForNeed(IdentifiedNeed need, IEnumerable<DateOnly> days, IEnumerable<string> householdMembers) =>
         need switch
         {
             IdentifiedNeed.Food =>
                new SelfServeSupport[]
                {
                    new SelfServeFoodGroceriesSupport { Nights = days.Select(d=> new SupportDay(d,householdMembers)), TotalAmount = 0},
                    new SelfServeFoodRestaurantSupport
                    {
                        IncludedHouseholdMembers = householdMembers,
                        Meals = days.Select(d=>new SupportDayMeals(d, true, true, true)),
                        TotalAmount = 100d,
                    }
                },

             IdentifiedNeed.Incidentals => [new SelfServeIncidentalsSupport { IncludedHouseholdMembers = householdMembers, TotalAmount = 100d }],
             IdentifiedNeed.Clothing => [new SelfServeClothingSupport { IncludedHouseholdMembers = householdMembers, TotalAmount = 100d }],
             IdentifiedNeed.ShelterAllowance => [new SelfServeShelterAllowanceSupport { Nights = days.Select(d => new SupportDay(d, householdMembers)), TotalAmount = 100d }],

             _ => throw new NotImplementedException($"{need.GetType().Name}")
         };

         private static void CalculateAmount(SelfServeFoodGroceriesSupport support){
             support.TotalAmount = 100d;
         }
    }
}
