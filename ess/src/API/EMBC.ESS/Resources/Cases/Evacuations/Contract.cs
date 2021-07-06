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
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Cases
{
    public interface IEvacuationRepository
    {
        Task<string> Create(EvacuationFile evacuationFile);

        Task<IEnumerable<EvacuationFile>> Read(EvacuationFilesQuery query);

        Task<string> Update(EvacuationFile evacuationFile);

        Task<string> Delete(string essFileNumber);

        Task<string> UpdateSecurityPhrase(string essFileNumber, string securityPhrase);

        Task<string> CreateNote(string essFileNumber, Note note);

        Task<string> UpdateNote(string essFileNumber, Note note);
    }

    public class EvacuationFile : Case
    {
        public string TaskId { get; set; }
        public EvacuationAddress EvacuatedFrom { get => NeedsAssessment?.EvacuatedFrom; }
        public NeedsAssessment NeedsAssessment { get; set; }
        public string PrimaryRegistrantId { get; set; }
        public string SecurityPhrase { get; set; }
        public bool SecurityPhraseChanged { get; set; } = false;
        public bool IsSecurityPhraseMasked { get; set; }
        public DateTime EvacuationDate { get; set; }
        public EvacuationFileStatus Status { get; set; }
        public bool RestrictedAccess { get; set; }
        public string RegistrationLocation { get; set; }
        public IEnumerable<HouseholdMember> HouseholdMembers { get; set; }
        public IEnumerable<Note> Notes { get; set; }
    }

    public class EvacuationAddress
    {
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string CommunityCode { get; set; }
        public string PostalCode { get; set; }
    }

    public class NeedsAssessment
    {
        public string Id { get; set; }
        public EvacuationAddress EvacuatedFrom { get; set; }
        public DateTime CompletedOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedByUserId { get; set; }
        public string CreatedByDisplayName { get; set; }
        public DateTime LastModified { get; set; }
        public string LastModifiedUserId { get; set; }
        public string LastModifiedDisplayName { get; set; }
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
        public NeedsAssessmentType Type { get; set; }
        public IEnumerable<Note> Notes { get; set; }
        public IEnumerable<ReferralServices> RecommendedReferralServices { get; set; }
    }

    public class HouseholdMember
    {
        public string Id { get; set; }
        public bool IsUnder19 { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string Gender { get; set; }
        public string DateOfBirth { get; set; }
        public bool IsPrimaryRegistrant { get; set; }
        public string LinkedRegistrantId { get; set; }
        public bool HasAccessRestriction { get; set; }
    }

    public class Pet
    {
        public string Id { get; set; }
        public string Type { get; set; }
        public string Quantity { get; set; }
    }

    public class Note
    {
        public string Id { get; set; }
        public NoteType Type { get; set; }
        public string Content { get; set; }
        public DateTime AddedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
        public string CreatingTeamMemberId { get; set; }
        public bool IsHidden { get; set; }
    }

    public enum NoteType
    {
        General,
        EvacuationImpact,
        ExternalReferralServices,
        PetCarePlans,
        RecoveryPlan
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

    public enum EvacuationFileStatus
    {
        Pending = 174360000,
        Active = 174360001,
        Completed = 174360002,
        Expired = 174360003,
        Archived = 174360004
    }
}
