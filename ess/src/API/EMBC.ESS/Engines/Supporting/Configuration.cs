using EMBC.ESS.Engines.Supporting.SupportCompliance;
using EMBC.ESS.Engines.Supporting.SupportGeneration;
using EMBC.ESS.Engines.Supporting.SupportProcessing;
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Engines.Supporting
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services
                .AddTransient<ISupportingEngine, SupportingEngine>()
                .AddTransient<SupportProcessingStrategyFactory>()
                .AddTransient<DigitalSupportProcessingStrategy>()
                .AddTransient<PaperSupportProcessingStrategy>()
                .AddTransient<SupportGenerationStrategyStragetyFactory>()
                .AddTransient<SingleDocumentStrategy>()
                .AddTransient<SupportComplianceStrategyFactory>()
                .AddTransient<ISupportComplianceCheck, DuplicateSupportComplianceStrategy>()
                .AddTransient<ISupportComplianceCheck, AmountExceededSupportComplianceStrategy>()
                ;
        }
    }
}
