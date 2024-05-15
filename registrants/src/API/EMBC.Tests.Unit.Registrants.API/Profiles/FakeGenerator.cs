using System;
using System.Collections.Generic;
using System.Globalization;
using Bogus;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Registrants.API.Controllers;

namespace EMBC.Tests.Unit.Registrants.API.Profiles;

public static class FakeGenerator
{
    public static RegistrantProfile CreateServerRegistrantProfile()
    {
        return new Faker<RegistrantProfile>("en_CA")
            .RuleFor(o => o.Id, f => Guid.NewGuid().ToString())
            .RuleFor(o => o.UserId, f => f.Random.String(10))
            .RuleFor(o => o.SecurityQuestions, f => FakeSecurityQuestions())
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

    private static IEnumerable<ESS.Shared.Contracts.Events.SecurityQuestion> FakeSecurityQuestions()
    {
        var ret = new List<ESS.Shared.Contracts.Events.SecurityQuestion>
        {
            FakeSecurityQuestion(1),
            FakeSecurityQuestion(2),
            FakeSecurityQuestion(3)
        };
        return ret;
    }

    private static ESS.Shared.Contracts.Events.SecurityQuestion FakeSecurityQuestion(int id)
    {
        return new Faker<ESS.Shared.Contracts.Events.SecurityQuestion>("en_CA")
            .RuleFor(o => o.Id, id)
            .RuleFor(o => o.Question, f => f.Random.Word())
            .RuleFor(o => o.Answer, f => f.Random.Word())
            .RuleFor(o => o.AnswerChanged, true)
            .Generate();
    }

    private static ESS.Shared.Contracts.Events.Address FakeAddress()
    {
        return new Faker<ESS.Shared.Contracts.Events.Address>("en_CA")
            .RuleFor(o => o.AddressLine1, f => f.Address.StreetAddress())
            .RuleFor(o => o.Community, f => f.Address.City())
            .RuleFor(o => o.Country, f => f.Address.CountryCode())
            .RuleFor(o => o.StateProvince, f => f.Address.State())
            .RuleFor(o => o.PostalCode, f => f.Address.ZipCode())
            .Generate();
    }

    public static Profile CreateClientRegistrantProfile()
    {
        return new Faker<Profile>("en_CA")
            .RuleFor(o => o.Id, f => f.Random.String(10))
            .RuleFor(o => o.SecurityQuestions, f => FakeClientEnteredSecurityQuestions())
            .RuleFor(o => o.RestrictedAccess, f => f.Random.Bool())

            .RuleFor(o => o.PersonalDetails, f => new Faker<PersonDetails>("en_CA")
                    .RuleFor(o => o.FirstName, f => f.Name.FirstName())
                    .RuleFor(o => o.LastName, f => f.Name.LastName())
                    .RuleFor(o => o.Initials, f => f.Name.Prefix())
                    .RuleFor(o => o.PreferredName, f => f.Name.Suffix())
                    .RuleFor(o => o.DateOfBirth, f => f.Date.Past(20).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture))
                    .RuleFor(o => o.Gender, f => f.PickRandom("Male", "Female", "X"))
                    .Generate())
            .RuleFor(o => o.ContactDetails, f => new Faker<ContactDetails>("en_CA")
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

    private static IEnumerable<EMBC.Registrants.API.Controllers.SecurityQuestion> FakeClientEnteredSecurityQuestions()
        =>
        [
            FakeClientEnteredSecurityQuestion(1),
            FakeClientEnteredSecurityQuestion(2),
            FakeClientEnteredSecurityQuestion(3)
        ];

    private static EMBC.Registrants.API.Controllers.SecurityQuestion FakeClientEnteredSecurityQuestion(int id)
    {
        return new Faker<EMBC.Registrants.API.Controllers.SecurityQuestion>("en_CA")
            .RuleFor(o => o.Id, id)
            .RuleFor(o => o.Question, f => f.Random.Word())
            .RuleFor(o => o.Answer, f => f.Random.Word())
            .RuleFor(o => o.AnswerChanged, true)
            .Generate();
    }

    private static EMBC.Registrants.API.Controllers.Address FakeClientEnteredAddress()
    {
        return new Faker<EMBC.Registrants.API.Controllers.Address>("en_CA")
            .RuleFor(o => o.AddressLine1, f => f.Address.StreetAddress())
            .RuleFor(o => o.Community, f => f.Address.City())
            .RuleFor(o => o.Country, f => f.Address.CountryCode())
            .RuleFor(o => o.StateProvince, f => f.Address.State())
            .RuleFor(o => o.PostalCode, f => f.Address.ZipCode())
            .Generate();
    }

    public static Profile CreateUser(string stateProvince, string country)
    {
        return new Faker<Profile>()
            .RuleFor(u => u.Id, f => f.Random.String(10))
            //.RuleFor(u => u.DisplayName, f => f.Name.FullName())
            .RuleFor(u => u.ContactDetails, f => new Faker<ContactDetails>()
                 .RuleFor(o => o.Email, f => f.Internet.Email())
            ).RuleFor(u => u.PersonalDetails, f => new Faker<PersonDetails>()
                  .RuleFor(u => u.Gender, f => f.PickRandom("Male", "Female", "X"))
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
}
