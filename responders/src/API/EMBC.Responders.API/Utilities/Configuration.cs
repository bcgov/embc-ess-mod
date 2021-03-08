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

using System;
using System.Net.Http;
using EMBC.ESS;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace EMBC.Responders.API.Utilities
{
    public static class Configuration
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
