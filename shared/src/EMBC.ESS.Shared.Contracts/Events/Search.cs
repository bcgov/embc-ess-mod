using System;
using System.Collections.Generic;

namespace EMBC.ESS.Shared.Contracts.Events
{
    public class EvacuationFilesQuery : Query<EvacuationFilesQueryResponse>
    {
        public string FileId { get; set; }
        public string ManualFileId { get; set; }
        public string PrimaryRegistrantId { get; set; }
        public string PrimaryRegistrantUserId { get; set; }
        public string LinkedRegistrantId { get; set; }
        public string NeedsAssessmentId { get; set; }
        public EvacuationFileStatus[] IncludeFilesInStatuses { get; set; } = Array.Empty<EvacuationFileStatus>();
    }

    public class EvacuationFilesQueryResponse
    {
        public IEnumerable<EvacuationFile> Items { get; set; }
    }

    public class RegistrantsQuery : Query<RegistrantsQueryResponse>
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string FileId { get; set; }
    }

    public class RegistrantsQueryResponse
    {
        public IEnumerable<RegistrantProfile> Items { get; set; }
    }

    public class VerifySecurityQuestionsQuery : Query<VerifySecurityQuestionsResponse>
    {
        public string RegistrantId { get; set; }
        public IEnumerable<SecurityQuestion> Answers { get; set; }
    }

    public class VerifySecurityQuestionsResponse
    {
        public int NumberOfCorrectAnswers { get; set; }
    }

    public class VerifySecurityPhraseQuery : Query<VerifySecurityPhraseResponse>
    {
        public string FileId { get; set; }
        public string SecurityPhrase { get; set; }
    }

    public class VerifySecurityPhraseResponse
    {
        public bool IsCorrect { get; set; }
    }

    public class EvacueeSearchQuery : Query<EvacueeSearchQueryResponse>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DateOfBirth { get; set; }
        public bool IncludeRestrictedAccess { get; set; }
        public EvacuationFileStatus[] InStatuses { get; set; } = Array.Empty<EvacuationFileStatus>();
        public bool IncludeEvacuationFilesOnly { get; set; } = false;
        public bool IncludeRegistrantProfilesOnly { get; set; } = false;
    }

    public class EvacueeSearchQueryResponse
    {
        public IEnumerable<ProfileSearchResult> Profiles { get; set; } = Array.Empty<ProfileSearchResult>();
        public IEnumerable<EvacuationFileSearchResult> EvacuationFiles { get; set; } = Array.Empty<EvacuationFileSearchResult>();
    }

    public class ProfileSearchResult
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DateOfBirth { get; set; }
        public Address PrimaryAddress { get; set; }
        public bool RestrictedAccess { get; set; }
        public DateTime RegistrationDate { get; set; }
        public DateTime LastModified { get; set; }
        public IEnumerable<EvacuationFileSearchResult> RecentEvacuationFiles { get; set; }
        public bool IsVerified { get; set; }
        public bool IsAuthenticated { get; set; }
        public bool IsMinor { get; set; }
        public bool IsProfileCompleted { get; set; }
    }

    public class EvacuationFileSearchResult
    {
        public string Id { get; set; }
        public EvacuationFileStatus Status { get; set; }
        public string TaskId { get; set; }
        public DateTime? TaskStartDate { get; set; }
        public DateTime? TaskEndDate { get; set; }
        public string TaskLocationCommunityCode { get; set; }
        public bool RestrictedAccess { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime IssuedOn { get; set; }
        public DateTime LastModified { get; set; }
        public DateTime EvacuationDate { get; set; }
        public Address EvacuationAddress { get; set; }
        public IEnumerable<EvacuationFileSearchResultHouseholdMember> HouseholdMembers { get; set; }
        public string ManualFileId { get; set; }
        public bool IsFileCompleted { get; set; }
    }

    public class EvacuationFileSearchResultHouseholdMember
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DateOfBirth { get; set; }
        public bool IsSearchMatch { get; set; }
        public string LinkedRegistrantId { get; set; }
        public bool IsPrimaryRegistrant { get; set; }
        public bool? RestrictedAccess { get; set; }
    }

    public class SearchSupportsQuery : Query<SearchSupportsQueryResponse>
    {
        public string ManualReferralId { get; set; }
        public string FileId { get; set; }
    }

    public class SearchSupportsQueryResponse
    {
        public IEnumerable<Support> Items { get; set; }
    }
}
