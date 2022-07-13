using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.StepDefinitions
{
    [Binding]
    public sealed class RespondersMgmtSteps
    {
        private readonly ResponderManagement responderManagement;
        private readonly LoginSteps loginSteps;

        private readonly string userName = "ess.developerA1";
        private readonly string memberFirstName = "autotest-John";
        private readonly string memberLastName = "autotest-Smith";
        private readonly string memberBCeID = "autotest-automationTeam";
        public RespondersMgmtSteps(BrowserDriver driver)
        {
            loginSteps = new LoginSteps(driver);
            responderManagement = new ResponderManagement(driver.Current);
        }

        [StepDefinition(@"I create a new team member")]
        public void CreateNewTeamMember()
        {
            //Login
            loginSteps.Bcsc(userName);

            //Create a new member
            responderManagement.EnterResponderManagement();
            responderManagement.CurrentLocation.Should().Be("/responder-access/responder-management/details/member-list");
            responderManagement.AddNewTeamMemberTab();
            responderManagement.CurrentLocation.Should().Be("/responder-access/responder-management/add-member");
            responderManagement.AddNewTeamMember(memberFirstName, memberLastName, memberBCeID);

            //Change Member Status
            SearchTeamMember();
            responderManagement.ChangeTeamMemberStatus();

            //Check Member status
            SearchTeamMember();
            responderManagement.CurrentLocation.Should().Be("/responder-access/responder-management/details/member-list");
            Assert.True(responderManagement.GetMemberStatus().Equals("Deactivated"));

        }

        [StepDefinition(@"I delete a team member")]
        public void DeleteTeamMember()
        {
            SearchTeamMember();
            responderManagement.SelectTeamMember();
            responderManagement.CurrentLocation.Should().Be("/responder-access/responder-management/details/member-details");
            responderManagement.DeleteTeamMember();
        }

        [StepDefinition(@"The team member does not exist")]
        public void MemberNotFound()
        {
            SearchTeamMember();
            responderManagement.CurrentLocation.Should().Be("/responder-access/responder-management/details/member-list");
            Assert.True(responderManagement.GetTotalSearchNumber().Equals(0));
        }

        private void SearchTeamMember()
        {
            responderManagement.EnterResponderManagement();
            responderManagement.CurrentLocation.Should().Be("/responder-access/responder-management/details/member-list");
            responderManagement.SearchTeamMember("automationTeam");
        }
    }
}
