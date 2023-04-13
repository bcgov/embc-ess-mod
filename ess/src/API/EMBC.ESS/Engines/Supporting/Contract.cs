using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Resources.Evacuees;
using EMBC.ESS.Resources.Payments;
using EMBC.ESS.Shared.Contracts.Events;

namespace EMBC.ESS.Engines.Supporting
{
    public interface ISupportingEngine
    {
        Task<ValidationResponse> Validate(ValidationRequest request);

        Task<ProcessResponse> Process(ProcessRequest request);

        Task<GenerateResponse> Generate(GenerateRequest request);
    }

    public abstract class ValidationRequest
    { }

    public abstract class ValidationResponse
    {
        public abstract bool IsValid { get; }
    }

    public abstract class ProcessRequest
    { }

    public abstract class ProcessResponse
    { }

    public class ProcessDigitalSupportsRequest : ProcessRequest
    {
        public string FileId { get; set; }
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
        public bool IncludeSummaryInReferralsPrintout { get; set; }
        public string RequestingUserId { get; set; }
    }

    public class ProcessDigitalSupportsResponse : ProcessResponse
    {
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();

        public string PrintRequestId { get; set; } = null!;
    }

    public class DigitalSupportsValidationRequest : ValidationRequest
    {
        public string FileId { get; set; }
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
    }

    public class DigitalSupportsValidationResponse : ValidationResponse
    {
        public override bool IsValid => !Errors.Any();

        public IEnumerable<string> Errors { get; set; } = Array.Empty<string>();
    }

    public class CheckSupportComplianceRequest : ValidationRequest
    {
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
    }

    public class CheckSupportComplianceResponse : ValidationResponse
    {
        public IEnumerable<KeyValuePair<Support, IEnumerable<SupportFlag>>> Flags { get; set; } = Array.Empty<KeyValuePair<Support, IEnumerable<SupportFlag>>>();

        public override bool IsValid => Flags.All(s => !s.Value.Any());
    }

    public class ProcessPaperSupportsRequest : ProcessRequest
    {
        public string FileId { get; set; }
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
        public bool IncludeSummaryInReferralsPrintout { get; set; }
        public string RequestingUserId { get; set; }
    }

    public class ProcessPaperSupportsResponse : ProcessResponse
    {
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
    }

    public class PaperSupportsValidationRequest : ValidationRequest
    {
        public string FileId { get; set; }
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
    }

    public class PaperSupportsValidationResponse : ValidationResponse
    {
        public override bool IsValid => !Errors.Any();

        public IEnumerable<string> Errors { get; set; } = Array.Empty<string>();
    }

    public abstract class GenerateRequest
    { }

    public abstract class GenerateResponse
    { }

    public class GenerateReferralsRequest : GenerateRequest
    {
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
        public bool AddSummary { get; set; }
        public bool AddWatermark { get; set; }
        public string RequestingUserId { get; set; }
        public TeamMember PrintingMember { get; set; }
        public EvacuationFile File { get; set; }
        public Evacuee evacuee { get; set; }
    }

    public class GenerateReferralsResponse : GenerateResponse
    {
        public byte[] Content { get; set; }
    }

    public class GeneratePaymentsRequest : GenerateRequest
    {
        public IEnumerable<PayableSupport> Supports { get; set; }
    }

    public class PayableSupport
    {
        public string FileId { get; set; }
        public string SupportId { get; set; }
        public decimal Amount { get; set; }
        public PaymentDelivery Delivery { get; set; }
        public string PayeeId { get; set; }
    }

    public class PaymentDelivery
    {
        public string NotificationEmail { get; set; }
        public string NotificationPhone { get; set; }
        public string RecipientFirstName { get; set; }
        public string RecipientLastName { get; set; }
    }

    public class GeneratePaymentsResponse : GenerateResponse
    {
        //TODO: create manager level payment dto
        public IEnumerable<Payment> Payments { get; set; }
    }
}
