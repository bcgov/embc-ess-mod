using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Engines.Supporting.PaymentGeneration
{
    public interface IPaymentGenerationStrategy
    {
        Task<GeneratePaymentsResponse> GeneratePayments(GeneratePaymentsRequest request);
    }

    public class PaymentGenerationStrategyFactory
    {
        private readonly IServiceProvider services;

        public PaymentGenerationStrategyFactory(IServiceProvider services)
        {
            this.services = services;
        }

        public IPaymentGenerationStrategy Create()
        {
            var config = services.GetRequiredService<IConfiguration>();
            var paymentAmountLimit = config.GetValue("etransferMaxLimit", 10000m);
            return new AggregatedSupportPaymentGenerationStrategy(paymentAmountLimit);
        }
    }
}
