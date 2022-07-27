using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Registrants.PageObjects
{
    public class EvacueeDashboard : PageObjectBase
    {
        private By addESSFileButton = By.XPath("//button/span[contains(text(), 'Add Another Event')]");

        public EvacueeDashboard(IWebDriver webDriver) : base(webDriver)
        { }

        public void CreateNewEvent()
        {
            Wait();
            if (webDriver.FindElements(addESSFileButton).Count > 0)
            {
                ButtonElement("Add Another Event");
                ButtonElement("Yes, Continue");
            }
            else
            {
                ButtonElement("Create ESS File");
            }

            
        }
    }
}
