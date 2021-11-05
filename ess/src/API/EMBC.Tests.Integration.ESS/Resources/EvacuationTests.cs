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
        private string TestContactId => TestData.ContactId;

        private string TestContactUserId => TestData.ContactUserId;

        private string TestEssFileNumber => TestData.EvacuationFileId;

        private string TestNeedsAssessmentId = "b67cbdb4-75af-4cbb-a291-c390be77f83d";

        public EvacuationTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            caseRepository = services.GetRequiredService<ICaseRepository>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuationFilesByFileId()
        {
            var caseQuery = new EvacuationFilesQuery
            {
                FileId = TestEssFileNumber
            };
            var queryResult = await caseRepository.QueryCase(caseQuery);
            queryResult.Items.ShouldHaveSingleItem();

            var evacuationFile = (EvacuationFile)queryResult.Items.ShouldHaveSingleItem();
            evacuationFile.Id.ShouldBe(TestEssFileNumber);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuationFilesByFileIdAndRelatedNeedsAssessmentId()
        {
            var caseQuery = new EvacuationFilesQuery
            {
                FileId = TestEssFileNumber,
                NeedsAssessmentId = TestNeedsAssessmentId
            };
            var queryResult = await caseRepository.QueryCase(caseQuery);
            queryResult.Items.ShouldHaveSingleItem();

            var evacuationFile = (EvacuationFile)queryResult.Items.ShouldHaveSingleItem();
            evacuationFile.Id.ShouldBe(TestEssFileNumber);
            evacuationFile.NeedsAssessment.Id.ShouldBe(TestNeedsAssessmentId);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetNoEvacuationFilesByRelatedNeedsAssessmentIdOnly()
        {
            var caseQuery = new EvacuationFilesQuery
            {
                NeedsAssessmentId = TestNeedsAssessmentId
            };
            var queryResult = await caseRepository.QueryCase(caseQuery);
            queryResult.Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetNoEvacuationFilessByFileIdAndRegistrant()
        {
            var caseQuery = new EvacuationFilesQuery
            {
                FileId = "nofileid",
                PrimaryRegistrantId = TestContactId
            };
            var queryResult = await caseRepository.QueryCase(caseQuery);
            queryResult.Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuationFilesByPrimaryRegistrantUserid()
        {
            var primaryContactId = TestContactId;
            var caseQuery = new EvacuationFilesQuery
            {
                PrimaryRegistrantId = primaryContactId,
            };
            var files = (await caseRepository.QueryCase(caseQuery)).Items.Cast<EvacuationFile>().ToArray();
            files.ShouldNotBeEmpty();
            files.ShouldAllBe(f => f.HouseholdMembers.Any(m => m.LinkedRegistrantId == primaryContactId));
            files.ShouldAllBe(f => f.PrimaryRegistrantId == primaryContactId);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuationFilessByLinkedRegistrantId()
        {
            var caseQuery = new EvacuationFilesQuery
            {
                LinkedRegistrantId = TestContactId
            };
            var files = (await caseRepository.QueryCase(caseQuery)).Items.Cast<EvacuationFile>().ToArray();
            files.ShouldNotBeEmpty();
            files.ShouldAllBe(f => f.HouseholdMembers.Any(m => m.LinkedRegistrantId == TestContactId));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateEvacuationFile()
        {
            var primaryContact = await GetContactByUserId(TestContactUserId);
            var originalFile = CreateTestFile(primaryContact);
            var fileId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = originalFile })).Id;

            var caseQuery = new EvacuationFilesQuery
            {
                FileId = fileId
            };
            (await caseRepository.QueryCase(caseQuery)).Items.ShouldHaveSingleItem();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateEvacuationFile()
        {
            var fileToUpdate = (await caseRepository.QueryCase(new EvacuationFilesQuery
            {
                FileId = TestEssFileNumber,
            })).Items.Cast<EvacuationFile>().Single();

            var newUniqueSignature = Guid.NewGuid().ToString().Substring(0, 5);
            var needsAssessment = fileToUpdate.NeedsAssessment;

            needsAssessment.HavePetsFood = !needsAssessment.HavePetsFood;
            foreach (var member in needsAssessment.HouseholdMembers.Where(m => m.LinkedRegistrantId == null))
            {
                string originalFirstName = member.FirstName.Substring(member.FirstName.LastIndexOf("_") + 1);
                string originalLastName = member.LastName.Substring(member.LastName.LastIndexOf("_") + 1);
                member.FirstName = $"{newUniqueSignature}_{originalFirstName}";
                member.LastName = $"{newUniqueSignature}_{originalLastName}";
            }

            var fileId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = fileToUpdate })).Id;

            var updatedFile = (await caseRepository.QueryCase(new EvacuationFilesQuery { FileId = fileId })).Items.Cast<EvacuationFile>().ShouldHaveSingleItem();

            var updatedNeedsAssessment = updatedFile.NeedsAssessment;
            updatedNeedsAssessment.HavePetsFood.ShouldBe(needsAssessment.HavePetsFood);
            foreach (var member in updatedNeedsAssessment.HouseholdMembers.Where(m => !m.IsPrimaryRegistrant && m.LinkedRegistrantId == null))
            {
                member.FirstName.ShouldStartWith(newUniqueSignature);
                member.LastName.ShouldStartWith(newUniqueSignature);
            }
            var primaryRegistrant = updatedNeedsAssessment.HouseholdMembers.Where(m => m.IsPrimaryRegistrant).ShouldHaveSingleItem();
            updatedFile.NeedsAssessment.Pets.Count().ShouldBe(fileToUpdate.NeedsAssessment.Pets.Count());
            updatedFile.NeedsAssessment.HouseholdMembers.Count().ShouldBe(fileToUpdate.NeedsAssessment.HouseholdMembers.Count());
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanMapEvacuationFile()
        {
            var now = DateTime.UtcNow;
            var primaryContact = await GetContactByUserId(TestContactUserId);
            var originalFile = CreateTestFile(primaryContact);
            var fileId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = originalFile })).Id;

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
                householdMember.IsUnder19.ShouldBe(originalHouseholdMember.IsUnder19);
                householdMember.Id.ShouldNotBeNull();
                householdMember.LinkedRegistrantId.ShouldBe(originalHouseholdMember.LinkedRegistrantId);
                if (householdMember.LinkedRegistrantId != null)
                {
                    householdMember.HasAccessRestriction.ShouldNotBeNull().ShouldBe(primaryContact.RestrictedAccess);
                    householdMember.IsVerifiedRegistrant.ShouldNotBeNull().ShouldBe(primaryContact.Verified);
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

        [Fact(Skip = RequiresDynamics)]
        public async Task CanDeleteEvacuationFiles()
        {
            var files = (await caseRepository.QueryCase(new EvacuationFilesQuery { PrimaryRegistrantId = TestContactId })).Items;

            foreach (var file in files.OrderByDescending(f => f.CreatedOn).Skip(10))
            {
                await caseRepository.ManageCase(new DeleteEvacuationFile { Id = file.Id });
            }
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateSupports()
        {
            var now = DateTime.UtcNow;
            var primaryContact = await GetContactByUserId(TestContactUserId);
            var originalFile = CreateTestFile(primaryContact);
            var fileId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = originalFile })).Id;
            var createdFile = (EvacuationFile)(await caseRepository.QueryCase(new EvacuationFilesQuery { FileId = fileId })).Items.Single();
            var includedHouseholdMembers = createdFile.HouseholdMembers.Select(s => s.Id).ToArray();
            var supports = new Support[]
            {
               new ClothingReferral {
                   SupplierId = "9f584892-94fb-eb11-b82b-00505683fbf4",
                   SupplierNotes = "notes",
                   IssuedByTeamMemberId = "ad3c5df0-608b-eb11-b827-00505683fbf4",
                   IssuedToPersonName = "test person",
                   IncludedHouseholdMembers = includedHouseholdMembers,
                   From = now.AddDays(20),
                   To = now.AddDays(50),
                   IssuedOn = now
               },
               new IncidentalsReferral {
                   SupplierId = "9f584892-94fb-eb11-b82b-00505683fbf4",
                   SupplierNotes = "notes",
                   IssuedByTeamMemberId = "ad3c5df0-608b-eb11-b827-00505683fbf4",
                   IssuedToPersonName = "test person",
                   IncludedHouseholdMembers = includedHouseholdMembers,
                   From = now.AddDays(20),
                   To = now.AddDays(50),
                   IssuedOn = now
               }
            };

            var supportIds = (await caseRepository.ManageCase(new SaveEvacuationFileSupportCommand { FileId = fileId, Supports = supports })).Id.Split(';');

            var file = (EvacuationFile)(await caseRepository.QueryCase(new EvacuationFilesQuery { FileId = fileId })).Items.Single();

            var readSupportIds = file.Supports.Select(s => s.Id).OrderBy(id => id).ToArray();
            readSupportIds.ShouldBe(supportIds.OrderBy(id => id).ToArray());
            foreach (var support in file.Supports)
            {
                var sourceSupport = (Referral)supports.Where(s => s.GetType() == support.GetType()).Single();

                if (support is Referral referral)
                {
                    referral.Status.ShouldBe(sourceSupport.To < DateTime.UtcNow ? SupportStatus.Expired : SupportStatus.Active);

                    if (sourceSupport.SupplierId != null)
                        referral.SupplierId.ShouldBe(sourceSupport.SupplierId);
                    if (sourceSupport.IncludedHouseholdMembers.Any())
                        referral.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
                    if (sourceSupport.IssuedByTeamMemberId != null)
                        referral.IssuedByTeamMemberId.ShouldBe(sourceSupport.IssuedByTeamMemberId);
                }
            }
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateSupports()
        {
            var now = DateTime.UtcNow;
            var fileToCreateSupportFor = (await caseRepository.QueryCase(new EvacuationFilesQuery { FileId = TestEssFileNumber, })).Items.Cast<EvacuationFile>().Single();

            //____
            //First create a support
            var newSupport = new Support[]
            {
               new ClothingReferral {
                   SupplierId = "9f584892-94fb-eb11-b82b-00505683fbf4",
                   SupplierNotes = "old notes",
                   IssuedByTeamMemberId = "ad3c5df0-608b-eb11-b827-00505683fbf4",
                   IssuedToPersonName = "old test person",
                   IncludedHouseholdMembers = fileToCreateSupportFor.HouseholdMembers.Select(s => s.Id).ToArray(),
                   From = now.AddDays(20),
                   To = now.AddDays(50),
                   IssuedOn = now,
                   TotalAmount = 0
               }
            };
            var createdSupportId = (await caseRepository.ManageCase(new SaveEvacuationFileSupportCommand { FileId = TestEssFileNumber, Supports = newSupport })).Id;

            //____
            //Then update the created support
            var fileToUpdateItsSupport = (await caseRepository.QueryCase(new EvacuationFilesQuery { FileId = TestEssFileNumber, })).Items.Cast<EvacuationFile>().Single();
            var supportToUpdate = (ClothingReferral)fileToUpdateItsSupport.Supports.Where(s => s.Id == createdSupportId).Single();

            //Parameters to change in support
            var newUniqueSignature = Guid.NewGuid().ToString().Substring(0, 5);

            var randomIndex = new Random().Next(0, fileToUpdateItsSupport.HouseholdMembers.Count());
            var includedHouseholdMembers = fileToUpdateItsSupport.HouseholdMembers.Where((m, i) => i == randomIndex).Select(s => s.Id).ToArray();

            supportToUpdate.From = supportToUpdate.From.AddDays(-30);
            supportToUpdate.To = supportToUpdate.To.AddDays(-51);
            supportToUpdate.IssuedToPersonName = "New Test Person";
            supportToUpdate.TotalAmount = 100;
            supportToUpdate.SupplierNotes = "New note to supplier is: " + newUniqueSignature;
            supportToUpdate.SupplierId = "5b1b6fb9-855a-ea11-b817-00505683fbf4";
            supportToUpdate.IssuedByTeamMemberId = "988c03c5-94c8-42f6-bf83-ffc57326e216";
            supportToUpdate.IncludedHouseholdMembers = includedHouseholdMembers;

            var updatedSupportId = (await caseRepository.ManageCase(new SaveEvacuationFileSupportCommand { FileId = TestEssFileNumber, Supports = new[] { supportToUpdate } })).Id.Split(';').Single();

            //__
            //Performing test
            var updatedFile = (await caseRepository.QueryCase(new EvacuationFilesQuery { FileId = TestEssFileNumber, })).Items.Cast<EvacuationFile>().Single();
            var updatedSupport = (ClothingReferral)updatedFile.Supports.Where(s => s.Id == updatedSupportId).Single();

            updatedSupport.From.ShouldBe(supportToUpdate.From);
            updatedSupport.To.ShouldBe(supportToUpdate.To);
            updatedSupport.IssuedToPersonName.ShouldBe(supportToUpdate.IssuedToPersonName);
            updatedSupport.TotalAmount.ShouldBe(supportToUpdate.TotalAmount);
            updatedSupport.SupplierNotes.ShouldBe(supportToUpdate.SupplierNotes);
            updatedSupport.IssuedByTeamMemberId.ShouldBe(supportToUpdate.IssuedByTeamMemberId);
            updatedSupport.Status.ShouldBe(updatedSupport.To < DateTime.UtcNow ? SupportStatus.Expired : SupportStatus.Active);

            if (supportToUpdate.IncludedHouseholdMembers.Any())
                updatedSupport.IncludedHouseholdMembers.ShouldBe(supportToUpdate.IncludedHouseholdMembers);

            if (supportToUpdate.SupplierId != null)
                updatedSupport.SupplierId.ShouldBe(supportToUpdate.SupplierId);
        }

        private async Task<Contact> GetContactByUserId(string userId) =>
            (await services.GetRequiredService<IContactRepository>().QueryContact(new RegistrantQuery { UserId = userId })).Items.Single();

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
                RegistrationLocation = $"{uniqueSignature}_testlocation",

                NeedsAssessment = new NeedsAssessment
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
                                IsUnder19 = false,
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
