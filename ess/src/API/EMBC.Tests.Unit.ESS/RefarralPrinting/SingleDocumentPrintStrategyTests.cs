using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Bogus;
using EMBC.ESS.Engines.Supporting;
using EMBC.ESS.Engines.Supporting.SupportGeneration;
using EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Shared.Contracts.Events;
using FakeItEasy;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.ESS.RefarralPrinting
{
    public class SingleDocumentPrintStrategyTests
    {
        private readonly IMapper mapper;
        private readonly IMetadataRepository metadataRepository;

        public SingleDocumentPrintStrategyTests()
        {
            var mapperConfig = new AutoMapper.MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(Mappings));
            });
            mapper = mapperConfig.CreateMapper();
            metadataRepository = A.Fake<IMetadataRepository>();
            A.CallTo(() => metadataRepository.GetCommunities()).Returns(new List<Community> { new Community { Code = "1", Name = "Test Community" } });
        }

        [Fact]
        public async Task CreatePrintReferral_Support_Created()
        {
            var file = new Faker<EvacuationFile>("en_CA").WithFileRules().Generate();
            var teamMember = new Faker<TeamMember>("en_CA").WithTeamMemberRules().Generate();
            var support = new Faker<ShelterAllowanceSupport>("en_CA").WithSupportRules(file, teamMember).Generate();

            var strategy = new SingleDocumentStrategy(mapper, metadataRepository);

            var response = (await strategy.Generate(new GenerateReferralsRequest
            {
                AddSummary = false,
                AddWatermark = true,
                File = file,
                Supports = new[] { support },
                RequestingUserId = teamMember.Id,
                PrintingMember = teamMember,
                Evacuee = new EMBC.ESS.Resources.Evacuees.Evacuee { FirstName = "first", LastName = "last" }
            })).ShouldBeOfType<GenerateReferralsResponse>();

            await File.WriteAllBytesAsync($"./{support.GetType().Name}.html", response.Content);
        }
    }

    public static class BogusExtensions
    {
        public static Faker<EvacuationFile> WithFileRules(this Faker<EvacuationFile> faker)
        {
            return faker
                .RuleFor(f => f.Id, f => "F" + f.Random.Number(100000, 999999).ToString())
                .RuleFor(f => f.RelatedTask, f => new IncidentTask { Id = f.Hacker.Phrase(), CommunityCode = "1" })
                .RuleFor(f => f.HouseholdMembers, f =>
                {
                    var hmFaker = new Faker<HouseholdMember>();
                    return hmFaker.WithHouseholdMember(false).GenerateBetween(0, 19).Prepend(hmFaker.WithHouseholdMember(true).Generate());
                })
                .RuleFor(f => f.NeedsAssessment, (f, o) => new NeedsAssessment
                {
                    HouseholdMembers = o.HouseholdMembers,
                    CompletedBy = new Faker<TeamMember>().WithTeamMemberRules().Generate(),
                    CompletedOn = DateTime.Now,
                    Insurance = f.Random.Enum<InsuranceOption>(),
                    Pets = new Faker<Pet>().GenerateBetween(0, 20),
                    Type = NeedsAssessmentType.Assessed,
                    Needs = f.Random.EnumValues<IdentifiedNeed>(),
                    Notes = o.Notes
                })
                .RuleFor(f => f.Status, _ => EvacuationFileStatus.Active)
                .RuleFor(f => f.EvacuationDate, _ => DateTime.Now)
                .RuleFor(f => f.Notes, new Faker<Note>().GenerateBetween(0, 10))
                .RuleFor(f => f.PrimaryRegistrantId, f => "test")
                .RuleFor(f => f.RegistrationLocation, f => f.Address.FullAddress())
                ;
        }

        public static Faker<HouseholdMember> WithHouseholdMember(this Faker<HouseholdMember> faker, bool isPrimaryRegistrant)
        {
            return faker
                .RuleFor(f => f.DateOfBirth, f => f.Person.DateOfBirth.ToString("MM/dd/yyyy"))
                .RuleFor(f => f.FirstName, f => f.Person.FirstName)
                .RuleFor(f => f.LastName, f => f.Person.LastName)
                .RuleFor(f => f.Gender, f => f.Person.Gender.ToString().Substring(0, 1).ToUpper())
                .RuleFor(f => f.IsMinor, (f, o) => DateTime.Parse(o.DateOfBirth, CultureInfo.InvariantCulture).AddYears(19) > DateTime.Today)
                .RuleFor(f => f.IsPrimaryRegistrant, _ => isPrimaryRegistrant)
                ;
        }

        public static Faker<TeamMember> WithTeamMemberRules(this Faker<TeamMember> faker)
        {
            return faker
                .RuleFor(f => f.FirstName, f => f.Person.FirstName)
                .RuleFor(f => f.LastName, f => f.Person.LastName)
                .RuleFor(f => f.TeamName, f => f.Company.CompanyName(0))
                ;
        }

        public static Faker<T> WithSupport<T>(this Faker<T> faker, EvacuationFile sourceFile, TeamMember issuer) where T : Support
        {
            return faker
                .RuleFor(s => s.FileId, _ => sourceFile.Id)
                .RuleFor(s => s.Id, f => "S" + f.Random.Number(100000, 999999).ToString())
                .RuleFor(s => s.Status, f => SupportStatus.Active)
                .RuleFor(s => s.From, f => f.Date.Recent())
                .RuleFor(s => s.To, (f, o) => o.From.AddDays(3))
                .RuleFor(s => s.SupportDelivery, _ => new Faker<Referral>("en_CA").WithReferral().Generate())
                .RuleFor(s => s.IncludedHouseholdMembers, f => f.PickRandom(sourceFile.HouseholdMembers.Select(hm => hm.Id), f.Random.Int(1, sourceFile.HouseholdMembers.Count())))
                .RuleFor(s => s.IssuedOn, (f, o) => o.From)
                .RuleFor(s => s.IssuedBy, _ => issuer)
                .RuleFor(s => s.CreatedBy, _ => issuer)
                .RuleFor(s => s.CreatedOn, (f, o) => o.IssuedOn)
                ;
        }

        public static Faker<Referral> WithReferral(this Faker<Referral> faker)
        {
            return faker
                .RuleFor(sd => sd.IssuedToPersonName, f => f.Person.FullName)
                .RuleFor(sd => sd.ManualReferralId, f => string.Empty)
                .RuleFor(sd => sd.SupplierNotes, f => f.Lorem.Lines(3))
                .RuleFor(sd => sd.SupplierDetails, f => new Faker<SupplierDetails>("en_CA").WithSupplierDetails().Generate())
                ;
        }

        public static Faker<Interac> WithInterac(this Faker<Interac> faker)
        {
            return faker
                .RuleFor(sd => sd.NotificationEmail, f => f.Person.Email)
                .RuleFor(sd => sd.NotificationMobile, f => f.Person.Phone)
                .RuleFor(sd => sd.RecipientFirstName, f => f.Person.FirstName)
                .RuleFor(sd => sd.RecipientFirstName, f => f.Person.LastName)
                ;
        }

        public static Faker<SupplierDetails> WithSupplierDetails(this Faker<SupplierDetails> faker)
        {
            return faker
                .RuleFor(sd => sd.LegalName, f => f.Company.CompanyName(1))
                .RuleFor(sd => sd.Name, f => f.Company.CompanyName(0))
                .RuleFor(sd => sd.Phone, f => f.Phone.PhoneNumber())
                .RuleFor(sd => sd.Address, f => new Faker<Address>("en_CA").WithAddress().Generate())
                ;
        }

        public static Faker<Address> WithAddress(this Faker<Address> faker)
        {
            return faker
                .RuleFor(sd => sd.AddressLine1, f => f.Address.StreetAddress())
                .RuleFor(sd => sd.AddressLine2, f => f.Address.SecondaryAddress())
                .RuleFor(sd => sd.City, f => f.Address.City())
                .RuleFor(sd => sd.Country, f => f.Address.Country())
                .RuleFor(sd => sd.PostalCode, f => f.Address.ZipCode())
                .RuleFor(sd => sd.StateProvince, f => f.Address.State())
                ;
        }

        public static Faker<FoodGroceriesSupport> WithSupport(this Faker<FoodGroceriesSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
        {
            return faker.WithSupport<FoodGroceriesSupport>(sourceFile, issuer)
                .RuleFor(s => s.NumberOfDays, _ => 3)
                .RuleFor(s => s.TotalAmount, f => f.Random.Decimal(min: 10m, max: 1000m))
                ;
        }

        public static Faker<FoodRestaurantSupport> WithSupport(this Faker<FoodRestaurantSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
        {
            return faker.WithSupport<FoodRestaurantSupport>(sourceFile, issuer)
                .RuleFor(s => s.NumberOfBreakfastsPerPerson, f => f.Random.Int(0, 4))
                .RuleFor(s => s.NumberOfDinnersPerPerson, f => f.Random.Int(0, 4))
                .RuleFor(s => s.NumberOfLunchesPerPerson, f => f.Random.Int(0, 4))
                .RuleFor(s => s.TotalAmount, f => f.Random.Decimal(min: 10m, max: 1000m))
                ;
        }

        public static Faker<ShelterAllowanceSupport> WithSupportRules(this Faker<ShelterAllowanceSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
        {
            return faker.WithSupport<ShelterAllowanceSupport>(sourceFile, issuer)
                .RuleFor(s => s.NumberOfNights, _ => 3)
                .RuleFor(s => s.TotalAmount, f => f.Random.Decimal(min: 10m, max: 1000m))
                ;
        }

        public static Faker<ShelterGroupSupport> WithSupport(this Faker<ShelterGroupSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
        {
            return faker.WithSupport<ShelterGroupSupport>(sourceFile, issuer)
                .RuleFor(s => s.NumberOfNights, _ => 3)
                .RuleFor(s => s.FacilityAddress, f => f.Address.StreetAddress())
                .RuleFor(s => s.FacilityCity, f => f.Address.City())
                .RuleFor(s => s.FacilityContactPhone, f => f.Phone.PhoneNumber())
                .RuleFor(s => s.FacilityName, f => f.Company.CompanyName())
                ;
        }

        public static Faker<ShelterHotelSupport> WithSupport(this Faker<ShelterHotelSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
        {
            return faker.WithSupport<ShelterHotelSupport>(sourceFile, issuer)
                .RuleFor(s => s.NumberOfNights, _ => 3)
                .RuleFor(s => s.NumberOfRooms, _ => 1)
                ;
        }

        public static Faker<ShelterBilletingSupport> WithSupport(this Faker<ShelterBilletingSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
        {
            return faker.WithSupport<ShelterBilletingSupport>(sourceFile, issuer)
                .RuleFor(s => s.NumberOfNights, _ => 3)
                .RuleFor(s => s.HostAddress, f => f.Address.StreetAddress())
                .RuleFor(s => s.HostCity, f => f.Address.City())
                .RuleFor(s => s.HostPhone, f => f.Phone.PhoneNumber())
                .RuleFor(s => s.HostEmail, f => f.Person.Email)
                ;
        }

        //public static Faker<PrintReferral> WithSupportRules(this Faker<PrintReferral> faker, Support support, EvacuationFile file)
        //{
        //    return faker
        //        .RuleFor(o => o.VolunteerFirstName, f => f.Person.FirstName)
        //        .RuleFor(o => o.VolunteerLastName, f => f.Person.LastName)
        //        .RuleFor(o => o.DisplayWatermark, f => true)
        //        .RuleFor(o => o.Type, f => f.Random.Enum<PrintReferralType>())
        //        .RuleFor(o => o.Id, f => support.Id)
        //        .RuleFor(o => o.FromDate, f => support.From.ToLongTimeString())
        //        .RuleFor(o => o.FromTime, f => support.From.ToShortDateString())
        //        .RuleFor(o => o.FromDate, f => support.To.ToLongTimeString())
        //        .RuleFor(o => o.FromTime, f => support.To.ToShortDateString())
        //        .RuleFor(o => o.Comments, f => string.Empty)
        //        .RuleFor(o => o.PrintDate, f => DateTime.Now.ToString())

        //        .RuleFor(o => o.PurchaserName, f => string.Empty)
        //        .RuleFor(o => o.ApprovedItems, (f, o) => o.Type == PrintReferralType.Incidentals ? string.Join(Environment.NewLine, f.Random.WordsArray(10)) : null)
        //        .RuleFor(o => o.TotalAmountPrinted, (f, o) => o.Type == PrintReferralType.Incidentals ? f.Random.Decimal(max: 1000m).ToString() : null)
        //        .RuleFor(o => o.TotalAmountPrinted, (f, o) => o.Type == PrintReferralType.Clothing ? f.Random.Decimal(max: 1000m).ToString() : null)
        //        .RuleFor(o => o.TotalAmountPrinted, (f, o) => o.Type == PrintReferralType.Meals ? f.Random.Decimal(max: 1000m).ToString() : null)
        //        .RuleFor(o => o.NumBreakfasts, (f, o) => o.Type == PrintReferralType.Meals ? f.Random.Int(0, 3) : 0)
        //        .RuleFor(o => o.NumLunches, (f, o) => o.Type == PrintReferralType.Meals ? f.Random.Int(0, 3) : 0)
        //        .RuleFor(o => o.NumDinners, (f, o) => o.Type == PrintReferralType.Meals ? f.Random.Int(0, 3) : 0)
        //        .RuleFor(o => o.TotalAmountPrinted, (f, o) => o.Type == PrintReferralType.Groceries ? f.Random.Decimal(max: 1000m).ToString() : null)
        //        .RuleFor(o => o.NumDaysMeals, (f, o) => o.Type == PrintReferralType.Groceries ? f.Random.Int(0, 3) : 0)
        //        .RuleFor(o => o.NumNights, (f, o) => o.Type == PrintReferralType.Hotel ? f.Random.Int(0, 3) : 0)
        //        .RuleFor(o => o.NumNights, (f, o) => o.Type == PrintReferralType.GroupLodging ? f.Random.Int(0, 3) : 0)
        //        .RuleFor(o => o.FromAddress, (f, o) => o.Type == PrintReferralType.Taxi ? f.Address.FullAddress() : null)
        //        .RuleFor(o => o.ToAddress, (f, o) => o.Type == PrintReferralType.Taxi ? f.Address.FullAddress() : null)
        //        .RuleFor(o => o.TotalAmountPrinted, (f, o) => o.Type == PrintReferralType.Transportation ? f.Random.Decimal(max: 1000m).ToString() : null)
        //        .RuleFor(o => o.OtherTransportModeDetails, (f, o) => o.Type == PrintReferralType.Transportation ? f.Vehicle.Type() : null)
        //        .RuleFor(o => o.Supplier, f => new Faker<PrintSupplier>()
        //            .RuleFor(o => o.Address, f => f.Address.StreetAddress() + "," + f.Address.StreetName())
        //            .RuleFor(o => o.City, f => f.Address.City())
        //            .RuleFor(o => o.Name, f => f.Company.CompanyName())
        //            .RuleFor(o => o.PostalCode, f => f.Address.ZipCode())
        //            .RuleFor(o => o.Telephone, f => f.Phone.PhoneNumber())
        //            .RuleFor(o => o.Province, f => f.Address.State())
        //            .Generate())
        //        .RuleFor(o => o.Evacuees, f => f.Make(f.Random.Number(20), () => new Faker<PrintEvacuee>()
        //            .RuleFor(o => o.EvacueeTypeCode, f => f.PickRandom("F", "A", "C"))
        //            .RuleFor(o => o.FirstName, f => f.Person.FirstName)
        //            .RuleFor(o => o.LastName, f => f.Person.LastName)
        //            .Generate()))
        //        ;
        //}
    }
}
