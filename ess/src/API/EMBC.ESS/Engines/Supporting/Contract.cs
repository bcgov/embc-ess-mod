using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;

namespace EMBC.ESS.Engines.Supporting;

public interface ISupportingEngine
{
    Task<ValidationResponse> Validate(ValidationRequest request, CancellationToken ct = default);

    Task<ProcessResponse> Process(ProcessRequest request, CancellationToken ct = default);

    Task<GenerateResponse> Generate(GenerateRequest request, CancellationToken ct = default);
}

public abstract record ValidationRequest
{ }

public abstract record ValidationResponse
{
    public abstract bool IsValid { get; }
}

public abstract record ProcessRequest
{ }

public abstract record ProcessResponse
{ }

public record ProcessDigitalSupportsRequest : ProcessRequest
{
    public string FileId { get; set; }
    public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
    public bool IncludeSummaryInReferralsPrintout { get; set; }
    public string? RequestingUserId { get; set; }
    public bool PrintReferrals { get; set; } = true;
}

public record ProcessDigitalSupportsResponse : ProcessResponse
{
    public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();

    public string? PrintRequestId { get; set; } = null!;
}

public record DigitalSupportsValidationRequest : ValidationRequest
{
    public string FileId { get; set; }
    public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
}

public record DigitalSupportsValidationResponse : ValidationResponse
{
    public override bool IsValid => !Errors.Any();

    public IEnumerable<string> Errors { get; set; } = Array.Empty<string>();
}

public record CheckSupportComplianceRequest : ValidationRequest
{
    public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
}

public record CheckSupportComplianceResponse : ValidationResponse
{
    public IEnumerable<KeyValuePair<Support, IEnumerable<SupportFlag>>> Flags { get; set; } = Array.Empty<KeyValuePair<Support, IEnumerable<SupportFlag>>>();

    public override bool IsValid => Flags.All(s => !s.Value.Any());
}

public record ProcessPaperSupportsRequest : ProcessRequest
{
    public string FileId { get; set; }
    public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
    public bool IncludeSummaryInReferralsPrintout { get; set; }
    public string RequestingUserId { get; set; }
}

public record ProcessPaperSupportsResponse : ProcessResponse
{
    public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
}

public record PaperSupportsValidationRequest : ValidationRequest
{
    public string FileId { get; set; }
    public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
}

public record PaperSupportsValidationResponse : ValidationResponse
{
    public override bool IsValid => !Errors.Any();

    public IEnumerable<string> Errors { get; set; } = Array.Empty<string>();
}

public abstract record GenerateRequest
{ }

public abstract record GenerateResponse
{ }

public record GenerateReferralsRequest : GenerateRequest
{
    public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
    public bool AddSummary { get; set; }
    public bool AddWatermark { get; set; }
    public string RequestingUserId { get; set; }
    public TeamMember PrintingMember { get; set; }
    public EvacuationFile File { get; set; }
    public RegistrantProfile Evacuee { get; set; }
}

public record GenerateReferralsResponse : GenerateResponse
{
    public byte[] Content { get; set; }
}

public record GeneratePaymentsRequest : GenerateRequest
{
    public IEnumerable<PayableSupport> Supports { get; set; }
}

public record PayableSupport
{
    public string FileId { get; set; }
    public string SupportId { get; set; }
    public decimal Amount { get; set; }
    public PaymentDelivery Delivery { get; set; }
    public string PayeeId { get; set; }
}

public record PaymentDelivery
{
    public string NotificationEmail { get; set; }
    public string NotificationPhone { get; set; }
    public string RecipientFirstName { get; set; }
    public string RecipientLastName { get; set; }
}

public record GeneratePaymentsResponse : GenerateResponse
{
    public IEnumerable<Resources.Payments.Payment> Payments { get; set; }
}

public record ValidateSelfServeSupportsEligibility(string EvacuationFileId) : ValidationRequest;

public record ValidateSelfServeSupportsEligibilityResponse(SelfServeSupportEligibility Eligibility) : ValidationResponse
{
    public override bool IsValid => Eligibility.Eligible;
}

public record SelfServeSupportEligibility(
    bool Eligible,
    string? Reason,
    string? TaskNumber,
    string? HomeAddressReferenceId,
    DateTimeOffset? From,
    DateTimeOffset? To,
    IEnumerable<SelfServeSupportType> EligibleSupportTypes,
    IEnumerable<SelfServeSupportType> OneTimePastSupportTypes);

public record GenerateSelfServeSupports(IEnumerable<SelfServeSupportType> SupportTypes, DateTime SupportPeriodFrom, DateTime SupportPeriodTo, IEnumerable<SelfServeHouseholdMember> HouseholdMembersIds) : GenerateRequest;

public record SelfServeHouseholdMember(string Id, bool IsMinor);

public record CalculateSelfServeSupports(IEnumerable<SelfServeSupport> Supports, IEnumerable<SelfServeHouseholdMember> HouseholdMembersIds) : GenerateRequest;

public record GenerateSelfServeSupportsResponse(IEnumerable<SelfServeSupport> Supports) : GenerateResponse;

public record GenerateSelfServeETransferSupports(string EvacuationFileId, string RegistrantId, IEnumerable<SelfServeSupport> Supports, ETransferDetails ETransferDetails, DateTime SupportPeriodFrom, DateTime SupportPeriodTo) : GenerateRequest;

public record GenerateSelfServeETransferSupportsResponse(IEnumerable<Support> Supports) : GenerateResponse;
