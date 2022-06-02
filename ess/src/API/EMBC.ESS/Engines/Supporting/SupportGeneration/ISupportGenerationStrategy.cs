using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration
{
    internal interface ISupportGenerationStrategy
    {
        Task<GenerateResponse> Generate(GenerateRequest request);
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
            SupportGenerationStrategyType.Pdf => services.GetRequiredService<SingleDocumentStrategy>(),

            _ => throw new NotImplementedException($"{type}")
        };
    }

    internal enum SupportGenerationStrategyType
    {
        Pdf
    }
}
