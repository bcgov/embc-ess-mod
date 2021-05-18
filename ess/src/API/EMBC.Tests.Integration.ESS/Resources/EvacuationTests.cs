using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Resources.Cases;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class EvacuationTests : WebAppTestBase
    {
        private readonly ICaseRepository caseRepository;
        private EvacuationFile baseTestEvacuation;
        private EvacuationFile updatedTestEvacuation;

        // Constants
        private const string TestUserId = "CHRIS-TEST";

        private const string TestEssFileNumber = "100487";

        public EvacuationTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            caseRepository = services.GetRequiredService<ICaseRepository>();
            CreateTestEvacuations();
        }

        private void CreateTestEvacuations()
        {
            var newAddress = $"1530 Party Ave.{Guid.NewGuid().ToString().Substring(0, 4)}";

            baseTestEvacuation = new EvacuationFile()
            {
                Id = "100487",
                //EvacuationDate = "2021-03-11",
                EvacuatedFromAddress = new EvacuationAddress()
                {
                    AddressLine1 = "3738 Main St",
                    AddressLine2 = "Suite 3",
                    Community = "9e6adfaf-9f97-ea11-b813-005056830319",
                    StateProvince = "BC",
                    Country = "CAN",
                    PostalCode = "V8V 2W3"
                },
                NeedsAssessments = new[]
                {
                    new NeedsAssessment
                    {
                        Type = NeedsAssessmentType.Preliminary,
                        HaveMedication = false,
                        Insurance = InsuranceOption.Yes,
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
                                FirstName = "EVAC",
                                LastName = "SEVEN",
                                PreferredName = "Eva",
                                Initials = "ES",
                                Gender = "X",
                                DateOfBirth = "2000-03-12",
                                isUnder19 = false
                            },
                            new HouseholdMember
                            {
                                FirstName = "Johnny",
                                LastName = "SEVEN",
                                PreferredName = "",
                                Initials = "",
                                Gender = "Male",
                                DateOfBirth = "2001-09-03",
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
                Id = "100487",
                //EvacuationDate = "2021-03-11",
                EvacuatedFromAddress = new EvacuationAddress()
                {
                    AddressLine1 = newAddress,
                    AddressLine2 = "Apt 249",
                    Community = "406adfaf-9f97-ea11-b813-005056830319",
                    StateProvince = "BC",
                    Country = "CAN",
                    PostalCode = "V8T 2W1"
                },
                NeedsAssessments = new[]
                {
                    new NeedsAssessment
                    {
                        Type = NeedsAssessmentType.Preliminary,
                        HaveMedication = true,
                        Insurance = InsuranceOption.No,
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
                                FirstName = "Elvis",
                                LastName = "Presley",
                                PreferredName = "The King",
                                Initials = "EAP",
                                Gender = "Male",
                                DateOfBirth = "1935-01-08",
                                isUnder19 = false
                            },
                            new HouseholdMember
                            {
                                FirstName = "EVAC",
                                LastName = "SIX",
                                PreferredName = "",
                                Initials = "",
                                Gender = "Male",
                                DateOfBirth = "2001-09-03",
                                isUnder19 = false
                            },
                            new HouseholdMember
                            {
                                FirstName = "Tiffany",
                                LastName = "Aching",
                                PreferredName = "Tiff",
                                Initials = "TA",
                                Gender = "Female",
                                DateOfBirth = "2010-09-01",
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

        //[Fact(Skip = RequiresDynamics)]
        //public async Task CanGetEvacuations()
        //{
        //    var caseQuery = new EvacuationFilesQuery
        //    {
        //        UserId = TestUserId
        //    };
        //    var queryResult = await caseRepository.QueryCase(caseQuery);

        //    queryResult.Items.ShouldNotBeEmpty();

        //    var evacuationFile = (EvacuationFile)queryResult.Items.Where(f => f.Id == this.baseTestEvacuation.Id).FirstOrDefault();
        //    evacuationFile.ShouldNotBeNull();

        //    // Evacuation
        //    evacuationFile.Id.ShouldNotBeNull().ShouldBe(this.baseTestEvacuation.Id);
        //    // evacuationFile.EvacuationDate.ShouldStartWith(this.baseTestEvacuation.EvacuationDate);
        //    evacuationFile.EvacuatedFromAddress.ShouldNotBeNull();
        //    evacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.AddressLine1);
        //    evacuationFile.EvacuatedFromAddress.AddressLine2.ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.AddressLine2);
        //    evacuationFile.EvacuatedFromAddress.StateProvince.ShouldNotBeNull().ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.StateProvince);
        //    evacuationFile.EvacuatedFromAddress.Country.ShouldNotBeNull().ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.Country);

        //    // Needs Assessment
        //    var needsAssessment = evacuationFile.NeedsAssessments.ShouldHaveSingleItem();
        //    needsAssessment.Insurance.ShouldBe(InsuranceOption.Yes);
        //    needsAssessment.CanEvacueeProvideClothing.ShouldBe(true);
        //    needsAssessment.CanEvacueeProvideFood.ShouldBe(true);
        //    needsAssessment.CanEvacueeProvideIncidentals.ShouldBe(true);
        //    needsAssessment.CanEvacueeProvideLodging.ShouldBe(true);
        //    needsAssessment.CanEvacueeProvideTransportation.ShouldBe(true);
        //    needsAssessment.HaveMedication.ShouldBe(false);
        //    needsAssessment.HasPetsFood.ShouldBe(true);
        //    needsAssessment.HaveSpecialDiet.ShouldBe(true);
        //    needsAssessment.SpecialDietDetails.ShouldBe(this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().SpecialDietDetails);
        //    needsAssessment.HouseholdMembers.ShouldNotBeEmpty();

        //    //Household Members
        //    var members = needsAssessment.HouseholdMembers.ToArray();
        //    members.ShouldNotBeEmpty();

        //    var testDetails = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(0);
        //    var member = (HouseholdMember)members.GetValue(0);
        //    member.ShouldNotBeNull();
        //    member.FirstName.ShouldBe(testDetails.FirstName);
        //    member.LastName.ShouldBe(testDetails.LastName);
        //    member.PreferredName.ShouldBe(testDetails.PreferredName);
        //    member.Initials.ShouldBe(testDetails.Initials);
        //    member.Gender.ShouldBe(testDetails.Gender);
        //    member.DateOfBirth.ShouldStartWith(testDetails.DateOfBirth);

        //    testDetails = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(1);
        //    member = (HouseholdMember)members.GetValue(1);
        //    member.ShouldNotBeNull();
        //    member.FirstName.ShouldBe(testDetails.FirstName);
        //    member.LastName.ShouldBe(testDetails.LastName);
        //    member.PreferredName.ShouldBeNullOrEmpty();
        //    member.Initials.ShouldBeNullOrEmpty();
        //    member.Gender.ShouldBe(testDetails.Gender);
        //    member.DateOfBirth.ShouldStartWith(testDetails.DateOfBirth);

        //    // Pets
        //    var pet = needsAssessment.Pets.ShouldHaveSingleItem();
        //    pet.Quantity.ShouldBe(this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().Pets.FirstOrDefault().Quantity);
        //    pet.Type.ShouldBe(this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().Pets.FirstOrDefault().Type);
        //}

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuation()
        {
            var caseQuery = new EvacuationFilesQuery
            {
                PrimaryRegistrantId = TestUserId,
                FileId = TestEssFileNumber
            };
            var queryResult = await caseRepository.QueryCase(caseQuery);
            queryResult.Items.ShouldNotBeEmpty();
            queryResult.Items.FirstOrDefault().ShouldNotBeNull();

            var evacuationFile = (EvacuationFile)queryResult.Items.Where(f => f.Id == TestEssFileNumber).FirstOrDefault();
            evacuationFile.ShouldNotBeNull();
        }

        //[Fact(Skip = RequiresDynamics)]
        //public async Task CanUpdateEvacuation()
        //{
        //    var caseQuery = new EvacuationFilesQuery
        //    {
        //        UserId = TestUserId,
        //        FileId = TestEssFileNumber
        //    };
        //    var queryResult = await caseRepository.QueryCase(caseQuery);
        //    var evacuationFile = (EvacuationFile)queryResult.Items.LastOrDefault();

        //    /* Step One - Set New Values */
        //    // Evacuation
        //    evacuationFile.EvacuatedFromAddress.AddressLine1 = this.updatedTestEvacuation.EvacuatedFromAddress.AddressLine1;
        //    evacuationFile.EvacuatedFromAddress.AddressLine2 = this.updatedTestEvacuation.EvacuatedFromAddress.AddressLine2;
        //    evacuationFile.EvacuatedFromAddress.StateProvince = this.updatedTestEvacuation.EvacuatedFromAddress.StateProvince;
        //    evacuationFile.EvacuatedFromAddress.Country = this.updatedTestEvacuation.EvacuatedFromAddress.Country;

        //    // Needs Assessment
        //    var needsAssessment = evacuationFile.NeedsAssessments.ShouldHaveSingleItem();
        //    needsAssessment.Insurance = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().Insurance;
        //    needsAssessment.CanEvacueeProvideClothing = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideClothing;
        //    needsAssessment.CanEvacueeProvideFood = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideFood;
        //    needsAssessment.CanEvacueeProvideIncidentals = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideIncidentals;
        //    needsAssessment.CanEvacueeProvideLodging = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideLodging;
        //    needsAssessment.CanEvacueeProvideTransportation = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideTransportation;
        //    needsAssessment.HaveMedication = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HaveMedication;
        //    needsAssessment.HasPetsFood = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HasPetsFood;
        //    needsAssessment.HaveSpecialDiet = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HaveSpecialDiet;
        //    needsAssessment.SpecialDietDetails = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().SpecialDietDetails;

        //    // Household Members
        //    /* Update Member */
        //    var members = needsAssessment.HouseholdMembers.ToList();
        //    members.ShouldNotBeEmpty();

        //    var testDetails = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(0);
        //    var memberOne = (HouseholdMember)members.ElementAt(0);
        //    memberOne.FirstName = testDetails.FirstName;
        //    memberOne.LastName = testDetails.LastName;
        //    memberOne.PreferredName = testDetails.PreferredName;
        //    memberOne.Initials = testDetails.Initials;
        //    memberOne.Gender = testDetails.Gender;
        //    memberOne.DateOfBirth = testDetails.DateOfBirth;
        //    members.RemoveAt(0);
        //    members.Insert(0, memberOne);

        //    testDetails = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(2);
        //    /* Add New Member */
        //    var newMember = new HouseholdMember()
        //    {
        //        FirstName = testDetails.FirstName,
        //        LastName = testDetails.LastName,
        //        PreferredName = testDetails.PreferredName,
        //        Initials = testDetails.Initials,
        //        Gender = testDetails.Gender,
        //        DateOfBirth = testDetails.DateOfBirth
        //    };
        //    members.Add(newMember);
        //    needsAssessment.HouseholdMembers = members;
        //    var needsAssessments = new List<NeedsAssessment>();
        //    needsAssessments.Add(needsAssessment);
        //    evacuationFile.NeedsAssessments = needsAssessments;

        //    // Pets
        //    /* TODO: Update Pet */
        //    /* TODO: Add New Pet */

        //    /* Update evacuation */
        //    SaveEvacuationFile saveEvacuationCmd = new SaveEvacuationFile
        //    {
        //        EvacuationFile = evacuationFile
        //    };
        //    var saveResult = await caseRepository.ManageCase(saveEvacuationCmd);

        //    var essFileNumber = saveResult.CaseId;
        //    essFileNumber.ShouldBe(TestEssFileNumber);

        //    /* Get updated evacuation */
        //    queryResult = await caseRepository.QueryCase(caseQuery);
        //    var updatedEvacuationFile = (EvacuationFile)queryResult.Items.LastOrDefault();

        //    /* Step Two - Check Updated Values */
        //    // Evacuation
        //    //updatedEvacuationFile.EssFileNumber.ShouldNotBeNull().ShouldBe(this.updatedTestEvacuation.EssFileNumber);
        //    //updatedEvacuationFile.EvacuationFileDate.ShouldNotBeNull().ShouldStartWith(this.updatedTestEvacuation.EvacuationFileDate);
        //    updatedEvacuationFile.EvacuatedFromAddress.ShouldNotBeNull();
        //    updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(this.updatedTestEvacuation.EvacuatedFromAddress.AddressLine1);
        //    updatedEvacuationFile.EvacuatedFromAddress.AddressLine2.ShouldBe(this.updatedTestEvacuation.EvacuatedFromAddress.AddressLine2);
        //    updatedEvacuationFile.EvacuatedFromAddress.StateProvince.ShouldNotBeNull().ShouldBe(this.updatedTestEvacuation.EvacuatedFromAddress.StateProvince);
        //    updatedEvacuationFile.EvacuatedFromAddress.Country.ShouldNotBeNull().ShouldBe(this.updatedTestEvacuation.EvacuatedFromAddress.Country);

        //    // Needs Assessment
        //    var updatedNeedsAssessment = updatedEvacuationFile.NeedsAssessments.ShouldHaveSingleItem();
        //    updatedNeedsAssessment.Insurance.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().Insurance);
        //    updatedNeedsAssessment.CanEvacueeProvideClothing.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideClothing);
        //    updatedNeedsAssessment.CanEvacueeProvideFood.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideFood);
        //    updatedNeedsAssessment.CanEvacueeProvideIncidentals.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideIncidentals);
        //    updatedNeedsAssessment.CanEvacueeProvideLodging.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideLodging);
        //    updatedNeedsAssessment.CanEvacueeProvideTransportation.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideTransportation);
        //    updatedNeedsAssessment.HaveMedication.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HaveMedication);
        //    updatedNeedsAssessment.HasPetsFood.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HasPetsFood);
        //    updatedNeedsAssessment.HaveSpecialDiet.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HaveSpecialDiet);
        //    updatedNeedsAssessment.SpecialDietDetails.ShouldBeNullOrEmpty();
        //    updatedNeedsAssessment.HouseholdMembers.ShouldNotBeEmpty();

        //    updatedEvacuationFile.NeedsAssessments.First().HouseholdMembers.ShouldNotBeEmpty();

        //    // Household Members
        //    var updatedMembers = updatedNeedsAssessment.HouseholdMembers.ToArray();
        //    updatedMembers.ShouldNotBeEmpty();

        //    testDetails = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(0);
        //    var updatedMemberOne = (HouseholdMember)updatedMembers.GetValue(0);
        //    updatedMemberOne.ShouldNotBeNull();
        //    updatedMemberOne.isUnder19.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(0).isUnder19);
        //    updatedMemberOne.FirstName.ShouldBe(testDetails.FirstName);
        //    updatedMemberOne.LastName.ShouldBe(testDetails.LastName);
        //    updatedMemberOne.PreferredName.ShouldBe(testDetails.PreferredName);
        //    updatedMemberOne.Initials.ShouldBe(testDetails.Initials);
        //    updatedMemberOne.Gender.ShouldBe(testDetails.Gender);
        //    updatedMemberOne.DateOfBirth.ShouldStartWith(testDetails.DateOfBirth);

        //    testDetails = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(1);
        //    var updatedMemberTwo = (HouseholdMember)updatedMembers.GetValue(1);
        //    updatedMemberTwo.ShouldNotBeNull();
        //    updatedMemberTwo.isUnder19.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(1).isUnder19);
        //    updatedMemberTwo.FirstName.ShouldBe(testDetails.FirstName);
        //    updatedMemberTwo.LastName.ShouldBe(testDetails.LastName);
        //    updatedMemberTwo.PreferredName.ShouldBeNullOrEmpty();
        //    updatedMemberTwo.Initials.ShouldBeNullOrEmpty();
        //    updatedMemberTwo.Gender.ShouldBe(testDetails.Gender);
        //    updatedMemberTwo.DateOfBirth.ShouldStartWith(testDetails.DateOfBirth);

        //    testDetails = this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(2);
        //    var addedMember = (HouseholdMember)updatedMembers.GetValue(2);
        //    addedMember.ShouldNotBeNull();
        //    addedMember.isUnder19.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(2).isUnder19);
        //    addedMember.FirstName.ShouldBe(testDetails.FirstName);
        //    addedMember.LastName.ShouldBe(testDetails.LastName);
        //    addedMember.PreferredName.ShouldBe(testDetails.PreferredName);
        //    addedMember.Initials.ShouldBe(testDetails.Initials);
        //    addedMember.Gender.ShouldBe(testDetails.Gender);
        //    addedMember.DateOfBirth.ShouldStartWith(testDetails.DateOfBirth);

        //    // Pets
        //    var updatedPet = updatedNeedsAssessment.Pets.ShouldHaveSingleItem();
        //    updatedPet.Quantity.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().Pets.FirstOrDefault().Quantity);
        //    updatedPet.Type.ShouldBe(this.updatedTestEvacuation.NeedsAssessments.FirstOrDefault().Pets.FirstOrDefault().Type);

        //    /* Step Three - Reset Previous Values */
        //    evacuationFile.EvacuatedFromAddress.AddressLine1 = this.baseTestEvacuation.EvacuatedFromAddress.AddressLine1;
        //    evacuationFile.EvacuatedFromAddress.AddressLine2 = this.baseTestEvacuation.EvacuatedFromAddress.AddressLine2;
        //    evacuationFile.EvacuatedFromAddress.StateProvince = this.baseTestEvacuation.EvacuatedFromAddress.StateProvince;
        //    evacuationFile.EvacuatedFromAddress.Country = this.baseTestEvacuation.EvacuatedFromAddress.Country;

        //    // Needs Assessment
        //    needsAssessment = evacuationFile.NeedsAssessments.ShouldHaveSingleItem();
        //    needsAssessment.Insurance = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().Insurance;
        //    needsAssessment.CanEvacueeProvideClothing = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideClothing;
        //    needsAssessment.CanEvacueeProvideFood = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideFood;
        //    needsAssessment.CanEvacueeProvideIncidentals = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideIncidentals;
        //    needsAssessment.CanEvacueeProvideLodging = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideLodging;
        //    needsAssessment.CanEvacueeProvideTransportation = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().CanEvacueeProvideTransportation;
        //    needsAssessment.HaveMedication = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HaveMedication;
        //    needsAssessment.HasPetsFood = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HasPetsFood;
        //    needsAssessment.HaveSpecialDiet = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HaveSpecialDiet;
        //    needsAssessment.SpecialDietDetails = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().SpecialDietDetails;

        //    // Household Members
        //    /* Reset Member */
        //    members = needsAssessment.HouseholdMembers.ToList();
        //    members.ShouldNotBeEmpty();

        //    testDetails = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(0);
        //    memberOne = (HouseholdMember)members.ElementAt(0);
        //    memberOne.FirstName = testDetails.FirstName;
        //    memberOne.LastName = testDetails.LastName;
        //    memberOne.PreferredName = testDetails.PreferredName;
        //    memberOne.Initials = testDetails.Initials;
        //    memberOne.Gender = testDetails.Gender;
        //    memberOne.DateOfBirth = testDetails.DateOfBirth;

        //    /* Remove Member */
        //    if (members.Count > 2)
        //    {
        //        needsAssessment.HouseholdMembers = members.Take(2);
        //    }

        //    SaveEvacuationFile resetEvacuationCmd = new SaveEvacuationFile
        //    {
        //        EvacuationFile = evacuationFile
        //    };
        //    var resetResult = await caseRepository.ManageCase(resetEvacuationCmd);

        //    essFileNumber = resetResult.CaseId;
        //    essFileNumber.ShouldBe(TestEssFileNumber);

        //    queryResult = await caseRepository.QueryCase(caseQuery);
        //    updatedEvacuationFile = (EvacuationFile)queryResult.Items.LastOrDefault();
        //    updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.AddressLine1);
        //}

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateEvacuation()
        {
            /* Get existing evacuation */
            var caseQuery = new EvacuationFilesQuery
            {
                PrimaryRegistrantId = TestUserId,
                FileId = TestEssFileNumber
            };
            var queryResult = await caseRepository.QueryCase(caseQuery);
            var evacuationFile = (EvacuationFile)queryResult.Items.LastOrDefault();

            /* remove the ID to create a new evacuation. */
            evacuationFile.Id = null;

            /* Create new evacuation */
            SaveEvacuationFile saveEvacuationCmd = new SaveEvacuationFile
            {
                EvacuationFile = evacuationFile
            };
            var saveResult = await caseRepository.ManageCase(saveEvacuationCmd);
            var newEssFileNumber = saveResult.CaseId;

            /* Get created evacuation. */
            var createdCaseQuery = new EvacuationFilesQuery
            {
                PrimaryRegistrantId = TestUserId,
                FileId = newEssFileNumber
            };
            var createdQueryResult = await caseRepository.QueryCase(createdCaseQuery);
            var createdEvacuationFile = (EvacuationFile)createdQueryResult.Items.LastOrDefault();

            createdEvacuationFile.ShouldNotBeNull();

            /* Delete new evacuation */
            DeleteEvacuationFile deleteEvacuationCmd = new DeleteEvacuationFile
            {
                Id = newEssFileNumber
            };
            var deleteResult = await caseRepository.ManageCase(deleteEvacuationCmd);
            var deletedEssFileNumber = deleteResult.CaseId;

            /* Get deleted evacuation */
            var deletedCaseQuery = new EvacuationFilesQuery
            {
                PrimaryRegistrantId = TestUserId,
                FileId = deletedEssFileNumber
            };
            var deletedQueryResult = await caseRepository.QueryCase(deletedCaseQuery);
            var deletedEvacuationFile = (EvacuationFile)deletedQueryResult.Items.LastOrDefault();
            deletedEvacuationFile.ShouldBeNull();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task ResetTestEvacuation()
        {
            /* Get existing evacuation */
            var caseQuery = new EvacuationFilesQuery
            {
                PrimaryRegistrantId = TestUserId,
                FileId = TestEssFileNumber
            };
            var queryResult = await caseRepository.QueryCase(caseQuery);
            var evacuationFile = (EvacuationFile)queryResult.Items.LastOrDefault();

            // Reset to Default Values
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
            // Reset Member
            var members = needsAssessment.HouseholdMembers.ToList();
            members.ShouldNotBeEmpty();

            var testDetails = this.baseTestEvacuation.NeedsAssessments.FirstOrDefault().HouseholdMembers.ElementAt(0);
            var memberOne = (HouseholdMember)members.ElementAt(0);
            memberOne.FirstName = testDetails.FirstName;
            memberOne.LastName = testDetails.LastName;
            memberOne.PreferredName = testDetails.PreferredName;
            memberOne.Initials = testDetails.Initials;
            memberOne.Gender = testDetails.Gender;
            memberOne.DateOfBirth = testDetails.DateOfBirth;

            // Remove Member
            if (members.Count > 2)
            {
                needsAssessment.HouseholdMembers = members.Take(2);
            }

            /* Update evacuation */
            SaveEvacuationFile saveEvacuationCmd = new SaveEvacuationFile
            {
                EvacuationFile = evacuationFile
            };
            var saveResult = await caseRepository.ManageCase(saveEvacuationCmd);

            var essFileNumber = saveResult.CaseId;
            essFileNumber.ShouldBe(TestEssFileNumber);

            /* Get updated evacuation */
            var updatedQueryResult = await caseRepository.QueryCase(caseQuery);
            var updatedEvacuationFile = (EvacuationFile)queryResult.Items.LastOrDefault();
            updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(this.baseTestEvacuation.EvacuatedFromAddress.AddressLine1);
        }    
    }
}
