using System;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Notifications.Channels;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Utilities.Notifications
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var services = configurationServices.Services;
            var configuration = configurationServices.Configuration;

            services.Configure<EmailChannelOptions>(opts => configuration.GetSection("notifications:email").Bind(opts));
            services.AddTransient<Email>();

            // runtime channel resolver
            services.AddTransient<Func<Type, INotificationChannel>>(sp => (type) => type.Name switch
            {
                nameof(EmailNotification) => sp.GetRequiredService<Email>(),
                _ => throw new NotSupportedException($"{type} is not a configured notification channel")
            });

            services.AddTransient<INotificationSender, NotificationSender>();
        }
    }
}
