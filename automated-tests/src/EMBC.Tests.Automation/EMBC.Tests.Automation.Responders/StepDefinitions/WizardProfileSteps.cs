using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.StepDefinitions
{
    [Binding]
    public sealed class WizardProfileSteps
    {
        private readonly WizardProfile wizardProfile;

        public WizardProfileSteps(BrowserDriver driver)
        {
            wizardProfile = new WizardProfile(driver.Current);
        }


        [StepDefinition(@"I complete an online profile wizard step")]
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
        }

        [StepDefinition(@"I complete a paper based profile wizard step")]
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
        }
    }
}
