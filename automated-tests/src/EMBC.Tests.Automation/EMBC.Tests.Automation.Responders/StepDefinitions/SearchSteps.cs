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

        public SearchSteps(BrowserDriver driver)
        {
            searchEvacuee = new SearchEvacuee(driver.Current);
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
            searchEvacuee.FillOnlineSearchEvacueeForm("Automation", "MayThirteen", "05131999");
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
            searchEvacuee.FillPaperBasedSearchEvacueeForm("Automation", "Maythirteen", "05131999");
        }
    }
}
