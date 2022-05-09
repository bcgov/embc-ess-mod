using EMBC.Utilities.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Resources.Payments
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddTransient<IPaymentRepository, PaymentRepository>();
            configurationServices.Services.AddTransient<ICasGateway, CasGateway>();
            configurationServices.Services.AddTransient<ICasSystemConfigurationProvider, CasSystemConfigurationProvider>();
        }
    }
}
