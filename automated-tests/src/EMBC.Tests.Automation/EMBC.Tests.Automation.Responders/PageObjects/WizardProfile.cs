using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    public class WizardProfile: WizardPageObjectBase
    {
        //ELEMENTS:
        private By addressFormIsBCAddressYesRadioBttn = By.CssSelector("[formcontrolname='isBcAddress'] mat-radio-button:nth-child(1)");
        private By addressFormIsBCAddressNoRadioBttn = By.CssSelector("[formcontrolname='isBcAddress'] mat-radio-button:nth-child(2)");
        private By addressFormCountryInput = By.CssSelector("input[formcontrolname='country']");
        private By addressFormIsMailingAddressYesRadioBttn = By.CssSelector("[formcontrolname='isNewMailingAddress'] mat-radio-button:nth-child(1)");
        private By contactFormPhoneInput = By.CssSelector("input[formcontrolname='phone']");
        private By contactFormEmailInput = By.CssSelector("input[formcontrolname='email']");
        private By contactFormConfirmEmailInput = By.CssSelector("input[formcontrolname='confirmEmail']");
        private By securityQuestionFormQuestion1Input = By.CssSelector("mat-select[formcontrolname='question1']");
        private By securityQuestionFormQuestion2Input = By.CssSelector("mat-select[formcontrolname='question2']");
        private By securityQuestionFormQuestion3Input = By.CssSelector("mat-select[formcontrolname='question3']");
        private By securityQuestionFormAnswer1Input = By.CssSelector("input[formcontrolname='answer1']");
        private By securityQuestionFormAnswer2Input = By.CssSelector("input[formcontrolname='answer2']");
        private By securityQuestionFormAnswer3Input = By.CssSelector("input[formcontrolname='answer3']");


        public WizardProfile(IWebDriver webDriver) : base(webDriver)
        { }

        //FUNCTIONS
        public void WizardCollectionNotice()
        {
            ButtonElement("Next");
        }

        public void WizardRestriction()
        {
            YesRadioButton();
            ButtonElement("Next");
        }

        public void WizardEvacueeDetailsForm(string gender)
        {
            webDriver.FindElement(personFormGenderSelect).SendKeys(gender);
            ButtonElement("Next");
        }

        public void WizardMinAddressForm(string addressLine1, string city)
        {
            Wait();

            FocusAndClick(addressFormIsBCAddressYesRadioBttn);

            webDriver.FindElement(addressFormAddressLine1Input).SendKeys(addressLine1);
            webDriver.FindElement(addressFormCityInput).SendKeys(city);
            webDriver.FindElement(By.Id(city)).Click();

            FocusAndClick(addressFormIsMailingAddressYesRadioBttn);
            ButtonElement("Next");
        }

        public void WizardMaxAddressForm(string country, string addressLine1, string city)
        {
            Wait();

            FocusAndClick(addressFormIsBCAddressNoRadioBttn);
            webDriver.FindElement(addressFormCountryInput).SendKeys(country);
            webDriver.FindElement(By.Id(country)).Click();
            webDriver.FindElement(addressFormAddressLine1Input).SendKeys(addressLine1);
            webDriver.FindElement(addressFormCityInput).SendKeys(city);

            FocusAndClick(addressFormIsMailingAddressYesRadioBttn);
            ButtonElement("Next");
        }

        public void WizardMinContactForm()
        {
            Wait();

            NoRadioButton();
            ButtonElement("Next");
        }

        public void WizardMaxContactForm(string phoneNumber, string email)
        {
            Wait();

            YesRadioButton();

            webDriver.FindElement(contactFormPhoneInput).SendKeys(phoneNumber);
            webDriver.FindElement(contactFormEmailInput).SendKeys(email);
            webDriver.FindElement(contactFormConfirmEmailInput).SendKeys(email);
            
            ButtonElement("Next");
        }

        public void WizardSecurityQuestions(string securityQuestion1, string securityQuestion2, string securityQuestion3, string securityResponse1, string securityResponse2, string securityResponse3)
        {
            Wait();
            webDriver.FindElement(securityQuestionFormQuestion1Input).SendKeys(securityQuestion1);
            
            Wait();
            webDriver.FindElement(securityQuestionFormQuestion2Input).SendKeys(securityQuestion2);

            Wait();
            webDriver.FindElement(securityQuestionFormQuestion3Input).SendKeys(securityQuestion3);

            webDriver.FindElement(securityQuestionFormAnswer1Input).SendKeys(securityResponse1);
            webDriver.FindElement(securityQuestionFormAnswer2Input).SendKeys(securityResponse2);
            webDriver.FindElement(securityQuestionFormAnswer3Input).SendKeys(securityResponse3);

            ButtonElement("Next");
        }

        public void WizardReviewProfileForm()
        {
            YesRadioButton();
            ButtonElement("Save Profile");
        }
    }
}
