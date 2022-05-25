using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.StepDefinitions
{
    [Binding]
    public sealed class WizardSteps
    {
        private readonly WizardProfile wizardProfile;
        private readonly WizardEssFile wizardEssFile;
        private readonly WizardSupport wizardSupport;

        public WizardSteps(BrowserDriver driver)
        {
            wizardProfile = new WizardProfile(driver.Current);
            wizardEssFile = new WizardEssFile(driver.Current);
            wizardSupport = new WizardSupport(driver.Current);
        }


        [StepDefinition(@"I complete an online registration")]
        public void OnlineWizardProfileStep()
        {
            //click new evacuee registration
            wizardProfile.NewEvacueeRegButton();

            //Wizard STEP 1:
            //click next on Collection Notice
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/collection-notice");
            wizardProfile.WizardCollectionNotice();

            //click yes on restriction page
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/restriction");
            wizardProfile.WizardRestriction();

            //fill evacuee details form
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/evacuee-details");
            wizardProfile.WizardEvacueeDetailsForm("Female");

            //fill address form
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/address");
            wizardProfile.WizardMinAddressForm("1012 Douglas St", "Victoria");

            //fill contact form
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/contact");
            wizardProfile.WizardMaxContactForm("4569999999", "test@test.ca");

            //fill security questions
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/security-questions");
            wizardProfile.WizardSecurityQuestions("What was the name of your first pet?", "In what city or town was your mother born?", "Where was your first job?", "Daisy", "Vancouver", "McDonalds");

            //review profile and submit
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/review");
            wizardProfile.WizardReviewProfileForm();
            wizardProfile.WizardNextStepButton();

            //WIZARD STEP 2:
            //fill evacuation details
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/evacuation-details");
            wizardEssFile.WizardOnlineEvacDetailsFormReqFields("Victoria EMBC Main Centre", "House loss");

            //fill household members
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/household-members");
            wizardEssFile.WizardHouseholdMembersMinForm();

            //fill animals
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/animals");
            wizardEssFile.AnimalsMinForm();

            //fill needs assessments
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/needs");
            wizardEssFile.WizardNeedsAssessmentsForm();

            //fill secret phrase
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/security-phrase");
            wizardEssFile.WizardSecurityPhraseForm("Sesame");

            //review ESS File and submit
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/review");
            wizardEssFile.WizardReviewEssFile();
            wizardEssFile.WizardNextStepButton();

            //WIZARD STEP 3:
            //add support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardAddSupport();

            //select support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            wizardSupport.WizardSelectSupportForm("Food - Groceries");

            //add support details
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            wizardSupport.SupportFoodDetailsForm("3", "50.50");

            //add support delivery
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            wizardSupport.SupportReferralDeliveryForm("Adrien Doe");
            wizardSupport.SuccessSupportPopUp();

            //process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardProcessDraftSupports();

            //review process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/review");
            wizardSupport.WizardOnlineProcessSupportsForm();
        }

        [StepDefinition(@"I complete a paper based registration")]
        public void PaperBasedWizardProfileStep()
        {
            //click new evacuee registration
            wizardProfile.NewEvacueeRegButton();

            //Wizard STEP 1:
            //click next on Collection Notice
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/collection-notice");
            wizardProfile.WizardCollectionNotice();

            //click yes on restriction page
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/restriction");
            wizardProfile.WizardRestriction();

            //fill evacuee details form
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/evacuee-details");
            wizardProfile.WizardEvacueeDetailsForm("Female");

            //fill address form
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/address");
            wizardProfile.WizardMaxAddressForm("Australia", "1012 Exford St", "Brisbane");

            //fill contact form
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/contact");
            wizardProfile.WizardMinContactForm();

            //review profile and submit
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/review");
            wizardProfile.WizardReviewProfileForm();
            wizardProfile.WizardNextStepButton();

            //STEP 2:
            //fill evacuation details
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/evacuation-details");
            wizardEssFile.WizardPaperBasedEvacDetailsFormReqFields("John", "S", "05/13/2022", "1500", "1012 Douglas St", "Victoria", "Victoria EMBC Main Centre", "House loss");

            //fill household members
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/household-members");
            wizardEssFile.WizardHouseholdMembersMaxForm("Anne", "Doe", "Female", "09/12/2001", "Lactose intolerant");

            //fill animals
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/animals");
            wizardEssFile.AnimalsMaxForm("Dogs", "2");

            //fill needs assessments
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/needs");
            wizardEssFile.WizardNeedsAssessmentsForm();

            //review ESS File and submit
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/review");
            wizardEssFile.WizardReviewEssFile();
            wizardEssFile.WizardNextStepButton();

            //WIZARD STEP 3:
            //add support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardAddSupport();

            //select support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            wizardSupport.WizardSelectSupportForm("Lodging - Hotel/Motel");

            //add support details
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            wizardSupport.SupportPaperBasedHotelDetailsForm("John", "S", "05/13/2022", "05/20/2022", "1500", "2");

            //add support delivery
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            wizardSupport.SupportReferralDeliveryForm("Andrew Doe");
            wizardSupport.SuccessSupportPopUp();

            //process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardProcessDraftSupports();

            //review process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/review");
            wizardSupport.WizardPaperBasedProcessSupportsForm();
        }

        [StepDefinition(@"I bypass ESS file wizard step")]
        public void BypassEssFileWizardStep()
        {
            //Passing ESS File Step
            wizardEssFile.WizardEditESSFilePassStep();
            wizardEssFile.WizardNextStepButton();
        }

        [StepDefinition(@"I create an Interac support")]
        public void CreateInteracSupport()
        {

            //WIZARD STEP 3:
            //add support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardAddSupport();

            //select support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            wizardSupport.WizardSelectSupportForm("Clothing");

            //add support details
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            wizardSupport.SupportClothingDetailsForm("135.99");

            //add support delivery
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            wizardSupport.SupportInteracDeliveryForm("test@test.ca", "7886889090");
            wizardSupport.SuccessSupportPopUp();

            //process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardOnlineProcessSupportsForm();
        }

        [StepDefinition(@"An online registration is completed with an active support")]
        public void OnlineSupportCreated()
        {
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            Assert.True(wizardSupport.GetSupportStatus().Equals("Active")); ;
        }

        [StepDefinition(@"A paper based registration is completed with an expired support")]
        public void PaperBasedSupportCreated()
        {
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            Assert.True(wizardSupport.GetSupportStatus().Equals("Expired")); ;
        }

        [StepDefinition(@"A registration is completed with a pending approval interac support")]
        public void OnlineInteracSupportCreated()
        {
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            Assert.True(wizardSupport.GetSupportStatus().Equals("Pending Approval")); ;
        }
    }
}
