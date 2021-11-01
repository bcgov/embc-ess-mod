using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Resources.Contacts;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class ContactTests : WebAppTestBase
    {
        private readonly IContactRepository contactRepository;

        // Constants
        private string TestContactUserId => base.TestData.ContactUserId;

        public ContactTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            contactRepository = services.GetRequiredService<IContactRepository>();
        }

        [Fact(Skip = RequiresDynamics)]
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

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateContact()
        {
            /* Get Contact */
            var contactQuery = new RegistrantQuery
            {
                UserId = TestContactUserId
            };
            var queryResult = await contactRepository.QueryContact(contactQuery);
            var contact = queryResult.Items.FirstOrDefault();

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
            var updatedContact = updatedQueryResult.Items.FirstOrDefault();

            updatedContact.PrimaryAddress.Community.ShouldBe(newCommunity);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateContact()
        {
            /* Get Contact */
            var contactQuery = new RegistrantQuery
            {
                UserId = TestContactUserId
            };
            var queryResult = await contactRepository.QueryContact(contactQuery);
            var baseContact = queryResult.Items.FirstOrDefault();
            baseContact.Id = null;
            baseContact.UserId = TestContactUserId + Guid.NewGuid().ToString("N").Substring(0, 4);

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
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateContactWithAddressLookupValues()
        {
            var country = "CAN";
            var province = "BC";
            var city = TestData.RandomCommunity;

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

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateEmailInvite()
        {
            var contact = (await contactRepository.QueryContact(new RegistrantQuery { UserId = TestContactUserId })).Items.Single();

            var email = "test@email.com";

            var inviteId = (await contactRepository.ManageContactInvite(new CreateNewContactEmailInvite
            {
                ContactId = contact.Id,
                Email = email,
                InviteDate = DateTime.Now,
                RequestingUserId = null
            })).InviteId;

            inviteId.ShouldNotBeNullOrEmpty();

            var invites = (await contactRepository.QueryContactInvite(new ContactEmailInviteQuery { InviteId = inviteId })).Items;

            var savedInvite = invites.ShouldHaveSingleItem();
            savedInvite.ContactId.ShouldBe(contact.Id);
            savedInvite.InviteId.ShouldBe(inviteId);
        }
    }
}
