using System.ServiceModel;
using BCeIDService;
using EMBC.ESS.Utilities.BceidWS;
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace EMBC.ESS.Resources.Teams
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var services = configurationServices.Services;
            var configuration = configurationServices.Configuration;

            services.Configure<BCeIDWebServiceOptions>(configuration.GetSection("bceidWebService"));
            services.AddTransient<IBCeIDServiceSecurityContextProvider, BCeIDServiceSecurityContextProvider>();
            services.AddScoped<BCeIDServiceSoap>(sp =>
            {
                var options = sp.GetRequiredService<IOptions<BCeIDWebServiceOptions>>().Value;
                var client = new BCeIDServiceSoapClient(new BasicHttpBinding()
                {
                    Security = new BasicHttpSecurity
                    {
                        Transport = new HttpTransportSecurity { ClientCredentialType = HttpClientCredentialType.Basic },
                        Mode = BasicHttpSecurityMode.Transport
                    }
                },
                new EndpointAddress(options.Url));

                client.ClientCredentials.UserName.UserName = options.ServiceAccountUser;
                client.ClientCredentials.UserName.Password = options.ServiceAccountPassword;

                return client;
            });
            services.AddTransient<ITeamRepository, TeamRepository>();
            services.AddTransient<IUserRepository, UserRepository>();
        }
    }
}
