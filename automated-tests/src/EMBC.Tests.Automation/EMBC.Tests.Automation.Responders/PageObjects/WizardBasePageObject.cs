using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    public class WizardBasePageObject : PageObjectBase
    {
        protected By addressFormAddressLine1Input = By.CssSelector("input[formcontrolname='addressLine1']");
        protected By addressFormCityInput = By.CssSelector("input[formcontrolname='community']");
        protected By wizardInterviewerInitialsInput = By.CssSelector("input[formcontrolname='lastNameInitial']");

        public WizardBasePageObject(IWebDriver webDriver) : base(webDriver)
        { }

        public void WizardNextStepButton()
        {
            Wait();
            this.ButtonElement("Proceed to Next Step");
        }
    }
}
