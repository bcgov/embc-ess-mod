// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System;
using System.Collections.Generic;

namespace EMBC.ESS.Shared.Contracts.Submissions
{
    public class EvacuationFilesSearchQuery : Query<EvacuationFilesSearchQueryResult>
    {
        public string FileId { get; set; }
        public string PrimaryRegistrantId { get; set; }
        public string PrimaryRegistrantUserId { get; set; }
        public EvacuationFileStatus[] IncludeFilesInStatuses { get; set; } = Array.Empty<EvacuationFileStatus>();
    }

    public class EvacuationFilesSearchQueryResult
    {
        public IEnumerable<EvacuationFile> Items { get; set; }
    }

    public class RegistrantsSearchQuery : Query<RegistrantsSearchQueryResult>
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string FileId { get; set; }
    }

    public class RegistrantsSearchQueryResult
    {
        public IEnumerable<RegistrantWithFiles> Items { get; set; }
    }

    public class RegistrantWithFiles
    {
        public RegistrantProfile RegistrantProfile { get; set; }
        public IEnumerable<EvacuationFile> Files { get; set; }
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
        public EvacuationFileStatus[] InStatuses { get; set; }
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
        public Address PrimaryAddress { get; set; }
        public bool RestrictedAccess { get; set; }
        public DateTime RegistrationDate { get; set; }
        public IEnumerable<EvacuationFileSearchResult> RecentEvacuationFiles { get; set; }
        public bool IsVerified { get; set; }
    }

    public class EvacuationFileSearchResult
    {
        public string Id { get; set; }
        public EvacuationFileStatus Status { get; set; }
        public string TaskId { get; set; }
        public bool RestrictedAccess { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime EvacuationDate { get; set; }
        public Address EvacuationAddress { get; set; }
        public IEnumerable<EvacuationFileSearchResultHouseholdMember> HouseholdMembers { get; set; }
    }

    public class EvacuationFileSearchResultHouseholdMember
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsSearchMatch { get; set; }
        public string LinkedRegistrantId { get; set; }
        public bool IsPrimaryRegistrant { get; set; }
    }
}
