using System;
using System.Linq;
using EMBC.ESS.Resources.Evacuees;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class EvacueesTests : DynamicsWebAppTestBase
    {
        private readonly IEvacueesRepository evacueeRepository;
        private readonly IInvitationRepository invitationRepository;

        // Constants
        private string TestEvacueeUserId => base.TestData.ContactUserId;

        public EvacueesTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            evacueeRepository = Services.GetRequiredService<IEvacueesRepository>();
            invitationRepository = Services.GetRequiredService<IInvitationRepository>();
        }

        [Fact]
        public async Task Query_UserId_SingleMatch()
        {
            var queryResult = await evacueeRepository.Query(new EvacueeQuery
            {
                UserId = TestEvacueeUserId
            });

            queryResult.Items.ShouldNotBeEmpty();

            queryResult.Items.ShouldHaveSingleItem().UserId.ShouldBe(TestEvacueeUserId);
        }

        [Fact]
        public async Task Manage_UpdatedEvacuee_Updated()
        {
            var evacuee = (await evacueeRepository.Query(new EvacueeQuery
            {
                UserId = TestEvacueeUserId
            })).Items.ShouldHaveSingleItem();

            var newCommunity = TestData.RandomCommunity;
            var currentCity = evacuee.PrimaryAddress.Community;

            evacuee.PrimaryAddress.Community = currentCity == newCommunity
              ? TestData.RandomCommunity
              : newCommunity; ;

            var updatedEvacueeId = (await evacueeRepository.Manage(new SaveEvacuee
            {
                Evacuee = evacuee
            })).EvacueeId;

            updatedEvacueeId.ShouldBe(evacuee.Id);

            var updatedEvacuee = (await evacueeRepository.Query(new EvacueeQuery
            {
                EvacueeId = updatedEvacueeId
            })).Items.ShouldHaveSingleItem();

            updatedEvacuee.PrimaryAddress.Community.ShouldBe(newCommunity);
        }

        [Fact]
        public async Task Manage_CreateEvacuee_Created()
        {
            var baseEvacuee = (await evacueeRepository.Query(new EvacueeQuery
            {
                UserId = TestEvacueeUserId
            })).Items.ShouldHaveSingleItem();

            var uniqueSignature = Guid.NewGuid().ToString().Substring(0, 4);

            baseEvacuee.Id = null;
            baseEvacuee.UserId = $"{TestData.TestPrefix}-{uniqueSignature}-{TestEvacueeUserId}";
            baseEvacuee.FirstName = $"{TestData.TestPrefix}-{uniqueSignature}-first";
            baseEvacuee.LastName += $"{TestData.TestPrefix}-{uniqueSignature}-last";
            baseEvacuee.PrimaryAddress.Community = TestData.RandomCommunity;
            baseEvacuee.PrimaryAddress.StateProvince = "BC";
            baseEvacuee.PrimaryAddress.Country = "CAN";

            var newEvacueeId = (await evacueeRepository.Manage(new SaveEvacuee
            {
                Evacuee = baseEvacuee
            })).EvacueeId;

            var newEvacuee = (await evacueeRepository.Query(new EvacueeQuery { EvacueeId = newEvacueeId })).Items.ShouldHaveSingleItem();
            newEvacuee.Id.ShouldBe(newEvacueeId);
            newEvacuee.UserId.ShouldBe(baseEvacuee.UserId);
            newEvacuee.FirstName.ShouldBe(baseEvacuee.FirstName);
            newEvacuee.LastName.ShouldBe(baseEvacuee.LastName);
            newEvacuee.PrimaryAddress.Country.ShouldBe(baseEvacuee.PrimaryAddress.Country);
            newEvacuee.PrimaryAddress.StateProvince.ShouldBe(baseEvacuee.PrimaryAddress.StateProvince);
            newEvacuee.PrimaryAddress.Community.ShouldBe(baseEvacuee.PrimaryAddress.Community);
        }

        [Fact]
        public async Task Manage_UpdatedSecurityQuestions_Updated()
        {
            var evacuee = (await evacueeRepository.Query(new EvacueeQuery
            {
                UserId = TestEvacueeUserId
            })).Items.ShouldHaveSingleItem();

            Func<string> uniqueSignature = () => Guid.NewGuid().ToString().Substring(0, 10);
            evacuee.SecurityQuestions = new[]
            {
                new SecurityQuestion{ Id = 1, Question = "question1", Answer = $"{uniqueSignature()}", AnswerIsMasked = false },
                new SecurityQuestion{ Id = 2, Question = "question2", Answer = $"{uniqueSignature()}", AnswerIsMasked = false },
                new SecurityQuestion{ Id = 3, Question = "question3", Answer = $"{uniqueSignature()}", AnswerIsMasked = false },
            };

            await evacueeRepository.Manage(new SaveEvacuee { Evacuee = evacuee });

            var updatedEvacuee = (await evacueeRepository.Query(new EvacueeQuery
            {
                UserId = TestEvacueeUserId
            })).Items.ShouldHaveSingleItem();
            updatedEvacuee.SecurityQuestions.Count().ShouldBe(evacuee.SecurityQuestions.Count());
            foreach (var securityQuestion in updatedEvacuee.SecurityQuestions)
            {
                var modifiedSecurityQuestion = updatedEvacuee.SecurityQuestions.Single(sq => sq.Id == securityQuestion.Id);
                securityQuestion.Question.ShouldBe(modifiedSecurityQuestion.Question);
                var answer = securityQuestion.Answer;
                securityQuestion.Answer.ShouldBe(answer.Substring(0, 1) + "*****" + answer.Substring(answer.Length - 1));
            }
        }

        [Fact]
        public async Task Manage_NewEvacueeNoSecurityQuestion_Created()
        {
            var baseEvacuee = (await evacueeRepository.Query(new EvacueeQuery
            {
                UserId = TestEvacueeUserId
            })).Items.ShouldHaveSingleItem();

            var uniqueSignature = Guid.NewGuid().ToString().Substring(0, 4);
            baseEvacuee.Id = null;
            baseEvacuee.UserId = null;
            baseEvacuee.FirstName = $"{this.TestData.TestPrefix}-{uniqueSignature}-first";
            baseEvacuee.LastName += $"{this.TestData.TestPrefix}-{uniqueSignature}-last";
            baseEvacuee.SecurityQuestions = Array.Empty<SecurityQuestion>();

            var newEvacueeId = (await evacueeRepository.Manage(new SaveEvacuee { Evacuee = baseEvacuee })).EvacueeId;

            var updatedEvacuee = (await evacueeRepository.Query(new EvacueeQuery { EvacueeId = newEvacueeId })).Items.ShouldHaveSingleItem();
            updatedEvacuee.SecurityQuestions.Count().ShouldBe(0);
        }

        [Fact]
        public async Task CanCreateEmailInvite()
        {
            var evacuee = (await evacueeRepository.Query(new EvacueeQuery { UserId = TestEvacueeUserId })).Items.Single();

            var email = "test@email.com";

            var inviteId = (await invitationRepository.Manage(new CreateNewEmailInvitation
            {
                EvacueeId = evacuee.Id ?? null!,
                Email = email,
                InviteDate = DateTime.UtcNow,
                RequestingUserId = null
            })).InviteId;

            inviteId.ShouldNotBeNullOrEmpty();

            var invites = (await invitationRepository.Query(new EmailInvitationQuery { InviteId = inviteId })).Items;

            var savedInvite = invites.ShouldHaveSingleItem();
            savedInvite.EvacueeId.ShouldBe(evacuee.Id);
            savedInvite.InviteId.ShouldBe(inviteId);
        }
    }
}
