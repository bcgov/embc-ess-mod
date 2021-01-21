using Bogus;
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
            mapperConfig = new AutoMapper.MapperConfiguration(cfg => cfg.AddMaps(typeof(EMBC.Registrants.API.ProfilesModule.ProfileMap)));
        }

        [Fact]
        public void ValidateAutoMapperMappings()
        {
            mapperConfig.AssertConfigurationIsValid();
        }

        [Fact]
        public void CanMapProfileFromDynamicsEntities()
        {
            var contact = CreateFakeContract().Generate();
            var profile = mapper.Map<Profile>(contact);

            profile.ShouldNotBeNull();

            profile.PersonalDetails.DateOfBirth.ShouldBe($"{contact.birthdate.Value.Year:D4}-{contact.birthdate.Value.Month:D2}-{contact.birthdate.Value.Day:D2}");
            profile.PersonalDetails.FirstName.ShouldBe(contact.firstname);
            profile.PersonalDetails.LastName.ShouldBe(contact.lastname);
            profile.PersonalDetails.Initials.ShouldBe(contact.era_initial);
            profile.PersonalDetails.PreferredName.ShouldBe(contact.era_preferredname);
            profile.PersonalDetails.Gender.ShouldBe(new GenderConverter().Convert(contact.gendercode, null));

            profile.ContactDetails.Email.ShouldBe(contact.emailaddress1);
            profile.ContactDetails.HideEmailRequired.ShouldBe(contact.era_emailrefusal.Value);
            profile.ContactDetails.Phone.ShouldBe(contact.telephone1);
            profile.ContactDetails.HidePhoneRequired.ShouldBe(contact.era_phonenumberrefusal.Value);

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
        }

        private Faker<contact> CreateFakeContract()
        {
            return new Faker<contact>()
                .RuleFor(o => o.birthdate, f => f.Date.Past(20))
                .RuleFor(o => o.firstname, f => f.Name.FirstName())
                .RuleFor(o => o.lastname, f => f.Name.LastName())
                .RuleFor(o => o.gendercode, f => f.Random.Number(1, 4))
                .RuleFor(o => o.era_initial, f => f.Name.Prefix())
                .RuleFor(o => o.era_preferredname, f => f.Name.Suffix())

                .RuleFor(o => o.telephone1, f => f.Phone.PhoneNumber())
                .RuleFor(o => o.era_phonenumberrefusal, f => f.Random.Bool())
                .RuleFor(o => o.emailaddress1, f => f.Internet.Email())
                .RuleFor(o => o.era_emailrefusal, f => f.Random.Bool())

                .RuleFor(o => o.address1_line1, f => f.Address.StreetAddress())
                .RuleFor(o => o.address1_city, f => f.Address.City())
                .RuleFor(o => o.address1_country, f => f.Address.CountryCode())
                .RuleFor(o => o.address1_stateorprovince, f => f.Address.State())
                .RuleFor(o => o.era_City, f => null)
                .RuleFor(o => o.era_ProvinceState, f => null)
                .RuleFor(o => o.era_Country, f => null)

                .RuleFor(o => o.address2_line1, f => f.Address.StreetAddress())
                .RuleFor(o => o.address2_city, f => f.Address.City())
                .RuleFor(o => o.address2_country, f => f.Address.CountryCode())
                .RuleFor(o => o.address2_stateorprovince, f => f.Address.State())
                .RuleFor(o => o.era_MailingCity, f => null)
                .RuleFor(o => o.era_MailingProvinceState, f => null)
                .RuleFor(o => o.era_MailingCountry, f => null)
                ;
        }
    }
}
