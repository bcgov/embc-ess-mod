using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Resources.Contacts;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class ContactTests : DynamicsWebAppTestBase
    {
        private readonly IContactRepository contactRepository;

        // Constants
        private string TestContactUserId => base.TestData.ContactUserId;

        public ContactTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            contactRepository = Services.GetRequiredService<IContactRepository>();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanGetContact()
        {
            var contactQuery = new RegistrantQuery
            {
                UserId = TestContactUserId
            };
            var queryResult = await contactRepository.QueryContact(contactQuery);

            queryResult.Items.ShouldNotBeEmpty();

            var contact = (Contact)queryResult.Items.First();

            contact.ShouldNotBeNull();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanUpdateContact()
        {
            /* Get Contact */
            var contactQuery = new RegistrantQuery
            {
                UserId = TestContactUserId
            };
            var queryResult = await contactRepository.QueryContact(contactQuery);
            var contact = queryResult.Items.First();

            var newCommunity = TestData.RandomCommunity;
            var currentCity = contact.PrimaryAddress.Community;

            contact.PrimaryAddress.Community = currentCity == newCommunity
              ? TestData.RandomCommunity
              : newCommunity; ;

            /* Update Contact */
            SaveContact saveContactCmd = new SaveContact
            {
                Contact = contact
            };
            var saveResult = await contactRepository.ManageContact(saveContactCmd);
            var updatedContactId = saveResult.ContactId;

            /* Get Updated Contact */
            var updatedContactQuery = new RegistrantQuery
            {
                ContactId = updatedContactId
            };
            var updatedQueryResult = await contactRepository.QueryContact(updatedContactQuery);
            var updatedContact = updatedQueryResult.Items.First();

            updatedContact.PrimaryAddress.Community.ShouldBe(newCommunity);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanCreateContact()
        {
            var uniqueSignature = Guid.NewGuid().ToString().Substring(0, 4);
            /* Get Contact */
            var contactQuery = new RegistrantQuery
            {
                UserId = TestContactUserId
            };
            var queryResult = await contactRepository.QueryContact(contactQuery);
            var baseContact = queryResult.Items.First();
            baseContact.Id = null;
            baseContact.UserId = $"{TestData.TestPrefix}-{uniqueSignature}-{TestContactUserId}";
            baseContact.FirstName = $"{TestData.TestPrefix}-{uniqueSignature}-first";
            baseContact.LastName += $"{TestData.TestPrefix}-{uniqueSignature}-last";

            /* Create Contact */
            SaveContact saveContactCmd = new SaveContact
            {
                Contact = baseContact
            };
            var saveResult = await contactRepository.ManageContact(saveContactCmd);
            var newContactId = saveResult.ContactId;

            /* Get New Contact */
            var newContactQuery = new RegistrantQuery
            {
                ContactId = newContactId
            };
            (await contactRepository.QueryContact(newContactQuery)).Items.ShouldHaveSingleItem().Id.ShouldBe(newContactId);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanCreateContactWithAddressLookupValues()
        {
            var country = "CAN";
            var province = "BC";
            var city = TestData.RandomCommunity;
            var uniqueSignature = Guid.NewGuid().ToString().Substring(0, 4);

            /* Get Contact */
            var contactQuery = new RegistrantQuery
            {
                UserId = TestContactUserId
            };
            var queryResult = await contactRepository.QueryContact(contactQuery);
            var baseContact = queryResult.Items.FirstOrDefault();
            baseContact.ShouldNotBeNull();

            baseContact.Id = null;
            baseContact.UserId = TestContactUserId + Guid.NewGuid().ToString("N").Substring(0, 4);
            baseContact.FirstName += "_" + uniqueSignature;
            baseContact.LastName += "_" + uniqueSignature;
            baseContact.PrimaryAddress.Country = country;
            baseContact.PrimaryAddress.StateProvince = province;
            baseContact.PrimaryAddress.Community = city;
            baseContact.MailingAddress.Country = country;
            baseContact.MailingAddress.StateProvince = province;
            baseContact.MailingAddress.Community = city;

            /* Create Contact */
            SaveContact saveContactCmd = new SaveContact
            {
                Contact = baseContact
            };
            var saveResult = await contactRepository.ManageContact(saveContactCmd);
            var newContactId = saveResult.ContactId;

            /* Get New Contact */
            var newContactQuery = new RegistrantQuery
            {
                ContactId = newContactId
            };
            var newQueryResult = await contactRepository.QueryContact(newContactQuery);
            var newContact = newQueryResult.Items.FirstOrDefault();

            newContact.ShouldNotBeNull().Id.ShouldBe(newContactId);

            newContact.PrimaryAddress.Country.ShouldBe(country);
            newContact.PrimaryAddress.StateProvince.ShouldBe(province);
            newContact.PrimaryAddress.Community.ShouldBe(city);

            newContact.MailingAddress.Country.ShouldBe(country);
            newContact.MailingAddress.StateProvince.ShouldBe(province);
            newContact.MailingAddress.Community.ShouldBe(city);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanCreateEmailInvite()
        {
            var contact = (await contactRepository.QueryContact(new RegistrantQuery { UserId = TestContactUserId })).Items.Single();

            var email = "test@email.com";

            var inviteId = (await contactRepository.ManageContactInvite(new CreateNewContactEmailInvite
            {
                ContactId = contact.Id,
                Email = email,
                InviteDate = DateTime.UtcNow,
                RequestingUserId = null
            })).InviteId;

            inviteId.ShouldNotBeNullOrEmpty();

            var invites = (await contactRepository.QueryContactInvite(new ContactEmailInviteQuery { InviteId = inviteId })).Items;

            var savedInvite = invites.ShouldHaveSingleItem();
            savedInvite.ContactId.ShouldBe(contact.Id);
            savedInvite.InviteId.ShouldBe(inviteId);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanUpdateSecurityQuestionsWhenChanged()
        {
            /* Get Contact */
            var contactQuery = new RegistrantQuery
            {
                UserId = TestContactUserId
            };
            var queryResult = await contactRepository.QueryContact(contactQuery);
            var contact = queryResult.Items.First();

            //var currentSecurityQuestions = contact.SecurityQuestions.ToArray();

            var uniqueSignature = Guid.NewGuid().ToString().Substring(0, 4);
            contact.SecurityQuestions = new[]
            {
                new SecurityQuestion{ Id = 1, Question = "question1", Answer = $"answer1-{uniqueSignature}", AnswerIsMasked = false },
                new SecurityQuestion{ Id = 2, Question = "question2", Answer = $"answer2-{uniqueSignature}", AnswerIsMasked = false },
                new SecurityQuestion{ Id = 3, Question = "question3", Answer = $"answer3-{uniqueSignature}", AnswerIsMasked = false },
            };

            /* Update Contact */
            var updatedContactId = (await contactRepository.ManageContact(new SaveContact { Contact = contact })).ContactId;

            /* Get Updated Contact */
            var updatedContact = (await contactRepository.QueryContact(new RegistrantQuery { ContactId = updatedContactId })).Items.ShouldHaveSingleItem();
            updatedContact.SecurityQuestions.Count().ShouldBe(contact.SecurityQuestions.Count());
            foreach (var securityQuestion in updatedContact.SecurityQuestions)
            {
                var modifiedSecurityQuestion = contact.SecurityQuestions.Single(sq => sq.Id == securityQuestion.Id);
                securityQuestion.Question.ShouldBe(modifiedSecurityQuestion.Question);
                var answer = securityQuestion.Answer;
                securityQuestion.Answer.ShouldBe(answer.Substring(0, 1) + "*****" + answer.Substring(answer.Length - 1));
            }
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanCreateContactWithNoSecurityQuestions()
        {
            /* Get Contact */
            var contactQuery = new RegistrantQuery
            {
                UserId = TestContactUserId
            };
            var queryResult = await contactRepository.QueryContact(contactQuery);

            var baseContact = queryResult.Items.First();

            var uniqueSignature = Guid.NewGuid().ToString().Substring(0, 4);
            baseContact.Id = null;
            baseContact.UserId = null;
            baseContact.FirstName = $"{this.TestData.TestPrefix}-{uniqueSignature}-first";
            baseContact.LastName += $"{this.TestData.TestPrefix}-{uniqueSignature}-last";
            baseContact.SecurityQuestions = Array.Empty<SecurityQuestion>();

            /* Update Contact */
            var updatedContactId = (await contactRepository.ManageContact(new SaveContact { Contact = baseContact })).ContactId;

            /* Get Updated Contact */
            var updatedContact = (await contactRepository.QueryContact(new RegistrantQuery { ContactId = updatedContactId })).Items.ShouldHaveSingleItem();
            updatedContact.SecurityQuestions.Count().ShouldBe(0);
        }
    }
}
