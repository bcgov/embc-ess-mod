using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Resources.Payments;
using EMBC.Tests.Integration.ESS.Managers.Events;
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
            var linkedSupportIds = TestData.SupportIds;
            var payment = new InteracSupportPayment
            {
                Status = PaymentStatus.Pending,
                Amount = 100.00m,
                RecipientFirstName = "first",
                RecipientLastName = "last",
                NotificationEmail = "email@unit.test",
                NotificationPhone = "1234567890",
                SecurityAnswer = "answer",
                SecurityQuestion = "question",
                LinkedSupportIds = linkedSupportIds
            };

            var paymentId = ((SavePaymentResponse)await repository.Manage(new SavePaymentRequest { Payment = payment })).Id;
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

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task SendPaymentToCas_InteracPayment_Sent()
        {
            var registrantId = await CreateNewRegistrant();
            //var registrantId = TestData.ContactId;

            var payeeDetails = (GetCasPayeeDetailsResponse)await repository.Query(new GetCasPayeeDetailsRequest { PayeeId = registrantId });

            var payments = new[]
            {
                new InteracSupportPayment
                    {
                        Status = PaymentStatus.Pending,
                        Amount = 100.00m,
                        RecipientFirstName = "first",
                        RecipientLastName = "last",
                        NotificationEmail = "email@unit.test",
                        NotificationPhone = "1234567890",
                        SecurityAnswer = "answer",
                        SecurityQuestion = "question",
                        LinkedSupportIds = TestData.SupportIds,
                        PayeeId = registrantId
                    }
            };

            foreach (var payment in payments)
            {
                payment.Id = ((SavePaymentResponse)await repository.Manage(new SavePaymentRequest { Payment = payment })).Id;
            }

            var results = (SendPaymentToCasResponse)await repository.Manage(new SendPaymentToCasRequest
            {
                CasBatchName = TestData.TestPrefix,
                Items = payments.Select(p => new CasPayment
                {
                    PaymentId = p.Id,
                    PayeeDetails = new CasPayeeDetails
                    {
                        SupplierNumber = payeeDetails.CasSupplierNumber,
                        SupplierSiteCode = payeeDetails.CasSupplierSiteNumber
                    }
                })
            });

            var sentPayments = results.SentItems.ToArray();
            var failedPayments = results.FailedItems.ToArray();

            failedPayments.ShouldBeEmpty();
            sentPayments.Length.ShouldBe(payments.Length);

            foreach (var paymentId in sentPayments)
            {
                var payment = ((SearchPaymentResponse)await repository.Query(new SearchPaymentRequest { ById = paymentId })).Items.ShouldHaveSingleItem();
                payment.Status.ShouldBe(PaymentStatus.Sent);
            }
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task GetPayeeDetails_NewEvacuee_CasSupplierCreated()
        {
            var registrantId = await CreateNewRegistrant();
            var payeeDetails = (GetCasPayeeDetailsResponse)await repository.Query(new GetCasPayeeDetailsRequest { PayeeId = registrantId });
            payeeDetails.CasSupplierNumber.ShouldNotBeNullOrEmpty();
            payeeDetails.CasSupplierSiteNumber.ShouldNotBeNullOrEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task GetPayeeDetails_ExistingEvacuee_CasSupplierSaved()
        {
            var registrantId = await CreateNewRegistrant();
            //var registrantId = TestData.ContactId;

            //query supplier
            var payeeDetails = (GetCasPayeeDetailsResponse)await repository.Query(new GetCasPayeeDetailsRequest { PayeeId = registrantId });
            payeeDetails.CasSupplierNumber.ShouldNotBeNullOrEmpty();
            payeeDetails.CasSupplierSiteNumber.ShouldNotBeNullOrEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task GetPaymentStatus_ExistingPayment_StatusReturned()
        {
            //var registrantId = await CreateNewRegistrant();
            //var registrantId = TestData.ContactId;

            //query payments
            var startDate = DateTime.UtcNow;
            var response = (GetCasPaymentStatusResponse)await repository.Query(new GetCasPaymentStatusRequest { ChangedFrom = startDate });

            response.Payments.ShouldNotBeEmpty();
            response.Payments.ShouldAllBe(p => p.StatusChangeDate >= startDate);
        }
    }
}
