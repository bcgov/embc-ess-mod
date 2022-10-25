using System;
using EMBC.ESS.Managers.Events.Notifications;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Messaging;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Managers.Events
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var services = configurationServices.Services;

            services.AddTransient<EventsManager>();
            services.Configure<HandlerRegistry>(opts => opts.AddAllHandlersFrom(typeof(EventsManager)));
            services.AddTransient<EmailTemplateProvider>();
            services.AddTransient<ITemplateProviderResolver>(sp =>
            {
                Func<NotificationChannelType, ITemplateProvider> resolverFunc = (type) => type switch
                {
                    NotificationChannelType.Email => sp.GetRequiredService<EmailTemplateProvider>(),
                    _ => throw new NotImplementedException($"No template provider was registered for {type}")
                };
                return new TemplateProviderResolver(resolverFunc);
            });
        }
    }
}
