using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Engines.Supporting.SupportProcessing;

internal interface ISupportProcessingStrategy
{
    Task<ProcessResponse> Process(ProcessRequest request, CancellationToken ct);

    Task<ValidationResponse> Validate(ValidationRequest request, CancellationToken ct);
}

internal class SupportProcessingStrategyFactory
{
    private readonly IServiceProvider services;

    public SupportProcessingStrategyFactory(IServiceProvider services)
    {
        this.services = services;
    }

    public ISupportProcessingStrategy Create(SupportProcessingStrategyType type) => type switch
    {
        SupportProcessingStrategyType.Digital => services.GetRequiredService<DigitalSupportProcessingStrategy>(),
        SupportProcessingStrategyType.Paper => services.GetRequiredService<PaperSupportProcessingStrategy>(),
        SupportProcessingStrategyType.SelfServe => services.GetRequiredService<SelfServeSupportEligibilityStrategy>(),
        SupportProcessingStrategyType.Eligibility => services.GetRequiredService<SelfServeSupportEligibilityStrategy>(),

        _ => throw new NotImplementedException($"{type}")
    };
}

internal enum SupportProcessingStrategyType
{
    Digital,
    Paper,
    SelfServe,
    Eligibility
}
