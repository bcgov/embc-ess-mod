using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.Configuration;

namespace EMBC.Utilities.Messaging
{
    public class VersionInformationProvider : IVersionInformationProvider
    {
        private readonly IConfiguration configuration;

        public VersionInformationProvider(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public async Task<IEnumerable<VersionInformation>> Get()
        {
            try
            {
                var url = configuration.GetValue<Uri>("messaging:Url");
                if (url.Scheme == "dns")
                {
                    var parts = url.LocalPath.Trim('/').Split(':');
                    url = new UriBuilder { Scheme = "https", Host = parts[0], Port = int.Parse(parts[1]) }.Uri;
                }
                var handler = new HttpClientHandler();
                if (configuration.GetValue("messaging:AllowInvalidServerCertificate", false))
                {
#pragma warning disable S4830 // Server certificates should be verified during SSL/TLS connections
                    handler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
#pragma warning restore S4830 // Server certificates should be verified during SSL/TLS connections
                }
                using var client = new HttpClient(handler);
                client.BaseAddress = url;

                var response = await client.GetAsync("/version");
                response.EnsureSuccessStatusCode();

                return await JsonSerializer.DeserializeAsync<IEnumerable<VersionInformation>>(
                    await response.Content.ReadAsStreamAsync(),
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }) ?? Array.Empty<VersionInformation>();
            }
            catch (Exception)
            {
                return new[]
                {
                    new VersionInformation { Name = $"{this.GetType().FullName}:error", Version = null }
                };
            }
        }
    }
}
