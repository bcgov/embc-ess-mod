using Microsoft.Extensions.Configuration;

namespace EMBC.Tests.Automation.Registrants.StepDefinitions
{
    [Binding]
    public sealed class RegistrantPortalSteps
    {
        private readonly Registration registration;
        private readonly string captchaAnswer;
        private readonly EvacueeDashboard evacueeDashboard;

        public RegistrantPortalSteps(BrowserDriver driver)
        {
            registration = new Registration(driver.Current);
            captchaAnswer = driver.Configuration.GetValue<string>("captchaAnswer");
            evacueeDashboard = new EvacueeDashboard(driver.Current);
        }

        [When("I complete the minimum fields on the evacuee forms")]
        public void MinimumFieldsEvacueeForms()
        {
            //collection notice
            registration.CurrentLocation.Should().Be("/non-verified-registration/collection-notice");
            registration.CollectionNotice();

            //Restriction
            registration.CurrentLocation.Should().Be("/non-verified-registration/restriction");
            registration.UnverifiedRestriction();

            //PROFILE CREATION:
            //Minimum Personal Details
            registration.CurrentLocation.Should().Be("/non-verified-registration/create-profile");
            registration.MinimumPersonalDetails("Jane", "Doe", "Female", "01011980");

            //Minimum Address Form
            registration.MinimumAddress("1012 Douglas St", "Victoria");

            //Minimum Contact Information
            registration.MinimumContact();

            //Security Questions
            registration.SecurityQuestions("What was the name of your first pet?", "In what city or town was your mother born?", "Where was your first job?", "Daisy", "Vancouver", "McDonalds");

            //ESS FILE
            //ESS file Location
            registration.CurrentLocation.Should().Be("/non-verified-registration/needs-assessment");
            registration.CreateESSFileMinLocation();

            //ESS file Household Members
            registration.CreateESSFileMinHouseholdMembers();

            //no pets entered
            registration.CreateESSFileMinAnimals();

            //ESS file Needs
            registration.CreateESSFileNeeds();

            //ESS file Security Phrase
            registration.CreateESSFileSecurityPhrase("Sesame");
        }

        [When("I create a new EssFile")]
        public void newEssFile()
        {
            evacueeDashboard.CreateNewEvent();
        }

        [When("I complete the maximum fields on the ESS file evacuee forms")]
        public void MaximumFieldsEvacueeForms()
        {
            //Restriction
            registration.CurrentLocation.Should().Be("/verified-registration/confirm-restriction");
            registration.VerifiedRestriction();

            //ESS file Location
            registration.CurrentLocation.Should().Be("/verified-registration/needs-assessment");
            registration.CreateESSFileMaxLocation("1012 Douglas St", "Apt 361", "Vancouver", "V6Z 1B7");

            //ESS file Household Members
            registration.CreateESSFileMaxHouseholdMembers("Andrew", "Doe", "AD","Male", "12122000", "Lactose intolerant");

            //no pets entered
            registration.CreateESSFileMaxAnimals("Cats", "3");

            //ESS file Needs
            registration.CreateESSFileNeeds();

            //ESS file Security Phrase
            registration.CreateESSFileSecurityPhrase("Sesame");

            //Submit ESSFile
            registration.SubmitEssFile();
        }

        [When("I submit the anonymous registration form")]
        public void SubmitForm()
        {
            registration.SubmitForm(this.captchaAnswer);
        }

        [Then("the CAPTCHA field is confirmed to be working")]
        public void CAPTCHAFieldWorking()
        {
            registration.CAPTCHAFails("Invalid");
        }

        [Then("the ESS File submission complete dialog appears")]
        public void VerifiedSubmitForm()
        {
            registration.SubmitFormSuccessfully();
        }
        
    }
}