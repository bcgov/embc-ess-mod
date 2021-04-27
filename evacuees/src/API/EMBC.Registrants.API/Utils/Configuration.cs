using System;
using System.Net.Http;
using EMBC.ESS;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace EMBC.Registrants.API.Utils
{
    public static class MessagingConfiguration
    {
        public static IServiceCollection AddMessaging(this IServiceCollection services)
        {
            var configuration = services.BuildServiceProvider().GetRequiredService<IOptions<MessagingOptions>>().Value;

            var httpClientBuilder = services.AddGrpcClient<Dispatcher.DispatcherClient>(opts =>
            {
                opts.Address = configuration.Url;
            });

            if (configuration.AllowInvalidServerCertificate)
            {
                httpClientBuilder.ConfigurePrimaryHttpMessageHandler(() =>
                {
                    return new HttpClientHandler
                    {
                        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                    };
                });
            }
            services.AddTransient<IMessagingClient, MessagingClient>();
            return services;
        }
    }

    public class MessagingOptions
    {
        public Uri Url { get; set; }

        public bool AllowInvalidServerCertificate { get; set; } = false;
    }
}
