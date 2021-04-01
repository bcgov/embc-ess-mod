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

        // Constants
        const string TestUserId = "CHRIS-TEST";

        // Evacuation Constants
        const string TestEssFileNumber = "100615";
        const string TestEvacuatationFileDate = "2021-03-11";
        const string TestEvacuatedAddressLine1 = "9837 Douglas St";
        const string TestEvacuatedAddressLine2 = "Apt 249";
        const string TestEvacuatedAddressJurisdiction = "Port Edward";
        const string TestEvacuatedAddressStateProvince = "BC";
        const string TestEvacuatedAddressCountry = "CAN";

        // Needs Assessment Constants
        const string TestSpecialDietDetails = "Shellfish allergy";

        // Member Constants
        const string TestMemberOneFirstName = "EVAC";
        const string TestMemberOneLastName = "SEVEN";
        const string TestMemberOnePreferredName = "Eva";
        const string TestMemberOneInitials = "ES";
        const string TestMemberOneGender = "X";
        const string TestMemberOneDateOfBirth = "03/12/2000";

        const string TestMemberTwoFirstName = "EVAC";
        const string TestMemberTwoLastName = "SIX";
        const string TestMemberTwoPreferredName = "";
        const string TestMemberTwoInitials = "";
        const string TestMemberTwoGender = "Male";
        const string TestMemberTwoDateOfBirth = "09/03/2001";

        const string TestMemberThreeFirstName = "Tiffany";
        const string TestMemberThreeLastName = "Aching";
        const string TestMemberThreePreferredName = "Tiff";
        const string TestMemberThreeInitials = "TA";
        const string TestMemberThreeGender = "Female";
        const string TestMemberThreeDateOfBirth = "01/09/2010";

        const string TestFirstName = "Elvis";
        const string TestLastName = "Presley";
        const string TestPreferredName = "The King";
        const string TestInitials = "EAP";
        const string TestGender = "Male";
        const string TestDateOfBirth = "08/01/1935";

        // Pet Constants
        const string TestPetOneType = "Cat";
        const string TestPetOneQuantity = "1";

        const string TestPetTwoType = "Parakeet";
        const string TestPetTwoQuantity = "5";

        public EvacuationTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            evacuationManager = services.GetRequiredService<IEvacuationManager>();
            listsRepository = services.GetRequiredService<IListsRepository>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuations()
        {
            var evacuationFiles = await evacuationManager.GetEvacuations(TestUserId);
            evacuationFiles.ShouldNotBeEmpty();

            var evacuationFile = evacuationFiles.First();
            evacuationFile.ShouldNotBeNull();

            // Evacuation
            evacuationFile.EssFileNumber.ShouldNotBeNull().ShouldBe(TestEssFileNumber);
            evacuationFile.EvacuationFileDate.ShouldNotBeNull().ShouldStartWith(TestEvacuatationFileDate);
            evacuationFile.EvacuatedFromAddress.ShouldNotBeNull();
            evacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(TestEvacuatedAddressLine1);
            evacuationFile.EvacuatedFromAddress.AddressLine2.ShouldBe(TestEvacuatedAddressLine2);
            evacuationFile.EvacuatedFromAddress.Jurisdiction.ShouldNotBeNull().Name.ShouldBe(TestEvacuatedAddressJurisdiction);
            evacuationFile.EvacuatedFromAddress.StateProvince.ShouldNotBeNull().Code.ShouldBe(TestEvacuatedAddressStateProvince);
            evacuationFile.EvacuatedFromAddress.Country.ShouldNotBeNull().Code.ShouldBe(TestEvacuatedAddressCountry);

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
            needsAssessment.SpecialDietDetails.ShouldBe(TestSpecialDietDetails);
            needsAssessment.HouseholdMembers.ShouldNotBeEmpty();

            //Household Members
            var members = needsAssessment.HouseholdMembers.ToArray();
            members.ShouldNotBeEmpty();

            var member = (HouseholdMember)members.GetValue(0);
            member.ShouldNotBeNull();
            member.Details.FirstName.ShouldBe(TestMemberOneFirstName);
            member.Details.LastName.ShouldBe(TestMemberOneLastName);
            member.Details.PreferredName.ShouldBe(TestMemberOnePreferredName);
            member.Details.Initials.ShouldBe(TestMemberOneInitials);
            member.Details.Gender.ShouldBe(TestMemberOneGender);
            member.Details.DateOfBirth.ShouldStartWith(TestMemberOneDateOfBirth);

            member = (HouseholdMember)members.GetValue(1);
            member.ShouldNotBeNull();
            member.Details.FirstName.ShouldBe(TestMemberTwoFirstName);
            member.Details.LastName.ShouldBe(TestMemberTwoLastName);
            member.Details.PreferredName.ShouldBeNullOrEmpty();
            member.Details.Initials.ShouldBeNullOrEmpty();
            member.Details.Gender.ShouldBe(TestMemberTwoGender);
            member.Details.DateOfBirth.ShouldStartWith(TestMemberTwoDateOfBirth);

            // Pets
            var pet = needsAssessment.Pets.ShouldHaveSingleItem();
            pet.Quantity.ShouldBe(TestPetOneQuantity);
            pet.Type.ShouldBe(TestPetOneType);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateEvacuation()
        {
            var evacuationFile = await evacuationManager.GetEvacuation(TestUserId, TestEssFileNumber);
            var newAddress = $"1530 Party Ave.{Guid.NewGuid().ToString().Substring(0, 4)}";

            /* Step One - Set New Values */
            // Evacuation
            evacuationFile.EvacuatedFromAddress.AddressLine1 = newAddress;

            // Needs Assessment
            var needsAssessment = evacuationFile.NeedsAssessments.ShouldHaveSingleItem();
            needsAssessment.Insurance = NeedsAssessment.InsuranceOption.No;
            needsAssessment.CanEvacueeProvideClothing = false;
            needsAssessment.CanEvacueeProvideFood = false;
            needsAssessment.CanEvacueeProvideIncidentals = false;
            needsAssessment.CanEvacueeProvideLodging = false;
            needsAssessment.CanEvacueeProvideTransportation = false;
            needsAssessment.HaveMedication = true;
            needsAssessment.HasPetsFood = false;
            needsAssessment.HaveSpecialDiet = false;
            needsAssessment.SpecialDietDetails = string.Empty;

            // Household Members
            /* Update Member */
            var members = needsAssessment.HouseholdMembers.ToList();
            members.ShouldNotBeEmpty();

            var memberOne = (HouseholdMember)members.ElementAt(0);
            memberOne.Details.FirstName = TestFirstName;
            memberOne.Details.LastName = TestLastName;
            memberOne.Details.PreferredName = TestPreferredName;
            memberOne.Details.Initials = TestInitials;
            memberOne.Details.Gender = TestGender;
            memberOne.Details.DateOfBirth = TestDateOfBirth;
            members.RemoveAt(0);
            members.Insert(0, memberOne);

            /* Add New Member */
            var newMember = new HouseholdMember()
            {
                Details = new PersonDetails()
                {
                    FirstName = TestMemberThreeFirstName,
                    LastName = TestMemberThreeLastName,
                    PreferredName = TestMemberThreePreferredName,
                    Initials = TestMemberThreeInitials,
                    Gender = TestMemberThreeGender,
                    DateOfBirth = TestMemberThreeDateOfBirth
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
            updatedEvacuationFile.EssFileNumber.ShouldNotBeNull().ShouldBe(TestEssFileNumber);
            updatedEvacuationFile.EvacuationFileDate.ShouldNotBeNull().ShouldStartWith(TestEvacuatationFileDate);
            updatedEvacuationFile.EvacuatedFromAddress.ShouldNotBeNull();
            updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(newAddress);
            updatedEvacuationFile.EvacuatedFromAddress.AddressLine2.ShouldBe(TestEvacuatedAddressLine2);
            updatedEvacuationFile.EvacuatedFromAddress.Jurisdiction.ShouldNotBeNull().Name.ShouldBe(TestEvacuatedAddressJurisdiction);
            updatedEvacuationFile.EvacuatedFromAddress.StateProvince.ShouldNotBeNull().Code.ShouldBe(TestEvacuatedAddressStateProvince);
            updatedEvacuationFile.EvacuatedFromAddress.Country.ShouldNotBeNull().Code.ShouldBe(TestEvacuatedAddressCountry);

            // Needs Assessment
            var updatedNeedsAssessment = updatedEvacuationFile.NeedsAssessments.ShouldHaveSingleItem();
            updatedNeedsAssessment.Insurance.ShouldBe(NeedsAssessment.InsuranceOption.No);
            updatedNeedsAssessment.CanEvacueeProvideClothing.ShouldBe(false);
            updatedNeedsAssessment.CanEvacueeProvideFood.ShouldBe(false);
            updatedNeedsAssessment.CanEvacueeProvideIncidentals.ShouldBe(false);
            updatedNeedsAssessment.CanEvacueeProvideLodging.ShouldBe(false);
            updatedNeedsAssessment.CanEvacueeProvideTransportation.ShouldBe(false);
            updatedNeedsAssessment.HaveMedication.ShouldBe(true);
            updatedNeedsAssessment.HasPetsFood.ShouldBe(false);
            updatedNeedsAssessment.HaveSpecialDiet.ShouldBe(false);
            updatedNeedsAssessment.SpecialDietDetails.ShouldBeNullOrEmpty();
            updatedNeedsAssessment.HouseholdMembers.ShouldNotBeEmpty();

            updatedEvacuationFile.NeedsAssessments.First().HouseholdMembers.ShouldNotBeEmpty();

            // Household Members
            var updatedMembers = updatedNeedsAssessment.HouseholdMembers.ToArray();
            updatedMembers.ShouldNotBeEmpty();

            var updatedMemberOne = (HouseholdMember)updatedMembers.GetValue(0);
            updatedMemberOne.ShouldNotBeNull();
            updatedMemberOne.isUnder19.ShouldBeFalse();
            updatedMemberOne.Details.FirstName.ShouldBe(TestFirstName);
            updatedMemberOne.Details.LastName.ShouldBe(TestLastName);
            updatedMemberOne.Details.PreferredName.ShouldBe(TestPreferredName);
            updatedMemberOne.Details.Initials.ShouldBe(TestInitials);
            updatedMemberOne.Details.Gender.ShouldBe(TestGender);
            updatedMemberOne.Details.DateOfBirth.ShouldStartWith(TestDateOfBirth);

            var updatedMemberTwo = (HouseholdMember)updatedMembers.GetValue(1);
            updatedMemberTwo.ShouldNotBeNull();
            updatedMemberTwo.isUnder19.ShouldBeFalse();
            updatedMemberTwo.Details.FirstName.ShouldBe(TestMemberTwoFirstName);
            updatedMemberTwo.Details.LastName.ShouldBe(TestMemberTwoLastName);
            updatedMemberTwo.Details.PreferredName.ShouldBeNullOrEmpty();
            updatedMemberTwo.Details.Initials.ShouldBeNullOrEmpty();
            updatedMemberTwo.Details.Gender.ShouldBe(TestMemberTwoGender);
            updatedMemberTwo.Details.DateOfBirth.ShouldStartWith(TestMemberTwoDateOfBirth);

            var addedMember = (HouseholdMember)updatedMembers.GetValue(2);
            addedMember.ShouldNotBeNull();
            addedMember.isUnder19.ShouldBeTrue();
            addedMember.Details.FirstName.ShouldBe(TestMemberThreeFirstName);
            addedMember.Details.LastName.ShouldBe(TestMemberThreeLastName);
            addedMember.Details.PreferredName.ShouldBe(TestMemberThreePreferredName);
            addedMember.Details.Initials.ShouldBe(TestMemberThreeInitials);
            addedMember.Details.Gender.ShouldBe(TestMemberThreeGender);
            addedMember.Details.DateOfBirth.ShouldStartWith(TestMemberThreeDateOfBirth);

            // Pets
            var updatedPet = updatedNeedsAssessment.Pets.ShouldHaveSingleItem();
            updatedPet.Quantity.ShouldBe(TestPetOneQuantity);
            updatedPet.Type.ShouldBe(TestPetOneType);

            /* Step Three - Reset Previous Values */
            evacuationFile.EvacuatedFromAddress.AddressLine1 = TestEvacuatedAddressLine1;
            // Needs Assessment
            needsAssessment = evacuationFile.NeedsAssessments.ShouldHaveSingleItem();
            needsAssessment.Insurance = NeedsAssessment.InsuranceOption.Yes;
            needsAssessment.CanEvacueeProvideClothing = true;
            needsAssessment.CanEvacueeProvideFood = true;
            needsAssessment.CanEvacueeProvideIncidentals = true;
            needsAssessment.CanEvacueeProvideLodging = true;
            needsAssessment.CanEvacueeProvideTransportation = true;
            needsAssessment.HaveMedication = false;
            needsAssessment.HasPetsFood = true;
            needsAssessment.HaveSpecialDiet = true;
            needsAssessment.SpecialDietDetails = TestSpecialDietDetails;

            // Household Members
            /* Reset Member */
            members = needsAssessment.HouseholdMembers.ToList();
            members.ShouldNotBeEmpty();

            memberOne = (HouseholdMember)members.ElementAt(0);
            memberOne.Details.FirstName = TestMemberOneFirstName;
            memberOne.Details.LastName = TestMemberOneLastName;
            memberOne.Details.PreferredName = TestMemberOnePreferredName;
            memberOne.Details.Initials = TestMemberOneInitials;
            memberOne.Details.Gender = TestMemberOneGender;
            memberOne.Details.DateOfBirth = TestMemberOneDateOfBirth;

            /* Remove Member */
            if (members.Count > 2)
            {
                needsAssessment.HouseholdMembers = members.Take(2);
            }

            essFileNumber = await evacuationManager.SaveEvacuation(TestUserId, evacuationFile.EssFileNumber, evacuationFile);
            essFileNumber.ShouldBe(TestEssFileNumber);

            updatedEvacuationFile = await evacuationManager.GetEvacuation(TestUserId, TestEssFileNumber);
            updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(TestEvacuatedAddressLine1);
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
            evacuationFile.EvacuatedFromAddress.AddressLine1 = TestEvacuatedAddressLine1;

            // Needs Assessment
            var needsAssessment = evacuationFile.NeedsAssessments.ShouldHaveSingleItem();
            needsAssessment.Insurance = NeedsAssessment.InsuranceOption.Yes;
            needsAssessment.CanEvacueeProvideClothing = true;
            needsAssessment.CanEvacueeProvideFood = true;
            needsAssessment.CanEvacueeProvideIncidentals = true;
            needsAssessment.CanEvacueeProvideLodging = true;
            needsAssessment.CanEvacueeProvideTransportation = true;
            needsAssessment.HaveMedication = false;
            needsAssessment.HasPetsFood = true;
            needsAssessment.HaveSpecialDiet = true;
            needsAssessment.SpecialDietDetails = TestSpecialDietDetails;

            // Household Members
            /* Reset Member */
            var members = needsAssessment.HouseholdMembers.ToList();
            members.ShouldNotBeEmpty();

            var memberOne = (HouseholdMember)members.ElementAt(0);
            memberOne.Details.FirstName = TestMemberOneFirstName;
            memberOne.Details.LastName = TestMemberOneLastName;
            memberOne.Details.PreferredName = TestMemberOnePreferredName;
            memberOne.Details.Initials = TestMemberOneInitials;
            memberOne.Details.Gender = TestMemberOneGender;
            memberOne.Details.DateOfBirth = TestMemberOneDateOfBirth;

            /* Remove Member */
            if (members.Count > 2)
            {
                needsAssessment.HouseholdMembers = members.Take(2);
            }

            var essFileNumber = await evacuationManager.SaveEvacuation(TestUserId, evacuationFile.EssFileNumber, evacuationFile);
            essFileNumber.ShouldBe(TestEssFileNumber);

            var updatedEvacuationFile = await evacuationManager.GetEvacuation(TestUserId, TestEssFileNumber);
            updatedEvacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(TestEvacuatedAddressLine1);
        }
        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuation()
        {
            var evacuationFile = await evacuationManager.GetEvacuation("4PRCSME5JFAAGAV5OPLTZLQXBGDL7XYD", "100707");
        }
    }
}
