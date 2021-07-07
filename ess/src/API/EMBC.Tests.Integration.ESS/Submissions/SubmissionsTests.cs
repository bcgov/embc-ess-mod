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
    public class SubmissionsTests : WebAppTestBase
    {
        private readonly SubmissionsManager manager;

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
                        PreferredName = profile.PreferredName,
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
        public async Task CanUpdateEvacuation()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));

            var file = (await manager.Handle(new EvacuationFilesQuery { PrimaryRegistrantId = registrant.Id })).Items.Last();

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
            newCommunity = null;

            var currentCity = registrant.PrimaryAddress.City;
            var newCity = currentCity == "Vancouver"
                ? "Burnaby"
                : "Vancouver";
            //newCity = null;

            registrant.Email = "christest3@email" + Guid.NewGuid().ToString("N").Substring(0, 10);
            registrant.PrimaryAddress.Community = newCommunity;
            registrant.PrimaryAddress.City = newCity;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var updatedRegistrant = (await GetRegistrantByUserId("CHRIS-TEST"));
            updatedRegistrant.Id.ShouldBe(id);
            updatedRegistrant.Id.ShouldBe(registrant.Id);
            updatedRegistrant.Email.ShouldBe(registrant.Email);
            updatedRegistrant.PrimaryAddress.Community.ShouldBe(newCommunity);
            updatedRegistrant.PrimaryAddress.City.ShouldBe(newCity);
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
        public async Task CanSearchEvacueesByName()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));

            registrant.ShouldNotBeNull();

            registrant.PrimaryAddress.Country.ShouldNotBeNull();

            var searchResults = await manager.Handle(new EvacueeSearchQuery { FirstName = "Elvis", LastName = "Presley", DateOfBirth = "08/01/1935" });

            var registrants = searchResults.Profiles;
            registrants.ShouldNotBeNull();
            registrants.ShouldAllBe(r => r.FirstName == "Elvis" && r.LastName == "Presley");

            var files = searchResults.EvacuationFiles;
            files.ShouldNotBeNull();
            files.ShouldAllBe(f => f.HouseholdMembers
                .Any(m => m.FirstName.Equals("Elvis", StringComparison.OrdinalIgnoreCase) && m.LastName.Equals("Presley", StringComparison.OrdinalIgnoreCase)));
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanVerifySecurityQuestions()
        {
            var expectedNumberOfCorrectAnswers = 3;
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST"));

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
            var fileId = "PAP2354234";
            var response = await manager.Handle(new VerifySecurityPhraseQuery { FileId = fileId, SecurityPhrase = "My New Security Phrase" });
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
            var noteId = "3fe43acf-edcb-44f7-8112-a9e1a88d401d";
            var notes = (await manager.Handle(new EvacuationFileNotesQuery { NoteId = noteId })).Notes;

            notes.ShouldNotBeNull();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateFileNote()
        {
            var fileId = "101010";
            var note = new Note { Content = "Test create note", Type = NoteType.General, CreatingTeamMemberId = "170b9e4d-731e-4ab8-a0df-ff2612bf6840" };
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

            var id = await manager.Handle(new SaveEvacuationFileNoteCommand { Note = note });
            id.ShouldNotBeNull();
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
                                PreferredName = registrant.PreferredName,
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
                                PreferredName = "hm1p",
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
                                PreferredName = "hm2p",
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
