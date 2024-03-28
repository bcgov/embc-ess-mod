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

            profile.PrimaryAddress.AddressLine1.ShouldBe(registrantProfile.PrimaryAddress.AddressLine1);
            profile.PrimaryAddress.AddressLine2.ShouldBe(registrantProfile.PrimaryAddress.AddressLine2);
            profile.PrimaryAddress.Community.ShouldBe(registrantProfile.PrimaryAddress.Community);
            profile.PrimaryAddress.StateProvince.ShouldBe(registrantProfile.PrimaryAddress.StateProvince);
            profile.PrimaryAddress.Country.ShouldBe(registrantProfile.PrimaryAddress.Country);
            profile.PrimaryAddress.PostalCode.ShouldBe(registrantProfile.PrimaryAddress.PostalCode);

            profile.MailingAddress.AddressLine1.ShouldBe(registrantProfile.MailingAddress.AddressLine1);
            profile.MailingAddress.AddressLine2.ShouldBe(registrantProfile.MailingAddress.AddressLine2);
            profile.MailingAddress.Community.ShouldBe(registrantProfile.MailingAddress.Community);
            profile.MailingAddress.StateProvince.ShouldBe(registrantProfile.MailingAddress.StateProvince);
            profile.MailingAddress.Country.ShouldBe(registrantProfile.MailingAddress.Country);
            profile.MailingAddress.PostalCode.ShouldBe(registrantProfile.MailingAddress.PostalCode);
        }

        [Fact]
        public void CanMapServerRegistrantProfileFromProfile()
        {
            var profile = FakeGenerator.CreateClientRegistrantProfile();
            var registrantProfile = mapper.Map<RegistrantProfile>(profile);

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

            registrantProfile.PrimaryAddress.AddressLine1.ShouldBe(profile.PrimaryAddress.AddressLine1);
            registrantProfile.PrimaryAddress.AddressLine2.ShouldBe(profile.PrimaryAddress.AddressLine2);
            registrantProfile.PrimaryAddress.Community.ShouldBe(profile.PrimaryAddress.Community);
            registrantProfile.PrimaryAddress.StateProvince.ShouldBe(profile.PrimaryAddress.StateProvince);
            registrantProfile.PrimaryAddress.Country.ShouldBe(profile.PrimaryAddress.Country);
            registrantProfile.PrimaryAddress.PostalCode.ShouldBe(profile.PrimaryAddress.PostalCode);

            registrantProfile.MailingAddress.AddressLine1.ShouldBe(profile.MailingAddress.AddressLine1);
            registrantProfile.MailingAddress.AddressLine2.ShouldBe(profile.MailingAddress.AddressLine2);
            registrantProfile.MailingAddress.Community.ShouldBe(profile.MailingAddress.Community);
            registrantProfile.MailingAddress.StateProvince.ShouldBe(profile.MailingAddress.StateProvince);
            registrantProfile.MailingAddress.Country.ShouldBe(profile.MailingAddress.Country);
            registrantProfile.MailingAddress.PostalCode.ShouldBe(profile.MailingAddress.PostalCode);
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
