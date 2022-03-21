using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace EMBC.Suppliers.API.DynamicsModule
{
    public class ADFSTokenProvider : ITokenProvider
    {
        private ADFSTokenProviderOptions options;
        private readonly IHttpClientFactory httpClientFactory;

        public ADFSTokenProvider(IHttpClientFactory httpClientFactory, IOptions<ADFSTokenProviderOptions> options)
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
                    new KeyValuePair<string, string>("resource", options.ResourceName),
                    new KeyValuePair<string, string>("client_id", options.ClientId),
                    new KeyValuePair<string, string>("client_secret", options.ClientSecret),
                    new KeyValuePair<string, string>("username", $"{options.ServiceAccountDomain}\\{options.ServiceAccountName}"),
                    new KeyValuePair<string, string>("password", options.ServiceAccountPassword),
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
                    string token = result["access_token"].GetString();
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
                throw new Exception($"Failed to obtain access token from {options.OAuth2TokenEndpoint}: {e.Message}", e);
            }
        }
    }

    public class ADFSTokenProviderOptions
    {
        public string OAuth2TokenEndpoint { get; set; }
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string ServiceAccountDomain { get; set; }
        public string ServiceAccountName { get; set; }
        public string ServiceAccountPassword { get; set; }
        public string ResourceName { get; set; }
    }

    public static class AccessTokenProviderEx
    {
        public static IServiceCollection AddADFSTokenProvider(this IServiceCollection services)
        {
            services.AddHttpClient("adfs_token", (sp, c) =>
            {
                var options = sp.GetRequiredService<IOptions<ADFSTokenProviderOptions>>().Value;
                c.BaseAddress = new Uri(options.OAuth2TokenEndpoint);
            });
            services.AddTransient<ITokenProvider, ADFSTokenProvider>();

            return services;
        }
    }
}
