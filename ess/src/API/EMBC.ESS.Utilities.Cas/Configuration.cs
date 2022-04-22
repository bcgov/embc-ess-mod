using System;
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace EMBC.ESS.Utilities.Cas
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var configuration = configurationServices.Configuration;
            var services = configurationServices.Services;

            services.Configure<CasConfiguration>(opts => configuration.GetSection("CAS").Bind(opts));

            services
                .AddHttpClient("cas", (sp, client) =>
                {
                    var options = sp.GetRequiredService<IOptions<CasConfiguration>>().Value;
                    client.BaseAddress = options.BaseUrl;
                }).SetHandlerLifetime(TimeSpan.FromMinutes(30));

            services.AddTransient<IWebProxy, WebProxy>();
        }
    }

    public class CasConfiguration
    {
        public Uri BaseUrl { get; set; } = null!;
        public string ClientId { get; set; } = null!;
        public string ClientSecret { get; set; } = null!;
    }
}
