using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.StepDefinitions
{
    [Binding]
    public sealed class RespondersPortalSteps
    {
        private readonly EvacueeRegistration evacueeRegistration;

        public RespondersPortalSteps(BrowserDriver driver)
        {
            this.evacueeRegistration = new EvacueeRegistration(driver.Current);
        }

        [When(@"I complete a new evacuee registration")]
        public void CompleteNewRegistration()
        {

            //click on Sign in to the Task #
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/responder-dashboard");
            evacueeRegistration.SignInTaskButton();

            //insert a task number
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/search/task");
            evacueeRegistration.EnterTaskNumber();

            //assign a task number
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/search/task-details");
            evacueeRegistration.SignInTask();

            //select a registration type
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/search/evacuee");
            evacueeRegistration.selectRegistrationType();
            evacueeRegistration.NextButton();

            //choose presented gov-id option
            evacueeRegistration.YesRadioButton();
            evacueeRegistration.NextButton();

            //fill evacuee information search
            evacueeRegistration.FillSearchEvacueeForm();

            //click new evacuee registration
            evacueeRegistration.NewEvacueeRegButton();


            //Wizard STEP 1:
            //click next on Collection Notice
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/collection-notice");
            evacueeRegistration.NextButton();

            //click yes on restriction page
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/restriction");
            evacueeRegistration.YesRadioButton();
            evacueeRegistration.NextButton();

            //fill evacuee details form
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/evacuee-details");
            evacueeRegistration.WizardEvacueeDetailsForm();
            evacueeRegistration.NextButton();

            //fill address form
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/address");
            evacueeRegistration.WizardAddressForm();
            evacueeRegistration.NextButton();

            //fill contact form
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/contact");
            evacueeRegistration.YesRadioButton();
            evacueeRegistration.WizardContactForm();
            evacueeRegistration.NextButton();

            //fill security questions
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/security-questions");
            evacueeRegistration.WizardSecurityQuestions();
            evacueeRegistration.NextButton();

            //review profile and submit
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/review");
            evacueeRegistration.YesRadioButton();
            evacueeRegistration.SaveProfileButton();
            evacueeRegistration.WizardNextStepButton();

            //Wizard STEP 2:
            //fill evacuation details
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/evacuation-details");
            evacueeRegistration.EvacuationDetailsFormReqFields();
            evacueeRegistration.NextButton();

            //fill household members
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/household-members");
            evacueeRegistration.HouseholdMembersMinForm();
            evacueeRegistration.NextButton();

            //fill animals
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/animals");
            evacueeRegistration.AnimalsMinForm();
            evacueeRegistration.NextButton();

            //fill needs assessments
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/needs");
            evacueeRegistration.NeedsAssessmentsForm();
            evacueeRegistration.NextButton();

            //fill secret phrase
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/security-phrase");
            evacueeRegistration.SecurityPhraseForm();
            evacueeRegistration.NextButton();

            //review ESS File and submit
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/review");
            evacueeRegistration.SaveEssFileButton();
            evacueeRegistration.WizardNextStepButton();

            //Wizard STEP 3:
            //add support
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            evacueeRegistration.AddSupportsButton();

            //select support
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            evacueeRegistration.SelectSupportForm();

            //add support details
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            evacueeRegistration.SupportFoodDetailsForm();

            //add support delivery
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            evacueeRegistration.SupportDeliveryForm();
            evacueeRegistration.CloseButton();

            //process support
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            evacueeRegistration.ProcessSupportButton();

            //review process support
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/review");
            evacueeRegistration.ProcessDraftForm();





        }
    }
}
