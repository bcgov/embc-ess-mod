using System;
using System.Globalization;
using Bogus;
using EMBC.Registrants.API.Controllers;
using EMBC.Registrants.API.SecurityModule;
using Microsoft.Dynamics.CRM;

namespace EMBC.Tests.Unit.Registrants.API.Profiles
{
    public class FakeGenerator
    {
        //public static (string Code, string Name)[] Jurisdictions = new[]
        //{
        //    (Code:"j1", Name:"JUR1"),
        //    (Code:"j2", Name:"JUR2"),
        //    (Code:"j3", Name:"JUR3"),
        //    (Code:"j4", Name:"JUR4"),
        //    (Code:"j5", Name:"JUR5"),
        //    (Code:"j6", Name:"JUR6"),
        //    (Code:"j7", Name:"JUR7"),
        //    (Code:"j8", Name:"JUR8"),
        //};

        public static contact CreateDynamicsContact()
        {
            return new Faker<contact>()
                .RuleFor(o => o.contactid, f => Guid.NewGuid())
                .RuleFor(o => o.era_bcservicescardid, f => f.Random.String(10))
                .RuleFor(o => o.era_secrettext, f => f.Internet.Password())
                .RuleFor(o => o.era_restriction, f => f.Random.Bool())

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

                .RuleFor(o => o.era_issamemailingaddress, f => f.Random.Bool())
                .Generate();
        }

        public static Profile CreateRegistrantProfile()
        {
            return new Faker<Profile>()
                .RuleFor(o => o.Id, f => f.Random.String(10))
                .RuleFor(o => o.SecretPhrase, f => f.Internet.Password())
                .RuleFor(o => o.RestrictedAccess, f => f.Random.Bool())

                .RuleFor(o => o.PersonalDetails, f => new Faker<PersonDetails>()
                        .RuleFor(o => o.FirstName, f => f.Name.FirstName())
                        .RuleFor(o => o.LastName, f => f.Name.LastName())
                        .RuleFor(o => o.Initials, f => f.Name.Prefix())
                        .RuleFor(o => o.PreferredName, f => f.Name.Suffix())
                        .RuleFor(o => o.DateOfBirth, f => f.Date.Past(20).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture))
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
                    .RuleFor(o => o.Jurisdiction, f => f.Address.CityPrefix())
                    .RuleFor(o => o.StateProvince, f => f.Address.StateAbbr())
                    .RuleFor(o => o.Country, f => f.Address.CountryCode())
                    .RuleFor(o => o.PostalCode, f => f.Address.ZipCode())
                    .Generate())
                .RuleFor(o => o.MailingAddress, f => new Faker<Address>()
                    .RuleFor(o => o.AddressLine1, f => f.Address.StreetAddress())
                    .RuleFor(o => o.AddressLine2, f => f.Address.SecondaryAddress())
                    .RuleFor(o => o.Jurisdiction, f => f.Address.CityPrefix())
                    .RuleFor(o => o.StateProvince, f => f.Address.StateAbbr())
                    .RuleFor(o => o.Country, f => f.Address.CountryCode())
                    .RuleFor(o => o.PostalCode, f => f.Address.ZipCode())
                    .Generate())

                .RuleFor(o => o.IsMailingAddressSameAsPrimaryAddress, f => f.Random.Bool())

                .Generate();
        }

        public static User CreateUser(string stateProvince, string country)
        {
            return new Faker<User>()
                .RuleFor(u => u.Id, f => f.Random.String(10))
                .RuleFor(u => u.DisplayName, f => f.Name.FullName())
                .RuleFor(u => u.Email, f => f.Internet.Email())
                .RuleFor(u => u.Gender, f => f.PickRandom(new[] { "Male", "Female", "X" }))
                .RuleFor(u => u.FirstName, f => f.Name.FirstName())
                .RuleFor(u => u.LastName, f => f.Name.LastName())
                .RuleFor(u => u.BirthDate, f => f.Date.Past(20).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture))
                .RuleFor(u => u.StreetAddress, f => f.Address.StreetAddress())
                .RuleFor(u => u.PostalCode, f => f.Address.ZipCode())
                .RuleFor(u => u.StateProvince, f => stateProvince)
                .RuleFor(u => u.Country, f => country)
                .Generate();
        }
    }
}
