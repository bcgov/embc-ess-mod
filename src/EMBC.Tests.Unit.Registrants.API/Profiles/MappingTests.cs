using System.Linq;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Registrants.API.Controllers;
using EMBC.Registrants.API.Mappers;
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
            profile.SecurityQuestions.Where(q => q.Id == 1).FirstOrDefault()?.Answer.ShouldBe(registrantProfile.SecurityQuestions.Where(q => q.Id == 1).FirstOrDefault()?.Answer);
            profile.SecurityQuestions.Where(q => q.Id == 2).FirstOrDefault()?.Answer.ShouldBe(registrantProfile.SecurityQuestions.Where(q => q.Id == 2).FirstOrDefault()?.Answer);
            profile.SecurityQuestions.Where(q => q.Id == 3).FirstOrDefault()?.Answer.ShouldBe(registrantProfile.SecurityQuestions.Where(q => q.Id == 3).FirstOrDefault()?.Answer);
            profile.SecurityQuestions.Where(q => q.Id == 1).FirstOrDefault()?.Question.ShouldBe(registrantProfile.SecurityQuestions.Where(q => q.Id == 1).FirstOrDefault()?.Question);
            profile.SecurityQuestions.Where(q => q.Id == 2).FirstOrDefault()?.Question.ShouldBe(registrantProfile.SecurityQuestions.Where(q => q.Id == 2).FirstOrDefault()?.Question);
            profile.SecurityQuestions.Where(q => q.Id == 3).FirstOrDefault()?.Question.ShouldBe(registrantProfile.SecurityQuestions.Where(q => q.Id == 3).FirstOrDefault()?.Question);
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
            //registrantProfile.SecretPhrase.ShouldBe(profile.SecretPhrase);
            registrantProfile.SecurityQuestions.Where(q => q.Id == 1).FirstOrDefault()?.Answer.ShouldBe(profile.SecurityQuestions.Where(q => q.Id == 1).FirstOrDefault()?.Answer);
            registrantProfile.SecurityQuestions.Where(q => q.Id == 2).FirstOrDefault()?.Answer.ShouldBe(profile.SecurityQuestions.Where(q => q.Id == 2).FirstOrDefault()?.Answer);
            registrantProfile.SecurityQuestions.Where(q => q.Id == 3).FirstOrDefault()?.Answer.ShouldBe(profile.SecurityQuestions.Where(q => q.Id == 3).FirstOrDefault()?.Answer);
            registrantProfile.SecurityQuestions.Where(q => q.Id == 1).FirstOrDefault()?.Question.ShouldBe(profile.SecurityQuestions.Where(q => q.Id == 1).FirstOrDefault()?.Question);
            registrantProfile.SecurityQuestions.Where(q => q.Id == 2).FirstOrDefault()?.Question.ShouldBe(profile.SecurityQuestions.Where(q => q.Id == 2).FirstOrDefault()?.Question);
            registrantProfile.SecurityQuestions.Where(q => q.Id == 3).FirstOrDefault()?.Question.ShouldBe(profile.SecurityQuestions.Where(q => q.Id == 3).FirstOrDefault()?.Question);
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

        //[Fact]
        //public void CanMapBcscUserToProfile()
        //{
        //    var bcscUser = FakeGenerator.CreateUser("BC", "CAN");
        //    var profile = mapper.Map<Profile>(bcscUser);

        //    profile.Id.ShouldBe(bcscUser.Id);
        //    profile.ContactDetails.Email.ShouldBeNull();
        //    profile.PersonalDetails.FirstName.ShouldBe(bcscUser.PersonalDetails.FirstName);
        //    profile.PersonalDetails.LastName.ShouldBe(bcscUser.PersonalDetails.LastName);
        //    profile.PersonalDetails.Gender.ShouldBeNull();
        //    profile.PersonalDetails.DateOfBirth.ShouldBe(Regex.Replace(bcscUser.PersonalDetails.DateOfBirth,
        //        @"\b(?<year>\d{2,4})-(?<month>\d{1,2})-(?<day>\d{1,2})\b", "${month}/${day}/${year}", RegexOptions.None));
        //    profile.PrimaryAddress.AddressLine1.ShouldBe(bcscUser.PrimaryAddress.AddressLine1);
        //    profile.PrimaryAddress.PostalCode.ShouldBe(bcscUser.PrimaryAddress.PostalCode);
        //    profile.PrimaryAddress.Community.ShouldBe(bcscUser.PrimaryAddress.Community);
        //    profile.PrimaryAddress.StateProvince.ShouldNotBeNull().ShouldBe("BC");
        //    profile.PrimaryAddress.Country.ShouldNotBeNull().ShouldBe("CAN");
        //}
    }
}