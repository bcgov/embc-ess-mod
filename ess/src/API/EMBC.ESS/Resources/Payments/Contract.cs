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
        public string PayeeId { get; set; }
    }

    public enum PaymentStatus
    {
        Pending = 1,
        Sending = 174360000,
        Sent = 174360001,
        Paid = 2,
        Failed = 174360002,
        Cancelled = 174360003,
        Issued = 174360004
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
        public int? LimitNumberOfItems { get; set; }
    }

    public class SearchPaymentResponse : QueryPaymentResponse
    {
        public IEnumerable<Payment> Items { get; set; } = Array.Empty<Payment>();
    }

    public class SendPaymentToCasRequest : ManagePaymentRequest
    {
        public string CasBatchName { get; set; }
        public IEnumerable<CasPayment> Items { get; set; } = Array.Empty<CasPayment>();
    }

    public class CasPayment
    {
        public string PaymentId { get; set; }
    }

    public class CasPayeeDetails
    {
        public string SupplierNumber { get; set; }
        public string SupplierSiteCode { get; set; }
    }

    public class SendPaymentToCasResponse : ManagePaymentResponse
    {
        public IEnumerable<string> SentItems { get; set; } = Array.Empty<string>();
        public IEnumerable<(string Id, string Reason)> FailedItems { get; set; } = Array.Empty<(string Id, string Reason)>();
    }

    public class GetCasPaymentStatusRequest : QueryPaymentRequest
    {
        public DateTime? ChangedFrom { get; set; }
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
        public DateTime? StatusChangeDate { get; set; }
        public string CasReferenceNumber { get; set; }
        public string StatusDescription { get; set; }
    }

    public enum CasPaymentStatus
    {
        Pending,
        Failed,
        Paid
    }

    public class UpdateCasPaymentStatusRequest : ManagePaymentRequest
    {
        public string PaymentId { get; set; }
        public PaymentStatus ToPaymentStatus { get; set; }
        public DateTime? StatusChangeDate { get; set; }
        public string CasReferenceNumber { get; set; }
        public string? Reason { get; set; }
    }

    public class UpdateCasPaymentStatusResponse : ManagePaymentResponse
    {
        public string PaymentId { get; set; }
    }
}
