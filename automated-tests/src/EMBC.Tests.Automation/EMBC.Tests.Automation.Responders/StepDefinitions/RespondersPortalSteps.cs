namespace EMBC.Tests.Automation.Responders.StepDefinitions
{
    [Binding]
    public sealed class RespondersPortalSteps
    {
        private readonly AssignTask assignTask;
        private readonly SearchEvacuee searchEvacuee;
        private readonly ESSFileDashboard essFileDashboard;
        private readonly WizardProfile wizardProfile;
        private readonly WizardEssFile wizardEssFile;
        private readonly WizardSupport wizardSupport;

        public RespondersPortalSteps(BrowserDriver driver)
        {
            
            this.assignTask = new AssignTask(driver.Current);
            this.searchEvacuee = new SearchEvacuee(driver.Current);
            this.essFileDashboard = new ESSFileDashboard(driver.Current);
            this.wizardProfile = new WizardProfile(driver.Current);
            this.wizardEssFile = new WizardEssFile(driver.Current);
            this.wizardSupport = new WizardSupport(driver.Current);
        }

        [When(@"I complete a new online evacuee registration")]
        public void CompleteNewOnlineRegistration()
        {
            //click on Sign in to the Task #
            assignTask.CurrentLocation.Should().Be("/responder-access/responder-dashboard");
            assignTask.SignInTaskButton();

            //insert a task number
            assignTask.CurrentLocation.Should().Be("/responder-access/search/task");
            assignTask.EnterTaskNumber("UNIT-TEST-ACTIVE-TASK");

            //assign a task number
            assignTask.CurrentLocation.Should().Be("/responder-access/search/task-details");
            assignTask.SignInTask();

            //select a registration type
            searchEvacuee.CurrentLocation.Should().Be("/responder-access/search/evacuee");
            searchEvacuee.SelectOnlineRegistrationType();

            //choose presented gov-id option
            searchEvacuee.SelectGovernmentID();

            //fill evacuee information search
            searchEvacuee.FillOnlineSearchEvacueeForm("Automation", "MayThirteen", "05131999");

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

            //Wizard STEP 2:
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

            //Wizard STEP 3:
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
            wizardSupport.SupportDeliveryForm("Adrien Doe");
            wizardSupport.SuccessSupportPopUp();

            //process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardProcessDraftSupports();

            //review process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/review");
            wizardSupport.WizardOnlineProcessSupportsForm();
        }

        [When(@"I complete a new paper based evacuee registration")]
        public void CompleteNewPaperBasedRegistration()
        {
            //click on Sign in to the Task #
            assignTask.CurrentLocation.Should().Be("/responder-access/responder-dashboard");
            assignTask.SignInTaskButton();

            //insert a task number
            assignTask.CurrentLocation.Should().Be("/responder-access/search/task");
            assignTask.EnterTaskNumber("UNIT-TEST-ACTIVE-TASK");

            //assign a task number
            assignTask.CurrentLocation.Should().Be("/responder-access/search/task-details");
            assignTask.SignInTask();

            //select a registration type
            searchEvacuee.CurrentLocation.Should().Be("/responder-access/search/evacuee");
            searchEvacuee.SelectPaperBasedRegistrationType();

            //choose presented gov-id option
            searchEvacuee.SelectGovernmentID();

            //fill evacuee information search
            searchEvacuee.FillPaperBasedSearchEvacueeForm("Automation", "Maythirteen", "05131999");

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

            //Wizard STEP 2:
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

            //Wizard STEP 3:
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
            wizardSupport.SupportDeliveryForm("Andrew Doe");
            wizardSupport.SuccessSupportPopUp();

            //process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardProcessDraftSupports();

            //review process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/review");
            wizardSupport.WizardPaperBasedProcessSupportsForm();
        }

        [When(@"I create an Interac support")]
        public void CreateInteracSupport()
        {
            //click on Sign in to the Task #
            assignTask.CurrentLocation.Should().Be("/responder-access/responder-dashboard");
            assignTask.SignInTaskButton();

            //insert a task number
            assignTask.CurrentLocation.Should().Be("/responder-access/search/task");
            assignTask.EnterTaskNumber("UNIT-TEST-ACTIVE-TASK");

            //assign a task number
            assignTask.CurrentLocation.Should().Be("/responder-access/search/task-details");
            assignTask.SignInTask();

            //select a registration type
            searchEvacuee.CurrentLocation.Should().Be("/responder-access/search/evacuee");
            searchEvacuee.SelectOnlineRegistrationType();

            //choose presented gov-id option
            searchEvacuee.SelectGovernmentID();

            //fill evacuee information search
            searchEvacuee.FillOnlineSearchEvacueeForm("Automation", "MayThirteen", "05131999");

            //Select an ESS File
            essFileDashboard.SelectESSFileFromSearch(2);

            //Click on Edit ESS File Button
            essFileDashboard.ESSFileDashEditButton();

            //Passing ESS File Step
            wizardEssFile.WizardEditESSFilePassStep();
            wizardEssFile.WizardNextStepButton();
        }

        [Then(@"A registration is completed with an active support")]
        public void SupportCreated()
        {
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            Assert.True(wizardSupport.GetSupportStatus().Equals("Active")); ;
        }
    }
}