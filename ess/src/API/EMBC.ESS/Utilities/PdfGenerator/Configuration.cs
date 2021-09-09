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
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PuppeteerSharp;

namespace EMBC.ESS.Utilities.PdfGenerator
{
    public static class Configuration
    {
        public static IServiceCollection AddPdfGenerator(this IServiceCollection services, IConfiguration configuration)
        {
            //var libPath = configuration.GetValue<string>("wkHtmlToPdfLibPath", null);
            //if (libPath != null)
            //    services.AddWkhtmltopdf(libPath);
            //else
            //    services.AddWkhtmltopdf();

            var puppeteerOptions = new BrowserFetcherOptions()
            {
                Product = Product.Chrome,
                Path = Path.GetTempPath()
            };

            var revisionInfo = Puppeteer.CreateBrowserFetcher(puppeteerOptions).DownloadAsync().GetAwaiter().GetResult();
            services.AddSingleton(revisionInfo);

            services.TryAddScoped<IPdfGenerator, PdfGenerator>();

            return services;
        }
    }
}
