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
        public RespondersMgmtSteps(BrowserDriver driver)
        {
            responderManagement = new ResponderManagement(driver.Current);
        }

        [StepDefinition(@"I create a new team member")]
        public void CreateNewTeamMember()
        {
            responderManagement.EnterResponderManagement();
            responderManagement.CurrentLocation.Should().Be("/responder-access/responder-management/details/member-list");
            responderManagement.AddNewTeamMemberTab();
            responderManagement.CurrentLocation.Should().Be("/responder-access/responder-management/add-member");
            responderManagement.AddNewTeamMember("Auto", "Test", "automationTeam");
        }

        [StepDefinition(@"I search for a team member")]
        public void SearchTeamMember()
        {
            responderManagement.EnterResponderManagement();
            responderManagement.CurrentLocation.Should().Be("/responder-access/responder-management/details/member-list");
            responderManagement.SearchTeamMember("automationTeam");
        }

        [StepDefinition(@"I change a team member status")]
        public void ChangeMemberStatus()
        {
            responderManagement.ChangeTeamMemberStatus();
        }

        [StepDefinition(@"The team member status is deactive")]
        public void MemberStatusDeactive()
        {
            responderManagement.CurrentLocation.Should().Be("/responder-access/responder-management/details/member-list");
            Assert.True(responderManagement.GetMemberStatus().Equals("Deactivated")); ;
        }

        [StepDefinition(@"I delete a team member")]
        public void DeleteTeamMember()
        {
            responderManagement.SelectTeamMember();
            responderManagement.CurrentLocation.Should().Be("/responder-access/responder-management/details/member-details");
            responderManagement.DeleteTeamMember();
        }

        [StepDefinition(@"The team member does not exist")]
        public void MemberNotFound()
        {
            responderManagement.CurrentLocation.Should().Be("/responder-access/responder-management/details/member-list");
            Assert.True(responderManagement.GetTotalSearchNumber().Equals(0));
        }
    }
}
