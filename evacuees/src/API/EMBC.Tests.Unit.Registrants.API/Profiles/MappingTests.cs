using System.Text.RegularExpressions;
using EMBC.Registrants.API.Controllers;
using EMBC.Registrants.API.ProfilesModule;
using Microsoft.Dynamics.CRM;
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
                cfg.AddMaps(typeof(ProfileAutoMapperProfile));
            });
        }

        [Fact]
        public void ValidateAutoMapperMappings()
        {
            mapperConfig.AssertConfigurationIsValid();
        }

        [Fact]
        public void CanMapProfileFromDynamicsEntities()
        {
            var contact = FakeGenerator.CreateDynamicsContact();
            var profile = mapper.Map<Profile>(contact);

            profile.ShouldNotBeNull();

            profile.Id.ShouldBe(contact.era_bcservicescardid);
            profile.SecretPhrase.ShouldBe(contact.era_secrettext);
            profile.RestrictedAccess.ShouldBe(contact.era_restriction.Value);

            profile.PersonalDetails.DateOfBirth.ShouldBe(Regex.Replace(contact.birthdate.ToString(),
                @"\b(?<year>\d{2,4})-(?<month>\d{1,2})-(?<day>\d{1,2})\b", "${month}/${day}/${year}", RegexOptions.None));
            profile.PersonalDetails.FirstName.ShouldBe(contact.firstname);
            profile.PersonalDetails.LastName.ShouldBe(contact.lastname);
            profile.PersonalDetails.Initials.ShouldBe(contact.era_initial);
            profile.PersonalDetails.PreferredName.ShouldBe(contact.era_preferredname);
            profile.PersonalDetails.Gender.ShouldBe(new GenderConverter().Convert(contact.gendercode, null));

            profile.ContactDetails.Email.ShouldBe(contact.emailaddress1);
            profile.ContactDetails.HideEmailRequired.ShouldBe(string.IsNullOrEmpty(contact.emailaddress1));
            profile.ContactDetails.Phone.ShouldBe(contact.telephone1);
            profile.ContactDetails.HidePhoneRequired.ShouldBe(string.IsNullOrEmpty(contact.telephone1));

            profile.PrimaryAddress.AddressLine1.ShouldBe(contact.address1_line1);
            profile.PrimaryAddress.AddressLine2.ShouldBe(contact.address1_line2);
            profile.PrimaryAddress.Jurisdiction.ShouldNotBeNull().ShouldBe(contact.era_City?.era_jurisdictionid.ToString() ?? contact.address1_city);
            profile.PrimaryAddress.StateProvince.ShouldNotBeNull().ShouldBe(contact.era_ProvinceState?.era_code.ToString() ?? contact.address1_stateorprovince);
            profile.PrimaryAddress.Country.ShouldNotBeNull().ShouldBe(contact.era_Country?.era_countrycode.ToString() ?? contact.address1_country);

            profile.MailingAddress.AddressLine1.ShouldBe(contact.address2_line1);
            profile.MailingAddress.AddressLine2.ShouldBe(contact.address2_line2);
            profile.MailingAddress.Jurisdiction.ShouldNotBeNull().ShouldBe(contact.era_MailingCity?.era_jurisdictionid.ToString() ?? contact.address2_city);
            profile.MailingAddress.StateProvince.ShouldNotBeNull().ShouldBe(contact.era_MailingProvinceState?.era_code.ToString() ?? contact.address2_stateorprovince);
            profile.MailingAddress.Country.ShouldNotBeNull().ShouldBe(contact.era_MailingCountry?.era_countrycode.ToString() ?? contact.address2_country);

            profile.IsMailingAddressSameAsPrimaryAddress.ShouldBe(contact.era_issamemailingaddress.Value);
        }

        [Fact]
        public void CanMapDynamicsEntitiesFromProfile()
        {
            var profile = FakeGenerator.CreateRegistrantProfile();
            var contact = mapper.Map<contact>(profile);

            contact.ShouldNotBeNull();

            contact.era_bcservicescardid.ShouldBe(profile.Id);
            contact.era_secrettext.ShouldBe(profile.SecretPhrase);
            contact.era_restriction.ShouldBe(profile.RestrictedAccess);

            contact.firstname.ShouldBe(profile.PersonalDetails.FirstName);
            contact.lastname.ShouldBe(profile.PersonalDetails.LastName);
            contact.era_initial.ShouldBe(profile.PersonalDetails.Initials);
            contact.era_preferredname.ShouldBe(profile.PersonalDetails.PreferredName);

            contact.birthdate.ShouldNotBeNull().ToString().ShouldBe(Regex.Replace(profile.PersonalDetails.DateOfBirth,
                @"\b(?<month>\d{1,2})/(?<day>\d{1,2})/(?<year>\d{2,4})\b", "${year}-${month}-${day}", RegexOptions.None));
            contact.gendercode.ShouldBe(new GenderConverter().Convert(profile.PersonalDetails.Gender, null));

            contact.emailaddress1.ShouldBe(profile.ContactDetails.Email);
            contact.era_emailrefusal.ShouldBe(string.IsNullOrEmpty(profile.ContactDetails.Email));
            contact.telephone1.ShouldBe(profile.ContactDetails.Phone);
            contact.era_phonenumberrefusal.ShouldBe(string.IsNullOrEmpty(profile.ContactDetails.Phone));

            contact.address1_line1.ShouldBe(profile.PrimaryAddress.AddressLine1);
            contact.address1_line2.ShouldBe(profile.PrimaryAddress.AddressLine2);
            contact.address1_city.ShouldBe(profile.PrimaryAddress.Jurisdiction);
            contact.address1_stateorprovince.ShouldBe(profile.PrimaryAddress.StateProvince);
            contact.address1_country.ShouldBe(profile.PrimaryAddress.Country);
            contact.era_City.ShouldBeNull();
            contact.era_ProvinceState.ShouldBeNull();
            contact.era_Country.ShouldBeNull();

            contact.address2_line1.ShouldBe(profile.MailingAddress.AddressLine1);
            contact.address2_line2.ShouldBe(profile.MailingAddress.AddressLine2);
            contact.address2_city.ShouldBe(profile.MailingAddress.Jurisdiction);
            contact.address2_stateorprovince.ShouldBe(profile.MailingAddress.StateProvince);
            contact.address2_country.ShouldBe(profile.MailingAddress.Country);
            contact.era_MailingCity.ShouldBeNull();
            contact.era_MailingProvinceState.ShouldBeNull();
            contact.era_MailingCountry.ShouldBeNull();

            contact.era_issamemailingaddress.ShouldBe(profile.PrimaryAddress.AddressLine1 == profile.MailingAddress.AddressLine1);
        }

        [Fact]
        public void CanMapBcscUserToProfile()
        {
            var bcscUser = FakeGenerator.CreateUser("BC", "CAN");
            var profile = mapper.Map<Profile>(bcscUser);

            profile.Id.ShouldBe(bcscUser.Id);
            profile.ContactDetails.Email.ShouldBeNull();
            profile.PersonalDetails.FirstName.ShouldBe(bcscUser.FirstName);
            profile.PersonalDetails.LastName.ShouldBe(bcscUser.LastName);
            profile.PersonalDetails.Gender.ShouldBeNull();
            profile.PersonalDetails.DateOfBirth.ShouldBe(Regex.Replace(bcscUser.BirthDate,
             @"\b(?<year>\d{2,4})-(?<month>\d{1,2})-(?<day>\d{1,2})\b", "${month}/${day}/${year}", RegexOptions.None));
            profile.PrimaryAddress.AddressLine1.ShouldBe(bcscUser.StreetAddress);
            profile.PrimaryAddress.PostalCode.ShouldBe(bcscUser.PostalCode);
            profile.PrimaryAddress.Jurisdiction.ShouldBe(bcscUser.City);
            profile.PrimaryAddress.StateProvince.ShouldNotBeNull().ShouldBe("BC");
            profile.PrimaryAddress.Country.ShouldNotBeNull().ShouldBe("CAN");
        }
    }
}
