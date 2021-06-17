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
            var textContextIdentifier = DateTime.Now.ToShortTimeString();
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
                FirstName = $"PriRegTestFirst-{textContextIdentifier}",
                LastName = $"PriRegTestLast-{textContextIdentifier}",
                DateOfBirth = "2000/01/01",
                Gender = "Female",
                Initials = "initials1",
                PreferredName = "preferred1",
                Email = "email@org.com",
                Phone = "999-999-9999",
                PrimaryAddress = new Address
                {
                    AddressLine1 = $"paddr1-{textContextIdentifier}",
                    AddressLine2 = "paddr2",
                    Country = "CAN",
                    StateProvince = "BC",
                    PostalCode = "v1v 1v1",
                    Community = "226adfaf-9f97-ea11-b813-005056830319"
                },
                MailingAddress = new Address
                {
                    AddressLine1 = $"maddr1-{textContextIdentifier}",
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
                            Id = null,

                                FirstName = $"MemRegTestFirst-{textContextIdentifier}",
                                LastName = $"MemRegTestLast-{textContextIdentifier}",
                                Gender = "X",
                                DateOfBirth = "2010-01-01"
                        }
                    },
                HaveMedication = false,
                Insurance = InsuranceOption.Yes,
                HaveSpecialDiet = true,
                SpecialDietDetails = "Gluten Free",
                HasPetsFood = true,
                CanEvacueeProvideClothing = false,
                CanEvacueeProvideFood = true,
                CanEvacueeProvideIncidentals = null,
                CanEvacueeProvideLodging = false,
                CanEvacueeProvideTransportation = true,
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
                        AddressLine1 = $"addr1-{textContextIdentifier}",
                        Country = "CAN",
                        Community = "226adfaf-9f97-ea11-b813-005056830319",
                        StateProvince = "BC",
                        PostalCode = "v1v 1v1"
                    },
                    EvacuationDate = DateTime.Now,
                    NeedsAssessments = new[] { needsAssessment },
                },
                SubmitterProfile = profile
            };

            var fileId = await manager.Handle(cmd);
            fileId.ShouldNotBeNull();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSubmitNewEvacuation()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;
            var textContextIdentifier = DateTime.Now.ToShortTimeString();
            var needsAssessment = new NeedsAssessment
            {
                HouseholdMembers = new[]
                {
                    new HouseholdMember
                    {
                        Id = null,

                            FirstName = $"MemRegTestFirst-{textContextIdentifier}",
                            LastName = $"MemRegTestLast-{textContextIdentifier}",
                            Gender = "X",
                            DateOfBirth = "2010-01-01"
                    }
                },
                HaveMedication = false,
                Insurance = InsuranceOption.Yes,
                HaveSpecialDiet = true,
                SpecialDietDetails = "Gluten Free",
                HasPetsFood = true,
                CanEvacueeProvideClothing = false,
                CanEvacueeProvideFood = true,
                CanEvacueeProvideIncidentals = null,
                CanEvacueeProvideLodging = false,
                CanEvacueeProvideTransportation = true,
                Pets = new[]
                {
                    new Pet{ Type = $"dog{textContextIdentifier}", Quantity = "4" }
                }
            };
            var cmd = new SubmitEvacuationFileCommand
            {
                File = new EvacuationFile
                {
                    Id = null,
                    EvacuatedFromAddress = new Address
                    {
                        AddressLine1 = $"addr1-{textContextIdentifier}",
                        Country = "CAN",
                        Community = "226adfaf-9f97-ea11-b813-005056830319",
                        StateProvince = "BC",
                        PostalCode = "v1v 1v1"
                    },
                    EvacuationDate = DateTime.Now,
                    NeedsAssessments = new[] { needsAssessment },
                    PrimaryRegistrantId = registrant.Id
                },
            };

            var fileId = await manager.Handle(cmd);
            fileId.ShouldNotBeNull();

            var file = (await GetRegistrantFilesByPrimaryRegistrantId(registrant.Id)).Where(f => f.Id == fileId).ShouldHaveSingleItem();
            file.PrimaryRegistrantId.ShouldBe(registrant.Id);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateEvacuation()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);

            var registrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;
            var file = (await GetRegistrantFilesByPrimaryRegistrantId(registrant.Id)).Last();

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
            var baseRegistrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;

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

            var newRegistrant = (await GetRegistrantByUserId(newProfileBceId)).ShouldNotBeNull().RegistrantProfile;

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
            var baseRegistrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;

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
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;
            var currentCity = registrant.PrimaryAddress.Community;
            var newCity = currentCity == "406adfaf-9f97-ea11-b813-005056830319"
                ? "226adfaf-9f97-ea11-b813-005056830319"
                : "406adfaf-9f97-ea11-b813-005056830319";

            registrant.Email = "christest3@email" + Guid.NewGuid().ToString("N").Substring(0, 10);
            registrant.PrimaryAddress.Community = newCity;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var updatedRegistrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;
            updatedRegistrant.Id.ShouldBe(id);
            updatedRegistrant.Id.ShouldBe(registrant.Id);
            updatedRegistrant.Email.ShouldBe(registrant.Email);
            updatedRegistrant.PrimaryAddress.Community.ShouldBe(newCity);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetRegistrantProfile()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;

            registrant.ShouldNotBeNull();

            registrant.PrimaryAddress.Country.ShouldNotBeNull().ShouldNotBeNull();
            registrant.PrimaryAddress.Country.ShouldNotBeNull();
            registrant.PrimaryAddress.StateProvince.ShouldNotBeNull().ShouldNotBeNull();
            registrant.PrimaryAddress.StateProvince.ShouldNotBeNull();
            registrant.PrimaryAddress.Community.ShouldNotBeNull().ShouldNotBeNull();
            registrant.PrimaryAddress.Community.ShouldNotBeNull();

            var registrants = (await GetRegistrantsByName("Elvis", "Presley")).Select(r => r.RegistrantProfile);

            registrants.ShouldNotBeNull();
            registrants.ShouldAllBe(r => r.FirstName == "Elvis");
            registrants.ShouldAllBe(r => r.LastName == "Presley");

            registrants = (await GetRegistrantsByNameAndBirthdate("Elvis", "Presley", "2010-01-01")).Select(r => r.RegistrantProfile);

            registrants.ShouldNotBeNull();
            registrants.ShouldBeEmpty();
            //registrants.ShouldAllBe(r => r.FirstName == "Elvis");
            //registrants.ShouldAllBe(r => r.LastName == "Presley");
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchEvacuationFilesByRegistrantUserName()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;
            var files = await GetRegistrantFilesByPrimaryRegistrantId(registrant.Id);

            files.ShouldNotBeEmpty();
            files.ShouldAllBe(f => f.PrimaryRegistrantId == registrant.Id);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchEvacuationFilesByPersonalDetails()
        {
            var files = (await manager.Handle(new EvacuationFilesSearchQuery
            {
                FirstName = "Elvis",
                LastName = "Presley",
                DateOfBirth = "08/01/1935"
            })).Items;

            files.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanVerifySecurityQuestions()
        {
            //If you need to set the security answers for testing.
            //var registrant = await GetRegistrantByUserId("CHRIS-TEST");

            //List<SecurityQuestion> securityQuestions = new List<SecurityQuestion>();
            //securityQuestions.Add(new SecurityQuestion { Id = 1, Question = "question1", Answer = "answer1", AnswerChanged = true });
            //securityQuestions.Add(new SecurityQuestion { Id = 2, Question = "question2", Answer = "answer2", AnswerChanged = true });
            //securityQuestions.Add(new SecurityQuestion { Id = 3, Question = "question3", Answer = "answer3", AnswerChanged = true });

            //registrant.SecurityQuestions = securityQuestions;
            //await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            List<SecurityQuestion> answers = new List<SecurityQuestion>();
            answers.Add(new SecurityQuestion { Id = 1, Question = "question1", Answer = "answer1" });
            answers.Add(new SecurityQuestion { Id = 2, Question = "question2", Answer = "answer2" });
            answers.Add(new SecurityQuestion { Id = 3, Question = "question3", Answer = "answer3" });

            var registrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;

            var num = await manager.Handle(new VerifySecurityQuestionsQuery { Answers = answers, RegistrantId = registrant.Id });

            num.NumberOfCorrectAnswers.ShouldBe(answers.Count());
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanVerifySecurityPhrase()
        {
            string fileId = "100644";

            //If you need to set the security phrase for testing.
            //var file = (await GetEvacuationFileById(fileId)).FirstOrDefault();
            //file.SecurityPhrase = "SecretPhrase";
            //file.SecurityPhraseChanged = true;
            //await manager.Handle(new SubmitEvacuationFileCommand { File = file });

            var response = await manager.Handle(new VerifySecurityPhraseQuery { FileId = fileId, SecurityPhrase = "SecretPhrase" });
            response.IsCorrect.ShouldBeTrue();
        }

        private async Task<RegistrantWithFiles> GetRegistrantByUserId(string userId)
        {
            return (await manager.Handle(new RegistrantsSearchQuery { UserId = userId })).Items.SingleOrDefault();
        }

        private async Task<IEnumerable<RegistrantWithFiles>> GetRegistrantsByName(string firstName, string lastName)
        {
            return (await manager.Handle(new RegistrantsSearchQuery
            {
                FirstName = firstName,
                LastName = lastName
            })).Items.ToList();
        }

        private async Task<IEnumerable<RegistrantWithFiles>> GetRegistrantsByNameAndBirthdate(string firstName, string lastName, string dateOfBirth)
        {
            return (await manager.Handle(new RegistrantsSearchQuery
            {
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth
            })).Items.ToList();
        }

        private async Task<IEnumerable<EvacuationFile>> GetRegistrantFilesByPrimaryRegistrantId(string registrantId)
        {
            return (await manager.Handle(new EvacuationFilesSearchQuery { PrimaryRegistrantId = registrantId })).Items;
        }

        private async Task<IEnumerable<EvacuationFile>> GetEvacuationFileById(string fileId)
        {
            return (await manager.Handle(new EvacuationFilesSearchQuery { FileId = fileId })).Items;
        }

        private EvacuationFile CreateTestFile(string primaryRegistrantId)
        {
            var uniqueSignature = Guid.NewGuid().ToString().Substring(0, 5);
            var file = new EvacuationFile()
            {
                PrimaryRegistrantId = primaryRegistrantId,
                EvacuatedFromAddress = new Address()
                {
                    AddressLine1 = $"{uniqueSignature}_3738 Main St",
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
                                FirstName = $"{uniqueSignature}_hm1",
                                LastName = "hm1",
                                PreferredName = "hm1p",
                                Initials = $"{uniqueSignature}_1",
                                Gender = "X",
                                DateOfBirth = "03/15/2000",
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
                                DateOfBirth = "03/16/2010",
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
