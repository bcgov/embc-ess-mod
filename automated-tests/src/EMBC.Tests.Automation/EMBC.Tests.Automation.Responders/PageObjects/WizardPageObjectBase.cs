using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    public abstract class WizardPageObjectBase : PageObjectBase
    {
        protected By personFormFirstNameInput = By.CssSelector("input[formcontrolname='firstName']");
        protected By personFormLastNameInput = By.CssSelector("input[formcontrolname='lastName']");
        protected By personFormGenderSelect = By.CssSelector("mat-select[formcontrolname='gender']");
        protected By personFormDateOfBirthInput = By.CssSelector("input[formcontrolname='dateOfBirth']");
        protected By addressFormAddressLine1Input = By.CssSelector("input[formcontrolname='addressLine1']");
        protected By addressFormCityInput = By.CssSelector("input[formcontrolname='community']");
        protected By wizardInterviewerInitialsInput = By.CssSelector("input[formcontrolname='lastNameInitial']");

        public WizardPageObjectBase(IWebDriver webDriver) : base(webDriver)
        { }

        public void NewEvacueeRegButton()
        {
            ButtonElement("New Evacuee Registration");
        }

        public void WizardNextStepButton()
        {
            Wait();
            this.ButtonElement("Proceed to Next Step");
        }
    }
}
