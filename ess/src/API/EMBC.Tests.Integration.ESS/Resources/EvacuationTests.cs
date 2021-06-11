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

        private const string TestEssFileNumber = "100718";

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
            var needsAssessment = fileToUpdate.CurrentNeedsAssessment;

            needsAssessment.HasPetsFood = !needsAssessment.HasPetsFood;
            foreach (var memeber in needsAssessment.HouseholdMembers)
            {
                memeber.FirstName = $"{newUniqueSignature}_{memeber.FirstName}";
                memeber.LastName = $"{newUniqueSignature}_{memeber.FirstName}";
            }

            var fileId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = fileToUpdate })).CaseId;

            var updatedFile = (await caseRepository.QueryCase(new EvacuationFilesQuery { FileId = fileId })).Items.Cast<EvacuationFile>().ShouldHaveSingleItem();

            var updatedNeedsAssessment = updatedFile.CurrentNeedsAssessment;
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
            evacuationFile.EvacuatedFrom.ShouldNotBeNull();
            evacuationFile.Id.ShouldBe(fileId);
            evacuationFile.EvacuatedFrom.AddressLine1.ShouldBe(originalFile.EvacuatedFrom.AddressLine1);
            evacuationFile.EvacuatedFrom.AddressLine2.ShouldBe(originalFile.EvacuatedFrom.AddressLine2);
            evacuationFile.EvacuatedFrom.CommunityCode.ShouldBe(originalFile.EvacuatedFrom.CommunityCode);
            evacuationFile.EvacuatedFrom.PostalCode.ShouldBe(originalFile.EvacuatedFrom.PostalCode);
            evacuationFile.EvacuationDate.ShouldBeInRange(now, DateTime.UtcNow);
            evacuationFile.PrimaryRegistrantId.ShouldBe(primaryContact.Id);

            // Needs Assessment

            var originalNeedsAssessment = originalFile.CurrentNeedsAssessment;
            var needsAssessment = evacuationFile.CurrentNeedsAssessment;
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
                var originalHouseholdMember = originalNeedsAssessment.HouseholdMembers.OrderBy(m => m.DateOfBirth).ElementAt(j);
                var householdMember = needsAssessment.HouseholdMembers.OrderBy(m => m.DateOfBirth).ElementAt(j);
                householdMember.DateOfBirth.ShouldBe(originalHouseholdMember.DateOfBirth);
                householdMember.FirstName.ShouldBe(originalHouseholdMember.FirstName);
                householdMember.LastName.ShouldBe(originalHouseholdMember.LastName);
                householdMember.Gender.ShouldBe(originalHouseholdMember.Gender);
                householdMember.Initials.ShouldBe(originalHouseholdMember.Initials);
                householdMember.IsUnder19.ShouldBe(originalHouseholdMember.IsUnder19);
                householdMember.Id.ShouldNotBeNull();
            }
            needsAssessment.Pets.Count().ShouldBe(originalNeedsAssessment.Pets.Count());
            for (var j = 0; j < originalNeedsAssessment.Pets.Count(); j++)
            {
                var originalPet = originalNeedsAssessment.Pets.OrderBy(p => p.Type).ElementAt(j);
                var pet = needsAssessment.Pets.OrderBy(p => p.Type).ElementAt(j);

                pet.Quantity.ShouldBe(originalPet.Quantity);
                pet.Type.ShouldBe(originalPet.Type);
            }
        }

        private async Task<Contact> GetContactByUserId(string userId) =>
            (await services.GetRequiredService<IContactRepository>().QueryContact(new ContactQuery { UserId = userId })).Items.Single();

        private EvacuationFile CreateTestFile(Contact primaryContact)
        {
            var now = DateTime.UtcNow;
            var uniqueSignature = Guid.NewGuid().ToString().Substring(0, 5);
            var file = new EvacuationFile()
            {
                PrimaryRegistrantId = primaryContact.Id,
                EvacuationDate = now,
                TaskId = "0001",
                SecurityPhrase = "secret123",
                SecurityPhraseChanged = true,

                CurrentNeedsAssessment = new NeedsAssessment
                {
                    CompletedOn = now,
                    EvacuatedFrom = new EvacuationAddress()
                    {
                        AddressLine1 = $"{uniqueSignature}_3738 Main St",
                        AddressLine2 = "Suite 3",
                        CommunityCode = "9e6adfaf-9f97-ea11-b813-005056830319",
                        PostalCode = "V8V 2W3"
                    },
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
                                Initials = $"{uniqueSignature}_1",
                                Gender = "Female",
                                DateOfBirth = "03/11/2000",
                                IsUnder19 = false,
                                IsPrimaryRegistrant = false
                            },
                             new HouseholdMember
                            {
                                FirstName = $"{uniqueSignature}_hm2",
                                LastName = "hm2",
                                Initials = $"{uniqueSignature}_2",
                                Gender = "Male",
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
            };
            return file;
        }
    }
}
