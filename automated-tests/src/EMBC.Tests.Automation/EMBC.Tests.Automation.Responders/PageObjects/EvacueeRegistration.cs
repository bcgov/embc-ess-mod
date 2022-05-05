using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    public class EvacueeRegistration : PageObjectBase
    {
        public EvacueeRegistration(IWebDriver webDriver) : base(webDriver)
        {}

        public void SignInTaskButton()
        {
            var buttons = webDriver.FindElements(By.TagName("button"));
            var signInButton = buttons.Should().ContainSingle(b => b.Text.Contains("Sign in to the Task #")).Subject;
            signInButton.Click();
        }

        public void EnterTaskNumber()
        {
            var taskName = "test";

            Wait();

            var taskNumberField = webDriver.FindElement(By.CssSelector("input[formcontrolname='taskNumber']"));
            taskNumberField.SendKeys(taskName);

            var buttons = webDriver.FindElements(By.TagName("button"));
            var submitButton = buttons.Should().ContainSingle(b => b.Text.Contains("Submit")).Subject;
            submitButton.Click();
        }

        public void SignInTask()
        {
            var buttons = webDriver.FindElements(By.TagName("button"));
            var signInTaskBtn = buttons.Should().ContainSingle(b => b.Text.Contains("Sign in to Task")).Subject;
            signInTaskBtn.Click();
        }

        public void selectRegistrationType()
        {
            var digitalRegCard = webDriver.FindElement(By.XPath("//mat-card/div/div/p/span[contains(text(),'evacuee registration & extensions')]"));
            digitalRegCard.Click();
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

        public void NoRadioButton()
        {
            var yesRadioButton = webDriver.FindElement(By.Id("noOption"));
            yesRadioButton.Click();
        }

        public void FillSearchEvacueeForm()
        {
            var firstName = "Anne";
            var lastName = "Lee";
            var dob = "09091999";
            
            Wait();

            var firstNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='firstName']"));
            firstNameInput.SendKeys(firstName);

            var lastNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='lastName']"));
            lastNameInput.SendKeys(lastName);

            var birthdayInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='dateOfBirth']"));
            birthdayInput.SendKeys(dob);

            var buttons = webDriver.FindElements(By.TagName("button"));
            var searchButton = buttons.Should().ContainSingle(b => b.Text.Contains("Search")).Subject;
            searchButton.Click();
        }

        public void NewEvacueeRegButton()
        {
            var buttons = webDriver.FindElements(By.TagName("button"));
            var searchButton = buttons.Should().ContainSingle(b => b.Text.Contains("New Evacuee Registration")).Subject;
            searchButton.Click();
        }

        public void WizardEvacueeDetailsForm()
        {
            var gender = "Female";

            var genderSelect = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='gender']"));
            genderSelect.SendKeys(gender);
        }

        public void WizardAddressForm()
        {
            Wait();

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

        public void WizardContactForm()
        {
            var phoneNumber = "2368887777";
            var email = "test@test.ca";

            Wait();

            var phoneInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='phone']"));
            phoneInput.SendKeys(phoneNumber);

            var emailInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='email']"));
            emailInput.SendKeys(email);

            var confirmEmailInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='confirmEmail']"));
            confirmEmailInput.SendKeys(email);
        }

        public void WizardSecurityQuestions()
        {
            Wait();

            var securityQuestion1 = "What was the name of your first pet?";
            var securityQuestion2 = "In what city or town was your mother born?";
            var securityQuestion3 = "Where was your first job?";
            var securityResponse1 = "Daisy";
            var securityResponse2 = "Vancouver";
            var securityResponse3 = "McDonalds";

            var securitySelect1 = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='question1']"));
            securitySelect1.SendKeys(securityQuestion1);

            Wait();

            var securitySelect2 = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='question2']"));
            securitySelect2.SendKeys(securityQuestion2);

            Wait();

            var securitySelect3 = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='question3']"));
            securitySelect3.SendKeys(securityQuestion3);

            var securityInput1 = webDriver.FindElement(By.CssSelector("input[formcontrolname='answer1']"));
            securityInput1.SendKeys(securityResponse1);

            var securityInput2 = webDriver.FindElement(By.CssSelector("input[formcontrolname='answer2']"));
            securityInput2.SendKeys(securityResponse2);

            var securityInput3 = webDriver.FindElement(By.CssSelector("input[formcontrolname='answer3']"));
            securityInput3.SendKeys(securityResponse3);
        }

        public void SaveProfileButton()
        {
            var buttons = webDriver.FindElements(By.TagName("button"));
            var saveButton = buttons.Should().ContainSingle(b => b.Text.Contains("Save Profile")).Subject;
            saveButton.Click();
        }

        public void WizardNextStepButton()
        {
            Wait();
            var buttons = webDriver.FindElements(By.TagName("button"));
            var nextStepButton = buttons.Should().ContainSingle(b => b.Text.Contains("Proceed to Next Step")).Subject;
            nextStepButton.Click();

        }



    }
}
