using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Resources.Cases;
using EMBC.ESS.Resources.Contacts;
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

        // Constants
        private const string TestUserId = "CHRIS-TEST";

        private const string TestEssFileNumber = "100487";

        public EvacuationTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            caseRepository = services.GetRequiredService<ICaseRepository>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuationFilessByFileId()
        {
            var caseQuery = new EvacuationFilesQuery
            {
                FileId = TestEssFileNumber
            };
            var queryResult = await caseRepository.QueryCase(caseQuery);
            queryResult.Items.ShouldNotBeEmpty();
            queryResult.Items.FirstOrDefault().ShouldNotBeNull();

            var evacuationFile = (EvacuationFile)queryResult.Items.ShouldHaveSingleItem();
            evacuationFile.Id.ShouldBe(TestEssFileNumber);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuationFilesByPrimaryRegistrantUserid()
        {
            var primaryContact = await GetContactByUserId(TestUserId);
            var caseQuery = new EvacuationFilesQuery
            {
                PrimaryRegistrantId = primaryContact.Id,
                Limit = 5
            };
            var queryResult = await caseRepository.QueryCase(caseQuery);
            queryResult.Items.ShouldNotBeEmpty();

            queryResult.Items.Cast<EvacuationFile>().ShouldAllBe(f => f.PrimaryRegistrantId == primaryContact.Id);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateEvacuationFile()
        {
            var primaryContact = await GetContactByUserId(TestUserId);
            var originalFile = CreateTestFile(primaryContact);
            var fileId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = originalFile })).CaseId;

            var caseQuery = new EvacuationFilesQuery
            {
                FileId = fileId
            };
            (await caseRepository.QueryCase(caseQuery)).Items.ShouldHaveSingleItem();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateEvacuationFile()
        {
            var primaryContact = await GetContactByUserId(TestUserId);
            var fileToUpdate = (await caseRepository.QueryCase(new EvacuationFilesQuery
            {
                PrimaryRegistrantId = primaryContact.Id,
                Limit = 2
            })).Items.Cast<EvacuationFile>().Last();

            var newUniqueSignature = Guid.NewGuid().ToString().Substring(0, 5);
            var needsAssessment = fileToUpdate.NeedsAssessments.ShouldHaveSingleItem();

            needsAssessment.HasPetsFood = !needsAssessment.HasPetsFood;
            foreach (var memeber in needsAssessment.HouseholdMembers)
            {
                memeber.FirstName = $"{newUniqueSignature}_{memeber.FirstName}";
                memeber.LastName = $"{newUniqueSignature}_{memeber.FirstName}";
            }

            var fileId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = fileToUpdate })).CaseId;

            var updatedFile = (await caseRepository.QueryCase(new EvacuationFilesQuery { FileId = fileId })).Items.Cast<EvacuationFile>().ShouldHaveSingleItem();

            var updatedNeedsAssessment = updatedFile.NeedsAssessments.ShouldHaveSingleItem();
            updatedNeedsAssessment.HasPetsFood.ShouldBe(needsAssessment.HasPetsFood);
            foreach (var member in updatedNeedsAssessment.HouseholdMembers)
            {
                member.FirstName.ShouldStartWith(newUniqueSignature);
                member.LastName.ShouldStartWith(newUniqueSignature);
            }
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanMapEvacuationFile()
        {
            var now = DateTime.UtcNow;
            var primaryContact = await GetContactByUserId(TestUserId);
            var originalFile = CreateTestFile(primaryContact);
            var fileId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = originalFile })).CaseId;

            var caseQuery = new EvacuationFilesQuery
            {
                FileId = fileId
            };
            var evacuationFile = (EvacuationFile)(await caseRepository.QueryCase(caseQuery)).Items.ShouldHaveSingleItem();

            // Evacuation file
            evacuationFile.EvacuatedFromAddress.ShouldNotBeNull();
            evacuationFile.Id.ShouldBe(fileId);
            evacuationFile.EvacuatedFromAddress.AddressLine1.ShouldBe(originalFile.EvacuatedFromAddress.AddressLine1);
            evacuationFile.EvacuatedFromAddress.AddressLine2.ShouldBe(originalFile.EvacuatedFromAddress.AddressLine2);
            evacuationFile.EvacuatedFromAddress.CommunityCode.ShouldBe(originalFile.EvacuatedFromAddress.CommunityCode);
            evacuationFile.EvacuatedFromAddress.CountryCode.ShouldBe(originalFile.EvacuatedFromAddress.CountryCode);
            evacuationFile.EvacuatedFromAddress.StateProvinceCode.ShouldBe(originalFile.EvacuatedFromAddress.StateProvinceCode);
            evacuationFile.EvacuatedFromAddress.PostalCode.ShouldBe(originalFile.EvacuatedFromAddress.PostalCode);
            evacuationFile.EvacuationDate.ShouldBeInRange(now, DateTime.UtcNow);
            evacuationFile.PrimaryRegistrantId.ShouldBe(primaryContact.Id);

            // Needs Assessments
            evacuationFile.NeedsAssessments.ShouldHaveSingleItem();
            for (var i = 0; i < originalFile.NeedsAssessments.Count(); i++)
            {
                var originalNeedsAssessment = originalFile.NeedsAssessments.ElementAt(i);
                var needsAssessment = evacuationFile.NeedsAssessments.ElementAt(i);
                needsAssessment.Insurance.ShouldBe(originalNeedsAssessment.Insurance);
                needsAssessment.CanEvacueeProvideClothing.ShouldBe(originalNeedsAssessment.CanEvacueeProvideClothing);
                needsAssessment.CanEvacueeProvideFood.ShouldBe(originalNeedsAssessment.CanEvacueeProvideFood);
                needsAssessment.CanEvacueeProvideIncidentals.ShouldBe(originalNeedsAssessment.CanEvacueeProvideIncidentals);
                needsAssessment.CanEvacueeProvideLodging.ShouldBe(originalNeedsAssessment.CanEvacueeProvideLodging);
                needsAssessment.CanEvacueeProvideTransportation.ShouldBe(originalNeedsAssessment.CanEvacueeProvideTransportation);
                needsAssessment.HaveMedication.ShouldBe(originalNeedsAssessment.HaveMedication);
                needsAssessment.HasPetsFood.ShouldBe(originalNeedsAssessment.HasPetsFood);
                needsAssessment.HaveSpecialDiet.ShouldBe(originalNeedsAssessment.HaveSpecialDiet);
                needsAssessment.SpecialDietDetails.ShouldBe(originalNeedsAssessment.SpecialDietDetails);

                needsAssessment.HouseholdMembers.Count().ShouldBe(originalNeedsAssessment.HouseholdMembers.Count());
                for (var j = 0; j < originalNeedsAssessment.HouseholdMembers.Count(); j++)
                {
                    var originalHouseholdMember = originalNeedsAssessment.HouseholdMembers.OrderBy(m => m.DateOfBirth).ElementAt(i);
                    var householdMember = needsAssessment.HouseholdMembers.Where(m => !m.IsPrimaryRegistrant).OrderBy(m => m.DateOfBirth).ElementAt(i);
                    householdMember.DateOfBirth.ShouldBe(originalHouseholdMember.DateOfBirth);
                    householdMember.FirstName.ShouldBe(originalHouseholdMember.FirstName);
                    householdMember.LastName.ShouldBe(originalHouseholdMember.LastName);
                    householdMember.Gender.ShouldBe(originalHouseholdMember.Gender);
                    householdMember.Initials.ShouldBe(originalHouseholdMember.Initials);
                    householdMember.PreferredName.ShouldBe(originalHouseholdMember.PreferredName);
                    householdMember.IsUnder19.ShouldBe(originalHouseholdMember.IsUnder19);
                    householdMember.Id.ShouldNotBeNull();
                }
                needsAssessment.Pets.Count().ShouldBe(originalNeedsAssessment.Pets.Count());
                for (var j = 0; j < originalNeedsAssessment.Pets.Count(); j++)
                {
                    var originalPet = originalNeedsAssessment.Pets.OrderBy(p => p.Type).ElementAt(i);
                    var pet = needsAssessment.Pets.OrderBy(p => p.Type).ElementAt(i);

                    pet.Quantity.ShouldBe(originalPet.Quantity);
                    pet.Type.ShouldBe(originalPet.Type);
                }
            }
        }

        private async Task<Contact> GetContactByUserId(string userId) =>
            (await services.GetRequiredService<IContactRepository>().QueryContact(new ContactQuery { UserId = userId })).Items.Single();

        private EvacuationFile CreateTestFile(Contact primaryContact)
        {
            var uniqueSignature = Guid.NewGuid().ToString().Substring(0, 5);
            var file = new EvacuationFile()
            {
                PrimaryRegistrantId = primaryContact.Id,
                EvacuatedFromAddress = new EvacuationAddress()
                {
                    AddressLine1 = $"{uniqueSignature}_3738 Main St",
                    AddressLine2 = "Suite 3",
                    CommunityCode = "9e6adfaf-9f97-ea11-b813-005056830319",
                    StateProvinceCode = "BC",
                    CountryCode = "CAN",
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
                                FirstName = primaryContact.FirstName,
                                LastName = primaryContact.LastName,
                                PreferredName = primaryContact.PreferredName,
                                Initials = primaryContact.Initials,
                                Gender = primaryContact.Gender,
                                DateOfBirth = primaryContact.DateOfBirth,
                                IsUnder19 = false,
                                IsPrimaryRegistrant = true,
                                LinkedRegistrantId = primaryContact.Id
                            },
                            new HouseholdMember
                            {
                                FirstName = $"{uniqueSignature}_hm1",
                                LastName = "hm1",
                                PreferredName = "hm1p",
                                Initials = $"{uniqueSignature}_1",
                                Gender = "X",
                                DateOfBirth = "03/11/2000",
                                IsUnder19 = false,
                                IsPrimaryRegistrant = false
                            },
                             new HouseholdMember
                            {
                                FirstName = $"{uniqueSignature}_hm2",
                                LastName = "hm2",
                                PreferredName = "hm2p",
                                Initials = $"{uniqueSignature}_2",
                                Gender = "M",
                                DateOfBirth = "03/12/2010",
                                IsUnder19 = true,
                                IsPrimaryRegistrant = false
                            }
                        },
                        Pets = new[]
                        {
                            new Pet{ Type = $"{uniqueSignature}_Cat", Quantity = "1" }
                        }
                    }
                }
            };
            return file;
        }
    }
}
