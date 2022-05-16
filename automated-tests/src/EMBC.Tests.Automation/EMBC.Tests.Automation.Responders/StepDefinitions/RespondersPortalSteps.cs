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

        [When(@"I complete a new online evacuee registration")]
        public void CompleteNewOnlineRegistration()
        {

            //click on Sign in to the Task #
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/responder-dashboard");
            evacueeRegistration.SignInTaskButton();

            //insert a task number
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/search/task");
            evacueeRegistration.EnterTaskNumber("UNIT-TEST-ACTIVE-TASK");

            //assign a task number
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/search/task-details");
            evacueeRegistration.SignInTask();

            //select a registration type
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/search/evacuee");
            evacueeRegistration.SelectOnlineRegistrationType();

            //choose presented gov-id option
            evacueeRegistration.SelectGovernmentID();

            //fill evacuee information search
            evacueeRegistration.FillOnlineSearchEvacueeForm("Automation", "MayThirteen", "05131999");

            //click new evacuee registration
            evacueeRegistration.NewEvacueeRegButton();


            //Wizard STEP 1:
            //click next on Collection Notice
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/collection-notice");
            evacueeRegistration.WizardCollectionNotice();

            //click yes on restriction page
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/restriction");
            evacueeRegistration.WizardRestriction();

            //fill evacuee details form
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/evacuee-details");
            evacueeRegistration.WizardEvacueeDetailsForm("Female");

            //fill address form
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/address");
            evacueeRegistration.WizardMinAddressForm("1012 Douglas St", "Victoria");

            //fill contact form
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/contact");
            evacueeRegistration.WizardMaxContactForm("4569999999", "test@test.ca");

            //fill security questions
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/security-questions");
            evacueeRegistration.WizardSecurityQuestions();

            //review profile and submit
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/review");
            evacueeRegistration.WizardReviewProfileForm();
            evacueeRegistration.WizardNextStepButton();

            //Wizard STEP 2:
            //fill evacuation details
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/evacuation-details");
            evacueeRegistration.WizardOnlineEvacDetailsFormReqFields("Victoria EMBC Main Centre", "House loss");

            //fill household members
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/household-members");
            evacueeRegistration.WizardHouseholdMembersMinForm();

            //fill animals
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/animals");
            evacueeRegistration.AnimalsMinForm();

            //fill needs assessments
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/needs");
            evacueeRegistration.WizardNeedsAssessmentsForm();

            //fill secret phrase
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/security-phrase");
            evacueeRegistration.WizardSecurityPhraseForm("Sesame");

            //review ESS File and submit
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/review");
            evacueeRegistration.WizardReviewEssFile();
            evacueeRegistration.WizardNextStepButton();

            //Wizard STEP 3:
            //add support
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            evacueeRegistration.WizardAddSupport();

            //select support
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            evacueeRegistration.WizardSelectSupportForm("Food - Groceries");

            //add support details
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            evacueeRegistration.SupportFoodDetailsForm("3", "50.50");

            //add support delivery
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            evacueeRegistration.SupportDeliveryForm("Adrien Doe");
            evacueeRegistration.SuccessSupportPopUp();

            //process support
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            evacueeRegistration.WizardProcessDraftSupports();

            //review process support
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/review");
            evacueeRegistration.WizardOnlineProcessSupportsForm();

        }


        [When(@"I complete a new paper based evacuee registration")]
        public void CompleteNewPaperBasedRegistration()
        {
            //click on Sign in to the Task #
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/responder-dashboard");
            evacueeRegistration.SignInTaskButton();

            //insert a task number
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/search/task");
            evacueeRegistration.EnterTaskNumber("UNIT-TEST-ACTIVE-TASK");

            //assign a task number
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/search/task-details");
            evacueeRegistration.SignInTask();

            //select a registration type
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/search/evacuee");
            evacueeRegistration.SelectPaperBasedRegistrationType();

            //choose presented gov-id option
            evacueeRegistration.SelectGovernmentID();

            //fill evacuee information search
            evacueeRegistration.FillPaperBasedSearchEvacueeForm("Automation", "Maythirteen", "05131999");

            //click new evacuee registration
            evacueeRegistration.NewEvacueeRegButton();


            //Wizard STEP 1:
            //click next on Collection Notice
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/collection-notice");
            evacueeRegistration.WizardCollectionNotice();

            //click yes on restriction page
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/restriction");
            evacueeRegistration.WizardRestriction();

            //fill evacuee details form
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/evacuee-details");
            evacueeRegistration.WizardEvacueeDetailsForm("Female");

            //fill address form
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/address");
            evacueeRegistration.WizardMaxAddressForm("Australia", "1012 Exford St", "Brisbane");

            //fill contact form
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/contact");
            evacueeRegistration.WizardMinContactForm();

            //review profile and submit
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/review");
            evacueeRegistration.WizardReviewProfileForm();
            evacueeRegistration.WizardNextStepButton();

            //Wizard STEP 2:
            //fill evacuation details
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/evacuation-details");
            evacueeRegistration.WizardPaperBasedEvacDetailsFormReqFields("John", "S", "05/13/2022", "1500", "1012 Douglas St", "Victoria", "Victoria EMBC Main Centre", "House loss");

            //fill household members
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/household-members");
            evacueeRegistration.WizardHouseholdMembersMaxForm("Anne", "Doe", "Female", "09/12/2001", "Lactose intolerant");

            //fill animals
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/animals");
            evacueeRegistration.AnimalsMaxForm("Dogs", "2");

            //fill needs assessments
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/needs");
            evacueeRegistration.WizardNeedsAssessmentsForm();

            //review ESS File and submit
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/ess-file/review");
            evacueeRegistration.WizardReviewEssFile();
            evacueeRegistration.WizardNextStepButton();

            //Wizard STEP 3:
            //add support
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            evacueeRegistration.WizardAddSupport();

            //select support
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            evacueeRegistration.WizardSelectSupportForm("Lodging - Hotel/Motel");

            //add support details
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            evacueeRegistration.SupportPaperBasedHotelDetailsForm("John", "S", "05/13/2022", "05/20/2022", "1500", "2");

            //add support delivery
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            evacueeRegistration.SupportDeliveryForm("Andrew Doe");
            evacueeRegistration.SuccessSupportPopUp();

            //process support
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            evacueeRegistration.WizardProcessDraftSupports();

            //review process support
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/review");
            evacueeRegistration.WizardPaperBasedProcessSupportsForm();
        }

        [When(@"I create a interact support")]
        public void CreateInteracSupport()
        {
            //click on Sign in to the Task #
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/responder-dashboard");
            evacueeRegistration.SignInTaskButton();

            //insert a task number
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/search/task");
            evacueeRegistration.EnterTaskNumber("UNIT-TEST-ACTIVE-TASK");

            //assign a task number
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/search/task-details");
            evacueeRegistration.SignInTask();

            //select a registration type
            evacueeRegistration.CurrentLocation.Should().Be("/responder-access/search/evacuee");
            evacueeRegistration.SelectOnlineRegistrationType();

            //choose presented gov-id option
            evacueeRegistration.SelectGovernmentID();

            //fill evacuee information search
            evacueeRegistration.FillOnlineSearchEvacueeForm("Automation", "MayThirteen", "05131999");

            //Select an ESS File
            evacueeRegistration.SelectESSFileFromSearch(2);

            //Click on Edit ESS File Button
            evacueeRegistration.ESSFileDashEditButton();

            //Passing ESS File Step
            evacueeRegistration.WizardEditESSFilePassStep();
            evacueeRegistration.WizardNextStepButton();




        }

        [Then(@"A registration is completed with an active support")]
        public void SupportCreated()
        {
            evacueeRegistration.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            evacueeRegistration.SupportCreatedSuccessfully();
        }
    }
}
