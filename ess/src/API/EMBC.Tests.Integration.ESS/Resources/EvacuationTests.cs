using System;
using System.Linq;
using EMBC.ESS.Resources.Evacuations;
using EMBC.ESS.Resources.Evacuees;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class EvacuationTests : DynamicsWebAppTestBase
    {
        private readonly IEvacuationRepository evacuationRepository;

        // Constants
        private string TestContactId => TestData.ContactId;

        private string TestContactUserId => TestData.ContactUserId;

        private string TestEssFileNumber => TestData.EvacuationFileId;

        private string TestNeedsAssessmentId => TestData.EvacuationFileCurrentNeedsAssessmentId;

        public EvacuationTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            evacuationRepository = Services.GetRequiredService<IEvacuationRepository>();
        }

        [Fact]
        public async Task CanGetEvacuationFilesByFileId()
        {
            var fileId = TestEssFileNumber;
            var caseQuery = new EvacuationFilesQuery
            {
                FileId = fileId
            };
            var queryResult = await evacuationRepository.Query(caseQuery);
            queryResult.Items.ShouldHaveSingleItem();

            var evacuationFile = queryResult.Items.ShouldHaveSingleItem();
            evacuationFile.Id.ShouldBe(fileId);
        }

        [Fact]
        public async Task CanGetEvacuationFilesByFileIdAndRelatedNeedsAssessmentId()
        {
            var caseQuery = new EvacuationFilesQuery
            {
                FileId = TestEssFileNumber,
                NeedsAssessmentId = TestNeedsAssessmentId
            };
            var queryResult = await evacuationRepository.Query(caseQuery);
            queryResult.Items.ShouldHaveSingleItem();

            var evacuationFile = (EvacuationFile)queryResult.Items.ShouldHaveSingleItem();
            evacuationFile.Id.ShouldBe(TestEssFileNumber);
            evacuationFile.NeedsAssessment.Id.ShouldBe(TestNeedsAssessmentId);
        }

        [Fact]
        public async Task Query_FileByNeedsAssessmentId_ReturnsHouseholdMembersForThatAssessment()
        {
            var fileToUpdate = (await evacuationRepository.Query(new EvacuationFilesQuery
            {
                FileId = TestEssFileNumber,
            })).Items.Cast<EvacuationFile>().Single();

            var needsAssessment = fileToUpdate.NeedsAssessment;
            needsAssessment.HouseholdMembers = needsAssessment.HouseholdMembers.Where(m => m.IsPrimaryRegistrant);
            needsAssessment.HouseholdMembers.ShouldHaveSingleItem();

            var fileId = (await evacuationRepository.Manage(new SubmitEvacuationFileNeedsAssessment { EvacuationFile = fileToUpdate })).Id;

            var onceUpdatedFile = (await evacuationRepository.Query(new EvacuationFilesQuery { FileId = fileId })).Items.Cast<EvacuationFile>().ShouldHaveSingleItem();
            var updatedNeedsAssessment = onceUpdatedFile.NeedsAssessment;
            var targetNeedsAssessmentId = updatedNeedsAssessment.Id;

            needsAssessment.Id.ShouldNotBe(targetNeedsAssessmentId);

            updatedNeedsAssessment.HouseholdMembers = fileToUpdate.HouseholdMembers;
            updatedNeedsAssessment.HouseholdMembers.Count().ShouldBeGreaterThan(1);

            fileId = (await evacuationRepository.Manage(new SubmitEvacuationFileNeedsAssessment { EvacuationFile = onceUpdatedFile })).Id;

            var twiceUpdatedFile = (await evacuationRepository.Query(new EvacuationFilesQuery { FileId = fileId, NeedsAssessmentId = targetNeedsAssessmentId })).Items.Cast<EvacuationFile>().ShouldHaveSingleItem();
            twiceUpdatedFile.NeedsAssessment.HouseholdMembers.ShouldHaveSingleItem();
        }

        [Fact]
        public async Task CanGetNoEvacuationFilesByRelatedNeedsAssessmentIdOnly()
        {
            var caseQuery = new EvacuationFilesQuery
            {
                NeedsAssessmentId = TestNeedsAssessmentId
            };
            var queryResult = await evacuationRepository.Query(caseQuery);
            queryResult.Items.ShouldBeEmpty();
        }

        [Fact]
        public async Task CanGetNoEvacuationFilessByFileIdAndRegistrant()
        {
            var caseQuery = new EvacuationFilesQuery
            {
                FileId = "nofileid",
                PrimaryRegistrantId = TestContactId
            };
            var queryResult = await evacuationRepository.Query(caseQuery);
            queryResult.Items.ShouldBeEmpty();
        }

        [Fact]
        public async Task CanGetEvacuationFilesByPrimaryRegistrantUserid()
        {
            var primaryContactId = TestContactId;
            var caseQuery = new EvacuationFilesQuery
            {
                PrimaryRegistrantId = primaryContactId,
            };
            var files = (await evacuationRepository.Query(caseQuery)).Items.Cast<EvacuationFile>().ToArray();
            files.ShouldNotBeEmpty();
            files.ShouldAllBe(f => f.HouseholdMembers.Any(m => m.LinkedRegistrantId == primaryContactId));
            files.ShouldAllBe(f => f.PrimaryRegistrantId == primaryContactId);
        }

        [Fact]
        public async Task CanGetEvacuationFilessByLinkedRegistrantId()
        {
            var caseQuery = new EvacuationFilesQuery
            {
                LinkedRegistrantId = TestContactId
            };
            var files = (await evacuationRepository.Query(caseQuery)).Items.Cast<EvacuationFile>().ToArray();
            files.ShouldNotBeEmpty();
            files.ShouldAllBe(f => f.HouseholdMembers.Any(m => m.LinkedRegistrantId == TestContactId));
        }

        [Fact]
        public async Task CanCreateEvacuationFile()
        {
            var primaryContact = await GetContactByUserId(TestContactUserId);
            var originalFile = CreateTestFile(primaryContact);
            var fileId = (await evacuationRepository.Manage(new SubmitEvacuationFileNeedsAssessment { EvacuationFile = originalFile })).Id;

            var caseQuery = new EvacuationFilesQuery
            {
                FileId = fileId
            };
            (await evacuationRepository.Query(caseQuery)).Items.ShouldHaveSingleItem();
        }

        [Fact]
        public async Task CanUpdateEvacuationFile()
        {
            var fileToUpdate = (await evacuationRepository.Query(new EvacuationFilesQuery
            {
                FileId = TestEssFileNumber,
            })).Items.Cast<EvacuationFile>().Single();

            var newUniqueSignature = Guid.NewGuid().ToString().Substring(0, 5);
            var needsAssessment = fileToUpdate.NeedsAssessment;

            needsAssessment.HavePetsFood = !needsAssessment.HavePetsFood;
            foreach (var member in needsAssessment.HouseholdMembers.Where(m => m.LinkedRegistrantId == null && !m.FirstName.Contains("no-registrant")))
            {
                string originalFirstName = member.FirstName.Substring(member.FirstName.LastIndexOf("_") + 1);
                string originalLastName = member.LastName.Substring(member.LastName.LastIndexOf("_") + 1);
                member.FirstName = $"{newUniqueSignature}_{originalFirstName}";
                member.LastName = $"{newUniqueSignature}_{originalLastName}";
            }

            var fileId = (await evacuationRepository.Manage(new SubmitEvacuationFileNeedsAssessment { EvacuationFile = fileToUpdate })).Id;

            var updatedFile = (await evacuationRepository.Query(new EvacuationFilesQuery { FileId = fileId })).Items.Cast<EvacuationFile>().ShouldHaveSingleItem();

            var updatedNeedsAssessment = updatedFile.NeedsAssessment;
            updatedNeedsAssessment.HavePetsFood.ShouldBe(needsAssessment.HavePetsFood);
            foreach (var member in updatedNeedsAssessment.HouseholdMembers.Where(m => !m.IsPrimaryRegistrant && m.LinkedRegistrantId == null && !m.FirstName.Contains("no-registrant")))
            {
                member.FirstName.ShouldStartWith(newUniqueSignature);
                member.LastName.ShouldStartWith(newUniqueSignature);
            }
            var primaryRegistrant = updatedNeedsAssessment.HouseholdMembers.Where(m => m.IsPrimaryRegistrant).ShouldHaveSingleItem();
            updatedFile.NeedsAssessment.Pets.Count().ShouldBe(fileToUpdate.NeedsAssessment.Pets.Count());
            updatedFile.NeedsAssessment.HouseholdMembers.Count().ShouldBe(fileToUpdate.NeedsAssessment.HouseholdMembers.Count());
        }

        [Fact]
        public async Task CanMapEvacuationFile()
        {
            var now = DateTime.UtcNow;
            var primaryContact = await GetContactByUserId(TestContactUserId);
            var originalFile = CreateTestFile(primaryContact);
            var fileId = (await evacuationRepository.Manage(new SubmitEvacuationFileNeedsAssessment { EvacuationFile = originalFile })).Id;

            var caseQuery = new EvacuationFilesQuery
            {
                FileId = fileId
            };
            var evacuationFile = (EvacuationFile)(await evacuationRepository.Query(caseQuery)).Items.ShouldHaveSingleItem();

            // Evacuation file
            evacuationFile.EvacuatedFrom.ShouldNotBeNull();
            evacuationFile.Id.ShouldBe(fileId);
            evacuationFile.EvacuatedFrom.AddressLine1.ShouldBe(originalFile.EvacuatedFrom.AddressLine1);
            evacuationFile.EvacuatedFrom.AddressLine2.ShouldBe(originalFile.EvacuatedFrom.AddressLine2);
            evacuationFile.EvacuatedFrom.CommunityCode.ShouldBe(originalFile.EvacuatedFrom.CommunityCode);
            evacuationFile.EvacuatedFrom.PostalCode.ShouldBe(originalFile.EvacuatedFrom.PostalCode);
            evacuationFile.EvacuationDate.ShouldBeInRange(now.AddSeconds(-1), DateTime.UtcNow);
            evacuationFile.PrimaryRegistrantId.ShouldBe(primaryContact.Id);
            evacuationFile.RegistrationLocation.ShouldBe(originalFile.RegistrationLocation);
            evacuationFile.TaskId.ShouldBe(originalFile.TaskId);
            if (originalFile.TaskId != null) evacuationFile.TaskLocationCommunityCode.ShouldNotBeNull();
            evacuationFile.HouseholdMembers.Count().ShouldBe(originalFile.NeedsAssessment.HouseholdMembers.Count());

            // Needs Assessment

            var originalNeedsAssessment = originalFile.NeedsAssessment;
            var needsAssessment = evacuationFile.NeedsAssessment;
            needsAssessment.Insurance.ShouldBe(originalNeedsAssessment.Insurance);
            needsAssessment.CanProvideClothing.ShouldBe(originalNeedsAssessment.CanProvideClothing);
            needsAssessment.CanProvideFood.ShouldBe(originalNeedsAssessment.CanProvideFood);
            needsAssessment.CanProvideIncidentals.ShouldBe(originalNeedsAssessment.CanProvideIncidentals);
            needsAssessment.CanProvideLodging.ShouldBe(originalNeedsAssessment.CanProvideLodging);
            needsAssessment.CanProvideTransportation.ShouldBe(originalNeedsAssessment.CanProvideTransportation);
            needsAssessment.TakeMedication.ShouldBe(originalNeedsAssessment.TakeMedication);
            needsAssessment.HaveMedicalSupplies.ShouldBe(originalNeedsAssessment.HaveMedicalSupplies);
            needsAssessment.HavePetsFood.ShouldBe(originalNeedsAssessment.HavePetsFood);
            needsAssessment.HaveSpecialDiet.ShouldBe(originalNeedsAssessment.HaveSpecialDiet);
            needsAssessment.SpecialDietDetails.ShouldBe(originalNeedsAssessment.SpecialDietDetails);

            needsAssessment.HouseholdMembers.Count().ShouldBe(originalNeedsAssessment.HouseholdMembers.Count());
            needsAssessment.HouseholdMembers.Where(m => m.IsPrimaryRegistrant).ShouldHaveSingleItem().LinkedRegistrantId.ShouldBe(primaryContact.Id);
            for (var j = 0; j < originalNeedsAssessment.HouseholdMembers.Count(); j++)
            {
                var originalHouseholdMember = originalNeedsAssessment.HouseholdMembers.OrderBy(m => m.DateOfBirth).ElementAt(j);
                var householdMember = needsAssessment.HouseholdMembers.OrderBy(m => m.DateOfBirth).ElementAt(j);
                householdMember.DateOfBirth.ShouldBe(originalHouseholdMember.DateOfBirth);
                householdMember.FirstName.ShouldBe(originalHouseholdMember.FirstName);
                householdMember.LastName.ShouldBe(originalHouseholdMember.LastName);
                householdMember.Gender.ShouldBe(originalHouseholdMember.Gender);
                householdMember.Initials.ShouldBe(originalHouseholdMember.Initials);
                householdMember.IsMinor.ShouldBe(originalHouseholdMember.IsMinor);
                householdMember.Id.ShouldNotBeNull();
                householdMember.LinkedRegistrantId.ShouldBe(originalHouseholdMember.LinkedRegistrantId);
                if (householdMember.LinkedRegistrantId != null)
                {
                    householdMember.HasAccessRestriction.ShouldNotBeNull().ShouldBe(primaryContact.RestrictedAccess);
                    householdMember.IsVerifiedRegistrant.ShouldNotBeNull();
                    householdMember.IsVerifiedRegistrant.ShouldBe(primaryContact.Verified);
                }
                else
                {
                    householdMember.HasAccessRestriction.ShouldBeNull();
                    householdMember.IsVerifiedRegistrant.ShouldBeNull();
                }
            }
            needsAssessment.Pets.Count().ShouldBe(originalNeedsAssessment.Pets.Count());
            for (var j = 0; j < originalNeedsAssessment.Pets.Count(); j++)
            {
                var originalPet = originalNeedsAssessment.Pets.OrderBy(p => p.Type).ElementAt(j);
                var pet = needsAssessment.Pets.OrderBy(p => p.Type).ElementAt(j);

                pet.Quantity.ShouldBe(originalPet.Quantity);
                pet.Type.ShouldBe(originalPet.Type);
                pet.Id.ShouldNotBeNullOrEmpty();
            }
        }

        private async Task<Evacuee> GetContactByUserId(string userId) =>
            (await Services.GetRequiredService<IEvacueesRepository>().Query(new EvacueeQuery { UserId = userId })).Items.Single();

        private EvacuationFile CreateTestFile(Evacuee primaryContact)
        {
            var now = DateTime.UtcNow;
            var uniqueSignature = TestData.TestPrefix + "-" + Guid.NewGuid().ToString().Substring(0, 4);
            var file = new EvacuationFile()
            {
                PrimaryRegistrantId = primaryContact.Id ?? null!,
                EvacuationDate = now,
                TaskId = TestData.ActiveTaskId,
                SecurityPhrase = "secret123",
                SecurityPhraseChanged = true,
                RegistrationLocation = $"{uniqueSignature}_testlocation",

                NeedsAssessment = new NeedsAssessment
                {
                    CompletedOn = now,
                    EvacuatedFrom = new EvacuationAddress()
                    {
                        AddressLine1 = $"{uniqueSignature}_3738 Main St",
                        AddressLine2 = "Suite 3",
                        CommunityCode = TestData.RandomCommunity,
                        PostalCode = "V8V 2W3"
                    },
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
                                FirstName = primaryContact.FirstName,
                                LastName = primaryContact.LastName,
                                Initials = primaryContact.Initials,
                                Gender = primaryContact.Gender,
                                DateOfBirth = primaryContact.DateOfBirth,
                                IsMinor = false,
                                IsPrimaryRegistrant = true,
                                LinkedRegistrantId = primaryContact.Id,
                                HasAccessRestriction = false,
                                IsVerifiedRegistrant = true
                            },
                            new HouseholdMember
                            {
                                FirstName = $"{uniqueSignature}_hm1",
                                LastName = "hm1",
                                Initials = $"{uniqueSignature}_1",
                                Gender = "Female",
                                DateOfBirth = "03/11/2000",
                                IsMinor = false,
                                IsPrimaryRegistrant = false
                            },
                             new HouseholdMember
                            {
                                FirstName = $"{uniqueSignature}_hm2",
                                LastName = "hm2",
                                Initials = $"{uniqueSignature}_2",
                                Gender = "Male",
                                DateOfBirth = "03/12/2010",
                                IsMinor = true,
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
