using System;
using System.Collections.Generic;
using System.Linq;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts.Events;

namespace EMBC.Tests.Integration.ESS
{
    public static class TestHelper
    {
        public static string GenerateNewUniqueId(string prefix) => prefix + Guid.NewGuid().ToString().Substring(0, 4);

        public static EvacuationFile CreateNewTestEvacuationFile(string prefix, RegistrantProfile registrant)
        {
            var uniqueSignature = GenerateNewUniqueId(prefix);
            var file = new EvacuationFile()
            {
                PrimaryRegistrantId = registrant.Id,
                SecurityPhrase = "SecretPhrase",
                SecurityPhraseChanged = true,
                RelatedTask = new IncidentTask { Id = "0001" },
                EvacuatedFromAddress = new Address()
                {
                    AddressLine1 = $"{uniqueSignature}-3738 Main St",
                    AddressLine2 = "Suite 3",
                    Community = "9e6adfaf-9f97-ea11-b813-005056830319",
                    StateProvince = "BC",
                    Country = "CAN",
                    PostalCode = "V8V 2W3"
                },
                NeedsAssessment =
                    new NeedsAssessment
                    {
                        Type = NeedsAssessmentType.Preliminary,
                        TakeMedication = false,
                        HaveMedicalSupplies = false,
                        Insurance = InsuranceOption.Yes,
                        HaveSpecialDiet = true,
                        SpecialDietDetails = "Shellfish allergy",
                        HavePetsFood = true,
                        CanProvideClothing = true,
                        CanProvideFood = true,
                        CanProvideIncidentals = true,
                        CanProvideLodging = true,
                        CanProvideTransportation = true,
                        HouseholdMembers = new[]
                        {
                            new HouseholdMember
                            {
                                FirstName = registrant.FirstName,
                                LastName = registrant.LastName,
                                Initials = registrant.Initials,
                                Gender = registrant.Gender,
                                DateOfBirth = registrant.DateOfBirth,
                                IsPrimaryRegistrant = true,
                                LinkedRegistrantId = registrant.Id
                            },
                            new HouseholdMember
                            {
                                FirstName = $"{uniqueSignature}-hm1first",
                                LastName = $"{uniqueSignature}-hm1last",
                                Initials = $"{uniqueSignature}-1",
                                Gender = "X",
                                DateOfBirth = "03/15/2000",
                                IsMinor = false,
                                IsPrimaryRegistrant = false
                            },
                             new HouseholdMember
                            {
                                FirstName = $"{uniqueSignature}-hm2first",
                                LastName = $"{uniqueSignature}-hm2last",
                                Initials = $"{uniqueSignature}-2",
                                Gender = "M",
                                DateOfBirth = "03/16/2010",
                                IsMinor = true,
                                IsPrimaryRegistrant = false
                            }
                        },
                        Pets = new[]
                        {
                            new Pet{ Type = $"{uniqueSignature}_Cat", Quantity = "1" },
                            new Pet{ Type = $"{uniqueSignature}_Dog", Quantity = "4" }
                        },
                        Notes = new[]
                        {
                            new Note{ Type = NoteType.EvacuationImpact, Content = "evac" },
                            new Note{ Type = NoteType.EvacuationExternalReferrals, Content = "refer" },
                            new Note{ Type = NoteType.PetCarePlans, Content = "pat plans" },
                            new Note{ Type = NoteType.RecoveryPlan, Content = "recovery" },
                        }
                    }
            };
            return file;
        }

        public static RegistrantProfile CreateRegistrantProfile(string prefix)
        {
            var uniqueIdentifier = GenerateNewUniqueId(prefix);
            var address = new Address
            {
                AddressLine1 = $"{uniqueIdentifier} st.",
                Community = "9e6adfaf-9f97-ea11-b813-005056830319",
                StateProvince = "BC",
                Country = "CAN",
                PostalCode = "V1V1V1"
            };
            return new RegistrantProfile
            {
                FirstName = $"autotest-dev-{uniqueIdentifier}_first",
                LastName = $"{uniqueIdentifier}_last",
                Email = $"{uniqueIdentifier}eratest@test.gov.bc.ca",
                DateOfBirth = "12/13/2000",
                Gender = "M",
                PrimaryAddress = address,
                MailingAddress = address
            };
        }

        public static IEnumerable<Support> CreateSupports(string prefix, EvacuationFile file)
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
                new LodgingBilletingSupport() { NumberOfNights = RandomInt()},
                new LodgingGroupSupport { NumberOfNights = RandomInt(), FacilityCommunityCode = file.EvacuatedFromAddress.Community },
                new LodgingHotelSupport { NumberOfNights = RandomInt(), NumberOfRooms = RandomInt() },
                new TransportationOtherSupport { TotalAmount = RandomAmount() },
                new TransportationTaxiSupport { FromAddress = "test",ToAddress="test" },
            };

            Func<Support, SupportDelivery> createSupportDelivery = sup =>
                sup switch
                {
                    IncidentalsSupport s => new Interac { NotificationEmail = $"{prefix}-unitest@test.gov.bc.ca", ReceivingRegistrantId = file.PrimaryRegistrantId },
                    ClothingSupport s => new Interac { NotificationEmail = $"{prefix}-unitest@test.gov.bc.ca", ReceivingRegistrantId = file.PrimaryRegistrantId },

                    _ => new Referral { IssuedToPersonName = $"{prefix}-unitest" },
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

        public static async Task<IEnumerable<Support>> CreateSupports(EventsManager manager, EvacuationFile file, string RequestingUserId, string prefix)
        {
            var newSupports = CreateSupports(prefix, file);

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
    }
}
