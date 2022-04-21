using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Payments
{
    public interface IPaymentRepository
    {
        Task<ManagePaymentResponse> Manage(ManagePaymentRequest request);

        Task<QueryPaymentResponse> Query(QueryPaymentRequest request);
    }

    public abstract class ManagePaymentRequest
    { }

    public abstract class ManagePaymentResponse
    { }

    public abstract class QueryPaymentRequest
    { }

    public abstract class QueryPaymentResponse
    { }

    public class SavePaymentRequest : ManagePaymentRequest
    {
        public Payment Payment { get; set; }
    }

    public class SavePaymentResponse : ManagePaymentResponse
    {
        public string Id { get; set; }
    }

    public abstract class Payment
    {
        public string Id { get; set; }
        public decimal Amount { get; set; }
        public PaymentStatus Status { get; set; }
        public string? FailureReason { get; set; }
    }

    public enum PaymentStatus
    {
        Pending = 1,
        Sent = 174360001,
        Paid = 2,
        Failed = 174360002,
        Cancelled = 174360003,
    }

    public abstract class SupportPayment : Payment
    {
        public IEnumerable<string> LinkedSupportIds { get; set; } = Array.Empty<string>();
    }

    public class InteracSupportPayment : SupportPayment
    {
        public string RecipientFirstName { get; set; }
        public string RecipientLastName { get; set; }
        public string SecurityQuestion { get; set; }
        public string SecurityAnswer { get; set; }
        public string? NotificationEmail { get; set; }
        public string? NotificationPhone { get; set; }
    }

    public class SearchPaymentRequest : QueryPaymentRequest
    {
        public PaymentStatus? ByStatus { get; set; }
        public string ById { get; set; }
    }

    public class SearchPaymentResponse : QueryPaymentResponse
    {
        public IEnumerable<Payment> Items { get; set; } = Array.Empty<Payment>();
    }

    public class SendPaymentToCasRequest : ManagePaymentRequest
    {
        public IEnumerable<string> PaymentIds { get; set; } = Array.Empty<string>();
    }

    public class SendPaymentToCasResponse : ManagePaymentResponse
    {
        public IEnumerable<string> Items { get; set; } = Array.Empty<string>();
    }
}
