using System;
using System.Collections.Generic;

namespace EMBC.ESS.Shared.Contracts.Events
{
    /// <summary>
    /// Evacuation file submission command
    /// </summary>
    public class SubmitEvacuationFileCommand : Command
    {
        public EvacuationFile File { get; set; }
    }

    /// <summary>
    /// Evacuation file and registrant profile for anonymous file submission
    /// </summary>
    public class SubmitAnonymousEvacuationFileCommand : Command
    {
        public RegistrantProfile SubmitterProfile { get; set; }
        public EvacuationFile File { get; set; }
    }

    /// <summary>
    /// save a file's note
    /// </summary>
    public class SaveEvacuationFileNoteCommand : Command
    {
        public string FileId { get; set; }
        public Note Note { get; set; }
    }

    /// <summary>
    /// set a file note hidden status
    /// </summary>
    public class ChangeNoteStatusCommand : Command
    {
        public string FileId { get; set; }
        public string NoteId { get; set; }
        public bool IsHidden { get; set; }
    }

    public class EvacuationFile
    {
        public string Id { get; set; }
        public string ManualFileId { get; set; }
        public string CompletedOn { get; set; }
        public string CompletedBy { get; set; }
        public IncidentTask RelatedTask { get; set; }
        public bool IsPaper { get; set; }
        public EvacuationFileStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool RestrictedAccess { get; set; }
        public string PrimaryRegistrantId { get; set; }
        public string PrimaryRegistrantUserId { get; set; }
        public string SecurityPhrase { get; set; }
        public bool SecurityPhraseChanged { get; set; } = false;
        public DateTime? EvacuationDate { get; set; }
        public Address EvacuatedFromAddress { get; set; }
        public string RegistrationLocation { get; set; }
        public IEnumerable<HouseholdMember> HouseholdMembers { get; set; }
        public IEnumerable<Note> Notes { get; set; } = Array.Empty<Note>();
        public NeedsAssessment NeedsAssessment { get; set; }
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();
    }

    public class TeamMember
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DisplayName { get; set; }
        public string TeamId { get; set; }
        public string TeamName { get; set; }
    }

    public enum EvacuationFileStatus
    {
        Pending,
        Active,
        Completed,
        Expired,
        Archived
    }

    public class NeedsAssessment
    {
        public string Id { get; set; }
        public DateTime CompletedOn { get; set; }
        public TeamMember CompletedBy { get; set; }
        public NeedsAssessmentType Type { get; set; }
        public InsuranceOption Insurance { get; set; }
        public bool? CanProvideFood { get; set; }
        public bool? CanProvideLodging { get; set; }
        public bool? CanProvideClothing { get; set; }
        public bool? CanProvideTransportation { get; set; }
        public bool? CanProvideIncidentals { get; set; }
        public bool HaveSpecialDiet { get; set; }
        public string SpecialDietDetails { get; set; }
        public bool TakeMedication { get; set; }
        public bool? HaveMedicalSupplies { get; set; }
        public IEnumerable<HouseholdMember> HouseholdMembers { get; set; } = Array.Empty<HouseholdMember>();
        public IEnumerable<Pet> Pets { get; set; } = Array.Empty<Pet>();
        public bool? HavePetsFood { get; set; }
        public IEnumerable<Note> Notes { get; set; } = Array.Empty<Note>();
        public IEnumerable<ReferralServices> RecommendedReferralServices { get; set; } = Array.Empty<ReferralServices>();
    }

    public class HouseholdMember
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string Gender { get; set; }
        public string DateOfBirth { get; set; }
        public bool IsMinor { get; set; }
        public bool IsPrimaryRegistrant { get; set; }
        public string LinkedRegistrantId { get; set; }
        public bool? RestrictedAccess { get; set; }
        public bool? Verified { get; set; }
        public bool? Authenticated { get; set; }
    }

    public class Pet
    {
        public string Type { get; set; }
        public string Quantity { get; set; }
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

    public class Note
    {
        public string Id { get; set; }
        public NoteType Type { get; set; }
        public string Content { get; set; }
        public DateTime AddedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
        public TeamMember CreatedBy { get; set; }
        public bool IsHidden { get; set; }
    }

    public enum NoteType
    {
        General,
        EvacuationImpact,
        EvacuationExternalReferrals,
        PetCarePlans,
        RecoveryPlan
    }

    public enum NoteStatus
    {
        ReadOnly,
        Editable,
        Hidden
    }

    public enum ReferralServices
    {
        Inquiry,
        Health,
        FirstAid,
        Personal,
        ChildCare,
        PetCare
    }
}
