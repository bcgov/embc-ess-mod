using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Registrants.API;
using EMBC.Registrants.API.EvacuationsModule;
using EMBC.Registrants.API.LocationModule;
using EMBC.Registrants.API.Shared;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.Registrants.API.Evacuations
{
    public class EvacuationTests : WebAppTestBase
    {
        private readonly IEvacuationManager evacuationManager;
        private readonly IListsRepository listsRepository;
        private EvacuationFile baseTestEvacuation;
        private EvacuationFile updatedTestEvacuation;

        // Constants
        const string TestUserId = "CHRIS-TEST";
        const string TestEssFileNumber = "100615";

        public EvacuationTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            evacuationManager = services.GetRequiredService<IEvacuationManager>();
            listsRepository = services.GetRequiredService<IListsRepository>();
            CreateTestEvacuations();
        }

        private void CreateTestEvacuations()
        {
            var newAddress = $"1530 Party Ave.{Guid.NewGuid().ToString().Substring(0, 4)}";

            baseTestEvacuation = new EvacuationFile()
            {
                EssFileNumber = "100615",
                EvacuationFileDate = "2021-03-11",
                EvacuatedFromAddress = new Address()
                {
                    AddressLine1 = "9837 Douglas St",
                    AddressLine2 = "Apt 249",
                    Jurisdiction = new Jurisdiction { Code = "406adfaf-9f97-ea11-b813-005056830319", Name = "Port Edward" },
                    StateProvince = new StateProvince { Code = "BC", Name = "British Columbia" },
                    Country = new Country { Code = "CAN", Name = "Canada" },
                    PostalCode = "V8T 2W1"
                },
                NeedsAssessments = new[]
                {
                    new NeedsAssessment
                    {
                        Type = NeedsAssessment.NeedsAssessmentType.Preliminary,
                        HaveMedication = false,
                        Insurance = NeedsAssessment.InsuranceOption.Yes,
                        HaveSpecialDiet = true,
                        SpecialDietDetails = "Shellfish allergy",
                        HasPetsFood = true,
                        CanEvacueeProvideClothing = true,
                        CanEvacueeProvideFood = true,
                        CanEvacueeProvideIncidentals = true,
                        CanEvacueeProvideLodging = true,
                        CanEvacueeProvideTransportation = true,
                        HouseholdMembers = new[]
                        {
                            new HouseholdMember
                            {
                                Details = new PersonDetails
                                {
                                    FirstName = "EVAC",
                                    LastName = "SEVEN",
                                    PreferredName = "Eva",
                                    Initials = "ES",
                                    Gender = "X",
                                    DateOfBirth = "03/12/2000"
                                },
                                isUnder19 = false
                            },
                            new HouseholdMember
                            {
                                Details = new PersonDetails
                                {
                                    FirstName = "EVAC",
                                    LastName = "SIX",
                                    PreferredName = "",
                                    Initials = "",
                                    Gender = "Male",
                                    DateOfBirth = "09/03/2001"
                                },
                                isUnder19 = false
                            }
                        },
                        Pets = new[]
                        {
                            new Pet{ Type = "Cat", Quantity = "1" }
                        }
                    }
                }
            };

            updatedTestEvacuation = new EvacuationFile()
            {
                EssFileNumber = "100615",
                EvacuationFileDate = "2021-03-11",
                EvacuatedFromAddress = new Address()
                {
                    AddressLine1 = newAddress,
                    AddressLine2 = "Apt 249",
                    Jurisdiction = new Jurisdiction { Code = "406adfaf-9f97-ea11-b813-005056830319", Name = "Port Edward" },
                    StateProvince = new StateProvince { Code = "BC", Name = "British Columbia" },
                    Country = new Country { Code = "CAN", Name = "Canada" },
                    PostalCode = "V8T 2W1"
                },
                NeedsAssessments = new[]
                {
                    new NeedsAssessment
                    {
                        Type = NeedsAssessment.NeedsAssessmentType.Preliminary,
                        HaveMedication = true,
                        Insurance = NeedsAssessment.InsuranceOption.No,
                        HaveSpecialDiet = false,
                        SpecialDietDetails = "",
                        HasPetsFood = false,
                        CanEvacueeProvideClothing = false,
                        CanEvacueeProvideFood = false,
                        CanEvacueeProvideIncidentals = false,
                        CanEvacueeProvideLodging = false,
                        CanEvacueeProvideTransportation = false,
                        HouseholdMembers = new[]
                        {
                            new HouseholdMember
                            {
                                Details = new PersonDetails
                                {
                                    FirstName = "Elvis",
                                    LastName = "Presley",
                                    PreferredName = "The King",
                                    Initials = "EAP",
                                    Gender = "Male",
                                    DateOfBirth = "08/01/1935"
                                },
                                isUnder19 = false
                            },
                            new HouseholdMember
                            {
                                Details = new PersonDetails
                                {
                                    FirstName = "EVAC",
                                    LastName = "SIX",
                                    PreferredName = "",
                                    Initials = "",
                                    Gender = "Male",
                                    DateOfBirth = "09/03/2001"
                                },
                                isUnder19 = false
                            },
                            new HouseholdMember
                            {
                                Details = new PersonDetails
                                {
                                    FirstName = "Tiffany",
                                    LastName = "Aching",
                                    PreferredName = "Tiff",
                                    Initials = "TA",
                                    Gender = "Female",
                                    DateOfBirth = "01/09/2010"
                                },
                                isUnder19 = true
                            }
                        },
                        Pets = new[]
                        {
                            new Pet{ Type = "Cat", Quantity = "1" }
                        }
                    }
                }
            };
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuations()
        {
            var evacuationFiles = await evacuationManager.GetEvacuations(TestUserId);
            evacuationFiles.ShouldNotBeEmpty();

            var evacuationFile = evacuationFiles.First();
            evacuationFile.ShouldNotBeNull();

            // Evacuation
            evacuationFile.EssFileNumber.ShouldNotBeNull().ShouldBe(this.baseTestEvacuation.EssFileNumber);
            evacuationFile.EvacuationFileDate.ShouldNotBeNull().ShouldStartWith(this.baseTestEvacuation.EvacuationFileDate);
            evacuationFile.EvacuatedFromAddress.ShouldNotBeNull();
            evacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.AddressLine1);
            evacuationFile.EvacuatedFromAddress.AddressLine2.ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.AddressLine2);
            evacuationFile.EvacuatedFromAddress.Jurisdiction.ShouldNotBeNull().Name.ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.Jurisdiction.Name);
            evacuationFile.EvacuatedFromAddress.StateProvince.ShouldNotBeNull().Code.ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.StateProvince.Code);
            evacuationFile.EvacuatedFromAddress.Country.ShouldNotBeNull().Code.ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.Country.Code);

            // Needs Assessment
            var needsAssessment = evacuationFile.NeedsAssessments.ShouldHaveSingleItem();
            needsAssessment.Insurance.ShouldBe(NeedsAssessment.InsuranceOption.Yes);
            needsAssessment.CanEvacueeProvideClothing.ShouldBe(true);
            needsAssessment.CanEvacueeProvideFood.ShouldBe(true);
            needsAssessment.CanEvacueeProvideIncidentals.ShouldBe(true);
            needsAssessment.CanEvacueeProvideLodging.ShouldBe(true);
            needsAssessment.CanEvacueeProvideTransportation.ShouldBe(true);
            needsAssessment.HaveMedication.ShouldBe(false);
            needsAssessment.HasPetsFood.ShouldBe(true);
            needsAssessment.HaveSpecialDiet.ShouldBe(true);
            needsAssessment.SpecialDietDetails.ShouldBe(this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().SpecialDietDetails);
            needsAssessment.HouseholdMembers.ShouldNotBeEmpty();

            //Household Members
            var members = needsAssessment.HouseholdMembers.ToArray();
            members.ShouldNotBeEmpty();

            var testDetails = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(0).Details;
            var member = (HouseholdMember)members.GetValue(0);
            member.ShouldNotBeNull();
            member.Details.FirstName.ShouldBe(testDetails.FirstName);
            member.Details.LastName.ShouldBe(testDetails.LastName);
            member.Details.PreferredName.ShouldBe(testDetails.PreferredName);
            member.Details.Initials.ShouldBe(testDetails.Initials);
            member.Details.Gender.ShouldBe(testDetails.Gender);
            member.Details.DateOfBirth.ShouldStartWith(testDetails.DateOfBirth);

            testDetails = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(1).Details;
            member = (HouseholdMember)members.GetValue(1);
            member.ShouldNotBeNull();
            member.Details.FirstName.ShouldBe(testDetails.FirstName);
            member.Details.LastName.ShouldBe(testDetails.LastName);
            member.Details.PreferredName.ShouldBeNullOrEmpty();
            member.Details.Initials.ShouldBeNullOrEmpty();
            member.Details.Gender.ShouldBe(testDetails.Gender);
            member.Details.DateOfBirth.ShouldStartWith(testDetails.DateOfBirth);

            // Pets
            var pet = needsAssessment.Pets.ShouldHaveSingleItem();
            pet.Quantity.ShouldBe(this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().Pets.FirstOrDefault().Quantity);
            pet.Type.ShouldBe(this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().Pets.FirstOrDefault().Type);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateEvacuation()
        {
            var evacuationFile = await evacuationManager.GetEvacuation(TestUserId, TestEssFileNumber);

            /* Step One - Set New Values */
            // Evacuation
            evacuationFile.EvacuatedFromAddress.AddressLine1 = this.updatedTestEvacuation.EvacuatedFromAddress.AddressLine1;

            // Needs Assessment
            var needsAssessment = evacuationFile.NeedsAssessments.ShouldHaveSingleItem();
            needsAssessment.Insurance = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().Insurance;
            needsAssessment.CanEvacueeProvideClothing = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideClothing;
            needsAssessment.CanEvacueeProvideFood = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideFood;
            needsAssessment.CanEvacueeProvideIncidentals = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideIncidentals;
            needsAssessment.CanEvacueeProvideLodging = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideLodging;
            needsAssessment.CanEvacueeProvideTransportation = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideTransportation;
            needsAssessment.HaveMedication = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HaveMedication;
            needsAssessment.HasPetsFood = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HasPetsFood;
            needsAssessment.HaveSpecialDiet = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HaveSpecialDiet;
            needsAssessment.SpecialDietDetails = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().SpecialDietDetails;

            // Household Members
            /* Update Member */
            var members = needsAssessment.HouseholdMembers.ToList();
            members.ShouldNotBeEmpty();

            var testDetails = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(0).Details;
            var memberOne = (HouseholdMember)members.ElementAt(0);
            memberOne.Details.FirstName = testDetails.FirstName;
            memberOne.Details.LastName = testDetails.LastName;
            memberOne.Details.PreferredName = testDetails.PreferredName;
            memberOne.Details.Initials = testDetails.Initials;
            memberOne.Details.Gender = testDetails.Gender;
            memberOne.Details.DateOfBirth = testDetails.DateOfBirth;
            members.RemoveAt(0);
            members.Insert(0, memberOne);

            testDetails = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(2).Details;
            /* Add New Member */
            var newMember = new HouseholdMember()
            {
                Details = new PersonDetails()
                {
                    FirstName = testDetails.FirstName,
                    LastName = testDetails.LastName,
                    PreferredName = testDetails.PreferredName,
                    Initials = testDetails.Initials,
                    Gender = testDetails.Gender,
                    DateOfBirth = testDetails.DateOfBirth
                }
            };
            members.Add(newMember);
            needsAssessment.HouseholdMembers = members;
            var needsAssessments = new List<NeedsAssessment>();
            needsAssessments.Add(needsAssessment);
            evacuationFile.NeedsAssessments = needsAssessments;

            // Pets
            /* TODO: Update Pet */
            /* TODO: Add New Pet */

            var essFileNumber = await evacuationManager.SaveEvacuation(TestUserId, evacuationFile.EssFileNumber, evacuationFile);
            essFileNumber.ShouldBe(TestEssFileNumber);

            var updatedEvacuationFile = await evacuationManager.GetEvacuation(TestUserId, TestEssFileNumber);

            /* Step Two - Check Updated Values */
            // Evacuation
            updatedEvacuationFile.EssFileNumber.ShouldNotBeNull().ShouldBe(this.updatedTestEvacuation.EssFileNumber);
            updatedEvacuationFile.EvacuationFileDate.ShouldNotBeNull().ShouldStartWith(this.updatedTestEvacuation.EvacuationFileDate);
            updatedEvacuationFile.EvacuatedFromAddress.ShouldNotBeNull();
            updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(this.updatedTestEvacuation.EvacuatedFromAddress.AddressLine1);
            updatedEvacuationFile.EvacuatedFromAddress.AddressLine2.ShouldBe(this.updatedTestEvacuation.EvacuatedFromAddress.AddressLine2);
            updatedEvacuationFile.EvacuatedFromAddress.Jurisdiction.ShouldNotBeNull().Name.ShouldBe(this.updatedTestEvacuation.EvacuatedFromAddress.Jurisdiction.Name);
            updatedEvacuationFile.EvacuatedFromAddress.StateProvince.ShouldNotBeNull().Code.ShouldBe(this.updatedTestEvacuation.EvacuatedFromAddress.StateProvince.Code);
            updatedEvacuationFile.EvacuatedFromAddress.Country.ShouldNotBeNull().Code.ShouldBe(this.updatedTestEvacuation.EvacuatedFromAddress.Country.Code);

            // Needs Assessment
            var updatedNeedsAssessment = updatedEvacuationFile.NeedsAssessments.ShouldHaveSingleItem();
            updatedNeedsAssessment.Insurance.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().Insurance);
            updatedNeedsAssessment.CanEvacueeProvideClothing.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideClothing);
            updatedNeedsAssessment.CanEvacueeProvideFood.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideFood);
            updatedNeedsAssessment.CanEvacueeProvideIncidentals.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideIncidentals);
            updatedNeedsAssessment.CanEvacueeProvideLodging.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideLodging);
            updatedNeedsAssessment.CanEvacueeProvideTransportation.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideTransportation);
            updatedNeedsAssessment.HaveMedication.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HaveMedication);
            updatedNeedsAssessment.HasPetsFood.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HasPetsFood);
            updatedNeedsAssessment.HaveSpecialDiet.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HaveSpecialDiet);
            updatedNeedsAssessment.SpecialDietDetails.ShouldBeNullOrEmpty();
            updatedNeedsAssessment.HouseholdMembers.ShouldNotBeEmpty();

            updatedEvacuationFile.NeedsAssessments.First().HouseholdMembers.ShouldNotBeEmpty();

            // Household Members
            var updatedMembers = updatedNeedsAssessment.HouseholdMembers.ToArray();
            updatedMembers.ShouldNotBeEmpty();

            testDetails = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(0).Details;
            var updatedMemberOne = (HouseholdMember)updatedMembers.GetValue(0);
            updatedMemberOne.ShouldNotBeNull();
            updatedMemberOne.isUnder19.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(0).isUnder19);
            updatedMemberOne.Details.FirstName.ShouldBe(testDetails.FirstName);
            updatedMemberOne.Details.LastName.ShouldBe(testDetails.LastName);
            updatedMemberOne.Details.PreferredName.ShouldBe(testDetails.PreferredName);
            updatedMemberOne.Details.Initials.ShouldBe(testDetails.Initials);
            updatedMemberOne.Details.Gender.ShouldBe(testDetails.Gender);
            updatedMemberOne.Details.DateOfBirth.ShouldStartWith(testDetails.DateOfBirth);

            testDetails = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(1).Details;
            var updatedMemberTwo = (HouseholdMember)updatedMembers.GetValue(1);
            updatedMemberTwo.ShouldNotBeNull();
            updatedMemberTwo.isUnder19.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(1).isUnder19);
            updatedMemberTwo.Details.FirstName.ShouldBe(testDetails.FirstName);
            updatedMemberTwo.Details.LastName.ShouldBe(testDetails.LastName);
            updatedMemberTwo.Details.PreferredName.ShouldBeNullOrEmpty();
            updatedMemberTwo.Details.Initials.ShouldBeNullOrEmpty();
            updatedMemberTwo.Details.Gender.ShouldBe(testDetails.Gender);
            updatedMemberTwo.Details.DateOfBirth.ShouldStartWith(testDetails.DateOfBirth);

            testDetails = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(2).Details;
            var addedMember = (HouseholdMember)updatedMembers.GetValue(2);
            addedMember.ShouldNotBeNull();
            addedMember.isUnder19.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(2).isUnder19);
            addedMember.Details.FirstName.ShouldBe(testDetails.FirstName);
            addedMember.Details.LastName.ShouldBe(testDetails.LastName);
            addedMember.Details.PreferredName.ShouldBe(testDetails.PreferredName);
            addedMember.Details.Initials.ShouldBe(testDetails.Initials);
            addedMember.Details.Gender.ShouldBe(testDetails.Gender);
            addedMember.Details.DateOfBirth.ShouldStartWith(testDetails.DateOfBirth);

            // Pets
            var updatedPet = updatedNeedsAssessment.Pets.ShouldHaveSingleItem();
            updatedPet.Quantity.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().Pets.FirstOrDefault().Quantity);
            updatedPet.Type.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().Pets.FirstOrDefault().Type);

            /* Step Three - Reset Previous Values */
            evacuationFile.EvacuatedFromAddress.AddressLine1 = this.baseTestEvacuation.EvacuatedFromAddress.AddressLine1;
            // Needs Assessment
            needsAssessment = evacuationFile.NeedsAssessments.ShouldHaveSingleItem();
            needsAssessment.Insurance = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().Insurance;
            needsAssessment.CanEvacueeProvideClothing = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideClothing;
            needsAssessment.CanEvacueeProvideFood = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideFood;
            needsAssessment.CanEvacueeProvideIncidentals = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideIncidentals;
            needsAssessment.CanEvacueeProvideLodging = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideLodging;
            needsAssessment.CanEvacueeProvideTransportation = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideTransportation;
            needsAssessment.HaveMedication = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HaveMedication;
            needsAssessment.HasPetsFood = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HasPetsFood;
            needsAssessment.HaveSpecialDiet = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HaveSpecialDiet;
            needsAssessment.SpecialDietDetails = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().SpecialDietDetails;

            // Household Members
            /* Reset Member */
            members = needsAssessment.HouseholdMembers.ToList();
            members.ShouldNotBeEmpty();

            testDetails = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(0).Details;
            memberOne = (HouseholdMember)members.ElementAt(0);
            memberOne.Details.FirstName = testDetails.FirstName;
            memberOne.Details.LastName = testDetails.LastName;
            memberOne.Details.PreferredName = testDetails.PreferredName;
            memberOne.Details.Initials = testDetails.Initials;
            memberOne.Details.Gender = testDetails.Gender;
            memberOne.Details.DateOfBirth = testDetails.DateOfBirth;

            /* Remove Member */
            if (members.Count > 2)
            {
                needsAssessment.HouseholdMembers = members.Take(2);
            }

            essFileNumber = await evacuationManager.SaveEvacuation(TestUserId, evacuationFile.EssFileNumber, evacuationFile);
            essFileNumber.ShouldBe(TestEssFileNumber);

            updatedEvacuationFile = await evacuationManager.GetEvacuation(TestUserId, TestEssFileNumber);
            updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.AddressLine1);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateEvacuation()
        {
            var evacuationFile = await evacuationManager.GetEvacuation(TestUserId, TestEssFileNumber);
            evacuationFile.NeedsAssessments.First().HouseholdMembers.ShouldNotBeEmpty();
            var newEssFileNumber = await evacuationManager.SaveEvacuation(TestUserId, null, evacuationFile);

            var createdEvacuationFile = await evacuationManager.GetEvacuation(TestUserId, newEssFileNumber);
            evacuationFile.NeedsAssessments.First().HouseholdMembers.ShouldNotBeEmpty();

            createdEvacuationFile.ShouldNotBeNull();

            await evacuationManager.DeleteEvacuation(TestUserId, newEssFileNumber);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task ResetTestEvacuation()
        {
            var evacuationFile = await evacuationManager.GetEvacuation(TestUserId, TestEssFileNumber);

            /* Reset to Default Values */
            evacuationFile.EvacuatedFromAddress.AddressLine1 = this.baseTestEvacuation.EvacuatedFromAddress.AddressLine1;

            // Needs Assessment
            var needsAssessment = evacuationFile.NeedsAssessments.ShouldHaveSingleItem();
            needsAssessment.Insurance = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().Insurance;
            needsAssessment.CanEvacueeProvideClothing = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideClothing;
            needsAssessment.CanEvacueeProvideFood = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideFood;
            needsAssessment.CanEvacueeProvideIncidentals = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideIncidentals;
            needsAssessment.CanEvacueeProvideLodging = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideLodging;
            needsAssessment.CanEvacueeProvideTransportation = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideTransportation;
            needsAssessment.HaveMedication = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HaveMedication;
            needsAssessment.HasPetsFood = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HasPetsFood;
            needsAssessment.HaveSpecialDiet = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HaveSpecialDiet;
            needsAssessment.SpecialDietDetails = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().SpecialDietDetails;

            // Household Members
            /* Reset Member */
            var members = needsAssessment.HouseholdMembers.ToList();
            members.ShouldNotBeEmpty();

            var testDetails = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(0).Details;
            var memberOne = (HouseholdMember)members.ElementAt(0);
            memberOne.Details.FirstName = testDetails.FirstName;
            memberOne.Details.LastName = testDetails.LastName;
            memberOne.Details.PreferredName = testDetails.PreferredName;
            memberOne.Details.Initials = testDetails.Initials;
            memberOne.Details.Gender = testDetails.Gender;
            memberOne.Details.DateOfBirth = testDetails.DateOfBirth;

            /* Remove Member */
            if (members.Count > 2)
            {
                needsAssessment.HouseholdMembers = members.Take(2);
            }

            var essFileNumber = await evacuationManager.SaveEvacuation(TestUserId, evacuationFile.EssFileNumber, evacuationFile);
            essFileNumber.ShouldBe(TestEssFileNumber);

            var updatedEvacuationFile = await evacuationManager.GetEvacuation(TestUserId, TestEssFileNumber);
            updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.AddressLine1);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuation()
        {
            var evacuationFile = await evacuationManager.GetEvacuation("4PRCSME5JFAAGAV5OPLTZLQXBGDL7XYD", "100707");
        }
    }
}
