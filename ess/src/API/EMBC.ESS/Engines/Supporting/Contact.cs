using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public IEnumerable<string> SupportIds { get; set; } = Array.Empty<string>();

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

    public class ProcessPaperSupportsRequest : ProcessRequest
    {
        public string FileId { get; set; }
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
        public bool IncludeSummaryInReferralsPrintout { get; set; }
        public string RequestingUserId { get; set; }
    }

    public class ProcessPaperSupportsResponse : ProcessResponse
    {
        public IEnumerable<string> SupportIds { get; set; } = Array.Empty<string>();
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
    }

    public class GenerateReferralsResponse : GenerateResponse
    {
        public byte[] Content { get; set; }
    }
}
