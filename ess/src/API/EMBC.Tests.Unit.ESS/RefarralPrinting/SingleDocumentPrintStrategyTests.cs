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
        public async Task Generate_AllSupportWithReferrals_Created()
        {
            var file = new Faker<EvacuationFile>("en_CA").WithFileRules().Generate();
            var teamMember = new Faker<TeamMember>("en_CA").WithTeamMemberRules().Generate();
            var supports = new Support[]
            {
                CreateSupport<ShelterAllowanceSupport, Referral>(file, teamMember),
                CreateSupport<ShelterBilletingSupport, Referral>(file, teamMember),
                CreateSupport<ShelterGroupSupport, Referral>(file, teamMember),
                CreateSupport<ShelterHotelSupport, Referral>(file, teamMember),
                CreateSupport<FoodGroceriesSupport, Referral>(file, teamMember),
                CreateSupport<FoodRestaurantSupport, Referral>(file, teamMember),
                CreateSupport<TransportationOtherSupport, Referral>(file, teamMember),
                CreateSupport<TransportationTaxiSupport, Referral>(file, teamMember),
                CreateSupport<ClothingSupport, Referral>(file, teamMember),
                CreateSupport<IncidentalsSupport, Referral>(file, teamMember),
            };

            var strategy = new SingleDocumentStrategy(mapper, metadataRepository);

            var response = (await strategy.Generate(new GenerateReferralsRequest
            {
                AddSummary = true,
                AddWatermark = true,
                File = file,
                Supports = supports,
                RequestingUserId = teamMember.Id,
                PrintingMember = teamMember,
                Evacuee = new EMBC.ESS.Resources.Evacuees.Evacuee { FirstName = "first", LastName = "last" }
            })).ShouldBeOfType<GenerateReferralsResponse>();

            await File.WriteAllBytesAsync($"./allreferrals.html", response.Content);
        }

        [Fact]
        public async Task Generate_AllSupportWithEtransfers_Created()
        {
            var file = new Faker<EvacuationFile>("en_CA").WithFileRules().Generate();
            var teamMember = new Faker<TeamMember>("en_CA").WithTeamMemberRules().Generate();
            var supports = new Support[]
            {
                CreateSupport<ShelterAllowanceSupport, Interac>(file, teamMember),
                CreateSupport<ShelterBilletingSupport, Interac>(file, teamMember),
                CreateSupport<ShelterGroupSupport, Interac>(file, teamMember),
                CreateSupport<ShelterHotelSupport, Interac>(file, teamMember),
                CreateSupport<FoodGroceriesSupport, Interac>(file, teamMember),
                CreateSupport<FoodRestaurantSupport, Interac>(file, teamMember),
                CreateSupport<TransportationOtherSupport, Interac>(file, teamMember),
                CreateSupport<TransportationTaxiSupport, Interac>(file, teamMember),
                CreateSupport<ClothingSupport, Interac>(file, teamMember),
                CreateSupport<IncidentalsSupport, Interac>(file, teamMember),
            };

            var strategy = new SingleDocumentStrategy(mapper, metadataRepository);

            var response = (await strategy.Generate(new GenerateReferralsRequest
            {
                AddSummary = true,
                AddWatermark = true,
                File = file,
                Supports = supports,
                RequestingUserId = teamMember.Id,
                PrintingMember = teamMember,
                Evacuee = new EMBC.ESS.Resources.Evacuees.Evacuee { FirstName = "first", LastName = "last" }
            })).ShouldBeOfType<GenerateReferralsResponse>();

            await File.WriteAllBytesAsync($"./alletransfers.html", response.Content);
        }

        [Fact]
        public async Task GenerateReferrals_ShelterAllowanceSupport_Created()
        {
            await RunSingleSupportTest<ShelterAllowanceSupport>();
        }

        [Fact]
        public async Task GenerateReferrals_ShelterBilletingSupport_Created()
        {
            await RunSingleSupportTest<ShelterBilletingSupport>();
        }

        [Fact]
        public async Task GenerateReferrals_ShelterHotelSupport_Created()
        {
            await RunSingleSupportTest<ShelterHotelSupport>();
        }

        [Fact]
        public async Task GenerateReferrals_ShelterGroupSupport_Created()
        {
            await RunSingleSupportTest<ShelterGroupSupport>();
        }

        [Fact]
        public async Task GenerateReferrals_FoodGroceriesSupport_Created()
        {
            await RunSingleSupportTest<FoodGroceriesSupport>();
        }

        [Fact]
        public async Task GenerateReferrals_FoodRestaurantSupport_Created()
        {
            await RunSingleSupportTest<FoodRestaurantSupport>();
        }

        [Fact]
        public async Task GenerateReferrals_IncidentalsSupport_Created()
        {
            await RunSingleSupportTest<IncidentalsSupport>();
        }

        [Fact]
        public async Task GenerateReferrals_ClothingSupport_Created()
        {
            await RunSingleSupportTest<ClothingSupport>();
        }

        [Fact]
        public async Task GenerateReferrals_TransportationOtherSupport_Created()
        {
            await RunSingleSupportTest<TransportationOtherSupport>();
        }

        [Fact]
        public async Task GenerateReferrals_TransportationTaxiSupport_Created()
        {
            await RunSingleSupportTest<TransportationTaxiSupport>();
        }

        private async Task RunSingleSupportTest<TSupport>()
         where TSupport : Support
        {
            var file = new Faker<EvacuationFile>("en_CA").WithFileRules().Generate();
            var teamMember = new Faker<TeamMember>("en_CA").WithTeamMemberRules().Generate();
            var support = CreateSupport<TSupport, Referral>(file, teamMember);

            var strategy = new SingleDocumentStrategy(mapper, metadataRepository);

            var response = (await strategy.Generate(new GenerateReferralsRequest
            {
                AddSummary = true,
                AddWatermark = true,
                File = file,
                Supports = [support],
                RequestingUserId = teamMember.Id,
                PrintingMember = teamMember,
                Evacuee = new EMBC.ESS.Resources.Evacuees.Evacuee { FirstName = "first", LastName = "last" }
            })).ShouldBeOfType<GenerateReferralsResponse>();

            await File.WriteAllBytesAsync($"./{support.GetType().Name}.html", response.Content);
        }

        private Support CreateSupport<TSupport, TSupportDelivery>(EvacuationFile file, TeamMember teamMember)
        where TSupport : Support
        where TSupportDelivery : SupportDelivery
        {
            return typeof(TSupport) switch
            {
                Type t when t == typeof(ShelterAllowanceSupport) => new Faker<ShelterAllowanceSupport>("en_CA").WithSupportRules(file, teamMember).WithSupportDeliveryRules<ShelterAllowanceSupport, TSupportDelivery>().Generate(),
                Type t when t == typeof(ShelterBilletingSupport) => new Faker<ShelterBilletingSupport>("en_CA").WithSupportRules(file, teamMember).WithSupportDeliveryRules<ShelterBilletingSupport, TSupportDelivery>().Generate(),
                Type t when t == typeof(ShelterGroupSupport) => new Faker<ShelterGroupSupport>("en_CA").WithSupportRules(file, teamMember).WithSupportDeliveryRules<ShelterGroupSupport, TSupportDelivery>().Generate(),
                Type t when t == typeof(ShelterHotelSupport) => new Faker<ShelterHotelSupport>("en_CA").WithSupportRules(file, teamMember).WithSupportDeliveryRules<ShelterHotelSupport, TSupportDelivery>().Generate(),
                Type t when t == typeof(FoodGroceriesSupport) => new Faker<FoodGroceriesSupport>("en_CA").WithSupportRules(file, teamMember).WithSupportDeliveryRules<FoodGroceriesSupport, TSupportDelivery>().Generate(),
                Type t when t == typeof(FoodRestaurantSupport) => new Faker<FoodRestaurantSupport>("en_CA").WithSupportRules(file, teamMember).WithSupportDeliveryRules<FoodRestaurantSupport, TSupportDelivery>().Generate(),

                _ => new Faker<TSupport>("en_CA").WithDefaultSupportRules(file, teamMember).WithSupportDeliveryRules<TSupport, TSupportDelivery>().Generate()
            };
        }
    }

    public static class BogusExtensions
    {
        public static Faker<EvacuationFile> WithFileRules(this Faker<EvacuationFile> faker)
        {
            return faker
                .RuleFor(f => f.Id, f => "F" + f.Random.Number(100000, 999999).ToString())
                .RuleFor(f => f.RelatedTask, f => new IncidentTask { Id = f.Hacker.Noun(), CommunityCode = "1" })
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
                .RuleFor(f => f.IsMinor, (f, o) => DateTime.Parse(o.DateOfBirth, CultureInfo.InvariantCulture).AddYears(19) >= DateTime.Today)
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

        public static Faker<SupplierDetails> WithSupplierDetailsRules(this Faker<SupplierDetails> faker)
        {
            return faker
                .RuleFor(sd => sd.LegalName, f => f.Company.CompanyName(1))
                .RuleFor(sd => sd.Name, f => f.Company.CompanyName(0))
                .RuleFor(sd => sd.Phone, f => f.Phone.PhoneNumber())
                .RuleFor(sd => sd.Address, f => new Faker<Address>("en_CA").WithAddressRules().Generate())
                ;
        }

        public static Faker<Address> WithAddressRules(this Faker<Address> faker)
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

        public static Faker<TSupport> WithSupportDeliveryRules<TSupport, TSupportDelivery>(this Faker<TSupport> faker)
        where TSupport : Support
        where TSupportDelivery : SupportDelivery
        {
            return typeof(TSupportDelivery) switch
            {
                Type t when t == typeof(Referral) => faker.RuleFor(s => s.SupportDelivery, f => new Faker<Referral>().WithReferralRules().Generate()),
                Type t when t == typeof(Interac) => faker.RuleFor(s => s.SupportDelivery, f => new Faker<Interac>().WithInteracRules().Generate()),

                _ => throw new NotImplementedException()
            };
        }

        public static Faker<Referral> WithReferralRules(this Faker<Referral> faker)
        {
            return faker
                .RuleFor(sd => sd.IssuedToPersonName, f => f.Person.FullName)
                .RuleFor(sd => sd.ManualReferralId, f => string.Empty)
                .RuleFor(sd => sd.SupplierNotes, f => f.Lorem.Lines(3))
                .RuleFor(sd => sd.SupplierDetails, f => new Faker<SupplierDetails>("en_CA").WithSupplierDetailsRules().Generate())
                ;
        }

        public static Faker<Interac> WithInteracRules(this Faker<Interac> faker)
        {
            return faker
                .RuleFor(sd => sd.NotificationEmail, f => f.Person.Email)
                .RuleFor(sd => sd.NotificationMobile, f => f.Person.Phone)
                .RuleFor(sd => sd.RecipientFirstName, f => f.Person.FirstName)
                .RuleFor(sd => sd.RecipientLastName, f => f.Person.LastName)
                ;
        }

        public static Faker<T> WithDefaultSupportRules<T>(this Faker<T> faker, EvacuationFile sourceFile, TeamMember issuer) where T : Support
        {
            return faker
               .RuleFor(s => s.FileId, _ => sourceFile.Id)
               .RuleFor(s => s.Id, f => "S" + f.Random.Number(100000, 999999).ToString())
               .RuleFor(s => s.Status, f => SupportStatus.Active)
               .RuleFor(s => s.From, f => f.Date.Recent())
               .RuleFor(s => s.To, (f, o) => o.From.AddDays(3))
               .RuleFor(s => s.IncludedHouseholdMembers, f => f.PickRandom(sourceFile.HouseholdMembers.Select(hm => hm.Id), f.Random.Int(1, sourceFile.HouseholdMembers.Count())))
               .RuleFor(s => s.IssuedOn, (f, o) => o.From)
               .RuleFor(s => s.IssuedBy, _ => issuer)
               .RuleFor(s => s.CreatedBy, _ => issuer)
               .RuleFor(s => s.CreatedOn, (f, o) => o.IssuedOn)
               ;
        }

        public static Faker<FoodGroceriesSupport> WithSupportRules(this Faker<FoodGroceriesSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
        {
            return faker.WithDefaultSupportRules(sourceFile, issuer)
                .RuleFor(s => s.NumberOfDays, _ => 3)
                .RuleFor(s => s.TotalAmount, f => f.Random.Decimal(min: 10m, max: 1000m))
                ;
        }

        public static Faker<FoodRestaurantSupport> WithSupportRules(this Faker<FoodRestaurantSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
        {
            return faker.WithDefaultSupportRules(sourceFile, issuer)
                .RuleFor(s => s.NumberOfBreakfastsPerPerson, f => f.Random.Int(0, 4))
                .RuleFor(s => s.NumberOfDinnersPerPerson, f => f.Random.Int(0, 4))
                .RuleFor(s => s.NumberOfLunchesPerPerson, f => f.Random.Int(0, 4))
                .RuleFor(s => s.TotalAmount, f => f.Random.Decimal(min: 10m, max: 1000m))
                ;
        }

        public static Faker<ShelterAllowanceSupport> WithSupportRules(this Faker<ShelterAllowanceSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
        {
            return faker.WithDefaultSupportRules(sourceFile, issuer)
                .RuleFor(s => s.NumberOfNights, _ => 3)
                .RuleFor(s => s.ContactEmail, f => f.Person.Email)
                .RuleFor(s => s.ContactPhone, f => f.Person.Phone)
                .RuleFor(s => s.TotalAmount, f => f.Random.Decimal(min: 10m, max: 1000m))
                ;
        }

        public static Faker<ShelterGroupSupport> WithSupportRules(this Faker<ShelterGroupSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
        {
            return faker.WithDefaultSupportRules(sourceFile, issuer)
                .RuleFor(s => s.NumberOfNights, _ => 3)
                .RuleFor(s => s.FacilityAddress, f => f.Address.StreetAddress())
                .RuleFor(s => s.FacilityCity, f => f.Address.City())
                .RuleFor(s => s.FacilityContactPhone, f => f.Phone.PhoneNumber())
                .RuleFor(s => s.FacilityName, f => f.Company.CompanyName())
                ;
        }

        public static Faker<ShelterHotelSupport> WithSupportRules(this Faker<ShelterHotelSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
        {
            return faker.WithDefaultSupportRules(sourceFile, issuer)
                .RuleFor(s => s.NumberOfNights, _ => 3)
                .RuleFor(s => s.NumberOfRooms, _ => 1)
                ;
        }

        public static Faker<ShelterBilletingSupport> WithSupportRules(this Faker<ShelterBilletingSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
        {
            return faker.WithDefaultSupportRules(sourceFile, issuer)
                .RuleFor(s => s.NumberOfNights, _ => 3)
                .RuleFor(s => s.HostAddress, f => f.Address.StreetAddress())
                .RuleFor(s => s.HostCity, f => f.Address.City())
                .RuleFor(s => s.HostPhone, f => f.Phone.PhoneNumber())
                .RuleFor(s => s.HostEmail, f => f.Person.Email)
                ;
        }
    }
}
