using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Registrants.API;
using EMBC.Registrants.API.LocationModule;
using EMBC.Registrants.API.ProfilesModule;
using EMBC.Registrants.API.Shared;
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
        private readonly IListsRepository listsRepository;

        public ProfileTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            profileManager = services.GetRequiredService<IProfileManager>();
            listsRepository = services.GetRequiredService<IListsRepository>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetProfile()
        {
            var profile = await profileManager.GetProfileByBcscid("test");

            profile.ShouldNotBeNull();

            profile.PrimaryAddress.Country.ShouldNotBeNull().Code.ShouldNotBeNull();
            profile.PrimaryAddress.Country.Name.ShouldNotBeNull();
            profile.PrimaryAddress.StateProvince.ShouldNotBeNull().Code.ShouldNotBeNull();
            profile.PrimaryAddress.StateProvince.Name.ShouldNotBeNull();
            profile.PrimaryAddress.Jurisdiction.ShouldNotBeNull().Code.ShouldNotBeNull();
            profile.PrimaryAddress.Jurisdiction.Name.ShouldNotBeNull();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateProfile()
        {
            var profile = await profileManager.GetProfileByBcscid("test");
            var currentCity = profile.PrimaryAddress.Jurisdiction;
            var newCity = (await listsRepository.GetJurisdictions()).Skip(new Random().Next(100)).Take(1).First();

            profile.PrimaryAddress.Jurisdiction = new Jurisdiction { Code = newCity.Code };

            await profileManager.SaveProfile(profile);

            var updatedProfile = await profileManager.GetProfileByBcscid("test");
            updatedProfile.PrimaryAddress.Jurisdiction.Code.ShouldBe(newCity.Code);
            updatedProfile.PrimaryAddress.Jurisdiction.Name.ShouldBe(newCity.Name);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateProfile()
        {
            var baseProfile = await profileManager.GetProfileByBcscid("test");
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
            var baseProfile = await profileManager.GetProfileByBcscid("test");
            var newProfileBceId = Guid.NewGuid().ToString("N").Substring(0, 10);
            var country = (await listsRepository.GetCountries()).First(c => c.Code == "CAN");
            var province = (await listsRepository.GetStateProvinces()).First(c => c.Code == "BC");
            var city = (await listsRepository.GetJurisdictions()).Skip(new Random().Next(100)).Take(1).First();

            baseProfile.Id = newProfileBceId;
            baseProfile.PrimaryAddress.Country = new Country { Code = country.Code };
            baseProfile.PrimaryAddress.StateProvince = new StateProvince { Code = province.Code };
            baseProfile.PrimaryAddress.Jurisdiction = new Jurisdiction { Code = city.Code };
            baseProfile.MailingAddress.Country = new Country { Code = country.Code };
            baseProfile.MailingAddress.StateProvince = new StateProvince { Code = province.Code };
            baseProfile.MailingAddress.Jurisdiction = new Jurisdiction { Code = city.Code };

            var id = await profileManager.SaveProfile(baseProfile);

            var profile = await profileManager.GetProfileByBcscid(newProfileBceId);

            profile.PrimaryAddress.Country.Code.ShouldBe(country.Code);
            profile.PrimaryAddress.Country.Name.ShouldBe(country.Name);
            profile.PrimaryAddress.StateProvince.Code.ShouldBe(province.Code);
            profile.PrimaryAddress.StateProvince.Name.ShouldBe(province.Name);
            profile.PrimaryAddress.Jurisdiction.Code.ShouldBe(city.Code);
            profile.PrimaryAddress.Jurisdiction.Name.ShouldBe(city.Name);

            profile.MailingAddress.Country.Code.ShouldBe(country.Code);
            profile.MailingAddress.Country.Name.ShouldBe(country.Name);
            profile.MailingAddress.StateProvince.Code.ShouldBe(province.Code);
            profile.MailingAddress.StateProvince.Name.ShouldBe(province.Name);
            profile.MailingAddress.Jurisdiction.Code.ShouldBe(city.Code);
            profile.MailingAddress.Jurisdiction.Name.ShouldBe(city.Name);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanDeleteProfile()
        {
            var baseProfile = await profileManager.GetProfileByBcscid("test");
            var newProfileId = Guid.NewGuid().ToString("N").Substring(0, 10);
            baseProfile.Id = newProfileId;

            await profileManager.SaveProfile(baseProfile);

            await profileManager.DeleteProfile(newProfileId);

            (await profileManager.GetProfileByBcscid(newProfileId)).ShouldBeNull();
        }
    }
}
