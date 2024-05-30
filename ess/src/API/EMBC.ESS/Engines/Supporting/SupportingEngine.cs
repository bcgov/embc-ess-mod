using System;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Engines.Supporting.PaymentGeneration;
using EMBC.ESS.Engines.Supporting.SupportCompliance;
using EMBC.ESS.Engines.Supporting.SupportGeneration;
using EMBC.ESS.Engines.Supporting.SupportProcessing;

namespace EMBC.ESS.Engines.Supporting;

internal class SupportingEngine : ISupportingEngine
{
    private readonly SupportProcessingStrategyFactory supportProcessingStrategyFactory;
    private readonly SupportGenerationStrategyStrategyFactory supportGenerationStrategyStragetyFactory;
    private readonly SupportComplianceStrategyFactory supportComplianceStrategyFactory;
    private readonly PaymentGenerationStrategyFactory paymentGenerationStrategyFactory;

    public SupportingEngine(
        SupportProcessingStrategyFactory supportProcessingStrategyFactory,
        SupportGenerationStrategyStrategyFactory supportGenerationStrategyStrategyFactory,
        SupportComplianceStrategyFactory supportComplianceStrategyFactory,
        PaymentGenerationStrategyFactory paymentGenerationStrategyFactory)
    {
        this.supportProcessingStrategyFactory = supportProcessingStrategyFactory;
        this.supportGenerationStrategyStragetyFactory = supportGenerationStrategyStrategyFactory;
        this.supportComplianceStrategyFactory = supportComplianceStrategyFactory;
        this.paymentGenerationStrategyFactory = paymentGenerationStrategyFactory;
    }

    public async Task<GenerateResponse> Generate(GenerateRequest request, CancellationToken ct = default) =>
        request switch
        {
            GenerateReferralsRequest r => await supportGenerationStrategyStragetyFactory.Create(SupportGenerationStrategyType.Referral).Generate(r, ct),
            GeneratePaymentsRequest r => await paymentGenerationStrategyFactory.Create().GeneratePayments(r),
            GenerateSelfServeSupports r => await supportGenerationStrategyStragetyFactory.Create(SupportGenerationStrategyType.SelfServeDraft).Generate(r, ct),
            CalculateSelfServeSupports r => await supportGenerationStrategyStragetyFactory.Create(SupportGenerationStrategyType.SelfServeDraft).Generate(r, ct),
            GenerateSelfServeETransferSupports r => await supportGenerationStrategyStragetyFactory.Create(SupportGenerationStrategyType.SelfServeETransfer).Generate(r, ct),
            _ => throw new NotImplementedException(request.GetType().Name)
        };

    public async Task<ProcessResponse> Process(ProcessRequest request, CancellationToken ct = default) =>
        request switch
        {
            ProcessDigitalSupportsRequest r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.Digital).Process(r, ct),
            ProcessPaperSupportsRequest r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.Paper).Process(r, ct),

            _ => throw new NotImplementedException(request.GetType().Name)
        };

    public async Task<ValidationResponse> Validate(ValidationRequest request, CancellationToken ct = default) =>
        request switch
        {
            DigitalSupportsValidationRequest r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.Digital).Validate(r, ct),
            PaperSupportsValidationRequest r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.Paper).Validate(r, ct),
            CheckSupportComplianceRequest r => await supportComplianceStrategyFactory.Create().CheckCompliance(r),
            ValidateSelfServeSupportsEligibility r => await supportProcessingStrategyFactory.Create(SupportProcessingStrategyType.SelfServe).Validate(r, ct),

            _ => throw new NotImplementedException(request.GetType().Name)
        };
}
