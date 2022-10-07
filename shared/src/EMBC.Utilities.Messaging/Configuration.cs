using System;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Messaging.Grpc;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Utilities.Messaging
{
    public class Configuration : IConfigureComponentServices, IHaveGrpcServices, IConfigureComponentPipeline
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var options = configurationServices.Configuration.GetSection("messaging").Get<MessagingOptions>() ?? new MessagingOptions() { Mode = MessagingMode.Server };
            configurationServices.Services.Configure<HandlerRegistry>(sp => { });
            Grpc.Configuration.Configure(configurationServices, options);
        }

        public void ConfigurePipeline(PipelineServices services)
        {
            var options = services.Configuration.GetSection("messaging").Get<MessagingOptions>() ?? new MessagingOptions() { Mode = MessagingMode.Server };
            if (options.Mode == MessagingMode.Server || options.Mode == MessagingMode.Both)
            {
                services.Application.UseAuthentication();
                services.Application.UseAuthorization();
            }
        }

        public Type[] GetGrpcServiceTypes()
        {
            return new[] { typeof(DispatcherService) };
        }
    }

    public class MessagingOptions
    {
        public Uri? Url { get; set; }

        public bool AllowInvalidServerCertificate { get; set; } = false;
        public MessagingMode Mode { get; set; } = MessagingMode.Both;
        public bool AuthorizationEnabled { get; set; } = false;
    }

    public enum MessagingMode
    {
        Both,
        Client,
        Server,
    }
}
