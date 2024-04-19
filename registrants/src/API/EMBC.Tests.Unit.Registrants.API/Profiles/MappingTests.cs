using System.Linq;
using System.Text.Json;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Registrants.API.Controllers;
using EMBC.Registrants.API.Mappers;
using EMBC.Registrants.API.Services;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.Registrants.API.Profiles
{
    public class MappingTests
    {
        private readonly AutoMapper.MapperConfiguration mapperConfig;
        private AutoMapper.IMapper mapper => mapperConfig.CreateMapper();

        public MappingTests()
        {
            mapperConfig = new AutoMapper.MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(Mappings));
            });
        }

        [Fact]
        public void ValidateAutoMapperMappings()
        {
            mapperConfig.AssertConfigurationIsValid();
        }

        [Fact]
        public void CanMapProfileFromServerRegistrantProfile()
        {
            var registrantProfile = FakeGenerator.CreateServerRegistrantProfile();
            var primaryAddress = registrantProfile.Addresses.Single(a => a.Type == AddressType.Primary);
            var mailingAddress = registrantProfile.Addresses.Single(a => a.Type == AddressType.Mailing);
            var profile = mapper.Map<Profile>(registrantProfile);

            profile.ShouldNotBeNull();

            profile.Id.ShouldBe(registrantProfile.UserId);
            profile.SecurityQuestions.FirstOrDefault(q => q.Id == 1)?.Answer.ShouldBe(registrantProfile.SecurityQuestions.FirstOrDefault(q => q.Id == 1)?.Answer);
            profile.SecurityQuestions.FirstOrDefault(q => q.Id == 2)?.Answer.ShouldBe(registrantProfile.SecurityQuestions.FirstOrDefault(q => q.Id == 2)?.Answer);
            profile.SecurityQuestions.FirstOrDefault(q => q.Id == 3)?.Answer.ShouldBe(registrantProfile.SecurityQuestions.FirstOrDefault(q => q.Id == 3)?.Answer);
            profile.SecurityQuestions.FirstOrDefault(q => q.Id == 1)?.Question.ShouldBe(registrantProfile.SecurityQuestions.FirstOrDefault(q => q.Id == 1)?.Question);
            profile.SecurityQuestions.FirstOrDefault(q => q.Id == 2)?.Question.ShouldBe(registrantProfile.SecurityQuestions.FirstOrDefault(q => q.Id == 2)?.Question);
            profile.SecurityQuestions.FirstOrDefault(q => q.Id == 3)?.Question.ShouldBe(registrantProfile.SecurityQuestions.FirstOrDefault(q => q.Id == 3)?.Question);
            profile.RestrictedAccess.ShouldBe(registrantProfile.RestrictedAccess);

            profile.PersonalDetails.DateOfBirth.ShouldBe(registrantProfile.DateOfBirth);
            profile.PersonalDetails.FirstName.ShouldBe(registrantProfile.FirstName);
            profile.PersonalDetails.LastName.ShouldBe(registrantProfile.LastName);
            profile.PersonalDetails.Initials.ShouldBe(registrantProfile.Initials);
            profile.PersonalDetails.PreferredName.ShouldBe(registrantProfile.PreferredName);
            profile.PersonalDetails.Gender.ShouldBe(registrantProfile.Gender);

            profile.ContactDetails.Email.ShouldBe(registrantProfile.Email);
            profile.ContactDetails.HideEmailRequired.ShouldBe(string.IsNullOrEmpty(registrantProfile.Email));
            profile.ContactDetails.Phone.ShouldBe(registrantProfile.Phone);
            profile.ContactDetails.HidePhoneRequired.ShouldBe(string.IsNullOrEmpty(registrantProfile.Phone));

            profile.PrimaryAddress.AddressLine1.ShouldBe(primaryAddress.AddressLine1);
            profile.PrimaryAddress.AddressLine2.ShouldBe(primaryAddress.AddressLine2);
            profile.PrimaryAddress.Community.ShouldBe(primaryAddress.Community);
            profile.PrimaryAddress.StateProvince.ShouldBe(primaryAddress.StateProvince);
            profile.PrimaryAddress.Country.ShouldBe(primaryAddress.Country);
            profile.PrimaryAddress.PostalCode.ShouldBe(primaryAddress.PostalCode);

            profile.MailingAddress.AddressLine1.ShouldBe(mailingAddress.AddressLine1);
            profile.MailingAddress.AddressLine2.ShouldBe(mailingAddress.AddressLine2);
            profile.MailingAddress.Community.ShouldBe(mailingAddress.Community);
            profile.MailingAddress.StateProvince.ShouldBe(mailingAddress.StateProvince);
            profile.MailingAddress.Country.ShouldBe(mailingAddress.Country);
            profile.MailingAddress.PostalCode.ShouldBe(mailingAddress.PostalCode);
        }

        [Fact]
        public void CanMapServerRegistrantProfileFromProfile()
        {
            var profile = FakeGenerator.CreateClientRegistrantProfile();
            var registrantProfile = mapper.Map<RegistrantProfile>(profile);
            var primaryAddress = registrantProfile.Addresses.Single(a => a.Type == AddressType.Primary);
            var mailingAddress = registrantProfile.Addresses.Single(a => a.Type == AddressType.Mailing);

            registrantProfile.ShouldNotBeNull();

            registrantProfile.UserId.ShouldBe(profile.Id);
            registrantProfile.SecurityQuestions.FirstOrDefault(q => q.Id == 1)?.Answer.ShouldBe(profile.SecurityQuestions.FirstOrDefault(q => q.Id == 1)?.Answer);
            registrantProfile.SecurityQuestions.FirstOrDefault(q => q.Id == 2)?.Answer.ShouldBe(profile.SecurityQuestions.FirstOrDefault(q => q.Id == 2)?.Answer);
            registrantProfile.SecurityQuestions.FirstOrDefault(q => q.Id == 3)?.Answer.ShouldBe(profile.SecurityQuestions.FirstOrDefault(q => q.Id == 3)?.Answer);
            registrantProfile.SecurityQuestions.FirstOrDefault(q => q.Id == 1)?.Question.ShouldBe(profile.SecurityQuestions.FirstOrDefault(q => q.Id == 1)?.Question);
            registrantProfile.SecurityQuestions.FirstOrDefault(q => q.Id == 2)?.Question.ShouldBe(profile.SecurityQuestions.FirstOrDefault(q => q.Id == 2)?.Question);
            registrantProfile.SecurityQuestions.FirstOrDefault(q => q.Id == 3)?.Question.ShouldBe(profile.SecurityQuestions.FirstOrDefault(q => q.Id == 3)?.Question);
            registrantProfile.RestrictedAccess.ShouldBe(profile.RestrictedAccess);

            registrantProfile.FirstName.ShouldBe(profile.PersonalDetails.FirstName);
            registrantProfile.LastName.ShouldBe(profile.PersonalDetails.LastName);
            registrantProfile.Initials.ShouldBe(profile.PersonalDetails.Initials);
            registrantProfile.PreferredName.ShouldBe(profile.PersonalDetails.PreferredName);

            registrantProfile.DateOfBirth.ShouldNotBeNull().ToString().ShouldBe(profile.PersonalDetails.DateOfBirth);
            registrantProfile.Gender.ShouldBe(profile.PersonalDetails.Gender);

            registrantProfile.Email.ShouldBe(profile.ContactDetails.Email);
            registrantProfile.Phone.ShouldBe(profile.ContactDetails.Phone);

            primaryAddress.AddressLine1.ShouldBe(profile.PrimaryAddress.AddressLine1);
            primaryAddress.AddressLine2.ShouldBe(profile.PrimaryAddress.AddressLine2);
            primaryAddress.Community.ShouldBe(profile.PrimaryAddress.Community);
            primaryAddress.StateProvince.ShouldBe(profile.PrimaryAddress.StateProvince);
            primaryAddress.Country.ShouldBe(profile.PrimaryAddress.Country);
            primaryAddress.PostalCode.ShouldBe(profile.PrimaryAddress.PostalCode);

            mailingAddress.AddressLine1.ShouldBe(profile.MailingAddress.AddressLine1);
            mailingAddress.AddressLine2.ShouldBe(profile.MailingAddress.AddressLine2);
            mailingAddress.Community.ShouldBe(profile.MailingAddress.Community);
            mailingAddress.StateProvince.ShouldBe(profile.MailingAddress.StateProvince);
            mailingAddress.Country.ShouldBe(profile.MailingAddress.Country);
            mailingAddress.PostalCode.ShouldBe(profile.MailingAddress.PostalCode);
        }

        [Fact]
        public void CanMapBcscUserToProfile()
        {
            var userInfo =
@"{
""address"": {
    ""country"": ""CA"",
    ""formatted"": ""818-9025 PEARL PLACE\nSURREY, BC  V3R 3H7"",
    ""locality"": ""SURREY"",
    ""postal_code"": ""V3R 3H7"",
    ""region"": ""BC"",
    ""street_address"": ""818-9025 PEARL PLACE""
},
""birthdate"": ""2000-04-14"",
""display_name"": ""EVAC THREE"",
""family_name"": ""THREE"",
""given_name"": ""EVAC""
}";

            var profile = BcscUserInfoMapper.MapBcscUserInfoToProfile("123", JsonDocument.Parse(userInfo));

            profile.Id.ShouldBe("123");
            profile.ContactDetails.Email.ShouldBeNull();
            profile.PersonalDetails.FirstName.ShouldBe("EVAC");
            profile.PersonalDetails.LastName.ShouldBe("THREE");
            profile.PersonalDetails.Gender.ShouldBeNull();
            profile.PersonalDetails.DateOfBirth.ShouldBe("04/14/2000");
            profile.PrimaryAddress.AddressLine1.ShouldBe("818-9025 PEARL PLACE");
            profile.PrimaryAddress.PostalCode.ShouldBe("V3R 3H7");
            profile.PrimaryAddress.Community.ShouldBe("SURREY");
            profile.PrimaryAddress.StateProvince.ShouldBe("BC");
            profile.PrimaryAddress.Country.ShouldBe("CA");
        }
    }
}
