using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Evacuations;

public interface IEvacuationRepository
{
    Task<ManageEvacuationFileCommandResult> Manage(ManageEvacuationFileCommand cmd);

    Task<EvacuationFileQueryResult> Query(EvacuationFilesQuery query);
}

public abstract record ManageEvacuationFileCommand
{ }

public record ManageEvacuationFileCommandResult
{
    public string Id { get; set; }
}

public abstract record EvacuationFileQuery
{
}

public record EvacuationFileQueryResult
{
    public IEnumerable<EvacuationFile> Items { get; set; } = Array.Empty<EvacuationFile>();
}

public record SubmitEvacuationFileNeedsAssessment : ManageEvacuationFileCommand
{
    public EvacuationFile EvacuationFile { get; set; }
}

public record LinkEvacuationFileRegistrant : ManageEvacuationFileCommand
{
    public string FileId { get; set; }
    public string RegistrantId { get; set; }
    public string HouseholdMemberId { get; set; }
}

public record EvacuationFilesQuery : EvacuationFileQuery
{
    public string FileId { get; set; }
    public string ManualFileId { get; set; }
    public string PrimaryRegistrantId { get; set; }
    public bool MaskSecurityPhrase { get; set; } = true;

    public IEnumerable<EvacuationFileStatus> IncludeFilesInStatuses { get; set; } = Array.Empty<EvacuationFileStatus>();
    public DateTime? RegistrationDateFrom { get; set; }
    public DateTime? RegistrationDateTo { get; set; }
    public int? Limit { get; set; }
    public string HouseholdMemberId { get; set; }
    public string LinkedRegistrantId { get; set; }
    public string NeedsAssessmentId { get; set; }
}

public record SaveEvacuationFileNote : ManageEvacuationFileCommand
{
    public string FileId { get; set; }
    public Note Note { get; set; }
}

public record AddEligibilityCheck : ManageEvacuationFileCommand
{
    public string EvacuationFileNumber { get; set; }
    public string? TaskNumber { get; set; }
    public string? HomeAddressReferenceId { get; set; }
    public bool Eligible { get; set; }
    public string? Reason { get; set; }
    public DateTimeOffset? From { get; set; }
    public DateTimeOffset? To { get; set; }
    public IEnumerable<SelfServeSupportSetting> EligibleSupports { get; set; } = [];
}

public record OptoutSelfServe : ManageEvacuationFileCommand
{
    public string EvacuationFileNumber { get; set; }
}

public record AssignFileToTask : ManageEvacuationFileCommand
{
    public string EvacuationFileNumber { get; set; }
    public string TaskNumber { get; set; }
}

public record EvacuationFile
{
    public string Id { get; set; }
    public string CompletedOn { get; set; }
    public string CompletedBy { get; set; }
    public DateTime CreatedOn { get; set; }
    public DateTime LastModified { get; set; }
    public string? ManualFileId { get; set; }
    public bool IsPaper { get; set; }
    public string TaskId { get; set; }
    public string TaskLocationCommunityCode { get; set; }
    public EvacuationAddress EvacuatedFrom { get => NeedsAssessment?.EvacuatedFrom; }
    public NeedsAssessment NeedsAssessment { get; set; }
    public string PrimaryRegistrantId { get; set; }
    public string PrimaryRegistrantUserId { get; set; }
    public string SecurityPhrase { get; set; }
    public bool SecurityPhraseChanged { get; set; }
    public bool IsSecurityPhraseMasked { get; set; }
    public DateTime EvacuationDate { get; set; }
    public EvacuationFileStatus Status { get; set; }
    public bool RestrictedAccess { get; set; }
    public string RegistrationLocation { get; set; }
    public IEnumerable<HouseholdMember> HouseholdMembers { get; set; }
    public IEnumerable<Note> Notes { get; set; }
    public IEnumerable<string> Supports { get; set; }
}

public record EvacuationAddress
{
    public string AddressLine1 { get; set; }
    public string AddressLine2 { get; set; }
    public string CommunityCode { get; set; }
    public string PostalCode { get; set; }
}

public record NeedsAssessment
{
    public string Id { get; set; }
    public string? TaskNumber { get; set; }
    public EvacuationAddress EvacuatedFrom { get; set; }
    public DateTime CompletedOn { get; set; }
    public string CompletedByTeamMemberId { get; set; }
    public DateTime LastModified { get; set; }
    public string LastModifiedTeamMemberId { get; set; }
    public InsuranceOption Insurance { get; set; }
    public IEnumerable<HouseholdMember> HouseholdMembers { get; set; } = Array.Empty<HouseholdMember>();
    public IEnumerable<Pet> Pets { get; set; } = Array.Empty<Pet>();
    public NeedsAssessmentType Type { get; set; }
    public IEnumerable<Note> Notes { get; set; }
    public IEnumerable<IdentifiedNeed> Needs { get; set; } = Array.Empty<IdentifiedNeed>();
    public SelfServeEligibilityCheck? EligibilityCheck { get; set; }
}

public record HouseholdMember
{
    public string Id { get; set; }
    public bool IsMinor { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Initials { get; set; }
    public string Gender { get; set; }
    public string DateOfBirth { get; set; }
    public bool IsPrimaryRegistrant { get; set; }
    public string? LinkedRegistrantId { get; set; }
    public bool? HasAccessRestriction { get; set; }
    public bool? IsVerifiedRegistrant { get; set; }
    public bool? IsAuthenticatedRegistrant { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
}

public record Pet
{
    public string Id { get; set; }
    public string Type { get; set; }
    public string Quantity { get; set; }
}

public record Note
{
    public string Id { get; set; }
    public NoteType Type { get; set; }
    public string Content { get; set; }
    public DateTime AddedOn { get; set; }
    public DateTime ModifiedOn { get; set; }
    public string CreatingTeamMemberId { get; set; }
    public bool IsHidden { get; set; }
    public bool IsImportant { get; set; }
}

public record SelfServeEligibilityCheck
{
    public bool Eligible { get; set; }
    public string? TaskNumber { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public IEnumerable<SelfServeSupportSetting> SupportSettings { get; set; } = [];
}

public record SelfServeSupportSetting(SelfServeSupportType Type, SelfServeSupportEligibilityState State);

public enum NoteType
{
    General
}

public enum InsuranceOption
{
    No,
    Yes,
    Unsure,
    Unknown
}

public enum NeedsAssessmentType
{
    Preliminary,
    Assessed
}

public enum IdentifiedNeed
{
    ShelterReferral,
    ShelterAllowance,
    Transportation,
    Food,
    Incidentals,
    Clothing
}

public enum EraTwoOptions
{
    Yes = 174360000,
    No = 174360001
}

public enum EvacuationFileStatus
{
    Pending = 174360000,
    Active = 174360001,
    Completed = 174360002,
    Expired = 174360003,
    Archived = 174360004
}

public enum SelfServeSupportType
{
    FoodGroceries = 174360000,
    FoodRestaurant = 174360001,
    Incidentals = 174360005,
    Clothing = 174360006,
    ShelterAllowance = 174360009
}

public enum SelfServeSupportEligibilityState
{
    Available = 174360000,
    NotAvailableOneTimeUsed = 174360001,
}
