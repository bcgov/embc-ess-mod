using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.StepDefinitions
{
    [Binding]
    public sealed class SearchSteps
    {
        private readonly SearchEvacuee searchEvacuee;
        private readonly ESSFileDashboard essFileDashboard;

        public SearchSteps(BrowserDriver driver)
        {
            searchEvacuee = new SearchEvacuee(driver.Current);
            essFileDashboard = new ESSFileDashboard(driver.Current);
        }

        [StepDefinition(@"I search for an online evacuee")]
        public void OnlineEvacueeSearch()
        {
            //select a registration type
            searchEvacuee.CurrentLocation.Should().Be("/responder-access/search/evacuee");
            searchEvacuee.SelectOnlineRegistrationType();

            //choose presented gov-id option
            searchEvacuee.SelectGovernmentID();

            //fill evacuee information search
            searchEvacuee.FillOnlineSearchEvacueeForm("Evac", "Thirtythree", "04052002");
        }

        [StepDefinition(@"I search for a paper based evacuee")]
        public void PaperBasedEvacueeSearch()
        {
            //select a registration type
            searchEvacuee.CurrentLocation.Should().Be("/responder-access/search/evacuee");
            searchEvacuee.SelectPaperBasedRegistrationType();

            //choose presented gov-id option
            searchEvacuee.SelectGovernmentID();

            //fill evacuee information search
            searchEvacuee.FillPaperBasedSearchEvacueeForm("Automation", "Maytwentysix", "05262000");
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
