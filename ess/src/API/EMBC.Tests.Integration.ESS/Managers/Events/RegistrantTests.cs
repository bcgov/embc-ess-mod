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

        private RegistrantProfile CreateNewTestRegistrantProfile() => TestHelper.CreateRegistrantProfile();

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
            actualRegistrant.FirstName.ShouldBe(newRegistrant.FirstName);
            actualRegistrant.LastName.ShouldBe(newRegistrant.LastName);
            actualRegistrant.Email.ShouldBe(newRegistrant.Email);
            actualRegistrant.PrimaryAddress.AddressLine1.ShouldBe(newRegistrant.PrimaryAddress.AddressLine1);
            actualRegistrant.MailingAddress.AddressLine1.ShouldBe(newRegistrant.MailingAddress.AddressLine1);
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

            await manager.Handle(new SaveRegistrantCommand { Profile = newRegistrant });

            var registrant = (await GetRegistrantByUserId(newProfileBceId)).ShouldNotBeNull();

            var file = await GetEvacuationFileById(TestData.EvacuationFileId);
            var member = file.NeedsAssessment.HouseholdMembers.First(m => !m.IsPrimaryRegistrant && m.FirstName != $"{TestData.TestPrefix}-member-no-registrant-first");

            var fileId = await manager.Handle(new LinkRegistrantCommand { FileId = file.Id, RegistantId = registrant.Id, HouseholdMemberId = member.Id });
            fileId.ShouldBe(file.Id);

            var updatedFile = await GetEvacuationFileById(TestData.EvacuationFileId);
            updatedFile.NeedsAssessment.HouseholdMembers.Single(m => m.Id == member.Id).LinkedRegistrantId.ShouldBe(registrant.Id);
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

            var id = await manager.Handle(new SetRegistrantVerificationStatusCommand { RegistrantId = registrant.Id, Verified = newStatus.HasValue && newStatus.Value });

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

        [Fact]
        public async Task NewBcscProfile_HomeAddress_Geocoded()
        {
            var newRegistrant = CreateNewTestRegistrantProfile();
            newRegistrant.UserId = Guid.NewGuid().ToString("N").Substring(0, 10);
            newRegistrant.HomeAddress = new Address
            {
                AddressLine1 = "100 Main st.",
                City = "Vancouver",
                StateProvince = "BC"
            };

            var registrantId = await manager.Handle(new SaveRegistrantCommand { Profile = newRegistrant });

            var evacueesRepo = Services.GetRequiredService<EMBC.ESS.Resources.Evacuees.IEvacueesRepository>();
            var evacuee = (await evacueesRepo.Query(new EMBC.ESS.Resources.Evacuees.EvacueeQuery { EvacueeId = registrantId })).Items.ShouldHaveSingleItem();
            var homeAddress = (evacuee.GeocodedHomeAddress?.Address).ShouldNotBeNull();
            homeAddress.AddressLine1.ShouldBe(newRegistrant.HomeAddress.AddressLine1);
            homeAddress.City.ShouldBe(newRegistrant.HomeAddress.City);
            homeAddress.StateProvince.ShouldBe(newRegistrant.HomeAddress.StateProvince);
            var geocode = (evacuee.GeocodedHomeAddress?.Geocode).ShouldNotBeNull();
            geocode.Coordinates.ShouldNotBeNull();
            geocode.ResolvedAddress.ShouldNotBeNull();
            geocode.Accuracy.ShouldBeGreaterThan(0);
        }

        [Fact]
        public async Task ExistingBcscProfile_HomeAddress_Updated()
        {
            var registrant = CreateNewTestRegistrantProfile();
            registrant.UserId = Guid.NewGuid().ToString("N").Substring(0, 10);
            registrant.HomeAddress = new Address
            {
                AddressLine1 = "100 Main st.",
                City = "Vancouver",
                StateProvince = "BC"
            };

            var registrantId = await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            registrant.HomeAddress = new Address
            {
                AddressLine1 = "100 Douglas st.",
                City = "Victoria",
                StateProvince = "BC"
            };

            await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var evacueesRepo = Services.GetRequiredService<EMBC.ESS.Resources.Evacuees.IEvacueesRepository>();
            var evacuee = (await evacueesRepo.Query(new EMBC.ESS.Resources.Evacuees.EvacueeQuery { EvacueeId = registrantId })).Items.ShouldHaveSingleItem();
            var homeAddress = (evacuee.GeocodedHomeAddress?.Address).ShouldNotBeNull();
            homeAddress.AddressLine1.ShouldBe(registrant.HomeAddress.AddressLine1);
            homeAddress.City.ShouldBe(registrant.HomeAddress.City);
            homeAddress.StateProvince.ShouldBe(registrant.HomeAddress.StateProvince);
        }

        [Fact]
        public async Task CanAuditRegistrantAccess()
        {
            await Should.NotThrowAsync(async () =>
            {
                await manager.Handle(new RecordAuditAccessCommand
                {
                    TeamMemberId = TestData.Tier4TeamMemberId,
                    AccessReasonId = 174360000,
                    RegistrantId = TestData.ContactId
                });
            });
        }
    }
}
