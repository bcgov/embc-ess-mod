using System;
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
                item.TotalAmount = 100d;
            }
            return await Task.FromResult(new GenerateSelfServeSupportsResponse(req.Supports));
        }

        private async Task<GenerateResponse> Handle(GenerateSelfServeSupports req, CancellationToken ct)
        {
            var householdMembers = req.HouseholdMembersIds.ToArray();
            DateOnly[] days = [DateOnly.FromDateTime(req.From.Date), DateOnly.FromDateTime(DateTime.Now.AddDays(1)), DateOnly.FromDateTime(DateTime.Now.AddDays(2))];
            var supports = new SelfServeSupport[]
            {
                new SelfServeClothingSupport { IncludedHouseholdMembers = householdMembers, TotalAmount = 100d },
                new SelfServeFoodGroceriesSupport { Nights = days.Select(d=>new SupportDay(d,householdMembers)), TotalAmount = 100d },
                new SelfServeFoodRestaurantSupport { IncludedHouseholdMembers = householdMembers, TotalAmount = 100d },
                new SelfServeIncidentalsSupport { IncludedHouseholdMembers = householdMembers, TotalAmount = 100d },
                new SelfServeShelterAllowanceSupport { Nights = days.Select(d=>new SupportDay(d,householdMembers)), TotalAmount = 100d },
            };

            return await Task.FromResult(new GenerateSelfServeSupportsResponse(supports));
        }
    }
}
