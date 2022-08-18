using System;
using System.Collections.Generic;
using System.Linq;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts.Events;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Managers.Events
{
    public class EvacuationFileTests : DynamicsWebAppTestBase
    {
        private readonly EventsManager manager;
        private readonly RegistrantProfile registrant;
        private string teamUserId => TestData.Tier4TeamMemberId;

        private async Task<RegistrantProfile?> GetTestRegistrant() => await TestHelper.GetRegistrantByUserId(manager, TestData.ContactUserId);

        private async Task<EvacuationFile> GetEvacuationFileById(string fileId) => await TestHelper.GetEvacuationFileById(manager, fileId) ?? null!;

        private EvacuationFile CreateNewTestEvacuationFile(RegistrantProfile registrant) => TestHelper.CreateNewTestEvacuationFile(TestData.TestPrefix, registrant);

        public EvacuationFileTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            manager = Services.GetRequiredService<EventsManager>();
            registrant = GetTestRegistrant().GetAwaiter().GetResult().ShouldNotBeNull();
        }

        [Fact]
        public async Task CanSubmitAnonymousRegistration()
        {
            var textContextIdentifier = Guid.NewGuid().ToString().Substring(0, 4);
            var securityQuestions = new List<SecurityQuestion>();
            securityQuestions.Add(new SecurityQuestion { Id = 1, Question = "question1", Answer = "answer1" });
            securityQuestions.Add(new SecurityQuestion { Id = 2, Question = "question2", Answer = "answer2" });
            securityQuestions.Add(new SecurityQuestion { Id = 3, Question = "question3", Answer = "answer3" });
            var profile = new RegistrantProfile
            {
                UserId = null,
                Id = null,
                AuthenticatedUser = false,
                VerifiedUser = false,
                RestrictedAccess = false,
                SecurityQuestions = securityQuestions,
                FirstName = $"{textContextIdentifier}-PriRegTestFirst",
                LastName = $"{textContextIdentifier}-PriRegTestLast",
                DateOfBirth = "2000/01/01",
                Gender = "Female",
                Initials = "initials1",
                PreferredName = "preferred1",
                Email = "email@org.com",
                Phone = "999-999-9999",
                PrimaryAddress = new Address
                {
                    AddressLine1 = $"paddr1",
                    AddressLine2 = "paddr2",
                    Country = "CAN",
                    StateProvince = "BC",
                    PostalCode = "v1v 1v1",
                    Community = TestData.RandomCommunity
                },
                MailingAddress = new Address
                {
                    AddressLine1 = $"maddr1",
                    AddressLine2 = "maddr2",
                    Country = "USA",
                    StateProvince = "WA",
                    PostalCode = "12345",
                    Community = "Seattle"
                }
            };
            var needsAssessment = new NeedsAssessment
            {
                HouseholdMembers = new[]
                {
                    new HouseholdMember
                    {
                        IsPrimaryRegistrant = true,
                        FirstName = profile.FirstName,
                        LastName = profile.LastName,
                        DateOfBirth = profile.DateOfBirth,
                        Gender = profile.Gender,
                        Initials = profile.Initials,
                    },
                    new HouseholdMember
                    {
                        IsPrimaryRegistrant = false,
                        Id = null,
                        FirstName = $"{textContextIdentifier}-MemRegTestFirst",
                        LastName = $"{textContextIdentifier}-MemRegTestLast",
                        Gender = "X",
                        DateOfBirth = "2010-01-01"
                    }
                },
                TakeMedication = false,
                HaveMedicalSupplies = false,
                Insurance = InsuranceOption.Yes,
                HaveSpecialDiet = true,
                SpecialDietDetails = "Gluten Free",
                HavePetsFood = true,
                CanProvideClothing = false,
                CanProvideFood = true,
                CanProvideIncidentals = null,
                CanProvideLodging = false,
                CanProvideTransportation = true,
                Pets = new[]
                {
                    new Pet{ Type = $"dog{textContextIdentifier}", Quantity = "4" }
                }
            };
            var cmd = new SubmitAnonymousEvacuationFileCommand
            {
                File = new EvacuationFile
                {
                    EvacuatedFromAddress = new Address
                    {
                        AddressLine1 = $"addr1",
                        Country = "CAN",
                        Community = TestData.RandomCommunity,
                        StateProvince = "BC",
                        PostalCode = "v1v 1v1"
                    },
                    NeedsAssessment = needsAssessment,
                },
                SubmitterProfile = profile
            };

            var fileId = (await manager.Handle(cmd)).ShouldNotBeNull();

            var file = (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.ShouldHaveSingleItem();

            file.HouseholdMembers.ShouldContain(m => m.IsPrimaryRegistrant == true && m.FirstName == profile.FirstName && m.LastName == profile.LastName);
            file.NeedsAssessment.HouseholdMembers.ShouldContain(m => m.IsPrimaryRegistrant == true && m.FirstName == profile.FirstName && m.LastName == profile.LastName);
            file.NeedsAssessment.HouseholdMembers.ShouldContain(m => m.IsPrimaryRegistrant == false && m.FirstName == $"{textContextIdentifier}-MemRegTestFirst" && m.LastName == $"{textContextIdentifier}-MemRegTestLast");
        }

        [Fact]
        public async Task CanSubmitNewEvacuation()
        {
            var file = CreateNewTestEvacuationFile(registrant);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = teamUserId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });
            fileId.ShouldNotBeNull();

            var savedFile = await GetEvacuationFileById(fileId);
            savedFile.PrimaryRegistrantId.ShouldBe(registrant.Id);
            savedFile.HouseholdMembers.ShouldContain(m => m.IsPrimaryRegistrant == true && m.FirstName == registrant.FirstName && m.LastName == registrant.LastName);
            savedFile.NeedsAssessment.HouseholdMembers.ShouldContain(m => m.IsPrimaryRegistrant == true && m.FirstName == registrant.FirstName && m.LastName == registrant.LastName);

            savedFile.HouseholdMembers.Count().ShouldBe(file.NeedsAssessment.HouseholdMembers.Count());
            foreach (var member in file.NeedsAssessment.HouseholdMembers.Where(m => !m.IsPrimaryRegistrant))
            {
                savedFile.HouseholdMembers.ShouldContain(m => m.FirstName == member.FirstName && m.LastName == member.LastName);
            }

            savedFile.NeedsAssessment.HouseholdMembers.Count().ShouldBe(file.NeedsAssessment.HouseholdMembers.Count());
            foreach (var member in file.NeedsAssessment.HouseholdMembers.Where(m => !m.IsPrimaryRegistrant))
            {
                savedFile.NeedsAssessment.HouseholdMembers.ShouldContain(m => m.FirstName == member.FirstName && m.LastName == member.LastName);
            }
        }

        [Fact]
        public void Create_EvacuationFileNoPrimaryRegistrant_ThrowsError()
        {
            var file = CreateNewTestEvacuationFile(registrant);
            foreach (var member in file.NeedsAssessment.HouseholdMembers)
            {
                member.IsPrimaryRegistrant = false;
            }

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = teamUserId };

            Should.Throw<Exception>(() => manager.Handle(new SubmitEvacuationFileCommand { File = file })).Message.ShouldBe("File  must have a single primary registrant household member");
        }

        [Fact]
        public async Task Update_EvacuationFileMultiplePrimaryRegistrants_ThrowsError()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - now.Ticks % TimeSpan.TicksPerSecond, now.Kind);

            var file = await GetEvacuationFileById(TestData.EvacuationFileId);

            var newPrimaryMember = new HouseholdMember
            {
                FirstName = registrant.FirstName,
                LastName = registrant.LastName,
                Initials = registrant.Initials,
                Gender = registrant.Gender,
                DateOfBirth = registrant.DateOfBirth,
                IsPrimaryRegistrant = true,
                LinkedRegistrantId = registrant.Id
            };

            if (file.NeedsAssessment.HouseholdMembers.Count() <= 1)
            {
                file.NeedsAssessment.HouseholdMembers = file.NeedsAssessment.HouseholdMembers.Concat(new[] { newPrimaryMember });
            }

            foreach (var member in file.NeedsAssessment.HouseholdMembers)
            {
                member.IsPrimaryRegistrant = true;
            }

            (await Should.ThrowAsync<Exception>(async () => await manager.Handle(new SubmitEvacuationFileCommand { File = file })))
                .Message.ShouldBe($"File {file.Id} can not have multiple primary registrant household members");

            file.NeedsAssessment.HouseholdMembers = new[] { newPrimaryMember };

            (await Should.ThrowAsync<Exception>(async () => await manager.Handle(new SubmitEvacuationFileCommand { File = file })))
                .Message.ShouldBe($"File {file.Id} can not have multiple primary registrant household members");
        }

        [Fact]
        public async Task Update_EvacuationFileTask_ThrowsError()
        {
            var fileWithTask = await GetEvacuationFileById(TestData.EvacuationFileId);
            fileWithTask.RelatedTask.Id = TestData.ActiveTaskId;
            //update file to task
            await manager.Handle(new SubmitEvacuationFileCommand { File = fileWithTask });

            //update to a different task
            fileWithTask.RelatedTask.Id = TestData.InactiveTaskId;
            (await Should.ThrowAsync<Exception>(async () => await manager.Handle(new SubmitEvacuationFileCommand { File = fileWithTask })))
                .Message.ShouldBe($"The ESS Task Number cannot be modified or updated once it's been initially assigned.");
        }

        [Fact]
        public async Task CanUpdateEvacuation()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - now.Ticks % TimeSpan.TicksPerSecond, now.Kind);

            var file = await GetEvacuationFileById(TestData.EvacuationFileId);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = teamUserId };

            file.Id.ShouldNotBeNullOrEmpty();
            file.EvacuationDate.ShouldNotBe(now);
            file.EvacuationDate = now;
            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });

            fileId.ShouldNotBeNullOrEmpty();
            var updatedFile = await GetEvacuationFileById(fileId);
            updatedFile.Id.ShouldBe(file.Id);
            updatedFile.EvacuationDate.ShouldBe(now);
        }

        [Fact]
        public async Task CanVerifySecurityPhrase()
        {
            var file = await GetEvacuationFileById(TestData.EvacuationFileId);

            var response = await manager.Handle(new VerifySecurityPhraseQuery { FileId = file.Id, SecurityPhrase = TestData.EvacuationFileSecurityPhrase });
            response.IsCorrect.ShouldBeTrue();
        }

        [Fact]
        public async Task CanCreateFileNote()
        {
            var fileId = TestData.EvacuationFileId;
            var noteSuffix = Guid.NewGuid().ToString().Substring(0, 4);
            var note = new Note { Content = $"{TestData.TestPrefix}-note-{noteSuffix}", Type = NoteType.General, CreatedBy = new TeamMember { Id = teamUserId } };
            var noteId = (await manager.Handle(new SaveEvacuationFileNoteCommand { FileId = fileId, Note = note })).ShouldNotBeNull();
            var actualNote = (await GetEvacuationFileById(TestData.EvacuationFileId)).Notes.Where(n => n.Id == noteId).ShouldHaveSingleItem();
            actualNote.Content.ShouldEndWith(noteSuffix);
        }

        [Fact]
        public async Task CanUpdateFileNote()
        {
            var fileId = TestData.EvacuationFileId;
            var noteSuffix = Guid.NewGuid().ToString().Substring(0, 4);
            var note = new Note { Content = $"{TestData.TestPrefix}-note-{noteSuffix}", Type = NoteType.General, CreatedBy = new TeamMember { Id = teamUserId } };
            var noteId = (await manager.Handle(new SaveEvacuationFileNoteCommand { FileId = fileId, Note = note })).ShouldNotBeNull();
            var actualNote = (await GetEvacuationFileById(TestData.EvacuationFileId)).Notes.Where(n => n.Id == noteId).ShouldHaveSingleItem();

            var updatedNoteSuffix = Guid.NewGuid().ToString().Substring(0, 4);
            actualNote.Content = $"{TestData.TestPrefix}-note-{updatedNoteSuffix}";
            var updatedNoteId = (await manager.Handle(new SaveEvacuationFileNoteCommand { FileId = fileId, Note = actualNote })).ShouldNotBeNull();

            updatedNoteId.ShouldBe(noteId);
            var actualUpdatedNote = (await GetEvacuationFileById(TestData.EvacuationFileId)).Notes.Where(n => n.Id == noteId).ShouldHaveSingleItem();
            actualUpdatedNote.Content.ShouldEndWith(updatedNoteSuffix);
        }

        [Fact]
        public async Task Update_FileNoteNotCreatingMember_ThrowsError()
        {
            var fileId = TestData.EvacuationFileId;
            var noteSuffix = Guid.NewGuid().ToString().Substring(0, 4);
            var note = new Note { Content = $"{TestData.TestPrefix}-note-{noteSuffix}", Type = NoteType.General, CreatedBy = new TeamMember { Id = teamUserId } };
            var noteId = (await manager.Handle(new SaveEvacuationFileNoteCommand { FileId = fileId, Note = note })).ShouldNotBeNull();
            var actualNote = (await GetEvacuationFileById(TestData.EvacuationFileId)).Notes.Where(n => n.Id == noteId).ShouldHaveSingleItem();

            var updatedNoteSuffix = Guid.NewGuid().ToString().Substring(0, 4);
            actualNote.Content = $"{TestData.TestPrefix}-note-{updatedNoteSuffix}";
            actualNote.CreatedBy = new TeamMember { Id = TestData.OtherTeamMemberId };
            Should.Throw<Exception>(() => manager.Handle(new SaveEvacuationFileNoteCommand { FileId = fileId, Note = actualNote })).Message.ShouldBe($"The note may be edited only by the user who created it withing a 24 hour period.");
        }

        [Fact]
        public async Task CanQueryFileNoteByFileId()
        {
            var notes = (await GetEvacuationFileById(TestData.EvacuationFileId)).Notes;
            notes.ShouldNotBeNull();
        }

        [Fact]
        public async Task CanQueryFileNoteByFileIdAndNoteId()
        {
            var fileId = TestData.EvacuationFileId;
            var noteSuffix = Guid.NewGuid().ToString().Substring(0, 4);
            var note = new Note { Content = $"{TestData.TestPrefix}-note-{noteSuffix}", Type = NoteType.General, CreatedBy = new TeamMember { Id = teamUserId } };
            var noteId = (await manager.Handle(new SaveEvacuationFileNoteCommand { FileId = fileId, Note = note })).ShouldNotBeNull();
            (await GetEvacuationFileById(TestData.EvacuationFileId)).Notes.Where(n => n.Id == noteId).ShouldNotBeNull();
        }

        [Fact]
        public async Task SubmitNewPaperEvacuationFile_Success()
        {
            var file = CreateNewTestEvacuationFile(registrant);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = teamUserId };
            file.ManualFileId = $"{TestData.TestPrefix}-{Guid.NewGuid().ToString().Substring(0, 4)}";
            file.SecurityPhrase = null!;

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });
            fileId.ShouldNotBeNull();

            var savedFile = await GetEvacuationFileById(fileId);
            savedFile.ManualFileId.ShouldBe(file.ManualFileId);
        }

        [Fact]
        public async Task Update_EvacuationFilePets_DoesNotCreateDuplicatePets()
        {
            var file = await GetEvacuationFileById(TestData.EvacuationFileId);

            file.NeedsAssessment.Pets = new[]
                {
                    new Pet{ Type = $"{TestData.TestPrefix}-dog", Quantity = "2" }
                };

            file.Id.ShouldNotBeNullOrEmpty();
            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });

            fileId.ShouldNotBeNullOrEmpty();
            var updatedFile = await GetEvacuationFileById(fileId);
            var pet = updatedFile.NeedsAssessment.Pets.ShouldHaveSingleItem();
            pet.Type.ShouldBe($"{TestData.TestPrefix}-dog");
            pet.Quantity.ShouldBe("2");
        }
    }
}
