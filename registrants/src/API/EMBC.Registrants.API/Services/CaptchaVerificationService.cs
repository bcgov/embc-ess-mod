using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace EMBC.Registrants.API.Services
{
    public interface ICaptchaVerificationService
    {
        public Task<bool> VerifyAsync(string clientResponse, CancellationToken ct);
    }

    public class CaptchaVerificationService : ICaptchaVerificationService
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly CaptchaVerificationServiceOptions options;

        public CaptchaVerificationService(IHttpClientFactory httpClientFactory, IOptions<CaptchaVerificationServiceOptions> options)
        {
            this.httpClientFactory = httpClientFactory;
            this.options = options.Value;
        }

        public async Task<bool> VerifyAsync(string clientResponse, CancellationToken ct)
        {
            var content = new Dictionary<string, string>()
            {
                { "secret", options.Secret },
                { "response", clientResponse }
            };
            using var client = httpClientFactory.CreateClient("captcha");

            var response = await client.PostAsync(options.Url.AbsoluteUri, new FormUrlEncodedContent(content), ct);
            response.EnsureSuccessStatusCode();

            var responseData = await response.Content.ReadFromJsonAsync<CaptchaResponse>();
            return responseData.Success;
        }
    }

    public class CaptchaResponse
    {
        public bool Success { get; set; }
    }

    public class CaptchaVerificationServiceOptions
    {
        public string Secret { get; set; } = null!;
        public Uri Url { get; set; } = null!;
    }
}
