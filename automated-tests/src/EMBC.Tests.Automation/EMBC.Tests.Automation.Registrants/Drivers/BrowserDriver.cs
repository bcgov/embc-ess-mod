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
        private readonly Lazy<IWebDriver> _currentWebDriverLazy;
        private bool _isDisposed;

        public BrowserDriver()
        {
            _currentWebDriverLazy = new Lazy<IWebDriver>(CreateWebDriver);
        }

        /// <summary>
        /// The Selenium IWebDriver instance
        /// </summary>
        public IWebDriver Current => _currentWebDriverLazy.Value;

        /// <summary>
        /// Creates the Selenium web driver (opens a browser)
        /// </summary>
        /// <returns></returns>
        private IWebDriver CreateWebDriver()
        {
            var chromeDriver = new ChromeDriver((ChromeDriverService?)ChromeDriverService.CreateDefaultService(), new ChromeOptions());
            chromeDriver.Url = "https://dev1-era-registrants.apps.silver.devops.gov.bc.ca/";

            var ngWebDriver = new NgWebDriver(chromeDriver);

            //ngWebDriver.Manage().Timeouts().AsynchronousJavaScript = TimeSpan.FromSeconds(30);
            //ngWebDriver.Manage().Timeouts().PageLoad = TimeSpan.FromSeconds(30);

            return ngWebDriver;
        }

        /// <summary>
        /// Disposes the Selenium web driver (closing the browser) after the Scenario completed
        /// </summary>
        /*public void Dispose()
        {
            if (_isDisposed)
            {
                return;
            }

            if (_currentWebDriverLazy.IsValueCreated)
            {
                Current.Quit();
            }

            _isDisposed = true;
        }*/
    }
}