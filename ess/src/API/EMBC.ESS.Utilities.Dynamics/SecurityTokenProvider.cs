using System;
using System.Net.Http;
using System.Threading.Tasks;
using EMBC.Utilities.Caching;
using EMBC.Utilities.Telemetry;
using IdentityModel.Client;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace EMBC.ESS.Utilities.Dynamics
{
    public interface ISecurityTokenProvider
    {
        Task<string> AcquireToken();
    }

    internal class ADFSSecurityTokenProvider : ISecurityTokenProvider
    {
        private const string cacheKey = "adfs_token";

        private readonly IHttpClientFactory httpClientFactory;
        private readonly DynamicsOptions options;
        private readonly ICache cache;
        private readonly ITelemetryReporter logger;

        public ADFSSecurityTokenProvider(
            IHttpClientFactory httpClientFactory,
            IOptions<DynamicsOptions> options,
            ICache cache,
            ITelemetryProvider telemetryProvider)
        {
            this.httpClientFactory = httpClientFactory;
            this.options = options.Value;
            this.cache = cache;
            this.logger = telemetryProvider.Get<ADFSSecurityTokenProvider>();
        }

        public async Task<string> AcquireToken() => await cache.GetOrSet(cacheKey, AcquireTokenInternal, TimeSpan.FromMinutes(5)) ?? null!;

        private async Task<string> AcquireTokenInternal()
        {
            logger.LogDebug("Acquiring ADFS token from {0}", options.Adfs.OAuth2TokenEndpoint.AbsoluteUri);
            using var httpClient = httpClientFactory.CreateClient("adfs_token");

            var response = await httpClient.RequestPasswordTokenAsync(new PasswordTokenRequest
            {
                Address = options.Adfs.OAuth2TokenEndpoint.AbsoluteUri,
                ClientId = options.Adfs.ClientId,
                ClientSecret = options.Adfs.ClientSecret,
                Resource = { options.Adfs.ResourceName },
                UserName = $"{options.Adfs.ServiceAccountDomain}\\{options.Adfs.ServiceAccountName}",
                Password = options.Adfs.ServiceAccountPassword,
                Scope = "openid",
            });

            if (response.IsError) throw new InvalidOperationException(response.Error);

            logger.LogInformation("ADFS token acquired");
            return response.AccessToken;
        }
    }
}
