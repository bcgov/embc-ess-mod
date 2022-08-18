using System.Linq;
using EMBC.ESS.Engines.Supporting;
using EMBC.ESS.Resources.Payments;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Engines.Supporting
{
    public class PaymentGenerationTests : DynamicsWebAppTestBase
    {
        private readonly ISupportingEngine engine;

        public PaymentGenerationTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            engine = Services.GetRequiredService<ISupportingEngine>();
        }

        [Fact]
        public async Task GeneratePayments_SingleSupport_SinglePayment()
        {
            var supports = new[]
            {
                new PayableSupport { FileId = "1", SupportId = "1", Amount = 10000 },
            };

            var payments = ((GeneratePaymentsResponse)await engine.Generate(new GeneratePaymentsRequest { Supports = supports })).Payments.ToArray();
            var payment = payments.ShouldHaveSingleItem().ShouldBeOfType<InteracSupportPayment>();
            payment.Amount.ShouldBe(10000);
            payment.LinkedSupportIds.ShouldHaveSingleItem().ShouldBe("1");
        }

        [Fact]
        public async Task GeneratePayments_MultipleSupportsUnderLimit_SinglePayment()
        {
            var supports = new[]
            {
                new PayableSupport { FileId = "1", SupportId = "1", Amount = 4000 },
                new PayableSupport { FileId = "1", SupportId = "2", Amount = 5000 },
            };

            var payments = ((GeneratePaymentsResponse)await engine.Generate(new GeneratePaymentsRequest { Supports = supports })).Payments.ToArray();
            var payment = payments.ShouldHaveSingleItem().ShouldBeOfType<InteracSupportPayment>();
            payment.Amount.ShouldBe(9000);
            payment.LinkedSupportIds.ShouldBe(supports.Select(s => s.SupportId));
        }

        [Fact]
        public async Task GeneratePayments_MultipleSupportsAboveLimit_CorrectPayments()
        {
            var supports = new[]
            {
                new PayableSupport { FileId = "1", SupportId = "1", Amount = 4000 },
                new PayableSupport { FileId = "1", SupportId = "2", Amount = 5000 },
                new PayableSupport { FileId = "1", SupportId = "3", Amount = 6000 },
            };

            var payments = ((GeneratePaymentsResponse)await engine.Generate(new GeneratePaymentsRequest { Supports = supports })).Payments.Cast<InteracSupportPayment>().ToArray();
            payments.Length.ShouldBe(2);
            payments[0].Amount.ShouldBe(9000);
            payments[0].LinkedSupportIds.ShouldBe(new[] { "1", "2" });
            payments[1].Amount.ShouldBe(6000);
            payments[1].LinkedSupportIds.ShouldBe(new[] { "3" });
        }

        [Fact]
        public async Task GeneratePayments_MultipleSupportsInMultipleFiles_CorrectPayments()
        {
            var supports = new[]
            {
                new PayableSupport { FileId = "1", SupportId = "1", Amount = 4000 },
                new PayableSupport { FileId = "1", SupportId = "2", Amount = 5000 },
                new PayableSupport { FileId = "2", SupportId = "3", Amount = 6000 },
                new PayableSupport { FileId = "2", SupportId = "4", Amount = 6000 },
            };

            var payments = ((GeneratePaymentsResponse)await engine.Generate(new GeneratePaymentsRequest { Supports = supports })).Payments.Cast<InteracSupportPayment>().ToArray();
            payments.Length.ShouldBe(3);
            payments[0].Amount.ShouldBe(9000);
            payments[0].LinkedSupportIds.ShouldBe(new[] { "1", "2" });
            payments[1].Amount.ShouldBe(6000);
            payments[1].LinkedSupportIds.ShouldBe(new[] { "3" });
            payments[2].Amount.ShouldBe(6000);
            payments[2].LinkedSupportIds.ShouldBe(new[] { "4" });
        }

        [Fact]
        public async Task GeneratePayments_SingleSupportOverLimit_SinglePayment()
        {
            var supports = new[]
            {
            new PayableSupport { FileId = "1", SupportId = "1", Amount = 12000 },
        };

            var payments = ((GeneratePaymentsResponse)await engine.Generate(new GeneratePaymentsRequest { Supports = supports })).Payments.ToArray();
            payments.ShouldBeEmpty();
        }
    }
}
