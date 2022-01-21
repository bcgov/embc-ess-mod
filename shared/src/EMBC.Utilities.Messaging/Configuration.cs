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
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using EMBC.Utilities.Configuration;
using Grpc.Core;
using Grpc.Net.Client.Balancer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;

namespace EMBC.Utilities.Messaging
{
    public class Configuration : IConfigureComponentServices, IHaveGrpcServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var options = configurationServices.Configuration.GetSection("messaging").Get<MessagingOptions>() ?? new MessagingOptions() { Mode = MessagingMode.Server };

            configurationServices.Services.AddGrpc(opts =>
            {
                opts.EnableDetailedErrors = configurationServices.Environment.IsDevelopment();
            });
            configurationServices.Services.TryAddSingleton<ResolverFactory>(new DnsResolverFactory(refreshInterval: TimeSpan.FromSeconds(30)));
            configurationServices.Services.TryAddSingleton<LoadBalancerFactory, RoundRobinBalancerFactory>();
            if (options.Mode == MessagingMode.Server || options.Mode == MessagingMode.Both)
            {
                configurationServices.Services.Configure<MessageHandlerRegistryOptions>(opts => { });
                configurationServices.Services.AddSingleton<MessageHandlerRegistry>();
            }

            if (options.Mode == MessagingMode.Client || options.Mode == MessagingMode.Both)
            {
                if (options.Url == null) throw new Exception($"Messaging url is missing - can't configure messaging client");
                configurationServices.Services.AddGrpcClient<Dispatcher.DispatcherClient>((sp, opts) =>
                {
                    opts.Address = options.Url;
                }).ConfigureChannel(opts =>
                {
                    if (options.Url.Scheme == "dns")
                    {
                        opts.Credentials = ChannelCredentials.SecureSsl;
                    }
                }).ConfigurePrimaryHttpMessageHandler(sp =>
                {
                    if (!options.AllowInvalidServerCertificate) return new SocketsHttpHandler();
                    return new SocketsHttpHandler
                    {
                        SslOptions = new SslClientAuthenticationOptions
                        {
                            RemoteCertificateValidationCallback = DangerousCertificationValidation
                        }
                    };
                });

                configurationServices.Services.AddTransient<IMessagingClient, MessagingClient>();
            }
        }

        private static bool DangerousCertificationValidation(
            object sender,
            X509Certificate? certificate,
            X509Chain? chain,
            SslPolicyErrors sslPolicyErrors)
        {
            return true;
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
    }

    public enum MessagingMode
    {
        Both,
        Client,
        Server,
    }
}
