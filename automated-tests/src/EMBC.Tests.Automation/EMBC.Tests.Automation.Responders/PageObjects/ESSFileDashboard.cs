using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    public class ESSFileDashboard: PageObjectBase
    {
        private By searchRemoteExtensionsFound = By.XPath("//button/span[contains(text(), 'Extend Supports')]");

        public ESSFileDashboard(IWebDriver webDriver) : base(webDriver)
        { }

        public void SelectESSFileFromSearch(int essFileNbr)
        {
            Wait();
            var js = (IJavaScriptExecutor)webDriver;

            var selectedEssFileElement = "//app-ess-files-results[1]/div[" + essFileNbr + "]/mat-card[1]/div[1]/div[1]/div[1]/div[1]/a[1]";
            var selectedEssFileLink = webDriver.FindElement(By.XPath(selectedEssFileElement));

            js.ExecuteScript("arguments[0].scrollIntoView();", selectedEssFileLink);

            Wait();
            selectedEssFileLink.Click();
        }

        public void ESSFileDashEditButton()
        {
            ButtonElement("Edit ESS File");
        }

        public void RemoteExtensionESSFileFound()
        {
            Wait();
            Assert.True(webDriver.FindElement(searchRemoteExtensionsFound).Displayed);
        }
    }
}
