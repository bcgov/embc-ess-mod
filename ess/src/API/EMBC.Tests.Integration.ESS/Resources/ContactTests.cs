using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
            private const string TestUserId = "test";

            public ContactTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
            {
                contactRepository = services.GetRequiredService<IContactRepository>();
            }

            [Fact(Skip = RequiresDynamics)]
            public async Task CanGetContact()
            {
                var contactQuery = new GetContact
                {
                    ContactId = TestUserId
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
/*
            [Fact(Skip = RequiresDynamics)]
            public async Task CanUpdateProfile()
            {
                var profile = await contactRepository.GetProfileByBcscid("test");
                var currentCity = profile.PrimaryAddress.Community;
                var newCity = currentCity == "406adfaf-9f97-ea11-b813-005056830319"
                    ? "226adfaf-9f97-ea11-b813-005056830319"
                    : "406adfaf-9f97-ea11-b813-005056830319";

                profile.PrimaryAddress.Community = newCity;

                await contactRepository.SaveProfile(profile);

                var updatedProfile = await contactRepository.GetProfileByBcscid("test");
                updatedProfile.PrimaryAddress.Community.ShouldBe(newCity);
            }

            [Fact(Skip = RequiresDynamics)]
            public async Task CanCreateProfile()
            {
                var baseProfile = await contactRepository.GetProfileByBcscid("ChrisTest3");
                var newProfileId = Guid.NewGuid().ToString("N").Substring(0, 10);
                baseProfile.Id = newProfileId;

                var id = await contactRepository.SaveProfile(baseProfile);

                var profile = await contactRepository.GetProfileByBcscid(newProfileId);

                profile.ShouldNotBeNull().Id.ShouldBe(newProfileId);
                profile.Id.ShouldBe(baseProfile.Id);
            }

            [Fact(Skip = RequiresDynamics)]
            public async Task CanCreateProfileWithAddressLookupValues()
            {
                var baseProfile = await contactRepository.GetProfileByBcscid("ChrisTest3");
                var newProfileBceId = Guid.NewGuid().ToString("N").Substring(0, 10);
                var country = "CAN";
                var province = "BC";
                var city = "226adfaf-9f97-ea11-b813-005056830319";

                baseProfile.Id = newProfileBceId;
                baseProfile.PrimaryAddress.Country = country;
                baseProfile.PrimaryAddress.StateProvince = province;
                baseProfile.PrimaryAddress.Community = city;
                baseProfile.MailingAddress.Country = country;
                baseProfile.MailingAddress.StateProvince = province;
                baseProfile.MailingAddress.Community = city;

                var id = await contactRepository.SaveProfile(baseProfile);

                var profile = await contactRepository.GetProfileByBcscid(newProfileBceId);

                profile.PrimaryAddress.Country.ShouldBe(country);
                profile.PrimaryAddress.StateProvince.ShouldBe(province);
                profile.PrimaryAddress.Community.ShouldBe(city);

                profile.MailingAddress.Country.ShouldBe(country);
                profile.MailingAddress.StateProvince.ShouldBe(province);
                profile.MailingAddress.Community.ShouldBe(city);
            }

            [Fact(Skip = RequiresDynamics)]
            public async Task CanDeleteProfile()
            {
                var baseProfile = await contactRepository.GetProfileByBcscid("ChrisTest3");
                var newProfileId = Guid.NewGuid().ToString("N").Substring(0, 10);
                baseProfile.Id = newProfileId;

                await contactRepository.SaveProfile(baseProfile);

                await contactRepository.DeleteProfile(newProfileId);

                (await contactRepository.GetProfileByBcscid(newProfileId)).ShouldBeNull();
            }
*/
    }
}
