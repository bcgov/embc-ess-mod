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
        private readonly LoginSteps loginSteps;
        private readonly TaskSteps taskSteps;
        private readonly SearchSteps searchSteps;


        private readonly WizardProfile wizardProfile;
        private readonly WizardEssFile wizardEssFile;
        private readonly WizardSupport wizardSupport;

        

        private readonly string userName = "ess.developerA1";
        private readonly string signInTask = "1234";
        private readonly string evacueeSearch = "autotest-Automation";
        private readonly string interacEvacueeSearch = "Thirtyfour";

        private readonly string evacueeGender = "Female";
        private readonly string evacueeMinFormAddressLine1 = "autotest-1012 Douglas St";
        private readonly string evacueeMinFormCity = "Victoria";
        private readonly string evacueeMaxFormCountry = "Australia";
        private readonly string evacueeMaxFormAddressLine1 = "autotest-1012 Exford St";
        private readonly string evacueeMaxFormCity = "Brisbane";
        
        private readonly string evacueePhone = "4569999999";
        private readonly string evacueeEmail = "test@test.ca";
        private readonly string evacueeSecQuestion1 = "What was the name of your first pet?";
        private readonly string evacueeSecQuestion2 = "In what city or town was your mother born?";
        private readonly string evacueeSecQuestion3 = "Where was your first job?";
        private readonly string evacueeSecAnswer1 = "Daisy";
        private readonly string evacueeSecAnswer2 = "Vancouver";
        private readonly string evacueeSecAnswer3 = "McDonalds";

        private readonly string essFileDetailsInterviewer = "John";
        private readonly string essFileDetailsInitial = "S";
        private readonly string essFileDetailsCompletedDate = "05/13/2022";
        private readonly string essFileDetailsCompletedTime = "1500";
        private readonly string essFileDetailsLocation = "autotest-Victoria EMBC Main Centre";
        private readonly string essFileDetailsReasons = "autotest-House loss";
        private readonly string supportValidDate = "05/30/2022";

        private readonly string essFileHouseholdMemberName = "autotest-Anne";
        private readonly string essFileHouseholdMemberLastName = "autotest-Doe";
        private readonly string essFileHouseholdMemberBirthday = "09/12/2001";
        private readonly string essFileHouseholdMemberDietDetails = "autotest-Lactose intolerant";
        private readonly string essFileAnimalsType = "Dogs";
        private readonly string essFileAnimalsQuantity = "2";
        private readonly string essFileSecPhrase = "Sesame";

        private readonly string supportGroceriesQuantity = "3";
        private readonly string supportGroceriesCost = "50.50";

        private readonly string supportHotelNbrRooms = "2";
        private readonly string supportDeliveryResponsibleName = "autotest-Adrien Doe";
        private readonly string supportClothingCost = "135.99";

        private readonly string supportIncidentalApprovedList = "autotest- Tooth brush, Advil, hand towels";
        private readonly string incidentalsAmount = "15.50";

        private readonly string hostName = "autotest-Test";
        private readonly string hostAddress = "autotest-1012 Test St.";
        private readonly string hostCity = "Clearwater";

        private readonly string taxiFromAddress = "autotest-1099 Howe St.";
        private readonly string taxiToAddress = "autotest-321 Robson St.";

        private readonly string otherTransportMode = "Train";
        private readonly string otherTransportAmount = "29.99";

        private readonly string supportDeliveryEmail = "test@test.ca";
        private readonly string supportDeliveryPhone = "7886889090";



        public WizardSteps(BrowserDriver driver)
        {
            loginSteps = new LoginSteps(driver);
            taskSteps = new TaskSteps(driver);
            searchSteps = new SearchSteps(driver);

            wizardProfile = new WizardProfile(driver.Current);
            wizardEssFile = new WizardEssFile(driver.Current);
            wizardSupport = new WizardSupport(driver.Current);
        }


        [StepDefinition(@"I complete an online registration")]
        public void OnlineWizardProfileStep()
        {
            //Login into Responders Portal
            loginSteps.Bcsc(userName);

            //Sign into Task
            taskSteps.SignInTask(signInTask);

            //Search for Online Evacuee
            searchSteps.OnlineEvacueeSearch(evacueeSearch);

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
            wizardProfile.WizardEvacueeDetailsForm(evacueeGender);

            //fill address form
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/address");
            wizardProfile.WizardMinAddressForm(evacueeMinFormAddressLine1, evacueeMinFormCity);

            //fill contact form
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/contact");
            wizardProfile.WizardMaxContactForm(evacueePhone, evacueeEmail);

            //fill security questions
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/security-questions");
            wizardProfile.WizardSecurityQuestions(evacueeSecQuestion1, evacueeSecQuestion2, evacueeSecQuestion3, evacueeSecAnswer1, evacueeSecAnswer2, evacueeSecAnswer3);

            //review profile and submit
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/review");
            wizardProfile.WizardReviewProfileForm();
            wizardProfile.WizardNextStepButton();

            //WIZARD STEP 2:
            //fill evacuation details
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/evacuation-details");
            wizardEssFile.WizardOnlineEvacDetailsFormReqFields(essFileDetailsLocation, essFileDetailsReasons);

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
            wizardEssFile.WizardSecurityPhraseForm(essFileSecPhrase);

            //review ESS File and submit
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/review");
            wizardEssFile.WizardReviewEssFile();
            wizardEssFile.WizardNextStepButton();

            //WIZARD STEP 3:
            //ADD SUPPORT 1
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardAddSupport();

            //select Lodging - Hotel/Motel support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            wizardSupport.WizardSelectSupportForm("Lodging - Hotel/Motel");
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            wizardSupport.SupportHotelDetailsForm(supportHotelNbrRooms);

            //add support delivery
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            wizardSupport.SupportReferralDeliveryForm(supportDeliveryResponsibleName);
            wizardSupport.SuccessSupportPopUp();

            //ADD SUPPORT 2
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardAddSupport();

            //select Lodging - Billeting
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            wizardSupport.WizardSelectSupportForm("Lodging - Billeting");
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            wizardSupport.SupportBilletingDetailsForm();

            //add billeting delivery
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            wizardSupport.SupportReferralBilletingDeliveryForm(supportDeliveryResponsibleName, hostName, hostAddress, hostCity, supportDeliveryPhone, supportDeliveryEmail);
            wizardSupport.SuccessSupportPopUp();

            //ADD SUPPORT 3
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardAddSupport();

            //select Transportation - Taxi
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            wizardSupport.WizardSelectSupportForm("Transportation - Taxi");
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            wizardSupport.SupportTaxiDetailsForm(taxiFromAddress, taxiToAddress);

            //add support delivery
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            wizardSupport.SupportReferralDeliveryForm(supportDeliveryResponsibleName);
            wizardSupport.SuccessSupportPopUp();

            //process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardProcessDraftSupports();

            //review process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/review");
            wizardSupport.WizardOnlineProcessSupportsForm();
            wizardSupport.CancelPrintOut();
        }

        [StepDefinition(@"I complete a paper based registration")]
        public void PaperBasedWizardProfileStep()
        {
            //Login into Responders Portal
            loginSteps.Bcsc(userName);

            //Sign into Task
            taskSteps.SignInTask(signInTask);

            //Search for a paperbased user
            searchSteps.PaperBasedEvacueeSearch(evacueeSearch);

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
            wizardProfile.WizardEvacueeDetailsForm(evacueeGender);

            //fill address form
            wizardProfile.CurrentLocation.Should().Be("/ess-wizard/evacuee-profile/address");
            wizardProfile.WizardMaxAddressForm(evacueeMaxFormCountry, evacueeMaxFormAddressLine1, evacueeMaxFormCity);

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
            wizardEssFile.WizardPaperBasedEvacDetailsFormReqFields(essFileDetailsInterviewer, essFileDetailsInitial, essFileDetailsCompletedDate, essFileDetailsCompletedTime, evacueeMinFormAddressLine1, evacueeMinFormCity, essFileDetailsLocation, essFileDetailsReasons);

            //fill household members
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/household-members");
            wizardEssFile.WizardHouseholdMembersMaxForm(essFileHouseholdMemberName, essFileHouseholdMemberLastName, evacueeGender, essFileHouseholdMemberBirthday, essFileHouseholdMemberDietDetails);

            //fill animals
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/animals");
            wizardEssFile.AnimalsMaxForm(essFileAnimalsType, essFileAnimalsQuantity);

            //fill needs assessments
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/needs");
            wizardEssFile.WizardNeedsAssessmentsForm();

            //review ESS File and submit
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/review");
            wizardEssFile.WizardReviewEssFile();
            wizardEssFile.WizardNextStepButton();

            //WIZARD STEP 3:
            //ADD SUPPORT 1
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardAddSupport();

            //select Lodging - Group support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            wizardSupport.WizardSelectSupportForm("Lodging - Group Lodging");
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            wizardSupport.WizardSupportDetailsPaperBased(essFileDetailsInterviewer, essFileDetailsInitial, essFileDetailsCompletedDate, supportValidDate, essFileDetailsCompletedTime);
            wizardSupport.SupportGroupLodgingDetailsForm();
     
            //add support delivery
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            wizardSupport.SupportReferralGroupDeliveryForm(supportDeliveryResponsibleName, hostName, hostAddress, hostCity, supportDeliveryPhone);
            wizardSupport.SuccessSupportPopUp();

            //ADD SUPPORT 2
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardAddSupport();

            //select Food - Restaurant Meals support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            wizardSupport.WizardSelectSupportForm("Food - Restaurant Meals");
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            wizardSupport.WizardSupportDetailsPaperBased(essFileDetailsInterviewer, essFileDetailsInitial, essFileDetailsCompletedDate, supportValidDate, essFileDetailsCompletedTime);
            wizardSupport.SupportRestaurantDetailsForm();

            //add support delivery
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            wizardSupport.SupportReferralDeliveryForm(supportDeliveryResponsibleName);
            wizardSupport.SuccessSupportPopUp();

            //ADD SUPPORT 3
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardAddSupport();

            //select Food - Restaurant Meals support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            wizardSupport.WizardSelectSupportForm("Transportation - Other");
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            wizardSupport.WizardSupportDetailsPaperBased(essFileDetailsInterviewer, essFileDetailsInitial, essFileDetailsCompletedDate, supportValidDate, essFileDetailsCompletedTime);
            wizardSupport.SupportTransportOtherDetailsForm(otherTransportMode, otherTransportAmount);

            //add support delivery
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            wizardSupport.SupportReferralDeliveryForm(supportDeliveryResponsibleName);
            wizardSupport.SuccessSupportPopUp();

            //process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardProcessDraftSupports();

            //review process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/review");
            wizardSupport.WizardPaperBasedProcessSupportsForm();
        }


        [StepDefinition(@"I create an Interac support from an existing user")]
        public void CreateInteracSupport()
        {
            //Login into Responders Portal
            loginSteps.Bcsc(userName);

            //Sign into Task
            taskSteps.SignInTask(signInTask);

            //Search for Online Evacuee
            searchSteps.OnlineEvacueeSearch(interacEvacueeSearch);

            //Choose specific evacuee
            searchSteps.CreateNewEssFileForEvacuee();

            //WIZARD STEP 1:
            //fill evacuation details
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/evacuation-details");
            wizardEssFile.WizardOnlineEvacDetailsFormReqFields(essFileDetailsLocation, essFileDetailsReasons);

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
            wizardEssFile.WizardSecurityPhraseForm(essFileSecPhrase);

            //review ESS File and submit
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/review");
            wizardEssFile.WizardReviewEssFile();
            wizardEssFile.WizardNextStepButton();

            //WIZARD STEP 2:
            //ADD SUPPORT 1
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardAddSupport();

            //select Clothing support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            wizardSupport.WizardSelectSupportForm("Clothing");
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            wizardSupport.SupportClothingDetailsForm(supportClothingCost);

            //add support delivery
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            wizardSupport.SupportInteracDeliveryEmailAndMobileForm(supportDeliveryEmail, supportDeliveryPhone);
            wizardSupport.SuccessSupportPopUp();

            //ADD SUPPORT 2
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardAddSupport();

            //select Incidentals
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            wizardSupport.WizardSelectSupportForm("Incidentals");
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            wizardSupport.SupportIncidentalsDetailsForm(supportIncidentalApprovedList, incidentalsAmount);

            //add delivery
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            wizardSupport.SupportInteracDeliveryEmailForm();
            wizardSupport.SuccessSupportPopUp();

            //ADD SUPPORT 3
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardAddSupport();

            //select Transportation - Taxi
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/select-support");
            wizardSupport.WizardSelectSupportForm("Food - Groceries");
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/details");
            wizardSupport.SupportGroceriesDetailsForm(supportGroceriesQuantity, supportGroceriesCost);

            //add support delivery
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/delivery");
            wizardSupport.SupportInteracDeliveryMobileForm();
            wizardSupport.SuccessSupportPopUp();

            //process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/view");
            wizardSupport.WizardProcessDraftSupports();

            //review process support
            wizardSupport.CurrentLocation.Should().Be("/ess-wizard/add-supports/review");
            wizardSupport.WizardOnlineProcessSupportsForm();
            wizardSupport.CancelPrintOut();
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
