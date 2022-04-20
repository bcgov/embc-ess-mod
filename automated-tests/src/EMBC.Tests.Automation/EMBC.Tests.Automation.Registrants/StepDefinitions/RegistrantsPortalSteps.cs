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

        [Given("I see Registrants' Portal home page")]
        public void GivenNavigateToHomePage()
        {
            pageObject.GetCurrentLocation.Should().Be("/registration-method");
        }

        [When("I click Self Register button")]
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
    }
}