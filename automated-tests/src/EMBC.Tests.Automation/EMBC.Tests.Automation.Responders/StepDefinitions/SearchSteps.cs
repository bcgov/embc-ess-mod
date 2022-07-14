using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace EMBC.Tests.Automation.Responders.StepDefinitions
{
    [Binding]
    public sealed class SearchSteps
    {
        private readonly SearchEvacuee searchEvacuee;
        private readonly ESSFileDashboard essFileDashboard;
        private readonly EvacueeDashboard evacueeDashboard;
        private readonly IEnumerable<Evacuee> evacuees;

        public SearchSteps(BrowserDriver driver)
        {
            searchEvacuee = new SearchEvacuee(driver.Current);
            essFileDashboard = new ESSFileDashboard(driver.Current);
            evacueeDashboard = new EvacueeDashboard(driver.Current);
            evacuees = driver.Configuration.GetSection("evacuees").Get<IEnumerable<Evacuee>>();
        }

        [StepDefinition(@"I search for an online evacuee (.*)")]
        public void OnlineEvacueeSearch(string evacueeLastName)
        {
            //select a registration type
            searchEvacuee.CurrentLocation.Should().Be("/responder-access/search/evacuee");
            searchEvacuee.SelectOnlineRegistrationType();

            //choose presented gov-id option
            searchEvacuee.SelectGovernmentID();

            //fill evacuee information search
            var evacuee = evacuees.SingleOrDefault(u => u.LastName.Equals(evacueeLastName, StringComparison.OrdinalIgnoreCase));
            if (evacuee == null) throw new InvalidOperationException($"User {evacueeLastName} not found in the test configuration");

            searchEvacuee.FillOnlineSearchEvacueeForm(evacuee.Name, evacuee.LastName, evacuee.Dob);
        }

        [StepDefinition(@"I search for a paper based evacuee (.*)")]
        public void PaperBasedEvacueeSearch(string evacueeLastName)
        {
            //select a registration type
            searchEvacuee.CurrentLocation.Should().Be("/responder-access/search/evacuee");
            searchEvacuee.SelectPaperBasedRegistrationType();

            //choose presented gov-id option
            searchEvacuee.SelectGovernmentID();

            //fill evacuee information search
            var evacuee = evacuees.SingleOrDefault(u => u.LastName.Equals(evacueeLastName, StringComparison.OrdinalIgnoreCase));
            if (evacuee == null) throw new InvalidOperationException($"User {evacueeLastName} not found in the test configuration");

            searchEvacuee.FillPaperBasedSearchEvacueeForm(evacuee.Name, evacuee.LastName, evacuee.Dob);
        }

        [StepDefinition(@"I choose an ESS file from the search results")]
        public void EditSelectedEssFile()
        {
            //Select an ESS File
            essFileDashboard.SelectESSFileFromSearch(1);

            //Click on Edit ESS File Button
            essFileDashboard.ESSFileDashEditButton();
        }

        [StepDefinition(@"I create a new ESS File from selected evacuee")]
        public void CreateNewEssFileForEvacuee()
        {
            //Select an evacuee Profile
            evacueeDashboard.SelectProfileFromSearch(1);

            //Click on Create a new ESS File
            evacueeDashboard.CreateNewEssFileFromProfileDashboard();
            
        }

        public class Evacuee
        {
            public string Name { get; set; } = null!;
            public string LastName { get; set; } = null!;
            public string Dob { get; set; } = null!;
        }

    }
}
