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
            var url = configuration.GetValue<Uri>("messaging:Url");
            var handler = new HttpClientHandler();
            if (configuration.GetValue("messaging:AllowInvalidServerCertificate", false))
            {
                handler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
            }
            using var client = new HttpClient(handler);
            client.BaseAddress = url;

            try
            {
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
                    new VersionInformation { Name = "EMBC.Utilities.Messaging.VersionInformationProvider", Version = null }
                };
            }
        }
    }
}
