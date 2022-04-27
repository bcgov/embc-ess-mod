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

        public void NextButton()
        {
            var buttons = webDriver.FindElements(By.TagName("button"));
            var nextButton = buttons.Should().ContainSingle(b => b.Text.Contains("Next")).Subject;
            nextButton.Click();
        }

        public void YesRadioButton()
        {
            var yesRadioButton = webDriver.FindElement(By.Id("mat-radio-2"));
            yesRadioButton.Click();
        }

        public void MinimumPersonalDetails()
        {
            var firstName = "Jane";
            var lastName = "Doe";
            var gender = "Female";
            var dateOfBirth = "01011980";

            Thread.Sleep(3000);

            var firstNameInput = webDriver.FindElement(By.Id("mat-input-0"));
            firstNameInput.SendKeys(firstName); 

            var lastNameInput = webDriver.FindElement(By.Id("mat-input-1"));
            lastNameInput.SendKeys(lastName);

            var selectGender = webDriver.FindElement(By.XPath("//mat-select[@id='mat-select-0']"));
            selectGender.SendKeys(gender);

            var dateOfBirthInput = webDriver.FindElement(By.Id("mat-input-4"));
            dateOfBirthInput.SendKeys(dateOfBirth);
        }

        public void MinimumAddress()
        {
            Thread.Sleep(3000);

            var addressLine1 = "1012 Douglas St";
            var city = "Victoria";

            var yesRadioButton = webDriver.FindElement(By.Id("mat-radio-9"));
            yesRadioButton.Click();

            var addressLine1Input = webDriver.FindElement(By.Id("mat-input-8"));
            addressLine1Input.SendKeys(addressLine1);

            var cityInput = webDriver.FindElement(By.Id("mat-input-10"));
            cityInput.SendKeys(city);
        }
    }
}