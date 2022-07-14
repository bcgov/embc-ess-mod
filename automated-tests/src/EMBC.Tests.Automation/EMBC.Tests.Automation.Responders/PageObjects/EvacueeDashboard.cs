using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    
    public class EvacueeDashboard : PageObjectBase
    {
        private By selectedEvacueeProfile = By.XPath("//app-profile-results[1]/div[1]/mat-card[1]/div[1]/div[1]/a[1]");

        public EvacueeDashboard(IWebDriver webDriver) : base(webDriver)
        {}

        public void SelectProfileFromSearch(int profileNbr)
        {
            Wait();
            FocusAndClick(selectedEvacueeProfile);
        }

        public void CreateNewEssFileFromProfileDashboard()
        {
            Wait();
            ButtonElement("Create New ESS File");
        }
    }
}
