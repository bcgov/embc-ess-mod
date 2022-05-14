using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using Protractor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    public class EvacueeRegistration : PageObjectBase
    {
        public EvacueeRegistration(IWebDriver webDriver) : base(webDriver)
        {}

        //TASK FUNCTIONS
        public void SignInTaskButton()
        {
            this.ButtonElement("Sign in to the Task #");
        }

        public void EnterTaskNumber(string taskName)
        {

            Wait();

            var taskNumberField = webDriver.FindElement(By.CssSelector("input[formcontrolname='taskNumber']"));
            taskNumberField.SendKeys(taskName);

            this.ButtonElement("Submit");
        }

        public void SignInTask()
        {
            this.ButtonElement("Sign in to Task");
        }

        //SEARCH FUNCTIONS
        public void SelectOnlineRegistrationType()
        {
            var digitalRegCard = webDriver.FindElement(By.XPath("//mat-card/div/div/p/span[contains(text(),'evacuee registration & extensions')]"));
            digitalRegCard.Click();

            this.ButtonElement("Next");

        }

        public void SelectPaperBasedRegistrationType()
        {
            var digitalRegCard = webDriver.FindElement(By.XPath("//mat-card/div/div/p/span[contains(text(),'data entry')]"));
            digitalRegCard.Click();

            this.ButtonElement("Next");

        }

        public void SelectGovernmentID()
        {
            Wait();
            this.YesRadioButton();
            this.ButtonElement("Next");
        }

        public void FillOnlineSearchEvacueeForm(string firstName, string lastName, string dob)
        {
            
            Wait();

            var firstNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='firstName']"));
            firstNameInput.SendKeys(firstName);

            var lastNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='lastName']"));
            lastNameInput.SendKeys(lastName);

            var birthdayInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='dateOfBirth']"));
            birthdayInput.SendKeys(dob);

            this.ButtonElement("Search");
        }

        public void FillPaperBasedSearchEvacueeForm(string firstName, string lastName, string dob)
        {
            Random random = new Random();
            var essfile = random.Next(0, 1000000).ToString("D6");

            Wait();

            var firstNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='firstName']"));
            firstNameInput.SendKeys(firstName);

            var lastNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='lastName']"));
            lastNameInput.SendKeys(lastName);

            var birthdayInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='dateOfBirth']"));
            birthdayInput.SendKeys(dob);

            var essFileInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='paperBasedEssFile']"));
            essFileInput.SendKeys(essfile);

            this.ButtonElement("Search");
        }

        //WIZARD FUNCTIONS
        //STEP 1: Profile
        public void NewEvacueeRegButton()
        {
            this.ButtonElement("New Evacuee Registration");
        }

        public void WizardCollectionNotice()
        {
            this.ButtonElement("Next");
        }

        public void WizardRestriction()
        {
            this.YesRadioButton();
            this.ButtonElement("Next");
        }

        public void WizardEvacueeDetailsForm(string gender)
        {

            var genderSelect = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='gender']"));
            genderSelect.SendKeys(gender);

            this.ButtonElement("Next");
        }

        public void WizardMinAddressForm(string addressLine1, string city)
        {
            Wait();

            var yesRadioButton = webDriver.FindElement(By.CssSelector("[formcontrolname='isBcAddress'] mat-radio-button"));
            yesRadioButton.Click();

            var addressLine1Input = webDriver.FindElement(By.CssSelector("input[formcontrolname='addressLine1']"));
            addressLine1Input.SendKeys(addressLine1);

            var cityInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='community']"));
            cityInput.SendKeys(city);

            var citySelect = webDriver.FindElement(By.Id(city));
            citySelect.Click();

            ((IJavaScriptExecutor)webDriver).ExecuteScript("window.scrollTo(0, document.body.scrollHeight - 200)");
            
            Wait();

            var yesRadioButton2 = webDriver.FindElement(By.CssSelector("[formcontrolname='isNewMailingAddress'] mat-radio-button"));
            yesRadioButton2.Click();

            this.ButtonElement("Next");
        }

        public void WizardMaxAddressForm(string country, string addressLine1, string city)
        {
            Wait();

            var noRadioButton = webDriver.FindElement(By.CssSelector("[formcontrolname='isBcAddress'] mat-radio-button:nth-child(2)"));
            noRadioButton.Click();

            var countryInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='country']"));
            countryInput.SendKeys(country);

            var countrySelect = webDriver.FindElement(By.Id(country));
            countrySelect.Click();

            var addressLine1Input = webDriver.FindElement(By.CssSelector("input[formcontrolname='addressLine1']"));
            addressLine1Input.SendKeys(addressLine1);

            var cityInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='community']"));
            cityInput.SendKeys(city);

            ((IJavaScriptExecutor)webDriver).ExecuteScript("window.scrollTo(0, document.body.scrollHeight - 200)");

            Wait();

            var yesRadioButton2 = webDriver.FindElement(By.CssSelector("[formcontrolname='isNewMailingAddress'] mat-radio-button"));
            yesRadioButton2.Click();

            this.ButtonElement("Next");
        }

        public void WizardMinContactForm()
        {

            Wait();

            this.NoRadioButton();
            this.ButtonElement("Next");
        }

        public void WizardMaxContactForm(string phoneNumber, string email)
        {

            Wait();

            this.YesRadioButton();

            var phoneInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='phone']"));
            phoneInput.SendKeys(phoneNumber);

            var emailInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='email']"));
            emailInput.SendKeys(email);

            var confirmEmailInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='confirmEmail']"));
            confirmEmailInput.SendKeys(email);

            this.ButtonElement("Next");
        }

        public void WizardSecurityQuestions()
        {
            Wait();

            var securityQuestion1 = "What was the name of your first pet?";
            var securityQuestion2 = "In what city or town was your mother born?";
            var securityQuestion3 = "Where was your first job?";
            var securityResponse1 = "Daisy";
            var securityResponse2 = "Vancouver";
            var securityResponse3 = "McDonalds";

            var securitySelect1 = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='question1']"));
            securitySelect1.SendKeys(securityQuestion1);

            Wait();

            var securitySelect2 = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='question2']"));
            securitySelect2.SendKeys(securityQuestion2);

            Wait();

            var securitySelect3 = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='question3']"));
            securitySelect3.SendKeys(securityQuestion3);

            var securityInput1 = webDriver.FindElement(By.CssSelector("input[formcontrolname='answer1']"));
            securityInput1.SendKeys(securityResponse1);

            var securityInput2 = webDriver.FindElement(By.CssSelector("input[formcontrolname='answer2']"));
            securityInput2.SendKeys(securityResponse2);

            var securityInput3 = webDriver.FindElement(By.CssSelector("input[formcontrolname='answer3']"));
            securityInput3.SendKeys(securityResponse3);

            this.ButtonElement("Next");
        }

        public void WizardReviewProfileForm()
        {
            
            ((IJavaScriptExecutor)webDriver).ExecuteScript("window.scrollTo(0, document.body.scrollHeight - 200)");

            Wait();

            this.YesRadioButton();
            this.ButtonElement("Save Profile");
            
        }

        public void WizardNextStepButton()
        {
            Wait();
            this.ButtonElement("Proceed to Next Step");

        }

        //Step 2: ESS File
        public void WizardOnlineEvacDetailsFormReqFields(string facilityLocation, string householdAffected)
        {

            Wait();

            var evacAddressRadioBttn = webDriver.FindElement(By.Id("addressYesOption"));

            Wait();
            evacAddressRadioBttn.Click();

            var facilityNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='facilityName']"));
            facilityNameInput.SendKeys(facilityLocation);

            var insuranceRadioButton = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='insurance'] mat-radio-button[id='Yes']"));
            insuranceRadioButton.Click();


            var evacDescriptionTextarea = webDriver.FindElement(By.CssSelector("textarea[formcontrolname='householdAffected']"));
            evacDescriptionTextarea.SendKeys(householdAffected);

            this.ButtonElement("Next");

        }

        public void WizardPaperBasedEvacDetailsFormReqFields(string interviewer, string initials, string completedDate, string completedTime, string addressLine1, string city, string facilityLocation, string householdAffected)
        {

            Wait();

            var interviewerInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='firstName']"));
            interviewerInput.SendKeys(interviewer);

            var lastNameInitInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='lastNameInitial']"));
            lastNameInitInput.SendKeys(initials);

            var completeDateInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='paperCompletedOn']"));
            completeDateInput.SendKeys(completedDate);

            var completeTimeInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='paperCompletedTime']"));
            completeTimeInput.SendKeys(completedTime);

            var addressLine1Input = webDriver.FindElement(By.CssSelector("input[formcontrolname='addressLine1']"));
            addressLine1Input.SendKeys(addressLine1);

            var cityInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='community']"));
            cityInput.SendKeys(city);

            ((IJavaScriptExecutor)webDriver).ExecuteScript("window.scrollTo(0, 1000)");
            Wait();

            var citySelect = webDriver.FindElement(By.Id("Victoria"));
            citySelect.Click();
           

            var facilityNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='facilityName']"));
            facilityNameInput.SendKeys(facilityLocation);

            ((IJavaScriptExecutor)webDriver).ExecuteScript("window.scrollTo(0, 1500)");
            Wait();

            var insuranceRadioButton = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='insurance'] mat-radio-button[id='Yes']"));
            insuranceRadioButton.Click();


            var evacDescriptionTextarea = webDriver.FindElement(By.CssSelector("textarea[formcontrolname='householdAffected']"));
            evacDescriptionTextarea.SendKeys(householdAffected);

            this.ButtonElement("Next");

        }

        public void WizardHouseholdMembersMinForm()
        {
            Wait();

            var hasHouseholdMembersNoRadioButton = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='hasHouseholdMembers']/mat-radio-button[2]"));
            hasHouseholdMembersNoRadioButton.Click();

            var hasDietaryReqsNoRadioButton = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='hasSpecialDiet']/mat-radio-button[2]"));
            hasDietaryReqsNoRadioButton.Click();

            var hasMedicineReqNoRadioButton = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='hasMedication']/mat-radio-button[2]"));
            hasMedicineReqNoRadioButton.Click();

            this.ButtonElement("Next");
        }

        public void WizardHouseholdMembersMaxForm(string firstName, string lastName, string gender, string dob, string dietDetails)
        {
            Wait();

            var hasHouseholdMembersNoRadioButton = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='hasHouseholdMembers']/mat-radio-button[1]"));
            hasHouseholdMembersNoRadioButton.Click();

            Wait();

            var firstNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='firstName']"));
            firstNameInput.SendKeys(firstName);

            var lastNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='lastName']"));
            lastNameInput.SendKeys(lastName);

            var genderSelect = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='gender']"));
            genderSelect.SendKeys(gender);

            var birthdayInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='dateOfBirth']"));
            birthdayInput.SendKeys(dob);

            ButtonElement("Save");

            var hasDietaryReqsNoRadioButton = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='hasSpecialDiet']/mat-radio-button[1]"));
            hasDietaryReqsNoRadioButton.Click();

            Wait();

            var dietDetailsInput = webDriver.FindElement(By.CssSelector("textarea[formcontrolname='specialDietDetails']"));
            dietDetailsInput.SendKeys(dietDetails);

            ((IJavaScriptExecutor)webDriver).ExecuteScript("window.scrollTo(0, document.body.scrollHeight - 200)");
            Wait();

            var hasMedicineReqYesRadioButton = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='hasMedication']/mat-radio-button[1]"));
            hasMedicineReqYesRadioButton.Click();

            Wait();

            var medicineSupplyYesRadioButton = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='medicationSupply']/mat-radio-button[1]"));
            medicineSupplyYesRadioButton.Click();

            ButtonElement("Next");

        }

        public void AnimalsMinForm()
        {
            var hasAnimalsNoRadioButton = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='hasPets']/mat-radio-button[2]"));
            hasAnimalsNoRadioButton.Click();

            this.ButtonElement("Next");
        }

        public void AnimalsMaxForm(string petType, string petQuantity)
        {
            var hasAnimalsYesRadioButton = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='hasPets']/mat-radio-button[1]"));

            Wait();
            hasAnimalsYesRadioButton.Click();

            Wait();

            var petsTypeInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='type']"));
            petsTypeInput.SendKeys(petType);

            var petsQuantityInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='quantity']"));
            petsQuantityInput.SendKeys(petQuantity);

            this.ButtonElement("Save");

            ((IJavaScriptExecutor)webDriver).ExecuteScript("window.scrollTo(0, document.body.scrollHeight - 200)");
            Wait();

            var hasPetFoodYesRadioButton = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='hasPetsFood'] mat-radio-button:nth-child(1)"));
            hasPetFoodYesRadioButton.Click();

            this.ButtonElement("Next");
        }

        public void WizardNeedsAssessmentsForm()
        {
            Wait();

            var needsFoodYesRadioBttn = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='canEvacueeProvideFood']/mat-radio-button[1]"));
            needsFoodYesRadioBttn.Click();

            ((IJavaScriptExecutor)webDriver).ExecuteScript("window.scrollTo(0, 500)");
            Wait();

            var needsLodgingYesRadioBttn = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='canEvacueeProvideLodging']/mat-radio-button[1]"));
            needsLodgingYesRadioBttn.Click();

            var needsClothingYesRadioBttn = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='canEvacueeProvideClothing']/mat-radio-button[1]"));
            needsClothingYesRadioBttn.Click();

            ((IJavaScriptExecutor)webDriver).ExecuteScript("window.scrollTo(0, document.body.scrollHeight - 500)");

            var needsTransportYesRadioBttn = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='canEvacueeProvideTransportation']/mat-radio-button[1]"));
            
            Wait();
            needsTransportYesRadioBttn.Click();

            var needsIncidentalYesRadioBttn = webDriver.FindElement(By.XPath("//mat-radio-group[@formcontrolname='canEvacueeProvideIncidentals']/mat-radio-button[1]"));
            needsIncidentalYesRadioBttn.Click();

            this.ButtonElement("Next");
        }

        public void WizardSecurityPhraseForm(string securityPhrase)
        {
            Wait();

            var securityPhraseInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='securityPhrase']"));
            securityPhraseInput.SendKeys(securityPhrase);

            this.ButtonElement("Next");
        }

        public void WizardReviewEssFile()
        {
            this.ButtonElement("Save");
        }


        //Step 3: Supports
        public void WizardAddSupport()
        {
            this.ButtonElement("+ Add Supports");

        }

        public void WizardSelectSupportForm(string supportType)
        {
            Wait();

            var supportSelect = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='type']"));
            supportSelect.SendKeys(supportType);

            this.ButtonElement("Next - Support Details");
        }

        public void SupportFoodDetailsForm(string nbrOfDays, string mealValue)
        {
            Wait();

            var nbrOfDaysSelect = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='noOfDays']"));
            nbrOfDaysSelect.SendKeys(nbrOfDays);

            ((IJavaScriptExecutor)webDriver).ExecuteScript("window.scrollTo(0, document.body.scrollHeight - 200)");
            Wait();

            var allMembersCheckbox = webDriver.FindElement(By.Id("allMembers"));
            allMembersCheckbox.Click();

            var totalAmountInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='userTotalAmount']"));
            totalAmountInput.SendKeys(mealValue);

            this.ButtonElement("Next - Support Delivery");

        }

        public void SupportPaperBasedHotelDetailsForm(string interviewer, string interviewerInitials, string completedDate, string validToDate, string validTime, string nbrRooms)
        {
            Random random = new Random();
            var supportNbr = random.Next(0, 1000000).ToString("D8");

            Wait();

            var supportNbrInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='paperSupportNumber']"));
            supportNbrInput.SendKeys(supportNbr);

            var interviewerInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='firstName']"));
            interviewerInput.SendKeys(interviewer);

            var interviewerInitInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='lastNameInitial']"));
            interviewerInitInput.SendKeys(interviewerInitials);

            var completeDateInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='paperCompletedOn']"));
            completeDateInput.SendKeys(completedDate);


            var validFromDateInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='fromDate']"));
            validFromDateInput.SendKeys(completedDate);

            var validFromTimeInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='fromTime']"));
            validFromTimeInput.SendKeys(validTime);

            var validToDateInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='toDate']"));
            validToDateInput.SendKeys(validToDate);

            var validToTimeInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='toTime']"));
            validToTimeInput.SendKeys(validTime);


            ((IJavaScriptExecutor)webDriver).ExecuteScript("window.scrollTo(0, document.body.scrollHeight - 200)");
            Wait();

            var allMembersCheckbox = webDriver.FindElement(By.Id("allMembers"));
            allMembersCheckbox.Click();

            var nbrOfRoomsSelect = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='noOfRooms']"));
            nbrOfRoomsSelect.SendKeys(nbrRooms);


            this.ButtonElement("Next - Support Delivery");

        }

        public void SupportDeliveryForm(string responsibleName)
        {
            var responsible = "Someone else";

            var referralCard = webDriver.FindElement(By.Id("referralCard"));
            referralCard.Click();

            Wait();

            var resposibleSelect = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='issuedTo']"));
            resposibleSelect.SendKeys(responsible);

            Wait();

            var responsibleNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='name']"));
            responsibleNameInput.SendKeys(responsibleName);

            var supplierInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='supplier']"));
            supplierInput.Click();

            var supplierSelect = webDriver.FindElement(By.XPath("//div[@role='listbox']/mat-option[1]"));
            supplierSelect.Click();

            this.ButtonElement("Next - Save Support");

        }

        public void SuccessSupportPopUp()
        {
            Wait();
            this.ButtonElement("Close");
        }

        public void WizardProcessDraftSupports()
        {
            Wait();
            this.ButtonElement("Process Draft Support/s");
        }

        public void WizardOnlineProcessSupportsForm()
        {
            

            var certificateCheckBox = webDriver.FindElement(By.Id("processDraftCert"));
            certificateCheckBox.Click();

            this.ButtonElement("Process Support/s");

            var buttons = webDriver.FindElements(By.TagName("button"));
            var proceedBttn = buttons.Should().ContainSingle(b => b.Text.Contains("Proceed")).Subject;
            proceedBttn.Click();

        }

        public void WizardPaperBasedProcessSupportsForm()
        {

            this.ButtonElement("Process Support/s");

            var buttons = webDriver.FindElements(By.TagName("button"));
            var proceedBttn = buttons.Should().ContainSingle(b => b.Text.Contains("Proceed")).Subject;
            proceedBttn.Click();

        }

        public void SelectEvacuee() // to be deleted
        {
            var firstEvacueeOption = webDriver.FindElement(By.XPath("/app-profile-results[1]/div[1]/mat-card[1]/div[1]/div[1]/a[1]"));
            firstEvacueeOption.Click();
            Wait();
            webDriver.FindElement(By.XPath("//span[contains(text(),'ESS File # 160819')]")).Click();
            Wait();
            webDriver.FindElement(By.XPath("//button[contains(text(),'Proceed to ESS File')]")).Click();
            Wait();
            webDriver.FindElement(By.XPath("//body/app-root[1]/div[1]/main[1]/div[2]/app-responder-access[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/div[1]/app-search-registration[1]/app-essfile-dashboard[1]/div[2]/div[5]/div[2]/button[1]")).Click();
            Wait();
            ButtonElement("Next");
            Wait();
            webDriver.FindElement(By.XPath("/html[1]/body[1]/app-root[1]/div[1]/main[1]/div[2]/app-wizard[1]/div[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/app-step-ess-file[1]/div[1]/div[3]/app-household-members[1]/div[1]/div[2]/div[1]/div[1]/div[1]/form[1]/div[3]/div[1]/mat-table[1]/mat-header-row[1]/th[1]/mat-checkbox[1]")).Click();
            Wait();
            webDriver.FindElement(By.XPath("/html[1]/body[1]/app-root[1]/div[1]/main[1]/div[2]/app-wizard[1]/div[1]/mat-sidenav-container[1]/mat-sidenav-content[1]/app-step-ess-file[1]/div[1]/nav[1]/div[2]/div[1]/div[1]/a[6]/span[1]")).Click();
            Wait();
            ButtonElement("Save ESS File");
            Wait();
            ButtonElement("Proceed to Next Step");
            Wait();
            webDriver.FindElement(By.XPath("//td[contains(text(),'D0000003579')]")).Click();
            Wait();
            webDriver.FindElement(By.XPath("//span[contains(text(),'Reprint Referral')]")).Click();
            Wait();
            webDriver.FindElement(By.XPath("/html[1]/body[1]/div[1]/div[2]/div[1]/mat-dialog-container[1]/app-dialog[1]/mat-dialog-content[1]/app-reprint-referral-dialog[1]/form[1]/div[1]/div[1]/mat-form-field[1]/div[1]/div[1]/div[3]/mat-select[1]")).Click();
            webDriver.FindElement(By.XPath("/html[1]/body[1]/div[1]/div[4]/div[1]/div[1]/div[1]/mat-option[2]")).Click();
            var proceedBttn = webDriver.FindElement(By.XPath("/html[1]/body[1]/div[1]/div[2]/div[1]/mat-dialog-container[1]/app-dialog[1]/mat-dialog-content[1]/app-reprint-referral-dialog[1]/div[4]/div[2]/button[1]"));
            proceedBttn.Click();
            Wait();
        }


        // ASSERT FUNCTIONS
        public void SupportCreatedSuccessfully()
        {
            Wait();

            var supportStatus = webDriver.FindElement(By.XPath("//table[@role='table']/tbody/tr/td[7]")).Text;
            Assert.True(supportStatus.Equals("Active"));
        }

        // PRIVATE FUNCTIONS
        private void ButtonElement(string bttnName)
        {
            Wait();

            IJavaScriptExecutor js = (IJavaScriptExecutor)webDriver;
            
            var buttons = webDriver.FindElements(By.TagName("button"));
            var selectedBttn = buttons.Should().ContainSingle(b => b.Text.Contains(bttnName)).Subject;
            js.ExecuteScript("arguments[0].click()", selectedBttn);
        }

        private void YesRadioButton()
        {
            Wait();
            var yesRadioButton = webDriver.FindElement(By.Id("yesOption"));
            yesRadioButton.Click();
        }

        private void NoRadioButton()
        {
            var yesRadioButton = webDriver.FindElement(By.Id("noOption"));
            yesRadioButton.Click();
        }

    }
}
