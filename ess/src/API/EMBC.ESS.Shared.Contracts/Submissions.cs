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
    /// Query specific evacuation files
    /// </summary>
    public class EvacuationFilesQuery : Query<EvacuationFilesQueryResult>
    {
        public string ByFileId { get; set; }
        public string ByRegistrantId { get; set; }
        public EvacuationFileStatus[] ByStatuses { get; set; }
    }

    /// <summary>
    /// Search matching evacuation files
    /// </summary>
    public class EvacuationFilesSearchQuery : Query<EvacuationFilesQueryResult>
    {
        public string FirstName { get; set; }
        public string lastName { get; set; }
        public string DateOfBirth { get; set; }
    }

    public class EvacuationFilesQueryResult
    {
        public IEnumerable<EvacuationFile> Items { get; set; }
    }

    /// <summary>
    /// Query specific regitrants
    /// </summary>
    public class RegistrantsQuery : Query<RegistrantsQueryResult>
    {
        public string ById { get; set; }
    }

    /// <summary>
    /// Search matching registrants
    /// </summary>
    public class RegistrantsSearchQuery : Query<EvacuationFilesQueryResult>
    {
        public string FirstName { get; set; }
        public string lastName { get; set; }
        public string DateOfBirth { get; set; }
    }

    public class RegistrantsQueryResult
    {
        public IEnumerable<RegistrantProfile> Items { get; set; }
    }

    /// <summary>
    /// Save registrant's profile
    /// </summary>
    public class SaveRegistrantCommand : Command
    {
        public RegistrantProfile Profile { get; set; }
    }

    /// <summary>
    /// Delete registrant's profile
    /// </summary>
    public class DeleteRegistrantCommand : Command
    {
        public string RegistrantId { get; set; }
    }

    public class EvacuationFile
    {
        public string Id { get; set; }
        public EvacuationFileStatus Status { get; set; }
        public string PrimaryRegistrantId { get; set; }
        public DateTime EvacuationDate { get; set; }
        public Address EvacuatedFromAddress { get; set; }
        public IEnumerable<NeedsAssessment> NeedsAssessments { get; set; }
    }

    public enum EvacuationFileStatus
    {
        Pending,
        Active,
        Expired,
        Completed
    }

    public class NeedsAssessment
    {
        public string Id { get; set; }
        public string FileId { get; set; }
        public NeedsAssessmentType Type { get; set; }
        public InsuranceOption Insurance { get; set; }
        public bool? CanEvacueeProvideFood { get; set; }
        public bool? CanEvacueeProvideLodging { get; set; }
        public bool? CanEvacueeProvideClothing { get; set; }
        public bool? CanEvacueeProvideTransportation { get; set; }
        public bool? CanEvacueeProvideIncidentals { get; set; }
        public bool HaveSpecialDiet { get; set; }
        public string SpecialDietDetails { get; set; }
        public bool HaveMedication { get; set; }
        public IEnumerable<HouseholdMember> HouseholdMembers { get; set; } = Array.Empty<HouseholdMember>();
        public IEnumerable<Pet> Pets { get; set; } = Array.Empty<Pet>();
        public bool? HasPetsFood { get; set; }
    }

    public class RegistrantProfile
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string PreferredName { get; set; }
        public string Gender { get; set; }
        public string DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public Address PrimaryAddress { get; set; }
        public Address MailingAddress { get; set; }
        public bool IsMailingAddressSameAsPrimaryAddress { get; set; }
        public bool RestrictedAccess { get; set; }
        public string SecretPhrase { get; set; }
        public bool AuthenticatedUser { get; set; }
        public bool VerifiedUser { get; set; }
    }

    public class HouseholdMember
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string PreferredName { get; set; }
        public string Gender { get; set; }
        public string DateOfBirth { get; set; }
        public bool isUnder19 { get; set; }
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

    public class Address
    {
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Community { get; set; }
        public string StateProvince { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
    }
}
