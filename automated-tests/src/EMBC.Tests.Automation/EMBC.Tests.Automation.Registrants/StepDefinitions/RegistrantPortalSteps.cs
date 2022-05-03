namespace EMBC.Tests.Automation.Registrants.StepDefinitions
{
    [Binding]
    public sealed class RegistrantPortalSteps
    {
        private readonly AnonymousRegistration anonymousRegistration;

        public RegistrantPortalSteps(BrowserDriver driver)
        {
            this.anonymousRegistration = new AnonymousRegistration(driver.Current);
        }

        [When("I complete the minimum fields on the evacuee forms")]
        public void MinimumFieldsEvacueeForms()
        {
            anonymousRegistration.CurrentLocation.Should().Be("/non-verified-registration/collection-notice");
            // click on 'Next' button on Collection Notice page
            anonymousRegistration.NextButton();

            // click on 'Yes' button on Restriction page
            anonymousRegistration.YesRadioButton();

            // click on 'Next' button
            anonymousRegistration.NextButton();

            // complete the minimum Personal Details
            anonymousRegistration.MinimumPersonalDetails();

            // click on 'Next' button
            anonymousRegistration.NextButton();

            // complete the Address
            anonymousRegistration.MinimumAddress();

            // click on 'Next' button
            anonymousRegistration.NextButton();

            // click on 'No' for Contact Information
            anonymousRegistration.NoRadioButton();

            // click on 'Next' button
            anonymousRegistration.NextButton();

            // complete the Security Questions
            anonymousRegistration.SecurityQuestions();

            // click on 'Next' button
            anonymousRegistration.NextButton();

            // enter ESS file Location
            anonymousRegistration.CreateESSFileLocation();

            // click on 'Next' button
            anonymousRegistration.NextButton();

            // enter ESS file Household Members
            anonymousRegistration.CreateESSFileHouseholdMembers();

            // click on 'Next' button
            anonymousRegistration.NextButton();

            // no pets entered
            anonymousRegistration.Wait();

            // click on 'Next' button
            anonymousRegistration.NextButton();

            // enter ESS file Needs
            anonymousRegistration.CreateESSFileNeeds();

            // click on 'Next' button
            anonymousRegistration.NextButton();

            // enter ESS file Security Phrase
            anonymousRegistration.CreateESSFileSecurityPhrase();

            // click on 'Next' button
            anonymousRegistration.NextButton();
        }

        [Then("the CAPTCHA field is confirmed to be working")]
        public void CAPTCHAFieldWorking()
        {
            anonymousRegistration.CAPTCHAFails();
        }
    }
}