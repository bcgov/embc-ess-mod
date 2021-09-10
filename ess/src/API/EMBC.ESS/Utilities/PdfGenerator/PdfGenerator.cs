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
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PuppeteerSharp;

namespace EMBC.ESS.Utilities.PdfGenerator
{
    public interface IPdfGenerator
    {
        public Task<byte[]> Generate(string source);
    }

    public class PdfGenerator : IPdfGenerator
    {
        private readonly RevisionInfo puppeteerInfo;
        private readonly ILogger<PdfGenerator> logger;

        public PdfGenerator(RevisionInfo puppeteerInfo, ILogger<PdfGenerator> logger)
        {
            this.puppeteerInfo = puppeteerInfo;
            this.logger = logger;
        }

        public async Task<byte[]> Generate(string source)
        {
            logger.LogInformation("Using Puppeteer from {0}", puppeteerInfo.ExecutablePath);
            var browser = await Puppeteer.LaunchAsync(new LaunchOptions
            {
                Headless = true,
                ExecutablePath = puppeteerInfo.ExecutablePath,
                Args = new[] { "--no-sandbox" },
                Timeout = TimeSpan.FromSeconds(10).Milliseconds, DumpIO = true,
            });
            logger.LogInformation("Created Puppeteer browser version {0}", await browser.GetVersionAsync());
            var page = await browser.NewPageAsync();
            logger.LogInformation("Created Puppeteer page");
            await page.SetContentAsync(source);
            var content = await page.PdfDataAsync();
            await page.DisposeAsync();
            await browser.CloseAsync();
            await browser.DisposeAsync();

            logger.LogInformation("Finished generating pdf with size {0}", content.Length);
            return content;
        }
    }
}
