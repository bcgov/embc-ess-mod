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
using System.Threading.Tasks;
using EMBC.Utilities.Caching;
using IdentityModel.Client;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace EMBC.Utilities.Messaging
{
    public interface ITokenProvider
    {
        Task<string> AcquireToken();
    }

    internal class OAuthTokenProvider : ITokenProvider
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly ICache cache;
        private readonly ILogger<OAuthTokenProvider> logger;
        private readonly MessagingOptions options;
        private const string cacheKey = "messaging_token";

        public OAuthTokenProvider(IHttpClientFactory httpClientFactory, ICache cache, IOptions<MessagingOptions> options, ILogger<OAuthTokenProvider> logger)
        {
            this.httpClientFactory = httpClientFactory;
            this.cache = cache;
            this.logger = logger;
            this.options = options.Value;
        }

        public async Task<string> AcquireToken() => await cache.GetOrSet(cacheKey, AcquireTokenInternal, TimeSpan.FromMinutes(5)) ?? null!;

        private async Task<string> AcquireTokenInternal()
        {
            if (options.OAuth == null) return string.Empty;

            using var httpClient = httpClientFactory.CreateClient("messaging_token");

            var response = await httpClient.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
            {
                RequestUri = options.OAuth.Url,
                ClientId = options.OAuth.ClientId,
                ClientSecret = options.OAuth.ClientSecret,
                Scope = options.OAuth.Scope,
            });

            if (response.IsError) throw new Exception(response.Error);

            logger.LogDebug("Messaging token acquired");
            return response.AccessToken;
        }
    }
}
