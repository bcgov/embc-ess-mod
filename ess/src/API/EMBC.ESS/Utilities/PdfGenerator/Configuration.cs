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

using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using PuppeteerSharp;

namespace EMBC.ESS.Utilities.PdfGenerator
{
    public static class Configuration
    {
        public static IServiceCollection AddPdfGenerator(this IServiceCollection services)
        {
            services.TryAddSingleton(sp =>
            {
                var logger = sp.GetRequiredService<ILogger<PdfGenerator>>();
                var options = new BrowserFetcherOptions()
                {
                    Product = Product.Chrome,
                    Path = Path.Combine(Path.GetTempPath(), "chrome/"),
                    Platform = Platform.Linux
                };

                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows)) options.Platform = Platform.Win64;

                logger.LogInformation("Setting up Puppeteer to use platform {0}", options.Platform);

                var fetcher = Puppeteer.CreateBrowserFetcher(options);

                var currentRevisions = fetcher.LocalRevisions();
                if (currentRevisions.Any())
                {
                    var info = fetcher.GetRevisionInfoAsync().GetAwaiter().GetResult();
                    logger.LogInformation("Found Puppeteer at {0}", info.ExecutablePath);
                    if (info.Downloaded) return info;
                }
                logger.LogInformation("Downloading Puppeteer");
                return fetcher.DownloadAsync().GetAwaiter().GetResult();
            });

            services.TryAddScoped<IPdfGenerator, PdfGenerator>();

            return services;
        }
    }
}
