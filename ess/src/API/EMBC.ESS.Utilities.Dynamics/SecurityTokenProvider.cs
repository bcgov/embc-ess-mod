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
using EMBC.ESS.Utilities.Cache;
using IdentityModel.Client;
using Microsoft.Extensions.Options;

namespace EMBC.ESS.Utilities.Dynamics
{
    public interface ISecurityTokenProvider
    {
        Task<string> AcquireToken();
    }

    internal class CachedADFSSecurityTokenProvider : ISecurityTokenProvider
    {
        private readonly string cacheKey = $"{nameof(CachedADFSSecurityTokenProvider)}_token";
        private readonly ISecurityTokenProvider internalSecurityProvider;
        private readonly ICache cache;

        public CachedADFSSecurityTokenProvider(IHttpClientFactory httpClientFactory, IOptions<DynamicsOptions> options, ICache cache)
        {
            internalSecurityProvider = new ADFSSecurityTokenProvider(httpClientFactory, options);
            this.cache = cache;
        }

        public async Task<string> AcquireToken() => await cache.GetOrSet(cacheKey, () => internalSecurityProvider.AcquireToken(), TimeSpan.FromMinutes(2));
    }

    internal class ADFSSecurityTokenProvider : ISecurityTokenProvider
    {
        private readonly DynamicsOptions options;
        private readonly IHttpClientFactory httpClientFactory;

        public ADFSSecurityTokenProvider(IHttpClientFactory httpClientFactory, IOptions<DynamicsOptions> options)
        {
            this.options = options.Value;
            this.httpClientFactory = httpClientFactory;
        }

        public async Task<string> AcquireToken()
        {
            using var httpClient = httpClientFactory.CreateClient("adfs_token");

            var response = await httpClient.RequestPasswordTokenAsync(new PasswordTokenRequest
            {
                Address = options.Adfs?.OAuth2TokenEndpoint?.AbsoluteUri,
                ClientId = options.Adfs?.ClientId,
                ClientSecret = options.Adfs?.ClientSecret,
                Resource = { options.Adfs?.ResourceName },
                UserName = $"{options.Adfs?.ServiceAccountDomain}\\{options.Adfs?.ServiceAccountName}",
                Password = options.Adfs?.ServiceAccountPassword,
                Scope = "openid",
            });

            if (response.IsError) throw new Exception(response.Error);

            return response.AccessToken;
        }
    }
}
