using System;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using EMBC.Utilities.Caching;
using EMBC.Utilities.Extensions;
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

        public async Task<string> CreateTokenAsync(CancellationToken ct)
        {
            var request = new ClientCredentialsTokenRequest
            {
                Address = "oauth/token",
                ClientId = config.ClientId,
                ClientSecret = config.ClientSecret,
                AuthorizationHeaderStyle = BasicAuthenticationHeaderStyle.Rfc2617,
                ClientCredentialStyle = ClientCredentialStyle.AuthorizationHeader,
            };

            var token = await httpClient.RequestClientCredentialsTokenAsync(request, ct);
            if (token.IsError) throw token.Exception;
            token.HttpResponse.EnsureSuccessStatusCode();

            return token.AccessToken;
        }

        private async Task<string> GetToken(CancellationToken ct) => await cache.GetOrSet("cas_token", () => CreateTokenAsync(ct), TimeSpan.FromMinutes(5), ct) ?? null!;

        public async Task<InvoiceResponse> CreateInvoiceAsync(Invoice invoice, CancellationToken ct)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "cfs/apinvoice/");
            request.Headers.Authorization = AuthenticationHeaderValue.Parse($"Bearer {await GetToken(ct)}");
            request.Content = JsonContent.Create(invoice, options: jsonSerializerOptions);
            var response = await httpClient.SendAsync(request, ct);

            return await response.Content.ReadFromJsonAsync<InvoiceResponse>(jsonSerializerOptions, ct) ?? null!;
        }

        public async Task<GetSupplierResponse?> GetSupplierAsync(GetSupplierRequest getRequest, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(getRequest.PostalCode)) throw new ArgumentNullException(nameof(getRequest.PostalCode));
            if (string.IsNullOrWhiteSpace(getRequest.SupplierName)) throw new ArgumentNullException(nameof(getRequest.SupplierName));

            var request = new HttpRequestMessage(HttpMethod.Get, $"cfs/supplierbyname/{getRequest.SupplierName}/{getRequest.PostalCode}");
            request.Headers.Authorization = AuthenticationHeaderValue.Parse($"Bearer {await GetToken(ct)}");
            var response = await httpClient.SendAsync(request, ct);
            if (response.StatusCode != System.Net.HttpStatusCode.OK) return null;
            return await response.Content.ReadFromJsonAsync<GetSupplierResponse>(jsonSerializerOptions, ct) ?? null!;
        }

        public async Task<CreateSupplierResponse> CreateSupplierAsync(CreateSupplierRequest supplier, CancellationToken ct)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "cfs/supplier/");
            request.Headers.Authorization = AuthenticationHeaderValue.Parse($"Bearer {await GetToken(ct)}");
            var localJsonSerializerOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = null // create supplier expects names as is
            };

            request.Content = JsonContent.Create(supplier, options: localJsonSerializerOptions);
            var response = await httpClient.SendAsync(request, ct);

            return await response.Content.ReadFromJsonAsync<CreateSupplierResponse>(jsonSerializerOptions, ct) ?? null!;
        }

        private static Func<DateTime, string> CasDateTimeFormatter => d => d.ToPST().ToString("dd-MMM-yyyy HH:mm:ss", CultureInfo.InvariantCulture);

        public async Task<GetInvoiceResponse> GetInvoiceAsync(GetInvoiceRequest getRequest, CancellationToken ct)
        {
            var queryParams = HttpUtility.ParseQueryString(string.Empty);
            if (!string.IsNullOrWhiteSpace(getRequest.InvoiceNumber)) queryParams.Add("invoicenumber", getRequest.InvoiceNumber);
            if (!string.IsNullOrWhiteSpace(getRequest.SupplierNumber)) queryParams.Add("suppliernumber", getRequest.SupplierNumber);
            if (!string.IsNullOrWhiteSpace(getRequest.SupplierSiteCode)) queryParams.Add("sitecode", getRequest.SupplierSiteCode);
            if (!string.IsNullOrWhiteSpace(getRequest.PaymentStatus)) queryParams.Add("paymentstatus", getRequest.PaymentStatus);
            if (!string.IsNullOrWhiteSpace(getRequest.PaymentNumber)) queryParams.Add("paymentnumber", getRequest.PaymentNumber);
            if (getRequest.InvoiceCreationDateFrom.HasValue) queryParams.Add("invoicecreationdatefrom", CasDateTimeFormatter(getRequest.InvoiceCreationDateFrom.Value));
            if (getRequest.InvoiceCreationDateTo.HasValue) queryParams.Add("invoicecreationdateto", CasDateTimeFormatter(getRequest.InvoiceCreationDateTo.Value));
            if (getRequest.PaymentStatusDateFrom.HasValue) queryParams.Add("paymentstatusdatefrom", CasDateTimeFormatter(getRequest.PaymentStatusDateFrom.Value));
            if (getRequest.PaymentStatusDateTo.HasValue) queryParams.Add("paymentstatusdateto", CasDateTimeFormatter(getRequest.PaymentStatusDateTo.Value));
            if (getRequest.PageNumber.HasValue) queryParams.Add("page", getRequest.PageNumber.Value.ToString());

            var query = queryParams.HasKeys()
                ? $"?{queryParams.ToString()}"
                : string.Empty;

            var request = new HttpRequestMessage(HttpMethod.Get, $"cfs/apinvoice/paymentsearch/{getRequest.PayGroup}{query}");

            request.Headers.Authorization = AuthenticationHeaderValue.Parse($"Bearer {await GetToken(ct)}");
            var response = await httpClient.SendAsync(request, ct);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<GetInvoiceResponse>(jsonSerializerOptions, ct) ?? new GetInvoiceResponse();
        }
    }
}
