using System;
using System.Collections.Generic;
using System.Linq;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Managers.Events
{
    public class RegistrantTests : DynamicsWebAppTestBase
    {
        private readonly EventsManager manager;

        private async Task<RegistrantProfile> GetRegistrantByUserId(string userId) => (await TestHelper.GetRegistrantByUserId(manager, userId)).ShouldNotBeNull();

        private async Task<EvacuationFile> GetEvacuationFileById(string fileId) => await TestHelper.GetEvacuationFileById(manager, fileId) ?? null!;

        private RegistrantProfile CreateNewTestRegistrantProfile() => TestHelper.CreateRegistrantProfile(TestData.TestPrefix);

        public RegistrantTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            manager = Services.GetRequiredService<EventsManager>();
        }

        [Fact]
        public async Task CanCreateNewRegistrantProfile()
        {
            var newRegistrant = CreateNewTestRegistrantProfile();
            var newProfileBceId = Guid.NewGuid().ToString("N").Substring(0, 10);
            newRegistrant.UserId = newProfileBceId;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = newRegistrant });

            var actualRegistrant = (await GetRegistrantByUserId(newProfileBceId)).ShouldNotBeNull();
            actualRegistrant.Id.ShouldBe(id);
            actualRegistrant.FirstName.ShouldStartWith(TestData.TestPrefix);
            actualRegistrant.LastName.ShouldStartWith(TestData.TestPrefix);
            actualRegistrant.Email.ShouldStartWith(TestData.TestPrefix);
            actualRegistrant.PrimaryAddress.AddressLine1.ShouldStartWith(TestData.TestPrefix);
            actualRegistrant.MailingAddress.AddressLine1.ShouldStartWith(TestData.TestPrefix);
        }

        [Fact]
        public async Task CanUpdateProfile()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var currentCommunity = registrant.PrimaryAddress.Community;
            var newCommunity = currentCommunity == TestData.Team1CommunityId
                ? TestData.OtherCommunityId
                : TestData.Team1CommunityId;

            var currentCountry = registrant.PrimaryAddress.Country;
            string newCountry;
            string newProvince;
            string newCity;
            string newPostalCode;
            if (!string.IsNullOrEmpty(currentCountry) && currentCountry.Equals("CAN"))
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

            var newEmail = "christest3@email" + Guid.NewGuid().ToString("N").Substring(0, 10);
            registrant.Email = newEmail;

            var currentPhone = registrant.Phone;
            var newPhone = currentPhone == "7789877897" ? "6045557777" : "7789998888";
            registrant.Phone = newPhone;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var updatedRegistrant = await GetRegistrantByUserId(TestData.ContactUserId);
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

        [Fact]
        public async Task Link_RegistrantToHouseholdMember_ReturnsRegistrantId()
        {
            var newRegistrant = CreateNewTestRegistrantProfile();
            var newProfileBceId = Guid.NewGuid().ToString("N").Substring(0, 10);
            newRegistrant.UserId = newProfileBceId;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = newRegistrant });

            var registrant = (await GetRegistrantByUserId(newProfileBceId)).ShouldNotBeNull();

            var file = await GetEvacuationFileById(TestData.EvacuationFileId);
            var member = file.NeedsAssessment.HouseholdMembers.Where(m => !m.IsPrimaryRegistrant && m.FirstName != $"{TestData.TestPrefix}-member-no-registrant-first").First();

            var fileId = await manager.Handle(new LinkRegistrantCommand { FileId = file.Id, RegistantId = registrant.Id, HouseholdMemberId = member.Id });
            fileId.ShouldBe(file.Id);

            var updatedFile = await GetEvacuationFileById(TestData.EvacuationFileId);
            updatedFile.NeedsAssessment.HouseholdMembers.Where(m => m.Id == member.Id).Single().LinkedRegistrantId.ShouldBe(registrant.Id);
        }

        [Fact]
        public async Task CanDeleteProfileAddressLinks()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            if (string.IsNullOrEmpty(registrant.PrimaryAddress.StateProvince))
            {
                await CanUpdateProfile(); //populates the community and state/province fields
                registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            }

            string? newProvince = null;
            string? newCommunity = null;
            registrant.PrimaryAddress.StateProvince = newProvince;
            registrant.PrimaryAddress.Community = newCommunity;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var updatedRegistrant = await GetRegistrantByUserId(TestData.ContactUserId);
            updatedRegistrant.Id.ShouldBe(id);
            updatedRegistrant.Id.ShouldBe(registrant.Id);
            updatedRegistrant.PrimaryAddress.StateProvince.ShouldBe(newProvince);
            updatedRegistrant.PrimaryAddress.Community.ShouldBe(newCommunity);
        }

        [Fact]
        public async Task CanUpdateRegistrantVerified()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var currentVerifiedStatus = registrant.VerifiedUser;
            var newStatus = !currentVerifiedStatus;

            var id = await manager.Handle(new SetRegistrantVerificationStatusCommand { RegistrantId = registrant.Id, Verified = newStatus.HasValue ? newStatus.Value : false });

            var updatedRegistrant = await GetRegistrantByUserId(TestData.ContactUserId);
            updatedRegistrant.Id.ShouldBe(id);
            updatedRegistrant.Id.ShouldBe(registrant.Id);
            updatedRegistrant.VerifiedUser.ShouldBe(newStatus);
        }

        [Fact]
        public async Task CanVerifySecurityQuestions()
        {
            var expectedNumberOfCorrectAnswers = 3;
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);

            var securityQuestions = new List<SecurityQuestion>();
            securityQuestions.Add(new SecurityQuestion { Id = 1, Question = "question1", Answer = "answer1", AnswerChanged = true });
            securityQuestions.Add(new SecurityQuestion { Id = 2, Question = "question2", Answer = "answer2", AnswerChanged = true });
            securityQuestions.Add(new SecurityQuestion { Id = 3, Question = "question3", Answer = "answer3", AnswerChanged = true });
            registrant.SecurityQuestions = securityQuestions;
            await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var answers = registrant.SecurityQuestions.Select(q =>
            {
                q.Answer = $"answer{q.Id}";
                return q;
            }).ToArray();
            var actualNumberOfCorrectAnswers = await manager.Handle(new VerifySecurityQuestionsQuery { Answers = answers, RegistrantId = registrant.Id });

            actualNumberOfCorrectAnswers.NumberOfCorrectAnswers.ShouldBe(expectedNumberOfCorrectAnswers);
        }

        [Fact]
        public async Task CanPartlyVerifySecurityQuestions()
        {
            var expectedNumberOfCorrectAnswers = 2;
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);

            var securityQuestions = new List<SecurityQuestion>();
            securityQuestions.Add(new SecurityQuestion { Id = 1, Question = "question1", Answer = "answer1", AnswerChanged = true });
            securityQuestions.Add(new SecurityQuestion { Id = 2, Question = "question2", Answer = "answer2", AnswerChanged = true });
            securityQuestions.Add(new SecurityQuestion { Id = 3, Question = "question3", Answer = "answer3", AnswerChanged = true });
            registrant.SecurityQuestions = securityQuestions;
            await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var answers = registrant.SecurityQuestions.Select(q =>
            {
                q.Answer = $"answer{q.Id}";
                return q;
            }).ToArray();
            answers[2].Answer = "wrong";
            var actualNumberOfCorrectAnswers = await manager.Handle(new VerifySecurityQuestionsQuery { Answers = answers, RegistrantId = registrant.Id });

            actualNumberOfCorrectAnswers.NumberOfCorrectAnswers.ShouldBe(expectedNumberOfCorrectAnswers);
        }

        [Fact]
        public async Task CanInviteRegistrant()
        {
            var uniqueSignature = Guid.NewGuid().ToString().Substring(0, 4);

            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            registrant.Id = null;
            registrant.UserId = null;
            registrant.AuthenticatedUser = false;
            registrant.VerifiedUser = false;
            registrant.FirstName += "_" + uniqueSignature;
            registrant.LastName += "_" + uniqueSignature;

            var registrantId = await TestHelper.SaveRegistrant(manager, registrant);
            var inviteId = await manager.Handle(new InviteRegistrantCommand
            {
                RegistrantId = registrantId,
                Email = $"{TestData.TestPrefix}eraunitest@test.gov.bc.ca",
                RequestingUserId = null
            });
            inviteId.ShouldNotBeNullOrEmpty();
        }

        [Fact]
        public async Task CanProcessRegistrantInvite()
        {
            var newRegistrant = CreateNewTestRegistrantProfile();
            var userId = TestHelper.GenerateNewUniqueId(TestData.TestPrefix);

            var registrantId = await manager.Handle(new SaveRegistrantCommand { Profile = newRegistrant });

            var inviteId = await manager.Handle(new InviteRegistrantCommand
            {
                RegistrantId = registrantId,
                Email = $"{TestData.TestPrefix}eraunitest@test.gov.bc.ca",
                RequestingUserId = null
            });

            var dp = Services.GetRequiredService<IDataProtectionProvider>().CreateProtector(nameof(InviteRegistrantCommand)).ToTimeLimitedDataProtector();
            var encryptedInviteId = dp.Protect(inviteId);

            await manager.Handle(new ProcessRegistrantInviteCommand { InviteId = encryptedInviteId, LoggedInUserId = userId });

            var actualRegistrant = (await TestHelper.GetRegistrantByUserId(manager, userId)).ShouldNotBeNull();
            actualRegistrant.AuthenticatedUser.HasValue.ShouldBeTrue();
            actualRegistrant.AuthenticatedUser.Value.ShouldBeTrue();
            actualRegistrant.VerifiedUser.HasValue.ShouldBeTrue();
            actualRegistrant.VerifiedUser.Value.ShouldBeTrue();
        }

        [Fact]
        public async Task ProcessRegistrantInvite_TwoSameRegistrant_FirstIsInvalid()
        {
            var dp = Services.GetRequiredService<IDataProtectionProvider>().CreateProtector(nameof(InviteRegistrantCommand)).ToTimeLimitedDataProtector();
            var registrant = CreateNewTestRegistrantProfile();
            var userId = TestHelper.GenerateNewUniqueId(TestData.TestPrefix);

            var registrantId = await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var firstInviteId = dp.Protect(await manager.Handle(new InviteRegistrantCommand
            {
                RegistrantId = registrantId,
                Email = $"{TestData.TestPrefix}eraunitest@test.gov.bc.ca",
                RequestingUserId = null
            }));

            var secondInviteId = dp.Protect(await manager.Handle(new InviteRegistrantCommand
            {
                RegistrantId = registrantId,
                Email = $"{TestData.TestPrefix}eraunitest@test.gov.bc.ca",
                RequestingUserId = null
            }));

            await Should.ThrowAsync<NotFoundException>(manager.Handle(new ProcessRegistrantInviteCommand { InviteId = firstInviteId, LoggedInUserId = userId }));
            await Should.NotThrowAsync(manager.Handle(new ProcessRegistrantInviteCommand { InviteId = secondInviteId, LoggedInUserId = userId }));
        }
    }
}
