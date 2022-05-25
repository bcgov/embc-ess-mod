using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    public class SearchEvacuee : PageObjectBase
    {
        //ELEMENTS:
        private By personFormFirstNameInput = By.CssSelector("input[formcontrolname='firstName']");
        private By personFormLastNameInput = By.CssSelector("input[formcontrolname='lastName']");
        private By personFormDateOfBirthInput = By.CssSelector("input[formcontrolname='dateOfBirth']");
        private By digitalRegCard = By.XPath("//mat-card/div/div/p/span[contains(text(),'evacuee registration & extensions')]");
        private By paperBasedRegCard = By.XPath("//mat-card/div/div/p/span[contains(text(),'data entry')]");
        private By searchPaperBasedEssFile = By.CssSelector("input[formcontrolname='paperBasedEssFile']");

        public SearchEvacuee(IWebDriver webDriver) : base(webDriver)
        { }

        //FUNCTIONS:
        public void SelectOnlineRegistrationType()
        {
            
            webDriver.FindElement(digitalRegCard).Click();
            this.ButtonElement("Next");
        }

        public void SelectPaperBasedRegistrationType()
        {
            webDriver.FindElement(paperBasedRegCard).Click();
            this.ButtonElement("Next");
        }

        public void SelectGovernmentID()
        {
            this.RadioButtonElement(By.Id("yesOption"));
            this.ButtonElement("Next");
        }

        public void FillOnlineSearchEvacueeForm(string firstName, string lastName, string dob)
        {
            Wait();

            webDriver.FindElement(personFormFirstNameInput).SendKeys(firstName);
            webDriver.FindElement(personFormLastNameInput).SendKeys(lastName);
            webDriver.FindElement(personFormDateOfBirthInput).SendKeys(dob);
            
            this.ButtonElement("Search");
        }

        public void FillPaperBasedSearchEvacueeForm(string firstName, string lastName, string dob)
        {
            Random random = new Random();
            var essfile = random.Next(0, 1000000).ToString("D6");

            Wait();

            webDriver.FindElement(personFormFirstNameInput).SendKeys(firstName);
            webDriver.FindElement(personFormLastNameInput).SendKeys(lastName);
            webDriver.FindElement(personFormDateOfBirthInput).SendKeys(dob);
            webDriver.FindElement(searchPaperBasedEssFile).SendKeys(essfile);

            this.ButtonElement("Search");
        }

    }
}
