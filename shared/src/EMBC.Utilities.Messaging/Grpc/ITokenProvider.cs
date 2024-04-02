using System;
using System.Net.Http;
using System.Threading.Tasks;
using EMBC.Utilities.Caching;
using EMBC.Utilities.Telemetry;
using IdentityModel.Client;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace EMBC.Utilities.Messaging.Grpc
{
    public interface ITokenProvider
    {
        Task<string> AcquireToken();
    }

    internal class OAuthTokenProvider : ITokenProvider
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly ICache cache;
        private readonly ITelemetryReporter logger;
        private readonly OauthTokenProviderOptions options;
        private const string cacheKey = "messaging_token";

        public OAuthTokenProvider(IHttpClientFactory httpClientFactory, ICache cache, IOptions<OauthTokenProviderOptions> options, ITelemetryProvider telemetryProvider)
        {
            this.httpClientFactory = httpClientFactory;
            this.cache = cache;
            logger = telemetryProvider.Get<OAuthTokenProvider>();
            this.options = options.Value;
        }

        public async Task<string> AcquireToken() => await cache.GetOrSet(cacheKey, AcquireTokenInternal, TimeSpan.FromMinutes(5)) ?? null!;

        private async Task<string> AcquireTokenInternal()
        {
            if (options.OidcConfig == null) return string.Empty;

            using var httpClient = httpClientFactory.CreateClient("messaging_token");

            var response = await httpClient.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
            {
                Address = options.OidcConfig.TokenEndpoint,
                ClientId = options.ClientId,
                ClientSecret = options.ClientSecret,
                Scope = options.Scope,
            });

            if (response.IsError) throw new InvalidOperationException(response.Error);

            logger.LogDebug("Messaging token acquired");
            return response.AccessToken;
        }
    }

    internal class OauthTokenProviderOptions
    {
        public string MetadataAddress { get; set; } = null!;
        public string ClientId { get; set; } = null!;
        public string ClientSecret { get; set; } = null!;
        public string Scope { get; set; } = null!;
        public OpenIdConnectConfiguration? OidcConfig { get; set; }
    }
}
