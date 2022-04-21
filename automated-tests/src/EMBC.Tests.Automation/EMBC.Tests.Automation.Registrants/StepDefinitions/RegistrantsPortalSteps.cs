using EMBC.Tests.Automation.Registrants.Drivers;
using EMBC.Tests.Automation.Registrants.PageObjects;

namespace EMBC.Tests.Automation.Registrants.StepDefinitions
{
    [Binding]
    public sealed class RegistrantsPortalSteps
    {
        private readonly AnonymousRegistration pageObject;

        public RegistrantsPortalSteps(BrowserDriver driver)
        {
            this.pageObject = new AnonymousRegistration(driver.Current);
        }

        [Given("I see the Registrants' Portal home page")]
        public void GivenNavigateToHomePage()
        {
            pageObject.GetCurrentLocation.Should().Be("/registration-method");
        }

        [When("I click Self Register button")]
        public void WhenClickSelfRegister()
        {
            pageObject.EnterCollectionNotice();
        }

        [When("I select to register without a BC Services Card")]
        public void WhenRegisterWithoutBCServicesCard()
        {
            // to be completed
        }

        [Then("I see Collection Notice page")]
        public void ThenCollectionNotice()
        {
            pageObject.GetCurrentLocation.Should().Be("/non-verified-registration/collection-notice");
            pageObject.GetCurrentWizardStep().Should().Be(AnonymousRegistration.AnonymousRegistrationWizardStep.CollectionNotice);
        }
    }
}