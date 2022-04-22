using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Resources.Payments;

namespace EMBC.ESS.Engines.Supporting.PaymentGeneration
{
    public class AggregatedSupportPaymentGenerationStrategy : IPaymentGenerationStrategy
    {
        private const decimal amountLimit = 10000m;

        public async Task<GeneratePaymentsResponse> GeneratePayments(GeneratePaymentsRequest request)
        {
            await Task.CompletedTask;
            var payments = new List<Payment>();
            // aggregate per file
            foreach (var supportsInFile in request.Supports.GroupBy(s => s.FileId))
            {
                var fileId = supportsInFile.Key;
                // aggregate per payment details
                foreach (var paymentGroup in supportsInFile.GroupBy(s => (s.Delivery?.RecipientFirstName, s.Delivery?.RecipientLastName, s.Delivery?.NotificationEmail, s.Delivery?.NotificationPhone)))
                {
                    var supports = paymentGroup.ToArray();
                    var amount = 0m;
                    var linkedSupportIds = new List<string>();
                    var numOfSupports = supports.Length;
                    var i = 0;
                    while (i < numOfSupports)
                    {
                        // aggregate supports into a single payment if possible
                        var support = supports[i];
                        while (i < numOfSupports && amount + support.Amount <= amountLimit)
                        {
                            amount += support.Amount;
                            linkedSupportIds.Add(support.SupportId);
                            // check if no more supports
                            if (++i < numOfSupports) support = supports[i];
                        }

                        // add the aggregated payment
                        payments.Add(new InteracSupportPayment
                        {
                            Amount = amount,
                            LinkedSupportIds = linkedSupportIds.ToArray(),
                            NotificationEmail = paymentGroup.Key.NotificationEmail,
                            NotificationPhone = paymentGroup.Key.NotificationPhone,
                            RecipientFirstName = paymentGroup.Key.RecipientFirstName,
                            RecipientLastName = paymentGroup.Key.RecipientLastName,
                            SecurityAnswer = fileId,
                            SecurityQuestion = "Your ESS evacuation file number",
                            Status = PaymentStatus.Pending
                        });
                        amount = 0;
                        linkedSupportIds.Clear();
                    }
                }
            }

            return new GeneratePaymentsResponse { Payments = payments.ToArray() };
        }
    }
}
