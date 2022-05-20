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
            ButtonElement("Log in with BC Services Card");
        }

        public void SelfRegister()
        {
            ButtonElement("Self-Register");
        }
    }
}