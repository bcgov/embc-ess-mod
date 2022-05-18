using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.StepDefinitions
{
    [Binding]
    public sealed class WizardEssFileSteps
    {
        private readonly WizardEssFile wizardEssFile;

        public WizardEssFileSteps(BrowserDriver driver)
        {
            wizardEssFile = new WizardEssFile(driver.Current);
        }

        [StepDefinition(@"I complete an online ESS File wizard step")]
        public void OnlineESSFileWizardStep()
        {
            //fill evacuation details
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/evacuation-details");
            wizardEssFile.WizardOnlineEvacDetailsFormReqFields("Victoria EMBC Main Centre", "House loss");

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
            wizardEssFile.WizardSecurityPhraseForm("Sesame");

            //review ESS File and submit
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/review");
            wizardEssFile.WizardReviewEssFile();
            wizardEssFile.WizardNextStepButton();
        }

        [StepDefinition(@"I complete a paper based ESS File wizard step")]
        public void PaperBasedESSFileWizardStep()
        {
            //fill evacuation details
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/evacuation-details");
            wizardEssFile.WizardPaperBasedEvacDetailsFormReqFields("John", "S", "05/13/2022", "1500", "1012 Douglas St", "Victoria", "Victoria EMBC Main Centre", "House loss");

            //fill household members
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/household-members");
            wizardEssFile.WizardHouseholdMembersMaxForm("Anne", "Doe", "Female", "09/12/2001", "Lactose intolerant");

            //fill animals
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/animals");
            wizardEssFile.AnimalsMaxForm("Dogs", "2");

            //fill needs assessments
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/needs");
            wizardEssFile.WizardNeedsAssessmentsForm();

            //review ESS File and submit
            wizardEssFile.CurrentLocation.Should().Be("/ess-wizard/ess-file/review");
            wizardEssFile.WizardReviewEssFile();
            wizardEssFile.WizardNextStepButton();
        }

        [StepDefinition(@"I bypass ESS file wizard step")]
        public void BypassEssFileWizardStep()
        {
            //Passing ESS File Step
            wizardEssFile.WizardEditESSFilePassStep();
            wizardEssFile.WizardNextStepButton();
        }
    }
}
