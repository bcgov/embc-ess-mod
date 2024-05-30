using System;
using System.Collections.Generic;
using System.Linq;
using Bogus;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Tests.Unit.ESS;

namespace EMBC.Tests.Integration.ESS
{
    public static class TestHelper
    {
        public static string GenerateNewUniqueId(string prefix) => prefix + Guid.NewGuid().ToString().Substring(0, 4);

        public static EvacuationFile CreateNewTestEvacuationFile(RegistrantProfile registrant, string? taskNumber, int minNumberOfHoldholdMembers = 0)
        {
            var file = new Faker<EvacuationFile>("en_CA").WithFileRules(registrant, minNumberOfHoldholdMembers).Generate();
            file.Id = null;
            file.RelatedTask = null;
            if (taskNumber != null) file.RelatedTask = new IncidentTask { Id = taskNumber };
            file.PrimaryRegistrantId = registrant.Id;
            return file;
        }

        public static RegistrantProfile CreateRegistrantProfile()
        {
            return new Faker<RegistrantProfile>("en_CA").WithRegistrantRules().Generate();
        }

        public static IEnumerable<Support> CreateSupports(EvacuationFile file)
        {
            var householdMemberIds = file.HouseholdMembers.Select(m => m.Id).ToArray();
            var from = DateTime.UtcNow.AddDays(-1);
            var to = DateTime.UtcNow.AddDays(2);
            var supports = new Support[]
            {
                new ClothingSupport { TotalAmount =  RandomAmount() },
                new IncidentalsSupport { TotalAmount = RandomAmount() },
                new FoodGroceriesSupport {TotalAmount = RandomAmount()},
                new FoodRestaurantSupport { TotalAmount = RandomAmount() },
                new ShelterBilletingSupport() { NumberOfNights = RandomInt()},
                new ShelterGroupSupport { NumberOfNights = RandomInt(), FacilityCommunityCode = file.EvacuatedFromAddress.Community },
                new ShelterHotelSupport { NumberOfNights = RandomInt(), NumberOfRooms = RandomInt() },
                new ShelterAllowanceSupport { NumberOfNights = RandomInt(), ContactPhone = "phone", ContactEmail = "email" },
                new TransportationOtherSupport { TotalAmount = RandomAmount() },
                new TransportationTaxiSupport { FromAddress = "test", ToAddress = "test" },
            };

            Func<Support, SupportDelivery> createSupportDelivery = sup =>
                sup switch
                {
                    IncidentalsSupport _ => new Interac { NotificationEmail = $"autotest-unitest@test.gov.bc.ca", ReceivingRegistrantId = file.PrimaryRegistrantId },
                    ClothingSupport _ => new Interac { NotificationEmail = $"autotest-unitest@test.gov.bc.ca", ReceivingRegistrantId = file.PrimaryRegistrantId },

                    _ => new Referral { IssuedToPersonName = $"autotest-unitest" },
                };

            foreach (var support in supports)
            {
                support.FileId = file.Id;
                support.IncludedHouseholdMembers = householdMemberIds.TakeRandom();
                support.From = from;
                support.To = to;
                support.SupportDelivery = createSupportDelivery(support);
            }

            return supports;
        }

        public static async Task<RegistrantProfile?> GetRegistrantByUserId(EventsManager manager, string userId) =>
            (await manager.Handle(new RegistrantsQuery { UserId = userId })).Items.SingleOrDefault();

        public static async Task<RegistrantProfile?> GetRegistrantById(EventsManager manager, string id) =>
            (await manager.Handle(new RegistrantsQuery { Id = id })).Items.SingleOrDefault();

        public static async Task<EvacuationFile?> GetEvacuationFileById(EventsManager manager, string fileId) =>
            (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.SingleOrDefault();

        public static async Task<string> SaveRegistrant(EventsManager manager, RegistrantProfile registrantProfile) =>
            await manager.Handle(new SaveRegistrantCommand { Profile = registrantProfile });

        public static async Task<string> SaveEvacuationFile(EventsManager manager, EvacuationFile file) =>
            await manager.Handle(new SubmitEvacuationFileCommand { File = file });

        public static async Task<IEnumerable<Support>> SaveSupports(EventsManager manager, EvacuationFile file, string RequestingUserId, string prefix)
        {
            var newSupports = CreateSupports(file);

            await manager.Handle(new ProcessSupportsCommand
            {
                FileId = file.Id,
                Supports = newSupports,
                IncludeSummaryInReferralsPrintout = false,
                RequestingUserId = RequestingUserId
            });

            await manager.Handle(new ProcessPendingSupportsCommand());

            var supports = (await manager.Handle(new SearchSupportsQuery { FileId = file.Id })).Items;

            return supports.Where(s => (s.SupportDelivery is Interac i && i.NotificationEmail.StartsWith(prefix)) ||
                (s.SupportDelivery is Referral r && r.IssuedToPersonName.StartsWith(prefix)))
                .ToArray();
        }

        public static IEnumerable<T> TakeRandom<T>(this T[] list) => list.TakeRandom(Random.Shared.Next(1, list.Length));

        public static IEnumerable<T> TakeRandom<T>(this T[] list, int numberOfItems) => list.Skip(Random.Shared.Next(list.Length - numberOfItems)).Take(numberOfItems);

        public static decimal RandomAmount() => decimal.Round(Convert.ToDecimal(Random.Shared.NextDouble() * 100), 2);

        public static int RandomInt(int min = 1, int max = 10) => Random.Shared.Next(min, max);

        public static Address CreateSelfServeEligibleAddress()
        {
            return new Address
            {
                AddressLine1 = "100 Main st",
                City = "Vancouver",
                StateProvince = "BC",
                Country = "CA"
            };
        }

        public static Address CreateSelfServeIneligibleAddress()
        {
            return new Address
            {
                AddressLine1 = "100 Cambie st",
                City = "Vancouver",
                StateProvince = "BC",
                Country = "CA"
            };
        }

        public static Address CreatePartialSelfServeEligibleAddress()
        {
            return new Address
            {
                AddressLine1 = "150 ALEXANDER ST",
                City = "Vancouver",
                StateProvince = "BC",
                Country = "CA"
            };
        }
    }
}
