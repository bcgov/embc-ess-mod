using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.Utilities.Caching;
using IdentityModel.Client;
using Microsoft.Extensions.Options;

namespace EMBC.ESS.Utilities.Cas
{
    internal class WebProxy : IWebProxy
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly ICache cache;
        private readonly CasConfiguration config;
        private readonly JsonSerializerOptions jsonSerializerOptions;

        private HttpClient httpClient => httpClientFactory.CreateClient("cas");

        public WebProxy(IHttpClientFactory httpClientFactory, IOptions<CasConfiguration> config, ICache cache)
        {
            this.httpClientFactory = httpClientFactory;
            this.cache = cache;
            this.config = config.Value;
            this.jsonSerializerOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            this.jsonSerializerOptions.Converters.Add(new CasDateJsonConverter());
        }

        public async Task<string> CreateTokenAsync()
        {
            var request = new ClientCredentialsTokenRequest
            {
                Address = "oauth/token",
                ClientId = config.ClientId,
                ClientSecret = config.ClientSecret,
                AuthorizationHeaderStyle = BasicAuthenticationHeaderStyle.Rfc2617,
                ClientCredentialStyle = ClientCredentialStyle.AuthorizationHeader,
            };

            var token = await httpClient.RequestClientCredentialsTokenAsync(request);
            token.HttpResponse.EnsureSuccessStatusCode();

            return token.AccessToken;
        }

        private async Task<string> GetToken() => await cache.GetOrSet("cas_token", CreateTokenAsync, TimeSpan.FromMinutes(5)) ?? null!;

        public async Task<InvoiceResponse> CreateInvoiceAsync(Invoice invoice)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "cfs/apinvoice/");
            request.Headers.Authorization = AuthenticationHeaderValue.Parse($"Bearer {await GetToken()}");
            request.Content = JsonContent.Create(invoice, options: jsonSerializerOptions);
            var response = await httpClient.SendAsync(request);

            return await response.Content.ReadFromJsonAsync<InvoiceResponse>(jsonSerializerOptions) ?? null!;
        }

        public async Task<GetSupplierResponse?> GetSupplierAsync(GetSupplierRequest getRequest)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"cfs/supplierbyname/{getRequest.SupplierName}/{getRequest.PostalCode}");
            request.Headers.Authorization = AuthenticationHeaderValue.Parse($"Bearer {await GetToken()}");
            var response = await httpClient.SendAsync(request);
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound) return null;
            return await response.Content.ReadFromJsonAsync<GetSupplierResponse>(jsonSerializerOptions) ?? null!;
        }

        public async Task<CreateSupplierResponse> CreateSupplierAsync(CreateSupplierRequest supplier)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "cfs/supplier/");
            request.Headers.Authorization = AuthenticationHeaderValue.Parse($"Bearer {await GetToken()}");
            var localJsonSerializerOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = null // create supplier expects names as is
            };

            request.Content = JsonContent.Create(supplier, options: localJsonSerializerOptions);
            var response = await httpClient.SendAsync(request);

            return await response.Content.ReadFromJsonAsync<CreateSupplierResponse>(jsonSerializerOptions) ?? null!;
        }
    }
}
