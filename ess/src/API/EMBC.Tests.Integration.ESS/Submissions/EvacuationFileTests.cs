using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Managers.Submissions;
using EMBC.ESS.Shared.Contracts.Submissions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Submissions
{
    public class EvacuationFileTests : WebAppTestBase
    {
        private readonly SubmissionsManager manager;

        private readonly string teamUserId = "988c03c5-94c8-42f6-bf83-ffc57326e216";

        private async Task<RegistrantProfile> GetRegistrantByUserId(string userId) => await TestHelper.GetRegistrantByUserId(manager, userId);

        private async Task<IEnumerable<EvacuationFile>> GetEvacuationFileById(string fileId) => await TestHelper.GetEvacuationFileById(manager, fileId);

        private EvacuationFile CreateNewTestEvacuationFile(RegistrantProfile registrant) => TestHelper.CreateNewTestEvacuationFile(registrant);

        public EvacuationFileTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            manager = services.GetRequiredService<SubmissionsManager>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSubmitAnonymousRegistration()
        {
            var textContextIdentifier = Guid.NewGuid().ToString().Substring(0, 4);
            List<SecurityQuestion> securityQuestions = new List<SecurityQuestion>();
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
                    Community = "226adfaf-9f97-ea11-b813-005056830319"
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
                        Community = "226adfaf-9f97-ea11-b813-005056830319",
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

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSubmitNewEvacuation()
        {
            var registrant = await GetRegistrantByUserId("CHRIS-TEST");
            var file = CreateNewTestEvacuationFile(registrant);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = teamUserId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });
            fileId.ShouldNotBeNull();

            var savedFile = (await GetEvacuationFileById(fileId)).ShouldHaveSingleItem();
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

        [Fact(Skip = RequiresDynamics)]
        public async Task Create_EvacuationFileNoPrimaryRegistrant_ThrowsError()
        {
            var registrant = await GetRegistrantByUserId("CHRIS-TEST");
            var file = CreateNewTestEvacuationFile(registrant);
            foreach (var member in file.NeedsAssessment.HouseholdMembers)
            {
                member.IsPrimaryRegistrant = false;
            }

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = teamUserId };

            Should.Throw<Exception>(() => manager.Handle(new SubmitEvacuationFileCommand { File = file })).Message.ShouldBe("File  must have a single primary registrant household member");
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Update_EvacuationFileMultiplePrimaryRegistrants_ThrowsError()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var registrant = await GetRegistrantByUserId("CHRIS-TEST");

            var file = (await manager.Handle(new EvacuationFilesQuery { PrimaryRegistrantId = registrant.Id })).Items.Last();

            if (file.NeedsAssessment.HouseholdMembers.Count() <= 1)
            {
                var member = new HouseholdMember
                {
                    FirstName = registrant.FirstName,
                    LastName = registrant.LastName,
                    Initials = registrant.Initials,
                    Gender = registrant.Gender,
                    DateOfBirth = registrant.DateOfBirth,
                    IsPrimaryRegistrant = true,
                    LinkedRegistrantId = registrant.Id
                };
                file.NeedsAssessment.HouseholdMembers = file.NeedsAssessment.HouseholdMembers.Concat(new[] { member });
            }

            foreach (var member in file.NeedsAssessment.HouseholdMembers)
            {
                member.IsPrimaryRegistrant = true;
            }

            Should.Throw<Exception>(() => manager.Handle(new SubmitEvacuationFileCommand { File = file })).Message.ShouldBe($"File {file.Id} can not have multiple primary registrant household members");
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Update_EvacuationFileTask_ThrowsError()
        {
            var fileWithTask = (await GetEvacuationFileById("101010")).ShouldHaveSingleItem();
            fileWithTask.RelatedTask.Id = fileWithTask.RelatedTask.Id == "0001" ? "0002" : "0001";
            Should.Throw<Exception>(() => manager.Handle(new SubmitEvacuationFileCommand { File = fileWithTask })).Message.ShouldBe($"The ESS Task Number cannot be modified or updated once it's been initially assigned.");
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateEvacuation()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var registrant = await GetRegistrantByUserId("CHRIS-TEST");

            var file = (await manager.Handle(new EvacuationFilesQuery { PrimaryRegistrantId = registrant.Id })).Items.Last();

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = teamUserId };

            file.Id.ShouldNotBeNullOrEmpty();
            file.EvacuationDate.ShouldNotBe(now);
            file.EvacuationDate = now;
            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });

            fileId.ShouldNotBeNullOrEmpty();
            var updatedFile = (await GetEvacuationFileById(fileId)).ShouldHaveSingleItem();
            updatedFile.Id.ShouldBe(file.Id);
            updatedFile.EvacuationDate.ShouldBe(now);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanVerifySecurityPhrase()
        {
            //var fileId = (await manager.Handle(new EvacuationFilesSearchQuery { PrimaryRegistrantUserId = "CHRIS-TEST" })).Items.Last().Id;
            var fileId = "101010";

            //set phrase if needed
            //var file = (await GetEvacuationFileById(fileId)).FirstOrDefault();
            //file.SecurityPhrase = "no security phrase please";
            //file.SecurityPhraseChanged = true;
            //await manager.Handle(new SubmitEvacuationFileCommand { File = file });

            var response = await manager.Handle(new VerifySecurityPhraseQuery { FileId = fileId, SecurityPhrase = "no security phrase please" });
            response.IsCorrect.ShouldBeTrue();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateFileNote()
        {
            var fileId = "101010";
            var note = new Note { Content = "Test create note", Type = NoteType.General, CreatedBy = new TeamMember { Id = "170b9e4d-731e-4ab8-a0df-ff2612bf6840" } };
            var id = await manager.Handle(new SaveEvacuationFileNoteCommand { FileId = fileId, Note = note });
            id.ShouldNotBeNull();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateFileNote()
        {
            var fileId = "101010";
            var file = (await GetEvacuationFileById(fileId)).FirstOrDefault();

            var note = file.Notes.FirstOrDefault();

            if (note.Content.Equals("_testing_ update value 1"))
            {
                note.Content = "_testing_ update value 2";
            }
            else
            {
                note.Content = "_testing_ update value 1";
            }

            var id = await manager.Handle(new SaveEvacuationFileNoteCommand { Note = note, FileId = fileId });
            id.ShouldNotBeNull();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanQueryFileNoteByFileId()
        {
            var fileId = "101010";
            var notes = (await manager.Handle(new EvacuationFileNotesQuery { FileId = fileId })).Notes;

            notes.ShouldNotBeNull();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanQueryFileNoteByFileIdAndNoteId()
        {
            var fileId = "101010";
            var noteId = "65dea67d-760a-445d-aa78-101564bbf0b7";
            var notes = (await manager.Handle(new EvacuationFileNotesQuery { NoteId = noteId, FileId = fileId })).Notes;

            notes.ShouldNotBeNull();
        }
    }
}
