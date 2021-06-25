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

            var file = (await manager.Handle(new EvacuationFilesSearchQuery { FileId = fileId })).Items.ShouldHaveSingleItem();

            file.HouseholdMembers.ShouldContain(m => m.IsPrimaryRegistrant == true && m.FirstName == profile.FirstName && m.LastName == profile.LastName);
            file.NeedsAssessment.HouseholdMembers.ShouldContain(m => m.IsPrimaryRegistrant == true && m.FirstName == profile.FirstName && m.LastName == profile.LastName);
            file.NeedsAssessment.HouseholdMembers.ShouldContain(m => m.IsPrimaryRegistrant == false && m.FirstName == $"{textContextIdentifier}-MemRegTestFirst" && m.LastName == $"{textContextIdentifier}-MemRegTestLast");
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSubmitNewEvacuation()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;
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

            var file = (await manager.Handle(new EvacuationFilesSearchQuery { PrimaryRegistrantUserId = "CHRIS-TEST" })).Items.Last();

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

            var updatedRegistrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;
            updatedRegistrant.Id.ShouldBe(id);
            updatedRegistrant.Id.ShouldBe(registrant.Id);
            updatedRegistrant.Email.ShouldBe(registrant.Email);
            updatedRegistrant.PrimaryAddress.Community.ShouldBe(newCommunity);
            updatedRegistrant.PrimaryAddress.City.ShouldBe(newCity);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchRegistrantsByName()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;

            registrant.ShouldNotBeNull();

            registrant.PrimaryAddress.Country.ShouldNotBeNull().ShouldNotBeNull();
            registrant.PrimaryAddress.Country.ShouldNotBeNull();

            var registrants = (await manager.Handle(new RegistrantsSearchQuery { FirstName = "Elvis", LastName = "Presley" })).Items.Select(r => r.RegistrantProfile);

            registrants.ShouldNotBeNull();
            registrants.ShouldAllBe(r => r.FirstName == "Elvis");
            registrants.ShouldAllBe(r => r.LastName == "Presley");
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchRegistrantsByUserId()
        {
            var registrant = (await GetRegistrantByUserId("CHRIS-TEST")).RegistrantProfile;

            registrant.ShouldNotBeNull();

            registrant.PrimaryAddress.Country.ShouldNotBeNull().ShouldNotBeNull();
            registrant.PrimaryAddress.Country.ShouldNotBeNull();
            registrant.PrimaryAddress.StateProvince.ShouldNotBeNull().ShouldNotBeNull();
            registrant.PrimaryAddress.StateProvince.ShouldNotBeNull();
            registrant.PrimaryAddress.Community.ShouldNotBeNull().ShouldNotBeNull();
            registrant.PrimaryAddress.Community.ShouldNotBeNull();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanSearchRegistrantsByNonExistentValues()
        {
            (await manager.Handle(new RegistrantsSearchQuery
            {
                FirstName = "Elvis",
                LastName = "Presley",
                DateOfBirth = "2010-01-01"
            })).Items.ShouldBeEmpty();
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
            //var fileId = (await manager.Handle(new EvacuationFilesSearchQuery { PrimaryRegistrantUserId = "CHRIS-TEST" })).Items.Last().Id;
            var fileId = "PAP2354234";
            var response = await manager.Handle(new VerifySecurityPhraseQuery { FileId = fileId, SecurityPhrase = "My New Security Phrase" });
            response.IsCorrect.ShouldBeTrue();
        }

        private async Task<RegistrantWithFiles> GetRegistrantByUserId(string userId)
        {
            return (await manager.Handle(new RegistrantsSearchQuery { UserId = userId })).Items.SingleOrDefault();
        }

        private async Task<IEnumerable<EvacuationFile>> GetRegistrantFilesByPrimaryRegistrantId(string registrantId) =>
            (await manager.Handle(new EvacuationFilesSearchQuery { PrimaryRegistrantId = registrantId })).Items;

        private async Task<IEnumerable<EvacuationFile>> GetEvacuationFileById(string fileId) =>
            (await manager.Handle(new EvacuationFilesSearchQuery { FileId = fileId })).Items;

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
                        }
                    }
            };
            return file;
        }
    }
}
