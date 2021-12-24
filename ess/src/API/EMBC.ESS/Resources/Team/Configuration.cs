// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System.ServiceModel;
using BCeIDService;
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace EMBC.ESS.Resources.Team
{
    public class Configuration : IComponentConfigurtion
    {
        public void Configure(ConfigurationServices configurationServices)
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
