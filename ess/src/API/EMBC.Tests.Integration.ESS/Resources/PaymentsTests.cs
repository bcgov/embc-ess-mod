using System;
using System.Linq;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Resources.Payments;
using EMBC.ESS.Utilities.Cas;
using Microsoft.Extensions.DependencyInjection;

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

        [Fact]
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

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public async Task SendPaymentToCas_InteracPayment_Sent(bool newPayee)
        {
            var mockedCas = (MockCasProxy)Services.GetRequiredService<IWebProxy>();
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
                mockedCas.GetInvoiceByInvoiceNumber(paymentId).ShouldNotBeNull();
            }
        }

        [Fact]
        public async Task GetCasPaymentStatus_ExistingPayment_StatusReturned()
        {
            var mockedCas = (MockCasProxy)Services.GetRequiredService<IWebProxy>();

            //2 expected in result
            mockedCas.AddInvoice(new Invoice
            {
                InvoiceNumber = "1234",
                SupplierNumber = "S1",
                SupplierSiteNumber = "001",
                InvoiceDate = DateTime.UtcNow,
                InvoiceAmount = 123,
            });
            mockedCas.SetPaymentDate("1234", DateTime.Parse("2022-04-28 09:00:00z"), CasPaymentStatuses.Negotiable);
            mockedCas.AddInvoice(new Invoice
            {
                InvoiceNumber = "1235",
                SupplierNumber = "S2",
                SupplierSiteNumber = "002",
                InvoiceDate = DateTime.UtcNow,
                InvoiceAmount = 234,
            });
            mockedCas.SetPaymentDate("1235", DateTime.Parse("2022-04-28 10:00:00z"), CasPaymentStatuses.Negotiable);

            //1 not expected
            mockedCas.AddInvoice(new Invoice
            {
                InvoiceNumber = "9876",
                SupplierNumber = "S3",
                SupplierSiteNumber = "003",
                InvoiceDate = DateTime.UtcNow,
                InvoiceAmount = 111,
            });
            mockedCas.SetPaymentDate("9876", DateTime.Parse("2022-05-15 09:00:00z"), CasPaymentStatuses.Negotiable);

            var startDate = DateTime.Parse("2022-04-28");
            var endDate = DateTime.Parse("2022-04-29");

            var response = (GetCasPaymentStatusResponse)await repository.Query(new GetCasPaymentStatusRequest { ChangedFrom = startDate, ChangedTo = endDate });

            response.Payments.ShouldNotBeEmpty();
            var expectedIds = new[] { "1234", "1235" };
            var notExpectedId = "9876";
            response.Payments.Where(p => expectedIds.Contains(p.PaymentId)).Count().ShouldBe(2);
            response.Payments.Where(p => p.PaymentId == notExpectedId).SingleOrDefault().ShouldBeNull();
            foreach (var payment in response.Payments)
            {
                payment.StatusChangeDate.ShouldBeGreaterThanOrEqualTo(startDate.ToLocalTime());
                payment.StatusChangeDate.ShouldBeLessThanOrEqualTo(endDate.ToLocalTime());
            }
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        public async Task SendPaymentToCas_InteracPayment_VerifySupplier(bool postalCodeMatches)
        {
            var manager = Services.GetRequiredService<EventsManager>();
            var registrant = TestHelper.CreateRegistrantProfile(Guid.NewGuid().ToString().Substring(0, 4));
            registrant.Id = await TestHelper.SaveRegistrant(manager, registrant);
            var mockedCas = (MockCasProxy)Services.GetRequiredService<IWebProxy>();

            mockedCas.AddSupplier(new GetSupplierResponse
            {
                Suppliernumber = "12345",
                Suppliername = Formatters.ToCasSupplierName(registrant.FirstName, registrant.LastName),
                Businessnumber = "123",
                SupplierAddress = new[] { new Supplieraddress { AddressLine1 = "123 test st", PostalCode = postalCodeMatches ? registrant.PrimaryAddress.PostalCode : "V2V2V2", Suppliersitecode = "001" } }
            });

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
                        PayeeId = registrant.Id
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

            if (postalCodeMatches) mockedCas.GetSuppliersCount().ShouldBe(1);
            else mockedCas.GetSuppliersCount().ShouldBe(2);
        }

        [Fact]
        public async Task SendPaymentToCas_InteracPayment_InvoiceNameShouldNotBePopulated()
        {
            var manager = Services.GetRequiredService<EventsManager>();
            var registrantId = TestData.ContactId;
            var mockedCas = (MockCasProxy)Services.GetRequiredService<IWebProxy>();

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

            await repository.Manage(new IssuePaymentsBatchRequest
            {
                BatchId = TestData.TestPrefix,
                PaymentIds = payments.Select(p => p.Id)
            });

            var response = (GetCasPaymentStatusResponse)await repository.Query(new GetCasPaymentStatusRequest { InStatus = CasPaymentStatus.Pending });
            var createdPayment = response.Payments.ShouldHaveSingleItem();

            var invoice = mockedCas.GetInvoiceByInvoiceNumber(createdPayment.PaymentId).ShouldNotBeNull();
            invoice.NameLine1.ShouldBeNull();
            invoice.NameLine2.ShouldBeNull();
        }
    }
}
