using System.Threading.Tasks;

namespace EMBC.ESS.Engines.Supporting.PaymentGeneration
{
    public interface IPaymentGenerationStrategy
    {
        Task<GeneratePaymentsResponse> GeneratePayments(GeneratePaymentsRequest request);
    }

    public class PaymentGenerationStrategyFactory
    {
        public IPaymentGenerationStrategy Create() => new AggregatedSupportPaymentGenerationStrategy();
    }
}
