using System.Threading.Tasks;
using EMBC.ESS.Resources.Payments;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class PaymentRepositoryTests : DynamicsWebAppTestBase
    {
        private readonly IPaymentRepository repository;

        public PaymentRepositoryTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            repository = Services.GetRequiredService<IPaymentRepository>();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task SavePayment_InteracPayment_Saved()
        {
            var payment = new InteracSupportPayment
            {

            };

            var id = ((SavePaymentResponse)await repository.Manage(new SavePaymentRequest { Payment = payment })).Id;
            id.ShouldNotBeNullOrEmpty();
        }
    }
}
