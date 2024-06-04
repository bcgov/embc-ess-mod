using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe.SupportCreationStrategies;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe;

internal class SelfServeSupportGenerator(ISelfServeSupportCreationStrategy supportCreationStrategy) : ISupportGenerationStrategy
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
        await Task.CompletedTask;
        var supports = req.Supports.Select(supportCreationStrategy.Evaluate).Where(supportCreationStrategy.Validate);
        return new GenerateSelfServeSupportsResponse(supports);
    }

    private async Task<GenerateResponse> Handle(GenerateSelfServeSupports req, CancellationToken ct)
    {
        await Task.CompletedTask;
        var supports = req.SupportTypes
            .Select(t => supportCreationStrategy.Create(new CreateSelfServeSupport(t, req.HouseholdMembersIds, req.SupportPeriodFrom, req.SupportPeriodTo)))
            .Where(supportCreationStrategy.Validate)
            .ToList();
        return new GenerateSelfServeSupportsResponse(supports);
    }
}
