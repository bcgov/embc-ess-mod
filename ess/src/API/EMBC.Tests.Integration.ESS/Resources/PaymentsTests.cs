using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Resources.Payments;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class PaymentsTests : DynamicsWebAppTestBase
    {
        private readonly IPaymentRepository repository;

        public PaymentsTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            repository = Services.GetRequiredService<IPaymentRepository>();
        }

        private async Task<string> CreateNewRegistrant()
        {
            var registrant = TestHelper.CreateRegistrantProfile(TestData.TestPrefix);
            return await TestHelper.SaveRegistrant(Services.GetRequiredService<EventsManager>(), registrant);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task SavePayment_InteracPayment_Saved()
        {
            var linkedSupportIds = TestData.ETransferIds.Take(2);
            var payment = new InteracSupportPayment
            {
                Status = PaymentStatus.Created,
                Amount = 100.00m,
                RecipientFirstName = "first",
                RecipientLastName = "last",
                NotificationEmail = $"{TestData.TestPrefix}eraunitest@test.gov.bc.ca",
                NotificationPhone = null,
                SecurityAnswer = "answer",
                SecurityQuestion = "question",
                LinkedSupportIds = linkedSupportIds,
                PayeeId = TestData.ContactId
            };

            var paymentId = ((CreatePaymentResponse)await repository.Manage(new CreatePaymentRequest { Payment = payment })).Id;
            paymentId.ShouldNotBeNullOrEmpty();

            var readPayment = ((SearchPaymentResponse)await repository.Query(new SearchPaymentRequest { ById = paymentId })).Items
                .ShouldHaveSingleItem()
                .ShouldBeOfType<InteracSupportPayment>();

            readPayment.Id.ShouldBe(paymentId);
            readPayment.Status.ShouldBe(payment.Status);
            readPayment.RecipientFirstName.ShouldBe(payment.RecipientFirstName);
            readPayment.RecipientLastName.ShouldBe(payment.RecipientLastName);
            readPayment.NotificationEmail.ShouldBe(payment.NotificationEmail);
            readPayment.NotificationPhone.ShouldBe(payment.NotificationPhone);
            readPayment.SecurityAnswer.ShouldBe(payment.SecurityAnswer);
            readPayment.SecurityQuestion.ShouldBe(payment.SecurityQuestion);
            readPayment.LinkedSupportIds.ShouldBe(payment.LinkedSupportIds);
        }

        [Theory(Skip = RequiresVpnConnectivity)]
        [InlineData(true)]
        [InlineData(false)]
        public async Task SendPaymentToCas_InteracPayment_Sent(bool newPayee)
        {
            var registrantId = newPayee ? await CreateNewRegistrant() : TestData.ContactId;

            var payments = new[]
            {
                new InteracSupportPayment
                    {
                        Status = PaymentStatus.Created,
                        Amount = 100.00m,
                        RecipientFirstName = "first",
                        RecipientLastName = "last",
                        NotificationEmail = $"{TestData.TestPrefix}eraunitest@test.gov.bc.ca",
                        NotificationPhone = null,
                        SecurityAnswer = "answer",
                        SecurityQuestion = "question",
                        LinkedSupportIds = TestData.ETransferIds.TakeRandom(),
                        PayeeId = registrantId
                    }
            };

            foreach (var payment in payments)
            {
                payment.Id = ((CreatePaymentResponse)await repository.Manage(new CreatePaymentRequest { Payment = payment })).Id;
            }

            var results = (IssuePaymentsBatchResponse)await repository.Manage(new IssuePaymentsBatchRequest
            {
                BatchId = TestData.TestPrefix,
                PaymentIds = payments.Select(p => p.Id)
            });

            var sentPayments = results.IssuedPayments.ToArray();
            var failedPayments = results.FailedPayments.ToArray();

            failedPayments.ShouldBeEmpty();
            sentPayments.Length.ShouldBe(payments.Length);

            foreach (var paymentId in sentPayments)
            {
                var payment = ((SearchPaymentResponse)await repository.Query(new SearchPaymentRequest { ById = paymentId })).Items.ShouldHaveSingleItem();
                payment.Status.ShouldBe(PaymentStatus.Sent);
            }
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task GetCasPaymentStatus_ExistingPayment_StatusReturned()
        {
            var startDate = DateTime.Parse("2022-04-28");
            var endDate = DateTime.Parse("2022-04-29");

            var response = (GetCasPaymentStatusResponse)await repository.Query(new GetCasPaymentStatusRequest { ChangedFrom = startDate, ChangedTo = endDate });

            response.Payments.ShouldNotBeEmpty();
            foreach (var payment in response.Payments)
            {
                payment.StatusChangeDate.ShouldBeGreaterThanOrEqualTo(startDate.ToLocalTime());
                payment.StatusChangeDate.ShouldBeLessThanOrEqualTo(endDate.ToLocalTime());
            }
        }
    }
}
