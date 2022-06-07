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

    public class CreatePaymentRequest : ManagePaymentRequest
    {
        public Payment Payment { get; set; }
    }

    public class CreatePaymentResponse : ManagePaymentResponse
    {
        public string Id { get; set; }
    }

    public abstract class Payment
    {
        public string Id { get; set; }
        public decimal Amount { get; set; }
        public PaymentStatus Status { get; set; }
        public string? FailureReason { get; set; }
        public string PayeeId { get; set; }
    }

    public enum PaymentStatus
    {
        Created = 1,
        Sent = 174360001,
        Paid = 2,
        Failed = 174360002,
        Cancelled = 174360003,
        Issued = 174360004,
        Cleared = 174360005,
    }

    public enum QueueStatus
    {
        None = -1,
        Pending = 174360000,
        Processing = 174360001,
        Failure = 174360002
    }

    public class InteracSupportPayment : Payment
    {
        public IEnumerable<string> LinkedSupportIds { get; set; } = Array.Empty<string>();
        public string RecipientFirstName { get; set; }
        public string RecipientLastName { get; set; }
        public string SecurityQuestion { get; set; }
        public string SecurityAnswer { get; set; }
        public string? NotificationEmail { get; set; }
        public string? NotificationPhone { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? SentOn { get; set; }
    }

    public class SearchPaymentRequest : QueryPaymentRequest
    {
        public PaymentStatus? ByStatus { get; set; }
        public string ById { get; set; }
        public string ByLinkedSupportId { get; set; }
        public int? LimitNumberOfItems { get; set; }
        public QueueStatus? ByQueueStatus { get; set; }
    }

    public class SearchPaymentResponse : QueryPaymentResponse
    {
        public IEnumerable<Payment> Items { get; set; } = Array.Empty<Payment>();
    }

    public class IssuePaymentsBatchRequest : ManagePaymentRequest
    {
        public string BatchId { get; set; }
        public IEnumerable<string> PaymentIds { get; set; } = Array.Empty<string>();
    }

    public class IssuePaymentsBatchResponse : ManagePaymentResponse
    {
        public IEnumerable<string> IssuedPayments { get; set; } = Array.Empty<string>();
        public IEnumerable<(string Id, Exception Error)> FailedPayments { get; set; } = Array.Empty<(string, Exception)>();
    }

    public class GetCasPaymentStatusRequest : QueryPaymentRequest
    {
        public DateTime? ChangedFrom { get; set; }
        public DateTime? ChangedTo { get; set; }
        public CasPaymentStatus? InStatus { get; set; }
    }

    public class GetCasPaymentStatusResponse : QueryPaymentResponse
    {
        public IEnumerable<CasPaymentDetails> Payments { get; set; } = Array.Empty<CasPaymentDetails>();
    }

    public class CasPaymentDetails
    {
        public string PaymentId { get; set; }
        public CasPaymentStatus Status { get; set; }
        public DateTime StatusChangeDate { get; set; }
        public string CasReferenceNumber { get; set; }
        public string StatusDescription { get; set; }
    }

    public enum CasPaymentStatus
    {
        Pending,
        Failed,
        Cleared
    }

    public class ProcessCasPaymentReconciliationStatusRequest : ManagePaymentRequest
    {
        public CasPaymentDetails CasPaymentDetails { get; set; }
    }

    public class ProcessCasPaymentReconciliationStatusResponse : ManagePaymentResponse
    {
        public bool Success { get; set; }
        public string? FailureReason { get; set; }
    }

    public class CancelPaymentRequest : ManagePaymentRequest
    {
        public string PaymentId { get; set; }
        public string Reason { get; set; }
    }

    public class CancelPaymentResponse : ManagePaymentResponse
    { }

    public class MarkPaymentAsPaidRequest : ManagePaymentRequest
    {
        public string PaymentId { get; set; }
    }

    public class MarkPaymentAsPaidResponse : ManagePaymentResponse
    { }

    public class MarkPaymentAsIssuedRequest : ManagePaymentRequest
    {
        public string PaymentId { get; set; }
    }

    public class MarkPaymentAsIssuedResponse : ManagePaymentResponse
    { }
}
