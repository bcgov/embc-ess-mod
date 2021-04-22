using System;
using System.Threading.Tasks;
using EMBC.Registrants.API;
using EMBC.Registrants.API.ProfilesModule;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.Registrants.API.Profiles
{
    public class ProfileTests : WebAppTestBase
    {
        private readonly IProfileManager profileManager;

        public ProfileTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            profileManager = services.GetRequiredService<IProfileManager>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetProfile()
        {
            var profile = await profileManager.GetProfileByBcscid("test");

            profile.ShouldNotBeNull();

            profile.PrimaryAddress.Country.ShouldNotBeNull().ShouldNotBeNull();
            profile.PrimaryAddress.Country.ShouldNotBeNull();
            profile.PrimaryAddress.StateProvince.ShouldNotBeNull().ShouldNotBeNull();
            profile.PrimaryAddress.StateProvince.ShouldNotBeNull();
            profile.PrimaryAddress.Jurisdiction.ShouldNotBeNull().ShouldNotBeNull();
            profile.PrimaryAddress.Jurisdiction.ShouldNotBeNull();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateProfile()
        {
            var profile = await profileManager.GetProfileByBcscid("test");
            var currentCity = profile.PrimaryAddress.Jurisdiction;
            var newCity = currentCity == "406adfaf-9f97-ea11-b813-005056830319"
                ? "226adfaf-9f97-ea11-b813-005056830319"
                : "406adfaf-9f97-ea11-b813-005056830319";

            profile.PrimaryAddress.Jurisdiction = newCity;

            await profileManager.SaveProfile(profile);

            var updatedProfile = await profileManager.GetProfileByBcscid("test");
            updatedProfile.PrimaryAddress.Jurisdiction.ShouldBe(newCity);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateProfile()
        {
            var baseProfile = await profileManager.GetProfileByBcscid("ChrisTest3");
            var newProfileId = Guid.NewGuid().ToString("N").Substring(0, 10);
            baseProfile.Id = newProfileId;

            var id = await profileManager.SaveProfile(baseProfile);

            var profile = await profileManager.GetProfileByBcscid(newProfileId);

            profile.ShouldNotBeNull().Id.ShouldBe(newProfileId);
            profile.Id.ShouldBe(baseProfile.Id);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateProfileWithAddressLookupValues()
        {
            var baseProfile = await profileManager.GetProfileByBcscid("ChrisTest3");
            var newProfileBceId = Guid.NewGuid().ToString("N").Substring(0, 10);
            var country = "CAN";
            var province = "BC";
            var city = "226adfaf-9f97-ea11-b813-005056830319";

            baseProfile.Id = newProfileBceId;
            baseProfile.PrimaryAddress.Country = country;
            baseProfile.PrimaryAddress.StateProvince = province;
            baseProfile.PrimaryAddress.Jurisdiction = city;
            baseProfile.MailingAddress.Country = country;
            baseProfile.MailingAddress.StateProvince = province;
            baseProfile.MailingAddress.Jurisdiction = city;

            var id = await profileManager.SaveProfile(baseProfile);

            var profile = await profileManager.GetProfileByBcscid(newProfileBceId);

            profile.PrimaryAddress.Country.ShouldBe(country);
            profile.PrimaryAddress.StateProvince.ShouldBe(province);
            profile.PrimaryAddress.Jurisdiction.ShouldBe(city);

            profile.MailingAddress.Country.ShouldBe(country);
            profile.MailingAddress.StateProvince.ShouldBe(province);
            profile.MailingAddress.Jurisdiction.ShouldBe(city);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanDeleteProfile()
        {
            var baseProfile = await profileManager.GetProfileByBcscid("ChrisTest3");
            var newProfileId = Guid.NewGuid().ToString("N").Substring(0, 10);
            baseProfile.Id = newProfileId;

            await profileManager.SaveProfile(baseProfile);

            await profileManager.DeleteProfile(newProfileId);

            (await profileManager.GetProfileByBcscid(newProfileId)).ShouldBeNull();
        }
    }
}
