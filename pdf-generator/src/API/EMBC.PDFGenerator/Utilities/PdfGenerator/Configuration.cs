using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using PuppeteerSharp;

namespace EMBC.PDFGenerator.Utilities.PdfGenerator
{
    public static class Configuration
    {
        public static IServiceCollection AddPdfGenerator(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddSingleton(sp =>
            {
                var logger = sp.GetRequiredService<ILogger<PdfGenerator>>();
                var options = new BrowserFetcherOptions()
                {
                    Product = Product.Chrome,
                    Path = Path.Combine(configuration.GetValue("CHROME_CACHE_PATH", Path.GetTempPath()), "chrome/"),
                    Platform = Platform.Linux
                };

                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows)) options.Platform = Platform.Win64;

                logger.LogInformation("Setting up Puppeteer to use {0} on platform {1} and caching in {2}", options.Product, options.Platform, options.Path);

                var fetcher = Puppeteer.CreateBrowserFetcher(options);

                var currentRevisions = fetcher.LocalRevisions();
                if (currentRevisions.Any())
                {
                    var info = fetcher.GetRevisionInfoAsync().GetAwaiter().GetResult();
                    logger.LogInformation("Found cached Puppeteer {0} in {0}", info.Revision, info.ExecutablePath);
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
