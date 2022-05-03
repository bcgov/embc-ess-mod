using OpenQA.Selenium;

namespace EMBC.Tests.Automation.Registrants.PageObjects
{
    public class RegistrationMethod : PageObjectBase
    {
        public RegistrationMethod(IWebDriver webDriver) : base(webDriver)
        {
        }

        public void LoginWithBcsc()
        {
            webDriver.FindElements(By.TagName("button")).Single(b => b.Text.Contains("Log in with BC Services Card app")).Click();
        }

        public void SelfRegister()
        {
            webDriver.FindElements(By.TagName("button")).Single(b => b.Text.Contains("Self-Register")).Click();
        }
    }
}