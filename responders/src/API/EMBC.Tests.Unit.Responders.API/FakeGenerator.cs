using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Bogus;
using EMBC.ESS.Shared.Contracts.Events;

namespace EMBC.Tests.Unit.Responders.API
{
    public static class FakeGenerator
    {
        public static RegistrantProfile CreateRegistrantProfile(bool makeRestricted = false)
        {
            var registrant = new Faker<RegistrantProfile>()
                .RuleFor(o => o.Id, f => f.Random.String(10))
                .RuleFor(o => o.RestrictedAccess, false)

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
                .RuleFor(o => o.SecurityQuestions, f => FakeSecurityQuestions())
                .RuleFor(o => o.VerifiedUser, f => f.Random.Bool())
                .Generate();

            if (makeRestricted)
            {
                registrant.RestrictedAccess = true;
            }

            return registrant;
        }

        private static Address FakeAddress()
        {
            return new Faker<Address>()
                .RuleFor(o => o.AddressLine1, f => f.Address.StreetAddress())
                .RuleFor(o => o.Community, f => f.Address.City())
                .RuleFor(o => o.Country, f => f.Address.CountryCode())
                .RuleFor(o => o.StateProvince, f => f.Address.State())
                .RuleFor(o => o.PostalCode, f => f.Address.ZipCode())
                .Generate();
        }

        private static SecurityQuestion[] FakeSecurityQuestions()
        {
            var ret = new List<SecurityQuestion>();
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

        public static EvacuationFile CreateEvacuationFile(bool makeRestricted = false)
        {
            var fakedFile = new Faker<EvacuationFile>()
                .RuleFor(o => o.NeedsAssessment, f => CreateNeedsAssessment())
                .RuleFor(o => o.RelatedTask, f => new IncidentTask { Id = f.Random.Int(1000, 9999).ToString() })
                ;

            var file = fakedFile.Generate();
            file.HouseholdMembers = file.NeedsAssessment.HouseholdMembers;

            if (makeRestricted)
            {
                file.RestrictedAccess = true;
                if (file.HouseholdMembers.Any())
                {
                    var restrictedMemberKey = Randomizer.Seed.Next(0, file.HouseholdMembers.Count() - 1);
                    //file.HouseholdMembers.ElementAt(restrictedMemberKey).HasRestriction = true;
                }
            }

            return file;
        }

        private static NeedsAssessment CreateNeedsAssessment()
        {
            return new Faker<NeedsAssessment>()
                .RuleFor(o => o.HouseholdMembers, f => f.Make(f.Random.Int(1, 10), CreateHouseholdMember))
                .RuleFor(o => o.Pets, f => f.Make(f.Random.Int(0, 5), CreatePet))
                .RuleFor(o => o.CanProvideClothing, f => f.Random.NullableBool())
                .RuleFor(o => o.CanProvideFood, f => f.Random.NullableBool())
                .RuleFor(o => o.CanProvideIncidentals, f => f.Random.NullableBool())
                .RuleFor(o => o.CanProvideLodging, f => f.Random.NullableBool())
                .RuleFor(o => o.CanProvideTransportation, f => f.Random.NullableBool())
                .RuleFor(o => o.HaveMedicalSupplies, f => f.Random.NullableBool())
                .RuleFor(o => o.HavePetsFood, f => f.Random.NullableBool())
                .RuleFor(o => o.HaveSpecialDiet, f => f.Random.Bool())
                .RuleFor(o => o.Insurance, f => f.Random.Enum<InsuranceOption>())
                .RuleFor(o => o.RecommendedReferralServices, f => f.Random.EnumValues<ReferralServices>())
                .RuleFor(o => o.SpecialDietDetails, f => f.Lorem.Paragraph(50))
                .RuleFor(o => o.TakeMedication, f => f.Random.Bool())
                .RuleFor(o => o.Type, f => f.Random.Enum<NeedsAssessmentType>())
                .RuleFor(o => o.Notes, f => f.Make(f.Random.Int(0, 20), CreateNote))
                ;
        }

        private static HouseholdMember CreateHouseholdMember()
        {
            return new Faker<HouseholdMember>()
                .RuleFor(o => o.DateOfBirth, f => f.Person.DateOfBirth.ToShortDateString())
                .RuleFor(o => o.FirstName, f => f.Name.FirstName())
                .RuleFor(o => o.FirstName, f => f.Name.LastName())
                .RuleFor(o => o.Gender, f => f.Random.ArrayElement(new[] { "Male", "Female", "X" }))
                ;
        }

        private static Pet CreatePet()
        {
            return new Faker<Pet>()
                .RuleFor(o => o.Type, f => f.Random.ArrayElement(new[] { "Dog", "Cat", "Horse", "Goldfish" }))
                .RuleFor(o => o.Quantity, f => f.Random.Int(1, 20).ToString())
                ;
        }

        private static Note CreateNote()
        {
            return new Faker<Note>()
                .RuleFor(o => o.Content, f => f.Lorem.Paragraph(100))
                .RuleFor(o => o.Type, f => f.Random.Enum<NoteType>())
                ;
        }

        public static IEnumerable<EvacuationFile> CreateEvacuationFiles(int numberOfFiles = 10, bool withAtLeastOneRestrictedAccess = false)
        {
            if (numberOfFiles == 0) yield break;
            var seed = Randomizer.Seed.Next(numberOfFiles - 1);
            for (int i = 0; i < numberOfFiles; i++)
            {
                yield return CreateEvacuationFile(withAtLeastOneRestrictedAccess && i == seed);
            }
        }

        public static IEnumerable<(RegistrantProfile profile, IEnumerable<EvacuationFile> files)> CreateRegistrantProfilesWithFiles(int numberOfregistrants = 1, bool withAtLeastOneRestrictedAccess = false)
        {
            var seed = Randomizer.Seed.Next(numberOfregistrants - 1);
            for (int i = 0; i < numberOfregistrants; i++)
            {
                var profile = CreateRegistrantProfile(makeRestricted: withAtLeastOneRestrictedAccess && i == seed);
                var filesSeed = Randomizer.Seed.Next(0, 3);
                var files = CreateEvacuationFiles(filesSeed, withAtLeastOneRestrictedAccess);
                yield return (profile, files);
            };
        }

        public static IEnumerable<ProfileSearchResult> MapToSearchResults(this IEnumerable<(RegistrantProfile profile, IEnumerable<EvacuationFile> files)> source) =>
            source.Select(p => new ProfileSearchResult
            {
                Id = p.profile.Id,
                FirstName = p.profile.FirstName,
                LastName = p.profile.LastName,
                RegistrationDate = p.profile.CreatedOn,
                IsVerified = p.profile.VerifiedUser.Value,
                PrimaryAddress = p.profile.PrimaryAddress,
                RestrictedAccess = p.profile.RestrictedAccess,
                RecentEvacuationFiles = p.files.MapToSearchResults()
            });

        public static IEnumerable<EvacuationFileSearchResult> MapToSearchResults(this IEnumerable<EvacuationFile> src) =>
            src.Select(f => new EvacuationFileSearchResult
            {
                Id = f.Id,
                CreatedOn = f.NeedsAssessment.CompletedOn,
                EvacuationAddress = f.EvacuatedFromAddress,
                EvacuationDate = f.EvacuationDate.Value,
                RestrictedAccess = f.RestrictedAccess,
                Status = f.Status,
                TaskId = f.RelatedTask?.Id,
                HouseholdMembers = f.HouseholdMembers.Select(m => new EvacuationFileSearchResultHouseholdMember
                {
                    Id = m.Id,
                    FirstName = m.FirstName,
                    LastName = m.LastName,
                    IsPrimaryRegistrant = m.IsPrimaryRegistrant,
                    LinkedRegistrantId = m.LinkedRegistrantId,
                    IsSearchMatch = false
                })
            });
    }
}
