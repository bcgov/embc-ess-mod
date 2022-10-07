using EMBC.Utilities.Configuration;
using EMBC.Utilities.Messaging;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Managers.Admin
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.AddTransient<AdminManager>();
            configurationServices.Services.Configure<HandlerRegistry>(opts => opts.AddAllHandlersFrom(typeof(AdminManager)));
        }
    }
}
