using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.StepDefinitions
{
    [Binding]
    public sealed class EssFileDashboardSteps
    {
        private readonly ESSFileDashboard essFileDashboard;

        public EssFileDashboardSteps(BrowserDriver driver)
        {
            essFileDashboard = new ESSFileDashboard(driver.Current);
        }

        [StepDefinition(@"I choose an ESS file from the search results")]
        public void EditSelectedEssFile()
        {
            //Select an ESS File
            essFileDashboard.SelectESSFileFromSearch(2);

            //Click on Edit ESS File Button
            essFileDashboard.ESSFileDashEditButton();
        }
    }
}
