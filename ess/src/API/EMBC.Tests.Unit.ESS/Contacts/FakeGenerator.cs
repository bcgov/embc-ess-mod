using System;
using System.Collections.Generic;
using System.Globalization;
using Bogus;
using EMBC.ESS.Resources.Evacuees;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.Tests.Unit.ESS.Contacts
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
                .RuleFor(o => o.createdon, f => f.Date.Past(2))
                .RuleFor(o => o.modifiedon, f => f.Date.Past(1))
                .RuleFor(o => o.era_bcservicescardid, f => f.Random.String(10))
                .RuleFor(o => o.era_restriction, f => f.Random.Bool())

                .RuleFor(o => o.birthdate, f => f.Date.Past(20))
                .RuleFor(o => o.firstname, f => f.Name.FirstName())
                .RuleFor(o => o.lastname, f => f.Name.LastName())
                .RuleFor(o => o.gendercode, f => f.Random.Number(0, 2))
                .RuleFor(o => o.era_initial, f => f.Name.Prefix())
                .RuleFor(o => o.era_preferredname, f => f.Name.Suffix())

                .RuleFor(o => o.address1_telephone1, f => f.Phone.PhoneNumber())
                .RuleFor(o => o.emailaddress1, f => f.Internet.Email())

                .RuleFor(o => o.address1_line1, f => f.Address.StreetAddress())
                .RuleFor(o => o.address1_city, f => f.Address.City())
                .RuleFor(o => o.address1_country, f => f.Address.CountryCode())
                .RuleFor(o => o.address1_stateorprovince, f => f.Address.State())
                //.RuleFor(o => o.era_City, f => null)
                //.RuleFor(o => o.era_ProvinceState, f => null)
                //.RuleFor(o => o.era_Country, f => null)

                .RuleFor(o => o.address2_line1, f => f.Address.StreetAddress())
                .RuleFor(o => o.address2_city, f => f.Address.City())
                .RuleFor(o => o.address2_country, f => f.Address.CountryCode())
                .RuleFor(o => o.address2_stateorprovince, f => f.Address.State())
                //.RuleFor(o => o.era_MailingCity, f => null)
                //.RuleFor(o => o.era_MailingProvinceState, f => null)
                //.RuleFor(o => o.era_MailingCountry, f => null)

                .RuleFor(o => o.era_issamemailingaddress, f => f.Random.Bool())

                .RuleFor(o => o.era_securityquestiontext1, f => f.Random.Words())
                .RuleFor(o => o.era_securityquestiontext2, f => f.Random.Words())
                .RuleFor(o => o.era_securityquestiontext3, f => f.Random.Words())
                .RuleFor(o => o.era_securityquestion1answer, f => f.Random.Word())
                .RuleFor(o => o.era_securityquestion2answer, f => f.Random.Word())
                .RuleFor(o => o.era_securityquestion3answer, f => f.Random.Word())
                .Generate();
        }

        public static Evacuee CreateRegistrantProfile()
        {
            return new Faker<Evacuee>()
                .RuleFor(o => o.Id, f => f.Random.Guid().ToString())
                .RuleFor(o => o.UserId, f => f.Random.String(10))
                .RuleFor(o => o.SecurityQuestions, f => FakeSecurityQuestions())
                .RuleFor(o => o.RestrictedAccess, f => f.Random.Bool())
                .RuleFor(o => o.FirstName, f => f.Name.FirstName())
                .RuleFor(o => o.LastName, f => f.Name.LastName())
                .RuleFor(o => o.Initials, f => f.Name.Prefix())
                .RuleFor(o => o.PreferredName, f => f.Name.Suffix())
                .RuleFor(o => o.DateOfBirth, f => f.Date.Past(20).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture))
                .RuleFor(o => o.Gender, f => f.PickRandom("Male", "Female", "X"))
                .RuleFor(o => o.Email, f => f.Internet.Email())
                .RuleFor(o => o.Phone, f => f.Phone.PhoneNumber())
                .RuleFor(o => o.PrimaryAddress, f => FakeAddress())
                .RuleFor(o => o.MailingAddress, f => FakeAddress())
                .Generate();
        }

        private static Address FakeAddress()
        {
            return new Faker<Address>()
                .RuleFor(o => o.AddressLine1, f => f.Address.StreetAddress())
                .RuleFor(o => o.City, f => f.Address.City())
                .RuleFor(o => o.Community, f => string.Empty)
                .RuleFor(o => o.Country, f => f.Address.CountryCode())
                .RuleFor(o => o.StateProvince, f => f.Address.State())
                .RuleFor(o => o.PostalCode, f => f.Address.ZipCode())
                .Generate();
        }

        private static IEnumerable<SecurityQuestion> FakeSecurityQuestions()
        {
            List<SecurityQuestion> ret = new List<SecurityQuestion>();
            ret.Add(FakeSecurityQuestion(1));
            ret.Add(FakeSecurityQuestion(2));
            ret.Add(FakeSecurityQuestion(3));
            return ret;
        }

        private static SecurityQuestion FakeSecurityQuestion(int id)
        {
            return new Faker<SecurityQuestion>()
                .RuleFor(o => o.Id, id)
                .RuleFor(o => o.Question, f => f.Random.Word())
                .RuleFor(o => o.Answer, f => f.Random.Word())
                .RuleFor(o => o.AnswerIsMasked, false)
                .Generate();
        }

        public static string GenderResolver(int? genderCode) => new GenderConverter().Convert(genderCode, null);

        public static int? GenderResolver(string gender) => new GenderConverter().Convert(gender, null);
    }
}
