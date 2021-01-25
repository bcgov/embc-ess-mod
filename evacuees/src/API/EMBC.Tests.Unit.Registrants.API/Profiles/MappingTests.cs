using System;
using Bogus;
using EMBC.Registrants.API.ProfilesModule;
using EMBC.Registrants.API.Shared;
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
            mapperConfig = new AutoMapper.MapperConfiguration(cfg => cfg.AddMaps(typeof(EMBC.Registrants.API.ProfilesModule.ProfileAutoMapperProfile)));
        }

        [Fact]
        public void ValidateAutoMapperMappings()
        {
            mapperConfig.AssertConfigurationIsValid();
        }

        [Fact]
        public void CanMapProfileFromDynamicsEntities()
        {
            var contact = CreateDynamicsContact();
            var profile = mapper.Map<Profile>(contact);

            profile.ShouldNotBeNull();

            profile.EraId.ShouldBe(contact.contactid?.ToString());
            profile.BceId.ShouldBe(contact.era_bcservicescardid);

            profile.PersonalDetails.DateOfBirth.ShouldBe($"{contact.birthdate.Value.Year:D4}-{contact.birthdate.Value.Month:D2}-{contact.birthdate.Value.Day:D2}");
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
        }

        [Fact]
        public void CanMapDynamicsEntitiesFromProfile()
        {
            var profile = CreateRegistrantProfile();
            var contact = mapper.Map<contact>(profile);

            contact.ShouldNotBeNull();

            contact.contactid.ShouldNotBeNull().ToString().ShouldBe(profile.EraId);
            contact.era_bcservicescardid.ShouldBe(profile.BceId);

            contact.firstname.ShouldBe(profile.PersonalDetails.FirstName);
            contact.lastname.ShouldBe(profile.PersonalDetails.LastName);
            contact.era_initial.ShouldBe(profile.PersonalDetails.Initials);
            contact.era_preferredname.ShouldBe(profile.PersonalDetails.PreferredName);
            contact.birthdate.ShouldNotBeNull().ToString().ShouldBe(profile.PersonalDetails.DateOfBirth);
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

        private contact CreateDynamicsContact()
        {
            return new Faker<contact>()
                .RuleFor(o => o.contactid, f => Guid.NewGuid())
                .RuleFor(o => o.era_bcservicescardid, f => f.Random.String(10))
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
                .Generate();
        }

        private Profile CreateRegistrantProfile()
        {
            return new Faker<Profile>()
                .RuleFor(o => o.EraId, f => Guid.NewGuid().ToString())
                .RuleFor(o => o.BceId, f => f.Random.String(10))
                .RuleFor(o => o.PersonalDetails, f => new Faker<PersonDetails>()
                        .RuleFor(o => o.FirstName, f => f.Name.FirstName())
                        .RuleFor(o => o.LastName, f => f.Name.LastName())
                        .RuleFor(o => o.Initials, f => f.Name.Prefix())
                        .RuleFor(o => o.PreferredName, f => f.Name.Suffix())
                        .RuleFor(o => o.DateOfBirth, f => f.Date.Past(20).ToString("yyyy-MM-dd"))
                        .RuleFor(o => o.Gender, f => f.PickRandom("Male", "Female", "X"))
                        .Generate())
                    .RuleFor(o => o.ContactDetails, f => new Faker<ContactDetails>()
                        .RuleFor(o => o.Email, f => f.Internet.Email())
                        .RuleFor(o => o.HideEmailRequired, f => f.Random.Bool())
                        .RuleFor(o => o.Phone, f => f.Phone.PhoneNumber())
                        .RuleFor(o => o.HidePhoneRequired, f => f.Random.Bool())
                        .Generate())
                    .RuleFor(o => o.PrimaryAddress, f => new Faker<Address>()
                        .RuleFor(o => o.AddressLine1, f => f.Address.StreetAddress())
                        .RuleFor(o => o.AddressLine2, f => f.Address.SecondaryAddress())
                        .RuleFor(o => o.Jurisdiction, f => new Jurisdiction { Code = f.Random.Guid().ToString(), Name = f.Address.City() })
                        .RuleFor(o => o.StateProvince, f => new StateProvince { Code = f.Address.StateAbbr(), Name = f.Address.State() })
                        .RuleFor(o => o.Country, f => new Country { Code = f.Address.CountryCode(), Name = f.Address.Country() })
                        .Generate())
                    .RuleFor(o => o.MailingAddress, f => new Faker<Address>()
                        .RuleFor(o => o.AddressLine1, f => f.Address.StreetAddress())
                        .RuleFor(o => o.AddressLine2, f => f.Address.SecondaryAddress())
                        .RuleFor(o => o.Jurisdiction, f => new Jurisdiction { Code = f.Random.Guid().ToString(), Name = f.Address.City() })
                        .RuleFor(o => o.StateProvince, f => new StateProvince { Code = f.Address.StateAbbr(), Name = f.Address.State() })
                        .RuleFor(o => o.Country, f => new Country { Code = f.Address.CountryCode(), Name = f.Address.Country() })
                        .Generate())
                .Generate();
        }
    }
}
