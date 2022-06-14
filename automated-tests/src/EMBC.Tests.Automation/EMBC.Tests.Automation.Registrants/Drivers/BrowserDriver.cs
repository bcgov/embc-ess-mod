using Microsoft.Extensions.Configuration;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using Protractor;

namespace EMBC.Tests.Automation.Registrants.Drivers
{
    /// <summary>
    /// Manages a browser instance using Selenium
    /// </summary>
    //public class BrowserDriver : IDisposable
    public class BrowserDriver
    {
        private readonly Lazy<IWebDriver> currentWebDriverLazy;
        private readonly Lazy<IConfiguration> configurationLazy;
        private bool _isDisposed;
        private readonly bool closeBrowserOnDispose;

        public BrowserDriver()
        {
            currentWebDriverLazy = new Lazy<IWebDriver>(CreateWebDriver);
            configurationLazy = new Lazy<IConfiguration>(ReadConfiguration);
            closeBrowserOnDispose = Configuration.GetValue("CloseBrowserAfterEachTest", false);
        }

        /// <summary>
        /// The Selenium IWebDriver instance
        /// </summary>
        public IWebDriver Current => currentWebDriverLazy.Value;

        public IConfiguration Configuration => configurationLazy.Value;

        /// <summary>
        /// Creates the Selenium web driver (opens a browser)
        /// </summary>
        /// <returns></returns>
        private IWebDriver CreateWebDriver()
        {
            var options = new ChromeOptions();
            options.AddArguments("start-maximized");

            var chromeDriver = new ChromeDriver(ChromeDriverService.CreateDefaultService(), options);
            chromeDriver.Url = Configuration.GetValue<string>("devUrl");

            var ngWebDriver = new NgWebDriver(chromeDriver);

            //ngWebDriver.Manage().Timeouts().AsynchronousJavaScript = TimeSpan.FromSeconds(30);
            //ngWebDriver.Manage().Timeouts().PageLoad = TimeSpan.FromSeconds(30);

            return ngWebDriver;
        }

        private IConfiguration ReadConfiguration() =>
            new ConfigurationBuilder()
                .AddUserSecrets<BrowserDriver>()
                .Build();

        /// <summary>
        /// Disposes the Selenium web driver (closing the browser) after the Scenario completed
        /// </summary>
        /// Commented out until pipeline integration begins; easier to troubleshoot element issues with the browser open.
        public void Dispose()
        {
            if (_isDisposed)
            {
                return;
            }

            if (currentWebDriverLazy.IsValueCreated && closeBrowserOnDispose)
            {
                Current.Quit();
            }

            _isDisposed = true;
        }
    }
}