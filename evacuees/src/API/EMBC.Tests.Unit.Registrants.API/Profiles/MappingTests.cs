using System;
using System.Text.RegularExpressions;
using EMBC.Registrants.API.LocationModule;
using EMBC.Registrants.API.ProfilesModule;
using EMBC.Registrants.API.Shared;
using FakeItEasy;
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
            var locationManager = A.Fake<ILocationManager>();
            A.CallTo(() => locationManager.GetJurisdictions("CAN", "BC", null)).Returns(FakeGenerator.Jurisdictions);
            mapperConfig = new AutoMapper.MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(ProfileAutoMapperProfile));
                cfg.ConstructServicesUsing(t => t switch
                {
                    Type st when st == typeof(BcscCityConverter) => new BcscCityConverter(locationManager),
                    Type st => Activator.CreateInstance(st),
                    _ => null
                });
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
            profile.PrimaryAddress.Jurisdiction.ShouldNotBeNull().Code.ShouldBe(contact.era_City?.era_jurisdictionid.ToString());
            profile.PrimaryAddress.Jurisdiction.Name.ShouldBe(contact.era_City?.era_jurisdictionname ?? contact.address1_city);
            profile.PrimaryAddress.StateProvince.ShouldNotBeNull().Code.ShouldBe(contact.era_ProvinceState?.era_code.ToString());
            profile.PrimaryAddress.StateProvince.Name.ShouldBe(contact.era_ProvinceState?.era_name ?? contact.address1_stateorprovince);
            profile.PrimaryAddress.Country.ShouldNotBeNull().Code.ShouldBe(contact.era_Country?.era_countrycode.ToString());
            profile.PrimaryAddress.Country.Name.ShouldBe(contact.era_Country?.era_name ?? contact.address1_country);

            profile.MailingAddress.AddressLine1.ShouldBe(contact.address2_line1);
            profile.MailingAddress.AddressLine2.ShouldBe(contact.address2_line2);
            profile.MailingAddress.Jurisdiction.ShouldNotBeNull().Code.ShouldBe(contact.era_MailingCity?.era_jurisdictionid.ToString());
            profile.MailingAddress.Jurisdiction.Name.ShouldBe(contact.era_MailingCity?.era_jurisdictionname ?? contact.address2_city);
            profile.MailingAddress.StateProvince.ShouldNotBeNull().Code.ShouldBe(contact.era_MailingProvinceState?.era_code.ToString());
            profile.MailingAddress.StateProvince.Name.ShouldBe(contact.era_MailingProvinceState?.era_name ?? contact.address2_stateorprovince);
            profile.MailingAddress.Country.ShouldNotBeNull().Code.ShouldBe(contact.era_MailingCountry?.era_countrycode.ToString());
            profile.MailingAddress.Country.Name.ShouldBe(contact.era_MailingCountry?.era_name ?? contact.address2_country);

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
            contact.address1_city.ShouldBe(profile.PrimaryAddress.Jurisdiction.Name);
            contact.address1_stateorprovince.ShouldBe(profile.PrimaryAddress.StateProvince.Name);
            contact.address1_country.ShouldBe(profile.PrimaryAddress.Country.Name);
            contact.era_City.ShouldBeNull();
            contact.era_ProvinceState.ShouldBeNull();
            contact.era_Country.ShouldBeNull();

            contact.address2_line1.ShouldBe(profile.MailingAddress.AddressLine1);
            contact.address2_line2.ShouldBe(profile.MailingAddress.AddressLine2);
            contact.address2_city.ShouldBe(profile.MailingAddress.Jurisdiction.Name);
            contact.address2_stateorprovince.ShouldBe(profile.MailingAddress.StateProvince.Name);
            contact.address2_country.ShouldBe(profile.MailingAddress.Country.Name);
            contact.era_MailingCity.ShouldBeNull();
            contact.era_MailingProvinceState.ShouldBeNull();
            contact.era_MailingCountry.ShouldBeNull();

            contact.era_issamemailingaddress.ShouldBe(profile.IsMailingAddressSameAsPrimaryAddress);
        }

        [Fact]
        public void CanMapCountryFromEntity()
        {
            var entity = new era_country { era_countrycode = "CAN", era_name = "Canada" };
            var country = mapper.Map<Country>(entity);
            country.Code.ShouldBe(entity.era_countrycode);
            country.Name.ShouldBe(entity.era_name);
        }

        [Fact]
        public void CanMapCountryToEntity()
        {
            var country = new Country { Code = "CAN", Name = "Canada" };
            var entity = mapper.Map<era_country>(country);
            entity.era_countrycode.ShouldBe(country.Code);
            entity.era_name.ShouldBe(country.Name);
        }

        [Fact]
        public void CanMapBcscUserToProfile()
        {
            var bcscUser = FakeGenerator.CreateUser();
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
            profile.PrimaryAddress.Jurisdiction.Name.ShouldBe(bcscUser.City);
            profile.PrimaryAddress.StateProvince.ShouldNotBeNull().Code.ShouldBe("BC");
            profile.PrimaryAddress.Country.ShouldNotBeNull().Code.ShouldBe("CAN");
        }
    }
}
