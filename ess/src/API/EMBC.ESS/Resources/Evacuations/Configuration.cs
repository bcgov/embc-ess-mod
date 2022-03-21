using EMBC.Utilities.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Resources.Evacuations
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddTransient<IEvacuationRepository, EvacuationRepository>();
        }
    }
}
