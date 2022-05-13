using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Net.Security;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Extensions;
using Grpc.Core;
using Grpc.Net.Client.Balancer;
using Grpc.Net.Client.Configuration;
using Grpc.Net.ClientFactory;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace EMBC.Utilities.Messaging
{
    public class Configuration : IConfigureComponentServices, IHaveGrpcServices, IConfigureComponentPipeline
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var options = configurationServices.Configuration.GetSection("messaging").Get<MessagingOptions>() ?? new MessagingOptions() { Mode = MessagingMode.Server };

            configurationServices.Services.AddGrpc(opts =>
            {
                opts.EnableDetailedErrors = configurationServices.Environment.IsDevelopment();
            });
            if (options.Mode == MessagingMode.Server || options.Mode == MessagingMode.Both)
            {
                configurationServices.Services.Configure<MessageHandlerRegistryOptions>(opts => { });
                configurationServices.Services.AddSingleton<MessageHandlerRegistry>();
                configurationServices.Services
                    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddScheme<AuthenticationSchemeOptions, AnonymousAuthenticationHandler>(AnonymousAuthenticationHandler.AuthenticationScheme, opts => { })
                    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, opts =>
                    {
                        configurationServices.Configuration.GetSection("messaging:oauth").Bind(opts);

                        opts.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateAudience = false,
                            ValidateIssuer = true,
                            RequireSignedTokens = true,
                            RequireAudience = false,
                            RequireExpirationTime = true,
                            ValidateLifetime = true,
                            ClockSkew = TimeSpan.FromSeconds(60),
                            NameClaimType = ClaimTypes.Upn,
                            RoleClaimType = ClaimTypes.Role,
                            ValidateActor = true,
                            ValidateIssuerSigningKey = false,
                        };
                        opts.Events = new JwtBearerEvents
                        {
                            OnAuthenticationFailed = async c =>
                            {
                                await Task.CompletedTask;
                                var logger = c.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("JwtBearer");
                                logger.LogError(c.Exception, $"Error authenticating token");
                            },
                            OnTokenValidated = async c =>
                            {
                                await Task.CompletedTask;
                                var logger = c.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("JwtBearer");
                                if (c.Request.Headers.TryGetValue("_user", out var userToken))
                                {
                                    var jwtHandler = new JwtSecurityTokenHandler();
                                    userToken = userToken[0].Replace("bearer ", string.Empty, true, null);
                                    if (!jwtHandler.CanReadToken(userToken)) throw new InvalidOperationException($"can't read user token");
                                    //TODO: validate token and add as identity to the principal
                                }
                                logger.LogDebug("Token validated for {0}", c.Principal?.Identity?.Name);
                            }
                        };
                        opts.Validate();
                    });

                configurationServices.Services.AddAuthorization(opts =>
                {
                    opts.AddPolicy(JwtBearerDefaults.AuthenticationScheme, policy =>
                    {
                        policy
                            .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                            .RequireAuthenticatedUser()
                            .RequireScope("ess-backend")
                            ;
                    });
                    opts.AddPolicy(AnonymousAuthenticationHandler.AuthenticationScheme, policy =>
                    {
                        policy
                            .AddAuthenticationSchemes(AnonymousAuthenticationHandler.AuthenticationScheme)
                            .RequireAssertion(ctx => true)
                            ;
                    });
                    if (options.AuthorizationEnabled)
                    {
                        // JWT bearer authentication policy
                        opts.DefaultPolicy = opts.GetPolicy(JwtBearerDefaults.AuthenticationScheme) ?? null!;
                    }
                    else
                    {
                        // anonymous authentication policy
                        opts.DefaultPolicy = opts.GetPolicy(AnonymousAuthenticationHandler.AuthenticationScheme) ?? null!;
                        configurationServices.Logger.LogWarning("Messaging service authentication is disabled");
                    }
                });
            }

            if (options.Mode == MessagingMode.Client || options.Mode == MessagingMode.Both)
            {
                configurationServices.Services.TryAddSingleton<ResolverFactory>(new DnsResolverFactory(refreshInterval: TimeSpan.FromSeconds(15)));
                configurationServices.Services.TryAddSingleton<LoadBalancerFactory, RoundRobinBalancerFactory>();
                configurationServices.Services.TryAddTransient<ClientAuthenticationInterceptor>();
                if (options.Url == null) throw new InvalidOperationException($"Messaging url is missing - can't configure messaging client");
                configurationServices.Services.AddGrpcClient<Dispatcher.DispatcherClient>((sp, opts) =>
                {
                    opts.Address = options.Url;
                }).ConfigurePrimaryHttpMessageHandler(sp =>
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
                    if (options.AllowInvalidServerCertificate)
                    {
                        handler.SslOptions = new SslClientAuthenticationOptions { RemoteCertificateValidationCallback = DangerousCertificationValidation };
                    }
                    return handler;
                }).ConfigureChannel(opts =>
                {
                    if (options.Url.Scheme == "dns")
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
                }).AddInterceptor<ClientAuthenticationInterceptor>(InterceptorScope.Client);

                configurationServices.Services
                    .Configure<OauthTokenProviderOptions>(configurationServices.Configuration.GetSection("messaging:oauth"))
                    .PostConfigure<OauthTokenProviderOptions>(opts =>
                    {
                        if (options.AuthorizationEnabled && !string.IsNullOrEmpty(opts.MetadataAddress))
                        {
                            // load the oidc config from the oauth server
                            opts.OidcConfig = OpenIdConnectConfigurationRetriever.GetAsync(opts.MetadataAddress, CancellationToken.None).GetAwaiter().GetResult();
                        }
                        else
                        {
                            configurationServices.Logger.LogWarning("Messaging client authentication is disabled");
                        }
                    })
                    .AddTransient<ITokenProvider, OAuthTokenProvider>()
                    .AddHttpClient("messaging_token").SetHandlerLifetime(TimeSpan.FromMinutes(30));

                configurationServices.Services.AddTransient<IMessagingClient, MessagingClient>();

                if (options.Mode == MessagingMode.Client)
                {
                    configurationServices.Services.AddTransient<IVersionInformationProvider, VersionInformationProvider>();
                }
            }
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
        public bool AuthorizationEnabled { get; set; } = false;
    }

    public enum MessagingMode
    {
        Both,
        Client,
        Server,
    }
}
