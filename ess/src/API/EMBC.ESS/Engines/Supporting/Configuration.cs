using EMBC.ESS.Engines.Supporting.Strategies;
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
                .AddTransient<SupportingStragetyFactory>()
                .AddTransient<DigitalSupportProcessingStrategy>()
                .AddTransient<PaperSupportProcessingStrategy>()
                ;
        }
    }
}
