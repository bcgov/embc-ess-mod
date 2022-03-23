using System;
using System.Threading.Tasks;
using EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting;

namespace EMBC.ESS.Engines.Supporting
{
    internal class SupportingEngine : ISupportingEngine
    {
        private readonly SupportProcessingStrategyFactory supportProcessingStrategyFactory;
        private readonly SupportGenerationStrategyStragetyFactory supportGenerationStrategyStragetyFactory;

        public SupportingEngine(SupportProcessingStrategyFactory supportProcessingStrategyFactory, SupportGenerationStrategyStragetyFactory supportGenerationStrategyStragetyFactory)
        {
            this.supportProcessingStrategyFactory = supportProcessingStrategyFactory;
            this.supportGenerationStrategyStragetyFactory = supportGenerationStrategyStragetyFactory;
        }

        public async Task<GenerateResponse> Generate(GenerateRequest request) =>
            request switch
            {
                GenerateReferralsRequest r => await supportGenerationStrategyStragetyFactory.Create(SupportGenerationStrategyType.Pdf).Handle(r),

                _ => throw new NotImplementedException(request.GetType().Name)
            };

        public async Task<ProcessResponse> Process(ProcessRequest request) =>
            request switch
            {
                ProcessDigitalSupportsRequest r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.Digital).Handle(r),
                ProcessPaperSupportsRequest r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.Paper).Handle(r),

                _ => throw new NotImplementedException(request.GetType().Name)
            };

        public async Task<ValidationResponse> Validate(ValidationRequest request) =>
            request switch
            {
                DigitalSupportsValidationRequest r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.Digital).Handle(r),
                PaperSupportsValidationRequest r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.Paper).Handle(r),

                _ => throw new NotImplementedException(request.GetType().Name)
            };
    }
}
