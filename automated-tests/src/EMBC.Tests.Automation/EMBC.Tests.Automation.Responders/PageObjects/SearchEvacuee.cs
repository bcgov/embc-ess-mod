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
        private By remoteExtensionsRegCard = By.XPath("//mat-card/div/div/p/span[contains(text(),'remote extensions')]");
        private By searchPaperBasedEssFile = By.CssSelector("input[formcontrolname='paperBasedEssFile']");
        private By searchRemoteExtensionsEssFile = By.CssSelector("input[formcontrolname='essFileNumber']");
        private By searchRemoteExtensionNotFound = By.XPath("//b[contains(text(),'ESS File Results (0)')]");


        public SearchEvacuee(IWebDriver webDriver) : base(webDriver)
        { }

        //FUNCTIONS:
        public void SelectOnlineRegistrationType()
        {
            
            FocusAndClick(digitalRegCard);
            this.ButtonElement("Next");
        }

        public void SelectPaperBasedRegistrationType()
        {
            FocusAndClick(paperBasedRegCard);
            this.ButtonElement("Next");
        }

        public void SelectRemoteExtensionsRegistrationType()
        {
            FocusAndClick(remoteExtensionsRegCard);
            this.ButtonElement("Next");
        }

        public void SelectGovernmentID()
        {
            this.FocusAndClick(By.Id("yesOption"));
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
            
            var essfile = Randomizer("D6");

            Wait();

            webDriver.FindElement(personFormFirstNameInput).SendKeys(firstName);
            webDriver.FindElement(personFormLastNameInput).SendKeys(lastName);
            webDriver.FindElement(personFormDateOfBirthInput).SendKeys(dob);
            webDriver.FindElement(searchPaperBasedEssFile).SendKeys(essfile);

            this.ButtonElement("Search");
        }

        public void FillRemoteExtensionESSFile(string essFileNumber)
        {
            Wait();

            webDriver.FindElement(searchRemoteExtensionsEssFile).SendKeys(essFileNumber);

            this.ButtonElement("Search");

        }

        public void RemoteExtensionESSFileNotFound()
        {
            Wait();
            Assert.True(webDriver.FindElement(searchRemoteExtensionNotFound).Displayed);
        }

    }
}
