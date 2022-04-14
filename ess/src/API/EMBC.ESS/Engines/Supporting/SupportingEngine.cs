using System;
using System.Threading.Tasks;
using EMBC.ESS.Engines.Supporting.PaymentGeneration;
using EMBC.ESS.Engines.Supporting.SupportCompliance;
using EMBC.ESS.Engines.Supporting.SupportGeneration;
using EMBC.ESS.Engines.Supporting.SupportProcessing;

namespace EMBC.ESS.Engines.Supporting
{
    internal class SupportingEngine : ISupportingEngine
    {
        private readonly SupportProcessingStrategyFactory supportProcessingStrategyFactory;
        private readonly SupportGenerationStrategyStragetyFactory supportGenerationStrategyStragetyFactory;
        private readonly SupportComplianceStrategyFactory supportComplianceStrategyFactory;
        private readonly PaymentGenerationStrategyFactory paymentGenerationStrategyFactory;

        public SupportingEngine(
            SupportProcessingStrategyFactory supportProcessingStrategyFactory,
            SupportGenerationStrategyStragetyFactory supportGenerationStrategyStragetyFactory,
            SupportComplianceStrategyFactory supportComplianceStrategyFactory,
            PaymentGenerationStrategyFactory paymentGenerationStrategyFactory)
        {
            this.supportProcessingStrategyFactory = supportProcessingStrategyFactory;
            this.supportGenerationStrategyStragetyFactory = supportGenerationStrategyStragetyFactory;
            this.supportComplianceStrategyFactory = supportComplianceStrategyFactory;
            this.paymentGenerationStrategyFactory = paymentGenerationStrategyFactory;
        }

        public async Task<GenerateResponse> Generate(GenerateRequest request) =>
            request switch
            {
                GenerateReferralsRequest r => await supportGenerationStrategyStragetyFactory.Create(SupportGenerationStrategyType.Pdf).Generate(r),
                GeneratePaymentsRequest r => await paymentGenerationStrategyFactory.Create().GeneratePayments(r),

                _ => throw new NotImplementedException(request.GetType().Name)
            };

        public async Task<ProcessResponse> Process(ProcessRequest request) =>
            request switch
            {
                ProcessDigitalSupportsRequest r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.Digital).Process(r),
                ProcessPaperSupportsRequest r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.Paper).Process(r),

                _ => throw new NotImplementedException(request.GetType().Name)
            };

        public async Task<ValidationResponse> Validate(ValidationRequest request) =>
            request switch
            {
                DigitalSupportsValidationRequest r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.Digital).Validate(r),
                PaperSupportsValidationRequest r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.Paper).Validate(r),
                CheckSupportComplianceRequest r => await supportComplianceStrategyFactory.Create().CheckCompliance(r),

                _ => throw new NotImplementedException(request.GetType().Name)
            };
    }
}
