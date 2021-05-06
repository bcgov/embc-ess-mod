using System;
using System.Globalization;
using Bogus;
using EMBC.ESS.Shared.Contracts.Submissions;
using EMBC.Registrants.API.Controllers;
using EMBC.Registrants.API.SecurityModule;

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

        public static RegistrantProfile CreateServerRegistrantProfile()
        {
            return new Faker<RegistrantProfile>()
                .RuleFor(o => o.Id, f => Guid.NewGuid().ToString())
                .RuleFor(o => o.UserId, f => f.Random.String(10))
                .RuleFor(o => o.SecretPhrase, f => f.Internet.Password())
                .RuleFor(o => o.RestrictedAccess, f => f.Random.Bool())

                .RuleFor(o => o.DateOfBirth, f => f.Date.Past(20).ToString("MM-dd-yyyy"))
                .RuleFor(o => o.FirstName, f => f.Name.FirstName())
                .RuleFor(o => o.LastName, f => f.Name.LastName())
                .RuleFor(o => o.Gender, f => f.PickRandom("Male", "Female", "X"))
                .RuleFor(o => o.Initials, f => f.Name.Prefix())
                .RuleFor(o => o.PreferredName, f => f.Name.Suffix())

                .RuleFor(o => o.Phone, f => f.Phone.PhoneNumber())
                .RuleFor(o => o.Email, f => f.Internet.Email())

                .RuleFor(o => o.PrimaryAddress, f => FakeAddress())
                .RuleFor(o => o.MailingAddress, f => FakeAddress())

                .Generate();
        }

        private static ESS.Shared.Contracts.Submissions.Address FakeAddress()
        {
            return new Faker<ESS.Shared.Contracts.Submissions.Address>()
                .RuleFor(o => o.AddressLine1, f => f.Address.StreetAddress())
                .RuleFor(o => o.Community, f => f.Address.City())
                .RuleFor(o => o.Country, f => f.Address.CountryCode())
                .RuleFor(o => o.StateProvince, f => f.Address.State())
                .RuleFor(o => o.PostalCode, f => f.Address.ZipCode())
                .Generate();
        }

        public static Profile CreateClientRegistrantProfile()
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

                .RuleFor(o => o.PrimaryAddress, f => FakeClientEnteredAddress())
                .RuleFor(o => o.MailingAddress, f => FakeClientEnteredAddress())
                .RuleFor(o => o.IsMailingAddressSameAsPrimaryAddress, f => f.Random.Bool())

                .Generate();
        }

        private static EMBC.Registrants.API.Controllers.Address FakeClientEnteredAddress()
        {
            return new Faker<EMBC.Registrants.API.Controllers.Address>()
                .RuleFor(o => o.AddressLine1, f => f.Address.StreetAddress())
                .RuleFor(o => o.Community, f => f.Address.City())
                .RuleFor(o => o.Country, f => f.Address.CountryCode())
                .RuleFor(o => o.StateProvince, f => f.Address.State())
                .RuleFor(o => o.PostalCode, f => f.Address.ZipCode())
                .Generate();
        }

        public static User CreateUser(string stateProvince, string country)
        {
            return new Faker<User>()
                .RuleFor(u => u.Id, f => f.Random.String(10))
                .RuleFor(u => u.DisplayName, f => f.Name.FullName())
                .RuleFor(u => u.ContactDetails, f => new Faker<ContactDetails>()
                     .RuleFor(o => o.Email, f => f.Internet.Email())
                ).RuleFor(u => u.PersonalDetails, f => new Faker<PersonDetails>()
                      .RuleFor(u => u.Gender, f => f.PickRandom(new[] { "Male", "Female", "X" }))
                      .RuleFor(u => u.FirstName, f => f.Name.FirstName())
                      .RuleFor(u => u.LastName, f => f.Name.LastName())
                      .RuleFor(u => u.DateOfBirth, f => f.Date.Past(20).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture))
                ).RuleFor(u => u.PrimaryAddress, f => new Faker<EMBC.Registrants.API.Controllers.Address>()
                      .RuleFor(u => u.AddressLine1, f => f.Address.StreetAddress())
                      .RuleFor(u => u.PostalCode, f => f.Address.ZipCode())
                      .RuleFor(u => u.StateProvince, f => stateProvince)
                      .RuleFor(u => u.Country, f => country)
                )
                .Generate();
        }

        //public static string GenderResolver(int? genderCode) =>
        //    genderCode switch
        //    {
        //        0 => "Male",
        //        1 => "Female",
        //        2 => "X",
        //        _ => null
        //    };

        //public static int? GenderResolver(string gender) =>
        //    gender switch
        //    {
        //        "Male" => 0,
        //        "Female" => 1,
        //        "X" => 2,
        //        _ => null
        //    };
    }
}
