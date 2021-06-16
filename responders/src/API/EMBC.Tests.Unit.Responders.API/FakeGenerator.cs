using System.Collections.Generic;
using System.Globalization;
using Bogus;
using EMBC.Responders.API.Controllers;

namespace EMBC.Tests.Unit.Responders.API
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

        public static RegistrantProfile CreateRegistrantProfile()
        {
            return new Faker<RegistrantProfile>()
                .RuleFor(o => o.Id, f => f.Random.String(10))
                .RuleFor(o => o.Restriction, f => f.Random.Bool())

                .RuleFor(o => o.PersonalDetails, f => FakePersonDetails())
                .RuleFor(o => o.ContactDetails, f => FakeContactDetails())

                .RuleFor(o => o.PrimaryAddress, f => FakeAddress())
                .RuleFor(o => o.MailingAddress, f => FakeAddress())
                .RuleFor(o => o.IsMailingAddressSameAsPrimaryAddress, f => f.Random.Bool())
                .RuleFor(o => o.SecurityQuestions, f => FakeSecurityQuestions())
                .RuleFor(o => o.VerifiedUser, f => f.Random.Bool())
                .Generate();
        }

        private static ContactDetails FakeContactDetails()
        {
            return new Faker<ContactDetails>()
                .RuleFor(o => o.Email, f => f.Internet.Email())
                .RuleFor(o => o.HideEmailRequired, f => f.Random.Bool())
                .RuleFor(o => o.Phone, f => f.Phone.PhoneNumber())
                .RuleFor(o => o.HidePhoneRequired, f => f.Random.Bool())
                .Generate();
        }

        private static PersonDetails FakePersonDetails()
        {
            return new Faker<PersonDetails>()
                .RuleFor(o => o.FirstName, f => f.Name.FirstName())
                .RuleFor(o => o.LastName, f => f.Name.LastName())
                .RuleFor(o => o.Initials, f => f.Name.Prefix())
                .RuleFor(o => o.PreferredName, f => f.Name.Suffix())
                .RuleFor(o => o.DateOfBirth, f => f.Date.Past(20).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture))
                .RuleFor(o => o.Gender, f => f.PickRandom("Male", "Female", "X"))
                .Generate();
        }

        private static Address FakeAddress()
        {
            return new Faker<Address>()
                .RuleFor(o => o.AddressLine1, f => f.Address.StreetAddress())
                .RuleFor(o => o.CommunityCode, f => f.Address.City())
                .RuleFor(o => o.CountryCode, f => f.Address.CountryCode())
                .RuleFor(o => o.StateProvinceCode, f => f.Address.State())
                .RuleFor(o => o.PostalCode, f => f.Address.ZipCode())
                .Generate();
        }

        private static SecurityQuestion[] FakeSecurityQuestions()
        {
            List<SecurityQuestion> ret = new List<SecurityQuestion>();
            ret.Add(FakeSecurityQuestion(1));
            ret.Add(FakeSecurityQuestion(2));
            ret.Add(FakeSecurityQuestion(3));
            return ret.ToArray();
        }

        private static SecurityQuestion FakeSecurityQuestion(int id)
        {
            return new Faker<SecurityQuestion>()
                .RuleFor(o => o.Id, id)
                .RuleFor(o => o.Question, f => f.Random.Word())
                .RuleFor(o => o.Answer, f => f.Random.Word())
                .RuleFor(o => o.AnswerChanged, false)
                .Generate();
        }
    }
}
