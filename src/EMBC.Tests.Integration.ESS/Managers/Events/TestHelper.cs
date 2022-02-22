﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts.Events;

namespace EMBC.Tests.Integration.ESS.Managers.Events
{
    public static class TestHelper
    {
        public static EvacuationFile CreateNewTestEvacuationFile(RegistrantProfile registrant)
        {
            var uniqueSignature = Guid.NewGuid().ToString().Substring(0, 4);
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
                                IsUnder19 = false,
                                IsPrimaryRegistrant = false
                            },
                             new HouseholdMember
                            {
                                FirstName = $"{uniqueSignature}-hm2first",
                                LastName = $"{uniqueSignature}-hm2last",
                                Initials = $"{uniqueSignature}-2",
                                Gender = "M",
                                DateOfBirth = "03/16/2010",
                                IsUnder19 = true,
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

        public static RegistrantProfile CreateRegistrantProfile(string uniqueIdentifier)
        {
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
                FirstName = $"{uniqueIdentifier}_first",
                LastName = $"{uniqueIdentifier}_last",
                Email = $"{uniqueIdentifier}@test.na",
                DateOfBirth = "12/13/2000",
                Gender = "M",
                PrimaryAddress = address,
                MailingAddress = address
            };
        }

        public static async Task<RegistrantProfile?> GetRegistrantByUserId(EventsManager manager, string userId) =>
            (await manager.Handle(new RegistrantsQuery { UserId = userId })).Items.SingleOrDefault();

        public static async Task<IEnumerable<EvacuationFile>> GetEvacuationFileById(EventsManager manager, string fileId) =>
            (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items;

        public static async Task<string> SaveRegistrant(EventsManager manager, RegistrantProfile registrantProfile) =>
            await manager.Handle(new SaveRegistrantCommand { Profile = registrantProfile });
    }
}
