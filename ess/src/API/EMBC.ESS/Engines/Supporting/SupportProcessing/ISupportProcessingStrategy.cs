using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Engines.Supporting.SupportProcessing
{
    internal interface ISupportProcessingStrategy
    {
        Task<ProcessResponse> Process(ProcessRequest request);

        Task<ValidationResponse> Validate(ValidationRequest request);
    }

    internal class SupportProcessingStrategyFactory
    {
        private IServiceProvider services;

        public SupportProcessingStrategyFactory(IServiceProvider services)
        {
            this.services = services;
        }

        public ISupportProcessingStrategy Create(SupportProcessingStrategyType type) => type switch
        {
            SupportProcessingStrategyType.Digital => services.GetRequiredService<DigitalSupportProcessingStrategy>(),
            SupportProcessingStrategyType.Paper => services.GetRequiredService<PaperSupportProcessingStrategy>(),

            _ => throw new NotImplementedException($"{type}")
        };
    }

    internal enum SupportProcessingStrategyType
    {
        Digital,
        Paper
    }
}
