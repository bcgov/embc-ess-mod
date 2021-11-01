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
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Cache;
using Microsoft.Extensions.Options;

namespace EMBC.ESS.Utilities.Dynamics
{
    public interface ISecurityTokenProvider
    {
        Task<string> AcquireToken();
    }

    public class CachedADFSSecurityTokenProvider : ISecurityTokenProvider
    {
        private readonly string cacheKey = $"{nameof(CachedADFSSecurityTokenProvider)}_token";
        private readonly ISecurityTokenProvider internalSecurityProvider;
        private readonly ICache cache;

        public CachedADFSSecurityTokenProvider(IHttpClientFactory httpClientFactory, IOptions<DynamicsOptions> options, ICache cache)
        {
            internalSecurityProvider = new ADFSSecurityTokenProvider(httpClientFactory, options);
            this.cache = cache;
        }

        public async Task<string> AcquireToken() => await cache.GetOrAdd(cacheKey, () => internalSecurityProvider.AcquireToken(), DateTimeOffset.UtcNow.AddMinutes(1));
    }

    public class ADFSSecurityTokenProvider : ISecurityTokenProvider
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

            httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

            // Construct the body of the request
            var pairs = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("resource", options.Adfs.ResourceName),
                    new KeyValuePair<string, string>("client_id", options.Adfs.ClientId),
                    new KeyValuePair<string, string>("client_secret", options.Adfs.ClientSecret),
                    new KeyValuePair<string, string>("username", $"{options.Adfs.ServiceAccountDomain}\\{options.Adfs.ServiceAccountName}"),
                    new KeyValuePair<string, string>("password", options.Adfs.ServiceAccountPassword),
                    new KeyValuePair<string, string>("scope", "openid"),
                    new KeyValuePair<string, string>("response_mode", "form_post"),
                    new KeyValuePair<string, string>("grant_type", "password")
                };

            try
            {
                // This will also set the content type of the request
                using var content = new FormUrlEncodedContent(pairs);
                // send the request to the ADFS server
                using var response = await httpClient.PostAsync(string.Empty, content);
                var responseContent = await response.Content.ReadAsStringAsync();
                // response should be in JSON format.
                var result = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(responseContent);
                if (result.ContainsKey("access_token"))
                {
                    var token = result["access_token"].GetString();
                    return token;
                }
                else if (result.ContainsKey("error"))
                {
                    throw new Exception($"{result["error"].GetString()}: {result["error_description"].GetString()}");
                }
                else
                {
                    throw new Exception(responseContent);
                }
            }
            catch (Exception e)
            {
                throw new Exception($"Failed to obtain access token from {options.Adfs.OAuth2TokenEndpoint}: {e.Message}", e);
            }
        }
    }
}
