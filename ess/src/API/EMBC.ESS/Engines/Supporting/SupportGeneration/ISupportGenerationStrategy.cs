using System;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting;
using EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration
{
    internal interface ISupportGenerationStrategy
    {
        Task<GenerateResponse> Generate(GenerateRequest request, CancellationToken ct);
    }

    internal class SupportGenerationStrategyStragetyFactory
    {
        private readonly IServiceProvider services;

        public SupportGenerationStrategyStragetyFactory(IServiceProvider services)
        {
            this.services = services;
        }

        public ISupportGenerationStrategy Create(SupportGenerationStrategyType type) => type switch
        {
            SupportGenerationStrategyType.Referral => services.GetRequiredService<SingleDocumentStrategy>(),
            SupportGenerationStrategyType.SelfServe => services.GetRequiredService<SelfServeSupportGenerator>(),

            _ => throw new NotImplementedException($"{type}")
        };
    }

    internal enum SupportGenerationStrategyType
    {
        Referral,
        SelfServe,
    }
}
