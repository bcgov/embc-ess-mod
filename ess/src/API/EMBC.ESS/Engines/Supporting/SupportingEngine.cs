using System;
using System.Threading.Tasks;
using EMBC.ESS.Engines.Supporting.Strategies;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Engines.Supporting
{
    internal class SupportingEngine : ISupportingEngine
    {
        private readonly SupportingStragetyFactory factory;

        public SupportingEngine(SupportingStragetyFactory factory)
        {
            this.factory = factory;
        }

        public async Task<ProcessResponse> Process(ProcessRequest request)
        {
            return request switch
            {
                ProcessDigitalSupportsRequest r => await factory.Create(ProcessingStragetyType.Digital).Handle(r),
                ProcessPaperSupportsRequest r => await factory.Create(ProcessingStragetyType.Paper).Handle(r),

                _ => throw new NotImplementedException(request.GetType().Name)
            };
        }

        public async Task<ValidationResponse> Validate(ValidationRequest request)
        {
            return request switch
            {
                DigitalSupportsValidationRequest r => await factory.Create(ProcessingStragetyType.Digital).Handle(r),
                PaperSupportsValidationRequest r => await factory.Create(ProcessingStragetyType.Paper).Handle(r),

                _ => throw new NotImplementedException(request.GetType().Name)
            };
        }
    }

    internal class SupportingStragetyFactory
    {
        private IServiceProvider services;

        public SupportingStragetyFactory(IServiceProvider services)
        {
            this.services = services;
        }

        public ISupportProcessingStrategy Create(ProcessingStragetyType type) => type switch
        {
            ProcessingStragetyType.Digital => services.GetRequiredService<DigitalSupportProcessingStrategy>(),
            ProcessingStragetyType.Paper => services.GetRequiredService<PaperSupportProcessingStrategy>(),

            _ => throw new NotImplementedException($"{type}")
        };
    }

    internal enum ProcessingStragetyType
    {
        Digital,
        Paper
    }
}
