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
        private const string TestUserId = "CHRIS-TEST";

        public ContactTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            contactRepository = services.GetRequiredService<IContactRepository>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetContact()
        {
            var contactQuery = new ContactQuery
            {
                ByUserId = TestUserId
            };
            var queryResult = await contactRepository.QueryContact(contactQuery);

            queryResult.Items.ShouldNotBeEmpty();

            var contact = (Contact)queryResult.Items.First();

            contact.ShouldNotBeNull();

            contact.PrimaryAddress.Country.ShouldNotBeNull().ShouldNotBeNull();
            contact.PrimaryAddress.Country.ShouldNotBeNull();
            contact.PrimaryAddress.StateProvince.ShouldNotBeNull().ShouldNotBeNull();
            contact.PrimaryAddress.StateProvince.ShouldNotBeNull();
            contact.PrimaryAddress.Community.ShouldNotBeNull().ShouldNotBeNull();
            contact.PrimaryAddress.Community.ShouldNotBeNull();
        }

        
        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateContact()
        {
            /* Get Contact */
            var contactQuery = new ContactQuery
            {
                ByUserId = TestUserId
            };
            var queryResult = await contactRepository.QueryContact(contactQuery);
            var contact = queryResult.Items.FirstOrDefault();
            
            var currentCity = contact.PrimaryAddress.Community;
            var newCity = currentCity == "406adfaf-9f97-ea11-b813-005056830319"
                ? "226adfaf-9f97-ea11-b813-005056830319"
                : "406adfaf-9f97-ea11-b813-005056830319";

            contact.PrimaryAddress.Community = newCity;

            /* Update Contact */
            SaveContact saveContactCmd = new SaveContact
            {
                Contact = contact
            };
            var saveResult = await contactRepository.ManageContact(saveContactCmd);
            var updatedContactId = saveResult.ContactId;

            /* Get Updated Contact */
            var updatedContactQuery = new ContactQuery
            {
                ByContactId = updatedContactId
            };
            var updatedQueryResult = await contactRepository.QueryContact(updatedContactQuery);
            var updatedContact = updatedQueryResult.Items.FirstOrDefault();

            updatedContact.PrimaryAddress.Community.ShouldBe(newCity);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateContact()
        {
            /* Get Contact */
            var contactQuery = new ContactQuery
            {
                ByUserId = TestUserId
            };
            var queryResult = await contactRepository.QueryContact(contactQuery);
            var baseContact = queryResult.Items.FirstOrDefault();
            baseContact.Id = null;
            baseContact.UserId = TestUserId + Guid.NewGuid().ToString("N").Substring(0, 4);

            /* Create Contact */
            SaveContact saveContactCmd = new SaveContact
            {
                Contact = baseContact
            };
            var saveResult = await contactRepository.ManageContact(saveContactCmd);
            var newContactId = saveResult.ContactId;

            /* Get New Contact */
            var newContactQuery = new ContactQuery
            {
                ByContactId = newContactId
            };
            var newQueryResult = await contactRepository.QueryContact(newContactQuery);
            var newContact = newQueryResult.Items.FirstOrDefault();

            newContact.ShouldNotBeNull().Id.ShouldBe(newContactId);

            /* Delete New Contact */
            DeleteContact deleteCmd = new DeleteContact
            {
                ContactId = newContactId
            };
            var deleteResult = await contactRepository.ManageContact(deleteCmd);
            var deletedContactId = deleteResult.ContactId;

            /* Get Deleted Contact */
            var deletedCaseQuery = new ContactQuery
            {
                ByContactId = deletedContactId
            };
            var deletedQueryResult = await contactRepository.QueryContact(deletedCaseQuery);
            var deletedContact = (Contact)deletedQueryResult.Items.LastOrDefault();
            deletedContact.ShouldBeNull();          
        }
        
        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateContactWithAddressLookupValues()
        {
            var country = "CAN";
            var province = "BC";
            var city = "226adfaf-9f97-ea11-b813-005056830319";

            /* Get Contact */
            var contactQuery = new ContactQuery
            {
                ByUserId = TestUserId
            };
            var queryResult = await contactRepository.QueryContact(contactQuery);
            var baseContact = queryResult.Items.FirstOrDefault();
            baseContact.ShouldNotBeNull();

            baseContact.Id = null;
            baseContact.UserId = TestUserId + Guid.NewGuid().ToString("N").Substring(0, 4);
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
            var newContactQuery = new ContactQuery
            {
                ByContactId = newContactId
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

            /* Delete New Contact */
            DeleteContact deleteCmd = new DeleteContact
            {
                ContactId = newContactId
            };
            var deleteResult = await contactRepository.ManageContact(deleteCmd);
            var deletedContactId = deleteResult.ContactId;

            /* Get deleted contact */
            var deletedCaseQuery = new ContactQuery
            {
                ByContactId = deletedContactId
            };
            var deletedQueryResult = await contactRepository.QueryContact(deletedCaseQuery);
            var deletedContact = (Contact)deletedQueryResult.Items.LastOrDefault();
            deletedContact.ShouldBeNull();
        }            
    }
}
