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
            var yesRadioButton = webDriver.FindElement(By.Id("yesOption"));
            yesRadioButton.Click();
        }

        public void MinimumPersonalDetails()
        {
            var firstName = "Jane";
            var lastName = "Doe";
            var gender = "Female";
            var dateOfBirth = "01011980";

            Thread.Sleep(1000);

            var firstNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='firstName']"));
            firstNameInput.SendKeys(firstName);

            var lastNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='lastName']"));
            lastNameInput.SendKeys(lastName);

            var genderSelect = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='gender']"));
            genderSelect.SendKeys(gender);

            var dateOfBirthInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='dateOfBirth']"));
            dateOfBirthInput.SendKeys(dateOfBirth);
        }

        public void MinimumAddress()
        {
            Thread.Sleep(1000);

            var addressLine1 = "1012 Douglas St";
            var city = "Victoria";

            var yesRadioButton = webDriver.FindElement(By.CssSelector("[formcontrolname='isBcAddress'] mat-radio-button"));
            yesRadioButton.Click();

            var addressLine1Input = webDriver.FindElement(By.CssSelector("input[formcontrolname='addressLine1']"));
            addressLine1Input.SendKeys(addressLine1);

            var cityInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='community']"));
            cityInput.SendKeys(city);

            var citySelect = webDriver.FindElement(By.Id("Victoria"));
            citySelect.Click();

            var yesRadioButton2 = webDriver.FindElement(By.CssSelector("[formcontrolname='isNewMailingAddress'] mat-radio-button"));
            yesRadioButton2.Click();
        }

        public void NoRadioButton()
        {
            Thread.Sleep(1000);

            var noRadioButton = webDriver.FindElement(By.Id("noOption"));
            noRadioButton.Click();
        }

        public void SecurityQuestions()
        {
            Thread.Sleep(1000);

            var securityQuestion1 = "What was the name of your first pet?";
            var securityQuestion2 = "In what city or town was your mother born?";
            var securityQuestion3 = "Where was your first job?";
            var securityResponse1 = "Daisy";
            var securityResponse2 = "Vancouver";
            var securityResponse3 = "McDonald's";

            var securitySelect1 = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='question1']"));
            securitySelect1.SendKeys(securityQuestion1);

            Thread.Sleep(1000);

            var securitySelect2 = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='question2']"));
            securitySelect2.SendKeys(securityQuestion2);

            Thread.Sleep(1000);

            var securitySelect3 = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='question3']"));
            securitySelect3.SendKeys(securityQuestion3);

            var securityInput1 = webDriver.FindElement(By.CssSelector("input[formcontrolname='answer1']"));
            securityInput1.SendKeys(securityResponse1);

            var securityInput2 = webDriver.FindElement(By.CssSelector("input[formcontrolname='answer2']"));
            securityInput2.SendKeys(securityResponse2);

            var securityInput3 = webDriver.FindElement(By.CssSelector("input[formcontrolname='answer3']"));
            securityInput3.SendKeys(securityResponse3);
        }

        public void CreateESSFileLocation()
        {
            Thread.Sleep(1000);

            var yesRadioButton = webDriver.FindElement(By.Id("yesOption"));
            yesRadioButton.Click();

            var yesRadioButton2 = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='insurance']/mat-radio-button[1]"));
            yesRadioButton2.Click();
        }

        public void CreateESSFileHouseholdMembers()
        {
            Thread.Sleep(2000);

            var noRadioButton = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='haveSpecialDiet']/mat-radio-button[2]"));
            noRadioButton.Click();

            var noRadioButton2 = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='haveMedication']/mat-radio-button[2]"));
            noRadioButton2.Click();
        }

        public void CreateESSFileNeeds()
        {
            Thread.Sleep(2000);

            var yesRadioButton = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='canEvacueeProvideFood']/mat-radio-button[1]"));
            yesRadioButton.Click();

            var yesRadioButton2 = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='canEvacueeProvideLodging']/mat-radio-button[1]"));
            yesRadioButton2.Click();

            var yesRadioButton3 = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='canEvacueeProvideClothing']/mat-radio-button[1]"));
            yesRadioButton3.Click();

            var yesRadioButton4 = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='canEvacueeProvideTransportation']/mat-radio-button[1]"));
            yesRadioButton4.Click();

            var yesRadioButton5 = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='canEvacueeProvideIncidentals']/mat-radio-button[1]"));
            yesRadioButton5.Click();
        }

        public void CreateESSFileSecurityPhrase()
        {
            Thread.Sleep(1000);

            var securityPhrase = "Sesame";

            var securityPhraseInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='secretPhrase']"));
            securityPhraseInput.SendKeys(securityPhrase);
        }

        public void CAPTCHAFails()
        {
            Thread.Sleep(1000);

            var CAPTCHAEntry = "Invalid";

            var CAPTCHAInput = webDriver.FindElement(By.Name("answer"));
            CAPTCHAInput.SendKeys(CAPTCHAEntry);

            Assert.True(webDriver.FindElement(By.XPath("//body[contains(.,' Incorrect answer, please try again. ')]")).Displayed);
        }

    }
}