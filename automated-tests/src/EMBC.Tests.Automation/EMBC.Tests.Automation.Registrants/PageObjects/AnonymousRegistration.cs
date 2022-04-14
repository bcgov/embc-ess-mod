using OpenQA.Selenium;

namespace EMBC.Tests.Automation.Registrants.PageObjects
{
    public class AnonymousRegistration
    {
        private readonly IWebDriver webDriver;

        public AnonymousRegistration(IWebDriver webDriver)
        {
            this.webDriver = webDriver;
        }

        public string GetCurrentLocation => new Uri(webDriver.Url).PathAndQuery;

        public void EnterCollectionNotice()
        {
            var buttons = webDriver.FindElements(By.TagName("button"));
            var selfRegisterButton = buttons.Should().ContainSingle(b => b.Text.Contains("Self-Register")).Subject;

            selfRegisterButton.Click();
        }

        public AnonymousRegistrationWizardStep GetCurrentWizardStep()
        {
            if (webDriver.FindElement(By.TagName("app-collection-notice")) != null)
                return AnonymousRegistrationWizardStep.CollectionNotice;
            else
                throw new InvalidOperationException($"Could not determine the current wizard step");
        }

        public enum AnonymousRegistrationWizardStep
        {
            CollectionNotice,
        }
    }
}