﻿using System;
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
    public class SubmissionsTests : WebAppTestBase
    {
        private readonly SubmissionsManager manager;

        private readonly string teamUserId = "988c03c5-94c8-42f6-bf83-ffc57326e216";

        public SubmissionsTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
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
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));
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
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));
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
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));

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
        public async Task CanUpdateEvacuation()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));

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
        public async Task CanCreateNewRegistrantProfile()
        {
            var baseRegistrant = (await GetRegistrantByUserId("CHRIS-TEST"));

            var newProfileBceId = Guid.NewGuid().ToString("N").Substring(0, 10);
            var country = "CAN";
            var province = "BC";
            var community = "226adfaf-9f97-ea11-b813-005056830319";
            string city = null;

            baseRegistrant.Id = null;
            baseRegistrant.UserId = newProfileBceId;
            baseRegistrant.PrimaryAddress.Country = country;
            baseRegistrant.PrimaryAddress.StateProvince = province;
            baseRegistrant.PrimaryAddress.Community = community;
            baseRegistrant.PrimaryAddress.City = city;
            baseRegistrant.MailingAddress.Country = country;
            baseRegistrant.MailingAddress.StateProvince = province;
            baseRegistrant.MailingAddress.Community = community;
            baseRegistrant.MailingAddress.City = city;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = baseRegistrant });

            var newRegistrant = (await GetRegistrantByUserId(newProfileBceId)).ShouldNotBeNull();

            newRegistrant.Id.ShouldBe(id);
            newRegistrant.Id.ShouldNotBe(baseRegistrant.Id);
            newRegistrant.PrimaryAddress.Country.ShouldBe(country);
            newRegistrant.PrimaryAddress.StateProvince.ShouldBe(province);
            newRegistrant.PrimaryAddress.Community.ShouldBe(community);
            newRegistrant.PrimaryAddress.City.ShouldBe(city);

            newRegistrant.MailingAddress.Country.ShouldBe(country);
            newRegistrant.MailingAddress.StateProvince.ShouldBe(province);
            newRegistrant.MailingAddress.Community.ShouldBe(community);
            newRegistrant.MailingAddress.City.ShouldBe(city);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanDeleteRegistrantProfile()
        {
            var baseRegistrant = (await GetRegistrantByUserId("CHRIS-TEST"));

            baseRegistrant.Id = null;
            baseRegistrant.UserId = Guid.NewGuid().ToString("N").Substring(0, 10);

            var newRegistrantId = await manager.Handle(new SaveRegistrantCommand { Profile = baseRegistrant });
            newRegistrantId.ShouldNotBeNull();

            await manager.Handle(new DeleteRegistrantCommand { UserId = baseRegistrant.UserId });

            (await GetRegistrantByUserId(baseRegistrant.UserId)).ShouldBeNull();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateProfile()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));
            var currentCommunity = registrant.PrimaryAddress.Community;
            var newCommunity = currentCommunity == "406adfaf-9f97-ea11-b813-005056830319"
                ? "226adfaf-9f97-ea11-b813-005056830319"
                : "406adfaf-9f97-ea11-b813-005056830319";

            string currentCountry = registrant.PrimaryAddress.Country;
            string newCountry;
            string newProvince;
            string newCity;
            string newPostalCode;
            if (currentCountry.Equals("CAN"))
            {
                newCountry = "USA";
                newProvince = "WA";
                newCity = "Seattle";
                newPostalCode = "12345";
            }
            else
            {
                newCountry = "CAN";
                newProvince = "BC";
                newCity = "Vancouver";
                newPostalCode = "v1v 1v1";
            }

            registrant.PrimaryAddress.Country = newCountry;
            registrant.PrimaryAddress.StateProvince = newProvince;
            registrant.PrimaryAddress.Community = newCommunity;
            registrant.PrimaryAddress.City = newCity;
            registrant.PrimaryAddress.PostalCode = newPostalCode;

            string newEmail = "christest3@email" + Guid.NewGuid().ToString("N").Substring(0, 10);
            registrant.Email = newEmail;

            var currentPhone = registrant.Phone;
            string newPhone = currentPhone == "7789877897" ? "6045557777" : "7789998888";
            registrant.Phone = newPhone;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var updatedRegistrant = (await GetRegistrantByUserId("CHRIS-TEST"));
            updatedRegistrant.Id.ShouldBe(id);
            updatedRegistrant.Id.ShouldBe(registrant.Id);
            updatedRegistrant.Email.ShouldBe(newEmail);
            updatedRegistrant.Phone.ShouldBe(newPhone);
            updatedRegistrant.PrimaryAddress.Country.ShouldBe(newCountry);
            updatedRegistrant.PrimaryAddress.StateProvince.ShouldBe(newProvince);
            updatedRegistrant.PrimaryAddress.Community.ShouldBe(newCommunity);
            updatedRegistrant.PrimaryAddress.City.ShouldBe(newCity);
            updatedRegistrant.PrimaryAddress.PostalCode.ShouldBe(newPostalCode);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Link_RegistrantToHouseholdMember_ReturnsRegistrantId()
        {
            var baseRegistrant = (await GetRegistrantByUserId("CHRIS-TEST"));

            var newProfileBceId = Guid.NewGuid().ToString("N").Substring(0, 10);
            var country = "CAN";
            var province = "BC";
            var community = "226adfaf-9f97-ea11-b813-005056830319";
            string city = null;

            baseRegistrant.Id = null;
            baseRegistrant.UserId = newProfileBceId;
            baseRegistrant.PrimaryAddress.Country = country;
            baseRegistrant.PrimaryAddress.StateProvince = province;
            baseRegistrant.PrimaryAddress.Community = community;
            baseRegistrant.PrimaryAddress.City = city;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = baseRegistrant });

            var registrant = (await GetRegistrantByUserId(newProfileBceId)).ShouldNotBeNull();

            var file = (await GetEvacuationFileById("101010")).FirstOrDefault();
            var member = file.NeedsAssessment.HouseholdMembers.FirstOrDefault();

            var fileId = await manager.Handle(new LinkRegistrantCommand { FileId = file.Id, RegistantId = registrant.Id, HouseholdMemberId = member.Id });
            fileId.ShouldBe(file.Id);

            var updatedFile = (await GetEvacuationFileById("101010")).FirstOrDefault();
            updatedFile.NeedsAssessment.HouseholdMembers.Where(m => m.Id == member.Id).SingleOrDefault().LinkedRegistrantId.ShouldBe(registrant.Id);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanDeleteProfileAddressLinks()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));
            if (string.IsNullOrEmpty(registrant.PrimaryAddress.StateProvince))
            {
                await CanUpdateProfile(); //populates the community and state/province fields
                registrant = (await GetRegistrantByUserId("CHRIS-TEST"));
            }

            string newProvince = null;
            string newCommunity = null;
            registrant.PrimaryAddress.StateProvince = newProvince;
            registrant.PrimaryAddress.Community = newCommunity;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var updatedRegistrant = (await GetRegistrantByUserId("CHRIS-TEST"));
            updatedRegistrant.Id.ShouldBe(id);
            updatedRegistrant.Id.ShouldBe(registrant.Id);
            updatedRegistrant.PrimaryAddress.StateProvince.ShouldBe(newProvince);
            updatedRegistrant.PrimaryAddress.Community.ShouldBe(newCommunity);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateRegistrantVerified()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));
            var currentVerifiedStatus = registrant.VerifiedUser;
            var newStatus = !currentVerifiedStatus;

            var id = await manager.Handle(new SetRegistrantVerificationStatusCommand { RegistrantId = registrant.Id, Verified = newStatus });

            var updatedRegistrant = (await GetRegistrantByUserId("CHRIS-TEST"));
            updatedRegistrant.Id.ShouldBe(id);
            updatedRegistrant.Id.ShouldBe(registrant.Id);
            updatedRegistrant.VerifiedUser.ShouldBe(newStatus);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchRegistrantsByUserId()
        {
            var userId = "CHRIS-TEST";
            var registrant = (await manager.Handle(new RegistrantsQuery { UserId = userId })).Items.SingleOrDefault();

            var profile = registrant.ShouldNotBeNull().ShouldNotBeNull();
            profile.UserId.ShouldBe(userId);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchRegistrantsByNonExistentValues()
        {
            (await manager.Handle(new RegistrantsQuery
            {
                UserId = "__nouser__"
            })).Items.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchEvacuationFilesByRegistrantUserName()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));
            var files = (await manager.Handle(new EvacuationFilesQuery { PrimaryRegistrantUserId = registrant.UserId })).Items;

            files.ShouldNotBeEmpty();
            files.ShouldAllBe(f => f.PrimaryRegistrantId == registrant.Id);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchEvacuationFilesByLinkedRegistrantId()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));
            var statuses = new[] { EvacuationFileStatus.Active, EvacuationFileStatus.Archived, EvacuationFileStatus.Completed, EvacuationFileStatus.Expired, EvacuationFileStatus.Pending };

            var files = (await manager.Handle(new EvacuationFilesQuery { LinkedRegistrantId = registrant.Id, IncludeFilesInStatuses = statuses })).Items;

            files.ShouldNotBeEmpty();

            files.ShouldAllBe(f => f.HouseholdMembers.Any(h => h.LinkedRegistrantId == registrant.Id));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchEvacuationFilesByBCServicesCardId()
        {
            var bcscId = "TX2JXF2AEFJP4NHJ2EP6SMXGGONIXEDO";
            var statuses = new[] { EvacuationFileStatus.Active, EvacuationFileStatus.Pending };

            var files = (await manager.Handle(new EvacuationFilesQuery { PrimaryRegistrantUserId = bcscId, IncludeFilesInStatuses = statuses })).Items;

            files.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchEvacueesByName()
        {
            var firstName = "Elvis";
            var lastName = "Presley";
            var dateOfBirth = "08/01/1935";

            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = firstName, LastName = lastName, DateOfBirth = dateOfBirth, IncludeRestrictedAccess = true });

            var registrants = searchResults.Profiles;
            registrants.ShouldNotBeEmpty();
            registrants.ShouldAllBe(r => r.FirstName.Equals(firstName, StringComparison.OrdinalIgnoreCase) && r.LastName.Equals(lastName, StringComparison.OrdinalIgnoreCase));

            var files = searchResults.EvacuationFiles;
            files.ShouldNotBeEmpty();
            files.ShouldAllBe(f => f.HouseholdMembers
                .Any(m => m.FirstName.Equals(firstName, StringComparison.OrdinalIgnoreCase) &&
                m.LastName.Equals(lastName, StringComparison.OrdinalIgnoreCase) &&
                m.DateOfBirth == dateOfBirth));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Search_EvacuationFiles_IncludeRegistrantProfilesOnly()
        {
            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = "Elvis", LastName = "Presley", DateOfBirth = "08/01/1935", IncludeRegistrantProfilesOnly = true, IncludeRestrictedAccess = true });

            searchResults.EvacuationFiles.ShouldBeEmpty();
            searchResults.Profiles.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Search_EvacuationFiles_IncludeEvacuationFilesOnly()
        {
            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = "Elvis", LastName = "Presley", DateOfBirth = "08/01/1935", IncludeEvacuationFilesOnly = true, IncludeRestrictedAccess = true });

            searchResults.EvacuationFiles.ShouldNotBeEmpty();
            searchResults.Profiles.ShouldBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task Search_EvacuationFiles_IncludeBoth()
        {
            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = "Elvis", LastName = "Presley", DateOfBirth = "08/01/1935", IncludeRestrictedAccess = true });

            searchResults.EvacuationFiles.ShouldNotBeEmpty();
            searchResults.Profiles.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanVerifySecurityQuestions()
        {
            var expectedNumberOfCorrectAnswers = 3;
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));

            //if need to update security questions
            //List<SecurityQuestion> securityQuestions = new List<SecurityQuestion>();
            //securityQuestions.Add(new SecurityQuestion { Id = 1, Question = "question1", Answer = "answer1 - test", AnswerChanged = true });
            //securityQuestions.Add(new SecurityQuestion { Id = 2, Question = "question2", Answer = "answer2 - test", AnswerChanged = true });
            //securityQuestions.Add(new SecurityQuestion { Id = 3, Question = "question3", Answer = "answer3 - test", AnswerChanged = true });
            //registrant.SecurityQuestions = securityQuestions;
            //await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var answers = registrant.SecurityQuestions.Select(q =>
            {
                q.Answer = $"answer{q.Id}";
                return q;
            }).ToArray();
            var actualNumberOfCorrectAnswers = await manager.Handle(new VerifySecurityQuestionsQuery { Answers = answers, RegistrantId = registrant.Id });

            actualNumberOfCorrectAnswers.NumberOfCorrectAnswers.ShouldBe(expectedNumberOfCorrectAnswers);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanPartlyVerifySecurityQuestions()
        {
            var expectedNumberOfCorrectAnswers = 2;
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));

            var answers = registrant.SecurityQuestions.Select(q =>
            {
                q.Answer = $"answer{q.Id}";
                return q;
            }).ToArray();
            answers[2].Answer = "wrong";
            var actualNumberOfCorrectAnswers = await manager.Handle(new VerifySecurityQuestionsQuery { Answers = answers, RegistrantId = registrant.Id });

            actualNumberOfCorrectAnswers.NumberOfCorrectAnswers.ShouldBe(expectedNumberOfCorrectAnswers);
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
        public async Task CanSearchFileNoteByFileId()
        {
            var fileId = "101010";
            var notes = (await manager.Handle(new EvacuationFileNotesQuery { FileId = fileId })).Notes;

            notes.ShouldNotBeNull();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchFileNoteByNoteId()
        {
            var fileId = "101010";
            var noteId = "65dea67d-760a-445d-aa78-101564bbf0b7";
            var notes = (await manager.Handle(new EvacuationFileNotesQuery { NoteId = noteId, FileId = fileId })).Notes;

            notes.ShouldNotBeNull();
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
        public async Task CanProcessSupports()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));
            var file = CreateNewTestEvacuationFile(registrant);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = teamUserId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });
            fileId.ShouldNotBeNull();

            var supports = new Support[]
            {
                new ClothingReferral { SupplierDetails = new SupplierDetails { Id = "9f584892-94fb-eb11-b82b-00505683fbf4" } },
                new IncidentalsReferral(),
                new FoodGroceriesReferral { SupplierDetails = new SupplierDetails { Id = "87dcf79d-acfb-eb11-b82b-00505683fbf4" } },
                new FoodRestaurantReferral { SupplierDetails = new SupplierDetails { Id = "8e290f97-b910-eb11-b820-00505683fbf4" } },
                new LodgingBilletingReferral() { NumberOfNights = 1 },
                new LodgingGroupReferral() { NumberOfNights = 1 },
                new LodgingHotelReferral() { NumberOfNights = 1, NumberOfRooms = 1 },
                new TransportationOtherReferral(),
                new TransportationTaxiReferral(),
            };

            await manager.Handle(new ProcessSupportsCommand { FileId = fileId, supports = supports });

            var refreshedFile = (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.ShouldHaveSingleItem();
            refreshedFile.Supports.ShouldNotBeEmpty();
            refreshedFile.Supports.Count().ShouldBe(supports.Length);
            foreach (var support in refreshedFile.Supports.Cast<Referral>())
            {
                var sourceSupport = (Referral)supports.Where(s => s.GetType() == support.GetType()).ShouldHaveSingleItem();
                if (sourceSupport.SupplierDetails != null)
                {
                    support.SupplierDetails.ShouldNotBeNull();
                    support.SupplierDetails.Id.ShouldBe(sourceSupport.SupplierDetails.Id);
                    support.SupplierDetails.Name.ShouldNotBeNull();
                    support.SupplierDetails.Address.ShouldNotBeNull();
                }
            }
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanVoidSupport()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));
            var file = CreateNewTestEvacuationFile(registrant);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = teamUserId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });
            fileId.ShouldNotBeNull();

            var supports = new Support[]
            {
                new ClothingReferral { SupplierDetails = new SupplierDetails { Id = "9f584892-94fb-eb11-b82b-00505683fbf4" } },
                new IncidentalsReferral(),
                new FoodGroceriesReferral { SupplierDetails = new SupplierDetails { Id = "87dcf79d-acfb-eb11-b82b-00505683fbf4" } },
                new FoodRestaurantReferral { SupplierDetails = new SupplierDetails { Id = "8e290f97-b910-eb11-b820-00505683fbf4" } },
                new LodgingBilletingReferral() { NumberOfNights = 1 },
                new LodgingGroupReferral() { NumberOfNights = 1 },
                new LodgingHotelReferral() { NumberOfNights = 1, NumberOfRooms = 1 },
                new TransportationOtherReferral(),
                new TransportationTaxiReferral(),
            };

            await manager.Handle(new ProcessSupportsCommand { FileId = fileId, supports = supports });

            var fileWithSupports = (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.ShouldHaveSingleItem();

            var support = fileWithSupports.Supports.FirstOrDefault();

            await manager.Handle(new VoidSupportCommand
            {
                FileId = fileId,
                SupportId = support.Id,
                VoidReason = SupportVoidReason.ErrorOnPrintedReferral
            });

            var updatedFile = (await GetEvacuationFileById(fileId)).ShouldHaveSingleItem();
            var updatedSupport = updatedFile.Supports.Where(s => s.Id == support.Id).ShouldHaveSingleItem();

            updatedSupport.Status.ShouldBe(SupportStatus.Void);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanQuerySupplierList()
        {
            var taskId = "UNIT-TEST-ACTIVE-TASK";
            var list = (await manager.Handle(new SuppliersListQuery { TaskId = taskId })).Items;
            list.ShouldNotBeEmpty();
        }

        private async Task<RegistrantProfile> GetRegistrantByUserId(string userId)
        {
            return (await manager.Handle(new RegistrantsQuery { UserId = userId })).Items.SingleOrDefault();
        }

        private async Task<IEnumerable<EvacuationFile>> GetEvacuationFileById(string fileId) =>
            (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items;

        private EvacuationFile CreateNewTestEvacuationFile(RegistrantProfile registrant)
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
    }
}
