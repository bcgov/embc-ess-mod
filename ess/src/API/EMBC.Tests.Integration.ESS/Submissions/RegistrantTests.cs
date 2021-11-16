using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Managers.Submissions;
using EMBC.ESS.Shared.Contracts.Submissions;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Submissions
{
    public class RegistrantTests : WebAppTestBase
    {
        private readonly SubmissionsManager manager;

        private async Task<RegistrantProfile> GetRegistrantByUserId(string userId) => await TestHelper.GetRegistrantByUserId(manager, userId);

        private async Task<IEnumerable<EvacuationFile>> GetEvacuationFileById(string fileId) => await TestHelper.GetEvacuationFileById(manager, fileId);

        private RegistrantProfile CreateNewTestRegistrantProfile(string identifier) => TestHelper.CreateRegistrantProfile(identifier);

        public RegistrantTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            manager = services.GetRequiredService<SubmissionsManager>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanCreateNewRegistrantProfile()
        {
            var uniqueSignature = TestData.TestPrefix + "-" + Guid.NewGuid().ToString().Substring(0, 4);
            var newRegistrant = CreateNewTestRegistrantProfile(uniqueSignature);
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

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateProfile()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var currentCommunity = registrant.PrimaryAddress.Community;
            var newCommunity = currentCommunity == TestData.TeamCommunityId
                ? TestData.OtherCommunityId
                : TestData.TeamCommunityId;

            string currentCountry = registrant.PrimaryAddress.Country;
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

            string newEmail = "christest3@email" + Guid.NewGuid().ToString("N").Substring(0, 10);
            registrant.Email = newEmail;

            var currentPhone = registrant.Phone;
            string newPhone = currentPhone == "7789877897" ? "6045557777" : "7789998888";
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

        [Fact(Skip = RequiresDynamics)]
        public async Task Link_RegistrantToHouseholdMember_ReturnsRegistrantId()
        {
            var identifier = TestData.TestPrefix + "-" + Guid.NewGuid().ToString().Substring(0, 4);
            var newRegistrant = CreateNewTestRegistrantProfile(identifier);
            var newProfileBceId = Guid.NewGuid().ToString("N").Substring(0, 10);
            newRegistrant.UserId = newProfileBceId;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = newRegistrant });

            var registrant = (await GetRegistrantByUserId(newProfileBceId)).ShouldNotBeNull();

            var file = (await GetEvacuationFileById(TestData.EvacuationFileId)).FirstOrDefault();
            var member = file.NeedsAssessment.HouseholdMembers.Where(m => !m.IsPrimaryRegistrant && m.FirstName != $"{TestData.TestPrefix}-member-no-registrant-first").FirstOrDefault();

            var fileId = await manager.Handle(new LinkRegistrantCommand { FileId = file.Id, RegistantId = registrant.Id, HouseholdMemberId = member.Id });
            fileId.ShouldBe(file.Id);

            var updatedFile = (await GetEvacuationFileById(TestData.EvacuationFileId)).FirstOrDefault();
            updatedFile.NeedsAssessment.HouseholdMembers.Where(m => m.Id == member.Id).SingleOrDefault().LinkedRegistrantId.ShouldBe(registrant.Id);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanDeleteProfileAddressLinks()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            if (string.IsNullOrEmpty(registrant.PrimaryAddress.StateProvince))
            {
                await CanUpdateProfile(); //populates the community and state/province fields
                registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            }

            string newProvince = null;
            string newCommunity = null;
            registrant.PrimaryAddress.StateProvince = newProvince;
            registrant.PrimaryAddress.Community = newCommunity;

            var id = await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var updatedRegistrant = await GetRegistrantByUserId(TestData.ContactUserId);
            updatedRegistrant.Id.ShouldBe(id);
            updatedRegistrant.Id.ShouldBe(registrant.Id);
            updatedRegistrant.PrimaryAddress.StateProvince.ShouldBe(newProvince);
            updatedRegistrant.PrimaryAddress.Community.ShouldBe(newCommunity);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanUpdateRegistrantVerified()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var currentVerifiedStatus = registrant.VerifiedUser;
            var newStatus = !currentVerifiedStatus;

            var id = await manager.Handle(new SetRegistrantVerificationStatusCommand { RegistrantId = registrant.Id, Verified = newStatus });

            var updatedRegistrant = (await GetRegistrantByUserId(TestData.ContactUserId));
            updatedRegistrant.Id.ShouldBe(id);
            updatedRegistrant.Id.ShouldBe(registrant.Id);
            updatedRegistrant.VerifiedUser.ShouldBe(newStatus);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanVerifySecurityQuestions()
        {
            var expectedNumberOfCorrectAnswers = 3;
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);

            List<SecurityQuestion> securityQuestions = new List<SecurityQuestion>();
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

        [Fact(Skip = RequiresDynamics)]
        public async Task CanPartlyVerifySecurityQuestions()
        {
            var expectedNumberOfCorrectAnswers = 2;
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);

            List<SecurityQuestion> securityQuestions = new List<SecurityQuestion>();
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

        [Fact(Skip = RequiresDynamics)]
        public async Task CanReprintSupport()
        {
            var printRequestId = await manager.Handle(new ReprintSupportCommand
            {
                FileId = TestData.EvacuationFileId,
                ReprintReason = "test",
                RequestingUserId = TestData.Tier4TeamMemberId,
                SupportId = TestData.SupportIds.First()
            });

            printRequestId.ShouldNotBeNullOrEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
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
                Email = "test@nowhere.notavailable",
                RequestingUserId = null
            });
            inviteId.ShouldNotBeNullOrEmpty();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanProcessRegistrantInvite()
        {
            var uniqueSignature = TestData.TestPrefix + "-" + Guid.NewGuid().ToString().Substring(0, 4);
            var newRegistrant = CreateNewTestRegistrantProfile(uniqueSignature);

            var registrantId = await manager.Handle(new SaveRegistrantCommand { Profile = newRegistrant });

            var inviteId = await manager.Handle(new InviteRegistrantCommand
            {
                RegistrantId = registrantId,
                Email = "test@nowhere.notavailable",
                RequestingUserId = null
            });

            var dp = services.GetRequiredService<IDataProtectionProvider>().CreateProtector(nameof(InviteRegistrantCommand)).ToTimeLimitedDataProtector();
            var encryptedInviteId = dp.Protect(inviteId);

            await manager.Handle(new ProcessRegistrantInviteCommand { InviteId = encryptedInviteId, LoggedInUserId = uniqueSignature });

            var actualRegistrant = (await TestHelper.GetRegistrantByUserId(manager, uniqueSignature)).ShouldNotBeNull();
            actualRegistrant.AuthenticatedUser.ShouldBeTrue();
            actualRegistrant.VerifiedUser.ShouldBeTrue();
        }
    }
}
