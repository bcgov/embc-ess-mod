using System;
using System.Threading.Tasks;
using EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Engines.Supporting
{
    internal interface ISupportGenerationStrategy
    {
        Task<GenerateResponse> Handle(GenerateRequest generateRequest);
    }

    internal class SupportGenerationStrategyStragetyFactory
    {
        private IServiceProvider services;

        public SupportGenerationStrategyStragetyFactory(IServiceProvider services)
        {
            this.services = services;
        }

        public ISupportGenerationStrategy Create(SupportGenerationStrategyType type) => type switch
        {
            SupportGenerationStrategyType.Pdf => services.GetRequiredService<ReferralPrintingStrategy>(),

            _ => throw new NotImplementedException($"{type}")
        };
    }

    internal enum SupportGenerationStrategyType
    {
        Pdf
    }
}
