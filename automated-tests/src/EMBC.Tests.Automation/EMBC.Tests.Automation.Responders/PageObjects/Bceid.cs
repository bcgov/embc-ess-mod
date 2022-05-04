using OpenQA.Selenium;
using Protractor;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    public class Bceid : PageObjectBase
    {
        public Bceid(IWebDriver webDriver) : base(webDriver)
        { }

        public void Login(string userName, string password)
        {
            //BCeID is not Angular, need to use the regular Chrome web driver
            var driver = webDriver is NgWebDriver ngDriver
                ? ngDriver.WrappedDriver
                : webDriver;

            var userInput = driver.FindElement(By.Id("user"));
            userInput.Clear();
            userInput.SendKeys(userName);

            var passwordInput = driver.FindElement(By.Id("password"));
            passwordInput.Clear();
            passwordInput.SendKeys(password);

            driver.FindElement(By.Name("btnSubmit")).Click();
        }
    }
}