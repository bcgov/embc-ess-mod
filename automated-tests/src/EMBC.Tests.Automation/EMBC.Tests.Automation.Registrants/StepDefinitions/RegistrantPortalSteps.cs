using EMBC.Tests.Automation.Registrants.Drivers;
using EMBC.Tests.Automation.Registrants.PageObjects;

namespace EMBC.Tests.Automation.Registrants.StepDefinitions
{
    [Binding]
    public sealed class RegistrantPortalSteps
    {
        private readonly AnonymousRegistration pageObject;

        public RegistrantPortalSteps(BrowserDriver driver)
        {
            this.pageObject = new AnonymousRegistration(driver.Current);
        }

        [Given("I see the Registrant Portal home page")]
        public void GivenNavigateToHomePage()
        {
            pageObject.GetCurrentLocation.Should().Be("/registration-method");
        }

        [When("I click on the Self Register button")]
        public void WhenClickSelfRegister()
        {
            pageObject.EnterCollectionNotice();
        }

        [Then("I see Collection Notice page")]
        public void ThenCollectionNotice()
        {
            pageObject.GetCurrentLocation.Should().Be("/non-verified-registration/collection-notice");
            pageObject.GetCurrentWizardStep().Should().Be(AnonymousRegistration.AnonymousRegistrationWizardStep.CollectionNotice);
        }

        [Then("I complete the minimum fields on the evacuee forms")]
        public void MinimumFieldsEvacueeForms()
        {
            // click on 'Next' button on Collection Notice page
            pageObject.NextButton();

            // click on 'Yes' button on Restriction page
            pageObject.YesRadioButton();

            // click on 'Next' button 
            pageObject.NextButton();

            //Thread.Sleep(2000);

            // complete the minimum Personal Details
            pageObject.MinimumPersonalDetails();

            // click on 'Next' button 
            pageObject.NextButton();
        }

        [Then("the CAPTCHA field is confirmed to be working")]
        public void CAPTCHAFieldWorking()
        {
            // to be completed
        }
    }
}