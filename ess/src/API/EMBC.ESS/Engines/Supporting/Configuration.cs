using EMBC.ESS.Engines.Supporting.PaymentGeneration;
using EMBC.ESS.Engines.Supporting.SupportCompliance;
using EMBC.ESS.Engines.Supporting.SupportGeneration;
using EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting;
using EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe;
using EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe.SupportCreationStrategies;
using EMBC.ESS.Engines.Supporting.SupportProcessing;
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Engines.Supporting;

public class Configuration : IConfigureComponentServices
{
    public void ConfigureServices(ConfigurationServices configurationServices)
    {
        configurationServices.Services
            .AddTransient<ISupportingEngine, SupportingEngine>()
            .AddTransient<SupportProcessingStrategyFactory>()
            .AddTransient<DigitalSupportProcessingStrategy>()
            .AddTransient<PaperSupportProcessingStrategy>()
            .AddTransient<SupportGenerationStrategyStrategyFactory>()
            .AddTransient<SingleDocumentStrategy>()
            .AddTransient<SupportComplianceStrategyFactory>()
            .AddTransient<ISupportComplianceCheck, DuplicateSupportComplianceCheck>()
            .AddTransient<ISupportComplianceCheck, AmountExceededSupportComplianceCheck>()
            .AddTransient<PaymentGenerationStrategyFactory>()
            .AddTransient<SelfServeSupportEligibilityStrategy>()
            .AddTransient<SelfServeSupportGenerator>()
            .AddTransient<SelfServeEtransferGenerator>()
            .AddTransient<ISelfServeSupportCreationStrategy, SelfServeSupportCreationStrategy>()
            ;
    }
}
