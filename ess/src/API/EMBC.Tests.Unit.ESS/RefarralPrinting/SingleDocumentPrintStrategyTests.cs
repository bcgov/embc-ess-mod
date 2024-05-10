using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Bogus;
using EMBC.ESS.Engines.Supporting;
using EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Shared.Contracts.Events;
using FakeItEasy;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.ESS.ReferralPrinting
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
                Evacuee = new RegistrantProfile { FirstName = "first", LastName = "last" }
            }, CancellationToken.None)).ShouldBeOfType<GenerateReferralsResponse>();

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
                Evacuee = new RegistrantProfile { FirstName = "first", LastName = "last" }
            }, CancellationToken.None)).ShouldBeOfType<GenerateReferralsResponse>();

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
                Evacuee = new RegistrantProfile { FirstName = "first", LastName = "last" }
            }, CancellationToken.None)).ShouldBeOfType<GenerateReferralsResponse>();

            await File.WriteAllBytesAsync($"./{support.GetType().Name}.html", response.Content);
        }

        private Support CreateSupport<TSupport, TSupportDelivery>(EvacuationFile file, TeamMember teamMember)
        where TSupport : Support
        where TSupportDelivery : SupportDelivery
        {
#pragma warning disable S2589 // Boolean expressions should not be gratuitous
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
#pragma warning restore S2589 // Boolean expressions should not be gratuitous
        }
    }
}
