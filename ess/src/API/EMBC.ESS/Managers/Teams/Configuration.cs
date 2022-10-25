using EMBC.Utilities.Configuration;
using EMBC.Utilities.Messaging;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Managers.Teams
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddTransient<TeamsManager>();
            configurationServices.Services.Configure<HandlerRegistry>(opts => opts.AddAllHandlersFrom(typeof(TeamsManager)));
        }
    }
}
