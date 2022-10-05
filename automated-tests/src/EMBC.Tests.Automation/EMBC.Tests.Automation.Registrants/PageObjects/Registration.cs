using OpenQA.Selenium;

namespace EMBC.Tests.Automation.Registrants.PageObjects
{
    public class Registration : PageObjectBase
    {
        private By personFormFirstNameInput = By.CssSelector("input[formcontrolname='firstName']");
        private By personFormLastNameInput = By.CssSelector("input[formcontrolname='lastName']");
        private By personFormInitialsInput = By.CssSelector("input[formcontrolname='initials']");
        private By personFormGenderSelect = By.CssSelector("mat-select[formcontrolname='gender']");
        private By personFormDateOfBirthInput = By.CssSelector("input[formcontrolname='dateOfBirth']");

        private By addressFormIsBCAddressYesRadioBttn = By.CssSelector("[formcontrolname='isBcAddress'] mat-radio-button:nth-child(1)");
        private By addressFormAddressLine1Input = By.CssSelector("input[formcontrolname='addressLine1']");
        private By addressFormAddressLine2Input = By.CssSelector("input[formcontrolname='addressLine2']");
        private By addressFormCityInput = By.CssSelector("input[formcontrolname='community']");
        private By addressFormZipCodeInput = By.CssSelector("input[formcontrolname='postalCode']");
        private By addressFormIsMailingSameYesRadioBttn = By.CssSelector("[formcontrolname='isNewMailingAddress'] mat-radio-button:nth-child(1)");

        private By securityQuestionsFormQuestion1Input = By.CssSelector("mat-select[formcontrolname='question1']");
        private By securityQuestionsFormQuestion2Input = By.CssSelector("mat-select[formcontrolname='question2']");
        private By securityQuestionsFormQuestion3Input = By.CssSelector("mat-select[formcontrolname='question3']");
        private By securityQuestionsFormAnswer1Input = By.CssSelector("input[formcontrolname='answer1']");
        private By securityQuestionsFormAnswer2Input = By.CssSelector("input[formcontrolname='answer2']");
        private By securityQuestionsFormAnswer3Input = By.CssSelector("input[formcontrolname='answer3']");

        private By locationFormInsuranceOptions = By.CssSelector("mat-radio-group[formcontrolname='insurance']");

        private By householdMembersHasSpecialDietYesRadioBttn = By.XPath("//mat-radio-group[@formcontrolname='haveSpecialDiet']/mat-radio-button[1]");
        private By householdMembersHasSpecialDietNoRadioBttn = By.XPath("//mat-radio-group[@formcontrolname='haveSpecialDiet']/mat-radio-button[2]");
        private By householdMembersDietDetailsInput = By.XPath("//input[@formcontrolname='specialDietDetails']");
        private By householdMembersHasMedicationYesRadioBttn = By.XPath("//mat-radio-group[@formcontrolname='haveMedication']/mat-radio-button[1]");
        private By householdMembersHasMedicationNoRadioBttn = By.XPath("//mat-radio-group[@formcontrolname='haveMedication']/mat-radio-button[2]");

        private By animalFormTypeInput = By.CssSelector("input[formcontrolname='type']");
        private By animalFormQuantityInput = By.CssSelector("input[formcontrolname='quantity']");
        private By animalFormHasFoodOptions = By.CssSelector("mat-radio-group[formcontrolname='hasPetsFood']");

        private By needsFormFoodOptions = By.CssSelector("mat-radio-group[formcontrolname='canEvacueeProvideFood']");
        private By needsFormLodgeOptions = By.CssSelector("mat-radio-group[formcontrolname='canEvacueeProvideLodging']");
        private By needsFormClothesOptions = By.CssSelector("mat-radio-group[formcontrolname='canEvacueeProvideClothing']");
        private By needsFormTransportOptions = By.CssSelector("mat-radio-group[formcontrolname='canEvacueeProvideTransportation']");
        private By needsFormIncidentalOptions = By.CssSelector("mat-radio-group[formcontrolname='canEvacueeProvideIncidentals']");

        private By securityPhraseFormPhraseInput = By.CssSelector("input[formcontrolname='secretPhrase']");

        private By submitFormCAPTCHAForm = By.CssSelector("re-captcha div iframe");
        private By submissionCompleteDialog = By.XPath("//mat-dialog-container[contains(.,' Submission Complete')]");

        public Registration(IWebDriver webDriver) : base(webDriver)
        { }

        public AnonymousRegistrationWizardStep GetCurrentWizardStep()
        {
            if (webDriver.FindElement(By.TagName("app-collection-notice")) != null)
                return AnonymousRegistrationWizardStep.CollectionNotice;
            else
                throw new InvalidOperationException($"Could not determine the current wizard step");
        }

        public enum AnonymousRegistrationWizardStep
        {
            CollectionNotice,
        }

        public void CollectionNotice()
        {
            ButtonElement("Next");
        }

        public void NewAccountRestriction()
        {
            YesRadioButton();
            ButtonElement("Next - Create Account");
        }

        public void VerifiedRestriction()
        {
            YesRadioButton();
            ButtonElement("Continue");
        }

        public void VerifiedAccountPersonalDetails(string gender)
        {
            Wait();

            webDriver.FindElement(personFormGenderSelect).SendKeys(gender);
            ButtonElement("Next - Primary & Mailing Address");
        }

        public void MinimumPersonalDetails(string firstName, string lastName, string gender, string dateOfBirth)
        {

            Wait();

            webDriver.FindElement(personFormFirstNameInput).SendKeys(firstName);
            webDriver.FindElement(personFormLastNameInput).SendKeys(lastName);
            webDriver.FindElement(personFormGenderSelect).SendKeys(gender);
            webDriver.FindElement(personFormDateOfBirthInput).SendKeys(dateOfBirth);

            ButtonElement("Next - Primary & Mailing Address");
            
        }

        public void VerifiedAccountAddress(string city, string postalCode)
        {
            Wait();
            webDriver.FindElement(addressFormCityInput).SendKeys(city);
            webDriver.FindElement(By.Id(city)).Click();
            webDriver.FindElement(addressFormZipCodeInput).SendKeys(postalCode);
            RadioButtonElement(addressFormIsMailingSameYesRadioBttn);

            ButtonElement("Next - Contact Information");

        }

        public void MinimumAddress(string addressLine1, string city)
        {
            Wait();

            RadioButtonElement(addressFormIsBCAddressYesRadioBttn);
            webDriver.FindElement(addressFormAddressLine1Input).SendKeys(addressLine1);
            webDriver.FindElement(addressFormCityInput).SendKeys(city);
            webDriver.FindElement(By.Id(city)).Click();
            RadioButtonElement(addressFormIsMailingSameYesRadioBttn);

            ButtonElement("Next - Contact Information");
        }

        public void MinimumContact()
        {
            Wait();

            NoRadioButton();
            ButtonElement("Next - Security Question");
        }

        public void SecurityQuestions(string securityQuestion1, string securityQuestion2, string securityQuestion3, string securityResponse1, string securityResponse2, string securityResponse3)
        {
            Wait();

            webDriver.FindElement(securityQuestionsFormQuestion1Input).SendKeys(securityQuestion1);

            Wait();
            webDriver.FindElement(securityQuestionsFormQuestion2Input).SendKeys(securityQuestion2);
            
            Wait();
            webDriver.FindElement(securityQuestionsFormQuestion3Input).SendKeys(securityQuestion3);
            webDriver.FindElement(securityQuestionsFormAnswer1Input).SendKeys(securityResponse1);
            webDriver.FindElement(securityQuestionsFormAnswer2Input).SendKeys(securityResponse2);
            webDriver.FindElement(securityQuestionsFormAnswer3Input).SendKeys(securityResponse3);

            ButtonElement("Next - Create Evacuation File");
           
        }



        public void CreateESSFileMinLocation()
        {
            Wait();

            YesRadioButton();
            var insuranceOptions = webDriver.FindElement(locationFormInsuranceOptions);
            ChooseRandomOption(insuranceOptions, "insurance");
            ButtonElement("Next - Household Information");
        }

        public void CreateESSFileMaxLocation(string addressLine1, string addressLine2, string city, string zipCode)
        {
            NoRadioButton();
            webDriver.FindElement(addressFormAddressLine1Input).SendKeys(addressLine1);
            webDriver.FindElement(addressFormAddressLine2Input).SendKeys(addressLine2);
            webDriver.FindElement(addressFormCityInput).SendKeys(city);
            webDriver.FindElement(By.Id(city)).Click();
            webDriver.FindElement(addressFormZipCodeInput).SendKeys(zipCode);

            var insuranceOptions = webDriver.FindElement(locationFormInsuranceOptions);
            ChooseRandomOption(insuranceOptions, "insurance");

            ButtonElement("Next - Household Information");

        }


        public void CreateESSFileMinHouseholdMembers()
        {
            Wait();

            RadioButtonElement(householdMembersHasSpecialDietNoRadioBttn);
            RadioButtonElement(householdMembersHasMedicationNoRadioBttn);

            ButtonElement("Next - Pets");
        }

        public void CreateESSFileMaxHouseholdMembers(string firstName, string lastName, string initials, string gender, string dateOfBirth, string dietDetails)
        {
            Wait();

            ButtonElement("+ Add Household Member");

            Wait();
            webDriver.FindElement(personFormFirstNameInput).SendKeys(firstName);
            webDriver.FindElement(personFormLastNameInput).SendKeys(lastName);
            webDriver.FindElement(personFormInitialsInput).SendKeys(initials);
            webDriver.FindElement(personFormGenderSelect).SendKeys(gender);
            webDriver.FindElement(personFormDateOfBirthInput).SendKeys(dateOfBirth);
            ButtonElement("Save");

            RadioButtonElement(householdMembersHasSpecialDietYesRadioBttn);
            webDriver.FindElement(householdMembersDietDetailsInput).SendKeys(dietDetails);
            RadioButtonElement(householdMembersHasMedicationYesRadioBttn);

            ButtonElement("Next - Pets");
        }

        public void CreateESSFileMinAnimals()
        {
            ButtonElement("Next - Identify Needs");
        }

        public void CreateESSFileMaxAnimals(string type, string quantity)
        {
            Wait();
            ButtonElement("+ Add Pets");

            Wait();
            webDriver.FindElement(animalFormTypeInput).SendKeys(type);
            webDriver.FindElement(animalFormQuantityInput).SendKeys(quantity);
            ButtonElement("Save");

            var hasFoodOptions = webDriver.FindElement(animalFormHasFoodOptions);
            ChooseRandomOption(hasFoodOptions, "hasPetsFood");

            ButtonElement("Next - Identify Needs");
        }

        public void CreateESSFileNeeds()
        {
            Wait();

            var needsFoodOptions = webDriver.FindElement(needsFormFoodOptions);
            ChooseRandomOption(needsFoodOptions, "canEvacueeProvideFood");

            var needsLodgeOptions = webDriver.FindElement(needsFormLodgeOptions);
            ChooseRandomOption(needsLodgeOptions, "canEvacueeProvideLodging");

            var needsClothesOptions = webDriver.FindElement(needsFormClothesOptions);
            ChooseRandomOption(needsClothesOptions, "canEvacueeProvideClothing");

            var needsTransportsOptions = webDriver.FindElement(needsFormTransportOptions);
            ChooseRandomOption(needsTransportsOptions, "canEvacueeProvideTransportation");

            var needsIncidentalsOptions = webDriver.FindElement(needsFormIncidentalOptions);
            ChooseRandomOption(needsIncidentalsOptions, "canEvacueeProvideIncidentals");

            ButtonElement("Next - Security Phrase");
        }

        public void CreateESSFileSecurityPhrase(string securityPhrase)
        {
            Wait();

            webDriver.FindElement(securityPhraseFormPhraseInput).SendKeys(securityPhrase);
            ButtonElement("Next - Review Submission");
        }

        public void SaveAndSubmit()
        {
            ButtonElement("Save & Submit");
        }

        public void SubmitForm()
        {
            var js = (IJavaScriptExecutor)webDriver;

            Wait();
            FocusAndClick(submitFormCAPTCHAForm);

            Wait(2000);

            var buttons = webDriver.FindElements(By.TagName("button"));
            var saveButton = buttons.Should().ContainSingle(b => b.Text.Contains("Save & Submit")).Subject;
            js.ExecuteScript("arguments[0].scrollIntoView();", saveButton);

            saveButton.Enabled.Should().BeTrue();
            saveButton.Click();
        }

        public void SubmitFormSuccessfully()
        {
            Wait();
            Assert.True(webDriver.FindElement(submissionCompleteDialog).Displayed);
            ButtonElement("Close");
        }
    }
}
