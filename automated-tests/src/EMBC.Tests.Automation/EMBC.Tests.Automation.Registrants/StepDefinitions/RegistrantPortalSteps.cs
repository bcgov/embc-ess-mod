using Microsoft.Extensions.Configuration;

namespace EMBC.Tests.Automation.Registrants.StepDefinitions
{
    [Binding]
    public sealed class RegistrantPortalSteps
    {
        private readonly Registration registration;
        private readonly EvacueeDashboard evacueeDashboard;

        private readonly string firstName1Input = "Jane";
        private readonly string lastNameInput = "Doe";
        private readonly string gender1Input = "Male";
        private readonly string gender2Input = "Female";
        private readonly string DOB1Input = "01011980";

        private readonly string addressLine1Input = "1012 Douglas St";
        private readonly string addressLine2Input = "Apt 462";
        private readonly string city1Input = "Victoria";
        private readonly string city2Input = "Vancouver";
        private readonly string postalCode1Input = "V6Z 1B7";
        private readonly string postalCode2Input = "V0W 1F3";

        private readonly string securityQuestion1Input = "What was the name of your first pet?";
        private readonly string securityQuestion2Input = "In what city or town was your mother born?";
        private readonly string securityQuestion3Input = "Where was your first job?";
        private readonly string securityAnswer1Input = "Daisy";
        private readonly string securityAnswer2Input = "Vancouver";
        private readonly string securityAnswer3Input = "McDonalds";

        private readonly string securityPhraseInput = "Sesame";

        private readonly string firstName2Input = "Andrew";
        private readonly string initialsInput = "AD";
        private readonly string DOB2Input = "12122000";
        private readonly string dietDetailsInput = "Lactose intolerant";

        private readonly string petsTypeInput = "Cats";
        private readonly string petsQuantityInput = "3";


        public RegistrantPortalSteps(BrowserDriver driver)
        {
            registration = new Registration(driver.Current);
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
            registration.NewAccountRestriction();

            //PROFILE CREATION:
            //Minimum Personal Details
            registration.CurrentLocation.Should().Be("/non-verified-registration/create-profile");
            registration.MinimumPersonalDetails(firstName1Input, lastNameInput, gender2Input, DOB1Input);

            //Minimum Address Form
            registration.MinimumAddress(addressLine1Input, city1Input);

            //Minimum Contact Information
            registration.MinimumContact();

            //Security Questions
            registration.SecurityQuestions(securityQuestion1Input, securityQuestion2Input, securityQuestion3Input, securityAnswer1Input, securityAnswer2Input, securityAnswer3Input);

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
            registration.CreateESSFileSecurityPhrase(securityPhraseInput);
        }

        [When("I create a new Registration")]
        public void newEssFile()
        {
            if (registration.CurrentLocation.Equals("/verified-registration/collection-notice"))
            {
                //collection notice
                registration.CollectionNotice();
                
                //Restriction
                registration.CurrentLocation.Should().Be("/verified-registration/restriction");
                registration.NewAccountRestriction();

                //PROFILE CREATION:
                //Required Personal Details
                registration.CurrentLocation.Should().Be("/verified-registration/create-profile");
                registration.VerifiedAccountPersonalDetails(gender1Input);

                //Required Address Form
                registration.VerifiedAccountAddress(city2Input, postalCode2Input);

                //Minimum Contact Information
                registration.MinimumContact();

                //Security Questions
                registration.SecurityQuestions(securityQuestion1Input, securityQuestion2Input, securityQuestion3Input, securityAnswer1Input, securityAnswer2Input, securityAnswer3Input);

                //Review
                registration.SaveAndSubmit();

                //Create New EssFile
                evacueeDashboard.CreateNewEvent();

            } else {
                evacueeDashboard.CreateNewEvent();
            }
        }

        [When("I complete the maximum fields on the ESS file evacuee forms")]
        public void MaximumFieldsEvacueeForms()
        {
            //Restriction
            registration.CurrentLocation.Should().Be("/verified-registration/confirm-restriction");
            registration.VerifiedRestriction();

            //ESS file Location
            registration.CurrentLocation.Should().Be("/verified-registration/needs-assessment");
            registration.CreateESSFileMaxLocation(addressLine1Input, addressLine2Input, city2Input, postalCode1Input);

            //ESS file Household Members
            registration.CreateESSFileMaxHouseholdMembers(firstName2Input, lastNameInput, initialsInput, gender1Input, DOB2Input, dietDetailsInput);

            //Pets entered
            registration.CreateESSFileMaxAnimals(petsTypeInput, petsQuantityInput);

            //ESS file Needs
            registration.CreateESSFileNeeds();

            //ESS file Security Phrase
            registration.CreateESSFileSecurityPhrase(securityPhraseInput);

            //Submit ESSFile
            registration.SaveAndSubmit();
        }

        [When("I submit the anonymous registration form")]
        public void SubmitForm()
        {
            registration.SubmitForm();
        }

        [Then("the ESS File submission complete dialog appears")]
        public void VerifiedSubmitForm()
        {
            registration.SubmitFormSuccessfully();
        }
        
    }
}
