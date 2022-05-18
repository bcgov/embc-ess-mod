using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.StepDefinitions
{
    [Binding]
    public sealed class WizardSupportSteps
    {
        private readonly WizardSupport wizardSupport;

        public WizardSupportSteps(BrowserDriver driver)
        {
            wizardSupport = new WizardSupport(driver.Current);
        }

        [StepDefinition(@"I complete an online referral support wizard step")]
        public void OnlineReferralSupportWizardStep()
        {
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

        [StepDefinition(@"I complete a paper based referral support wizard step")]
        public void PaperBasedReferralSupportWizardStep()
        {
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
    }
}
