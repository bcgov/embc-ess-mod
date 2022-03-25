using EMBC.Utilities.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Resources.Evacuees
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddTransient<IEvacueesRepository, EvacueesRepository>();
            configurationServices.Services.AddTransient<IInvitationRepository, EvacueesRepository>();
        }
    }
}
