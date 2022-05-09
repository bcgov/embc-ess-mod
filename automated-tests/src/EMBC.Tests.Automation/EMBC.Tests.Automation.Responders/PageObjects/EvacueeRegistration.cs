using OpenQA.Selenium;
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

        public void SignInTaskButton()
        {
            var buttons = webDriver.FindElements(By.TagName("button"));
            var signInButton = buttons.Should().ContainSingle(b => b.Text.Contains("Sign in to the Task #")).Subject;
            signInButton.Click();
        }

        public void EnterTaskNumber()
        {
            var taskName = "test";

            Wait();

            var taskNumberField = webDriver.FindElement(By.CssSelector("input[formcontrolname='taskNumber']"));
            taskNumberField.SendKeys(taskName);

            var buttons = webDriver.FindElements(By.TagName("button"));
            var submitButton = buttons.Should().ContainSingle(b => b.Text.Contains("Submit")).Subject;
            submitButton.Click();
        }

        public void SignInTask()
        {
            var buttons = webDriver.FindElements(By.TagName("button"));
            var signInTaskBtn = buttons.Should().ContainSingle(b => b.Text.Contains("Sign in to Task")).Subject;
            signInTaskBtn.Click();
        }

        public void selectRegistrationType()
        {
            var digitalRegCard = webDriver.FindElement(By.XPath("//mat-card/div/div/p/span[contains(text(),'evacuee registration & extensions')]"));
            digitalRegCard.Click();
        }

        public void NextButton()
        {
            var buttons = webDriver.FindElements(By.TagName("button"));
            var nextButton = buttons.Should().ContainSingle(b => b.Text.Contains("Next")).Subject;
            nextButton.Click();
        }

        public void YesRadioButton()
        {
            var yesRadioButton = webDriver.FindElement(By.Id("yesOption"));
            yesRadioButton.Click();
        }

        public void NoRadioButton()
        {
            var yesRadioButton = webDriver.FindElement(By.Id("noOption"));
            yesRadioButton.Click();
        }

        public void FillSearchEvacueeForm()
        {
            var firstName = "Anne";
            var lastName = "Lee";
            var dob = "09091999";
            
            Wait();

            var firstNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='firstName']"));
            firstNameInput.SendKeys(firstName);

            var lastNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='lastName']"));
            lastNameInput.SendKeys(lastName);

            var birthdayInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='dateOfBirth']"));
            birthdayInput.SendKeys(dob);

            var buttons = webDriver.FindElements(By.TagName("button"));
            var searchButton = buttons.Should().ContainSingle(b => b.Text.Contains("Search")).Subject;
            searchButton.Click();
        }

        public void NewEvacueeRegButton()
        {
            var buttons = webDriver.FindElements(By.TagName("button"));
            var searchButton = buttons.Should().ContainSingle(b => b.Text.Contains("New Evacuee Registration")).Subject;
            searchButton.Click();
        }

        public void WizardEvacueeDetailsForm()
        {
            var gender = "Female";

            var genderSelect = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='gender']"));
            genderSelect.SendKeys(gender);
        }

        public void WizardAddressForm()
        {
            Wait();

            var addressLine1 = "1012 Douglas St";
            var city = "Victoria";

            var yesRadioButton = webDriver.FindElement(By.CssSelector("[formcontrolname='isBcAddress'] mat-radio-button"));
            yesRadioButton.Click();

            var addressLine1Input = webDriver.FindElement(By.CssSelector("input[formcontrolname='addressLine1']"));
            addressLine1Input.SendKeys(addressLine1);

            var cityInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='community']"));
            cityInput.SendKeys(city);

            var citySelect = webDriver.FindElement(By.Id("Victoria"));
            citySelect.Click();

            var yesRadioButton2 = webDriver.FindElement(By.CssSelector("[formcontrolname='isNewMailingAddress'] mat-radio-button"));
            yesRadioButton2.Click();
        }

        public void WizardContactForm()
        {
            var phoneNumber = "2368887777";
            var email = "test@test.ca";

            Wait();

            var phoneInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='phone']"));
            phoneInput.SendKeys(phoneNumber);

            var emailInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='email']"));
            emailInput.SendKeys(email);

            var confirmEmailInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='confirmEmail']"));
            confirmEmailInput.SendKeys(email);
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
        }

        public void SaveProfileButton()
        {
            var buttons = webDriver.FindElements(By.TagName("button"));
            var saveButton = buttons.Should().ContainSingle(b => b.Text.Contains("Save Profile")).Subject;
            saveButton.Click();
        }

        public void WizardNextStepButton()
        {
            Wait();
            var buttons = webDriver.FindElements(By.TagName("button"));
            var nextStepButton = buttons.Should().ContainSingle(b => b.Text.Contains("Proceed to Next Step")).Subject;
            nextStepButton.Click();

        }

        public void EvacuationDetailsFormReqFields()
        {
            var facilityLocation = "Victoria EMBC Main Centre";
            var householdAffected = "House loss";

            Wait();

            var evacAddressRadioBttn = webDriver.FindElement(By.Id("addressYesOption"));
            evacAddressRadioBttn.Click();

            var facilityNameInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='facilityName']"));
            facilityNameInput.SendKeys(facilityLocation);

            var insuranceRadioButton = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='insurance'] mat-radio-button[id='Yes']"));
            insuranceRadioButton.Click();

            var evacDescriptionTextarea = webDriver.FindElement(By.CssSelector("textarea[formcontrolname='householdAffected']"));
            evacDescriptionTextarea.SendKeys(householdAffected);

        }

        public void HouseholdMembersMinForm()
        {
            Wait();

            var hasHouseholdMembersNoRadioButton = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='hasHouseholdMembers'] mat-radio-button[ng-reflect-value='No']"));
            hasHouseholdMembersNoRadioButton.Click();

            var hasDietaryReqsNoRadioButton = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='hasSpecialDiet'] mat-radio-button[ng-reflect-value='No']"));
            hasDietaryReqsNoRadioButton.Click();

            var hasMedicineReqNoRadioButton = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='hasMedication'] mat-radio-button[ng-reflect-value='No']"));
            hasMedicineReqNoRadioButton.Click();
        }

        public void AnimalsMinForm()
        {
            var hasAnimalsNoRadioButton = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='hasPets'] mat-radio-button[ng-reflect-value='No']"));
            hasAnimalsNoRadioButton.Click();
        }

        public void NeedsAssessmentsForm()
        {
            Wait();

            var needsFoodYesRadioBttn = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='canEvacueeProvideFood'] mat-radio-button[ng-reflect-value='Yes']"));
            needsFoodYesRadioBttn.Click();

            var needsLodgingYesRadioBttn = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='canEvacueeProvideLodging'] mat-radio-button[ng-reflect-value='Yes']"));
            needsLodgingYesRadioBttn.Click();

            var needsClothingYesRadioBttn = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='canEvacueeProvideClothing'] mat-radio-button[ng-reflect-value='Yes']"));
            needsClothingYesRadioBttn.Click();

            var needsTransportYesRadioBttn = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='canEvacueeProvideTransportation'] mat-radio-button[ng-reflect-value='Yes']"));
            needsTransportYesRadioBttn.Click();

            var needsIncidentalYesRadioBttn = webDriver.FindElement(By.CssSelector("mat-radio-group[formcontrolname='canEvacueeProvideIncidentals'] mat-radio-button[ng-reflect-value='Yes']"));
            needsIncidentalYesRadioBttn.Click();
        }

        public void SecurityPhraseForm()
        {
            Wait();

            var securityPhrase = "Sesame";

            var securityPhraseInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='securityPhrase']"));
            securityPhraseInput.SendKeys(securityPhrase);
        }

        public void SaveEssFileButton()
        {
            Wait();
            var saveEssFileButton = webDriver.FindElement(By.CssSelector("button[class*='save']"));
            saveEssFileButton.Click();
        }

        public void AddSupportsButton()
        {
            Wait();
            var addSupportsButton = webDriver.FindElement(By.CssSelector("button[class*='button-p']"));
            addSupportsButton.Click();
        }

        public void SelectSupportForm()
        {
            var support = "Food - Groceries";

            Wait();

            var supportSelect = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='type']"));
            supportSelect.SendKeys(support);

            var buttons = webDriver.FindElements(By.TagName("button"));
            var supportDetailsButton = buttons.Should().ContainSingle(b => b.Text.Contains("Next - Support Details")).Subject;
            supportDetailsButton.Click();
        }

        public void SupportFoodDetailsForm()
        {
            var nbrOfDays = "3";
            var mealValue = "50.50";

            Wait();

            var nbrOfDaysSelect = webDriver.FindElement(By.CssSelector("mat-select[formcontrolname='noOfDays']"));
            nbrOfDaysSelect.SendKeys(nbrOfDays);

            var allMembersCheckbox = webDriver.FindElement(By.Id("allMembers"));
            allMembersCheckbox.Click();

            var totalAmountInput = webDriver.FindElement(By.CssSelector("input[formcontrolname='userTotalAmount']"));
            totalAmountInput.SendKeys(mealValue);

            var buttons = webDriver.FindElements(By.TagName("button"));
            var supportDeliveryButton = buttons.Should().ContainSingle(b => b.Text.Contains("Next - Support Delivery")).Subject;
            supportDeliveryButton.Click();

        }

        public void SupportDeliveryForm()
        {
            var responsible = "Someone else";
            var responsibleName = "Adrien Doe";

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

            var buttons = webDriver.FindElements(By.TagName("button"));
            var saveSupportButton = buttons.Should().ContainSingle(b => b.Text.Contains("Next - Save Support")).Subject;
            saveSupportButton.Click();

        }

        public void CloseButton()
        {
            Wait();

            var buttons = webDriver.FindElements(By.TagName("button"));
            var closeButton = buttons.Should().ContainSingle(b => b.Text.Contains("Close")).Subject;
            closeButton.Click();
        }

        public void ProcessSupportButton()
        {
            Wait();

            var buttons = webDriver.FindElements(By.TagName("button"));
            var processDraft = buttons.Should().ContainSingle(b => b.Text.Contains("Process Draft Support/s")).Subject;
            processDraft.Click();
        }

        public void ProcessDraftForm()
        {
            var certificateCheckBox = webDriver.FindElement(By.CssSelector("mat-checkbox[ng-reflect-id='processDraftCert']"));
            certificateCheckBox.Click();

            var buttons = webDriver.FindElements(By.TagName("button"));
            var processSupport = buttons.Should().ContainSingle(b => b.Text.Contains("Process Support/s")).Subject;
            processSupport.Click();

            Wait();

            var buttons2 = webDriver.FindElements(By.TagName("button"));
            var proceedSupport = buttons2.Should().ContainSingle(b => b.Text.Contains("Proceed")).Subject;
            proceedSupport.Click();
        }

    }
}
