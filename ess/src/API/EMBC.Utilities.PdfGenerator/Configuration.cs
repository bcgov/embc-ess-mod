using System;
using System.Net.Http;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using EMBC.PDFGenerator;
using EMBC.Utilities.Configuration;
using Grpc.Core;
using Grpc.Net.Client.Balancer;
using Grpc.Net.Client.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EMBC.ESS.Utilities.PdfGenerator
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            configurationServices.Services.TryAddSingleton<ResolverFactory>(new DnsResolverFactory(refreshInterval: TimeSpan.FromSeconds(15)));
            configurationServices.Services.TryAddSingleton<LoadBalancerFactory, RoundRobinBalancerFactory>();
            configurationServices.Services.AddGrpc(opts =>
            {
                opts.EnableDetailedErrors = configurationServices.Environment.IsDevelopment();
            });
            var pdfGeneratorUrl = configurationServices.Configuration.GetValue<Uri>("pdfGenerator:url");
            var allowUntrustedCertificates = configurationServices.Configuration.GetValue("pdfGenerator:allowInvalidServerCertificate", false);
            if (pdfGeneratorUrl == null)
            {
                configurationServices.Logger.LogWarning("PdfGenerator:url env var is not set, PdfGenerator will not be available");
                return;
            }

            var httpClientBuilder = configurationServices.Services.AddGrpcClient<Generator.GeneratorClient>(opts =>
            {
                opts.Address = pdfGeneratorUrl;
            }).ConfigurePrimaryHttpMessageHandler(() =>
            {
                var handler = new SocketsHttpHandler()
                {
                    EnableMultipleHttp2Connections = true,
                    PooledConnectionIdleTimeout = TimeSpan.FromMinutes(2),
                    PooledConnectionLifetime = TimeSpan.FromSeconds(20),
                    KeepAlivePingDelay = TimeSpan.FromSeconds(20),
                    KeepAlivePingTimeout = TimeSpan.FromSeconds(20),
                    KeepAlivePingPolicy = HttpKeepAlivePingPolicy.WithActiveRequests
                };
                if (allowUntrustedCertificates)
                {
                    handler.SslOptions = new SslClientAuthenticationOptions { RemoteCertificateValidationCallback = DangerousCertificationValidation };
                }
                return handler;
            }).ConfigureChannel(opts =>
            {
                if (pdfGeneratorUrl.Scheme == "dns")
                {
                    opts.Credentials = ChannelCredentials.SecureSsl;
                }
                opts.ServiceConfig = new ServiceConfig
                {
                    LoadBalancingConfigs = { new RoundRobinConfig() },
                    MethodConfigs =
                        {
                            new MethodConfig
                            {
                                RetryPolicy = new RetryPolicy
                                {
                                    MaxAttempts = 5,
                                    InitialBackoff = TimeSpan.FromSeconds(1),
                                    MaxBackoff = TimeSpan.FromSeconds(5),
                                    BackoffMultiplier = 1.5,
                                    RetryableStatusCodes = { StatusCode.Unavailable }
                                }
                            }
                        }
                };
            }).EnableCallContextPropagation(opts => opts.SuppressContextNotFoundErrors = true);

            configurationServices.Services.TryAddTransient<IPdfGenerator, PdfGenerator>();
        }

        private static bool DangerousCertificationValidation(
            object sender,
            X509Certificate? certificate,
            X509Chain? chain,
            SslPolicyErrors sslPolicyErrors)
        {
            return true;
        }
    }
}
