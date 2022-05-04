using OpenQA.Selenium;
using Protractor;

namespace EMBC.Tests.Automation.Registrants.PageObjects
{
    public class BCSC : PageObjectBase
    {
        public BCSC(IWebDriver webDriver) : base(webDriver)
        { }

        public void LoginUsingTestCard(string csn, string passcode)
        {
            //BCSC is not Angular, need to use the regular Chrome web driver
            var driver = webDriver is NgWebDriver ngDriver
                ? ngDriver.WrappedDriver
                : webDriver;

            driver.FindElement(By.Id("tile_btn_virtual_device_div_id")).Click();

            Wait();

            driver.FindElement(By.Name("csn")).Clear();
            driver.FindElement(By.Name("csn")).SendKeys(csn);

            driver.FindElement(By.Id("continue")).Click();

            Wait();

            driver.FindElement(By.Name("passcode")).Clear();
            driver.FindElement(By.Name("passcode")).SendKeys(passcode);

            driver.FindElement(By.Id("btnSubmit")).Click();
        }
    }
}