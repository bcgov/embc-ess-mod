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

namespace EMBC.ESS.Resources.Cases.Evacuations
{
    public interface IEvacuationRepository
    {
        Task<string> Create(EvacuationFile evacuationFile);

        Task<IEnumerable<EvacuationFile>> Read(EvacuationFilesQuery query);

        Task<string> Update(EvacuationFile evacuationFile);

        Task<string> LinkRegistrant(string fileId, string registrantId, string householdMemberId);

        Task<string> CreateNote(string fileId, Note note);

        Task<string> UpdateNote(string fileId, Note note);

        Task<string[]> SaveSupports(string fileId, IEnumerable<Support> supports);

        Task<string> VoidSupport(string fileId, string supportId, SupportVoidReason reason);
    }

    public class EvacuationFile : Case
    {
        public string? ExternalReference { get; set; }
        public string TaskId { get; set; }
        public string TaskLocationCommunityCode { get; set; }
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
        public IEnumerable<Support> Supports { get; set; }
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
        public string CompletedByTeamMemberId { get; set; }
        public DateTime LastModified { get; set; }
        public string LastModifiedTeamMemberId { get; set; }
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
        public string? LinkedRegistrantId { get; set; }
        public bool? HasAccessRestriction { get; set; }
        public bool? IsVerifiedRegistrant { get; set; }
        public bool? IsAuthenticatedRegistrant { get; set; }
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

    public abstract class Support
    {
        public string Id { get; set; }
        public DateTime IssuedOn { get; set; }
        public string IssuedByTeamMemberId { get; set; }
        public string OriginatingNeedsAssessmentId { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public SupportStatus Status { get; set; } = SupportStatus.Active;
        public IEnumerable<string> IncludedHouseholdMembers { get; set; } = Array.Empty<string>();
    }

    public abstract class Referral : Support
    {
        public string SupplierId { get; set; }
        public string SupplierNotes { get; set; }
        public string IssuedToPersonName { get; set; }
    }

    public class ClothingReferral : Referral
    {
        public bool ExtremeWinterConditions { get; set; }
        public double TotalAmount { get; set; }
    }

    public class IncidentalsReferral : Referral
    {
        public string ApprovedItems { get; set; }
        public double TotalAmount { get; set; }
    }

    public class FoodGroceriesReferral : Referral
    {
        public int NumberOfDays { get; set; }
        public double TotalAmount { get; set; }
    }

    public class FoodRestaurantReferral : Referral
    {
        public int NumberOfBreakfastsPerPerson { get; set; }
        public int NumberOfLunchesPerPerson { get; set; }
        public int NumberOfDinnersPerPerson { get; set; }
        public double TotalAmount { get; set; }
    }

    public class LodgingHotelReferral : Referral
    {
        public int NumberOfNights { get; set; }
        public int NumberOfRooms { get; set; }
    }

    public class LodgingBilletingReferral : Referral
    {
        public int NumberOfNights { get; set; }
        public string HostName { get; set; }
        public string HostAddress { get; set; }
        public string HostCity { get; set; }
        public string HostEmail { get; set; }
        public string HostPhone { get; set; }
    }

    public class LodgingGroupReferral : Referral
    {
        public int NumberOfNights { get; set; }
        public string FacilityName { get; set; }
        public string FacilityAddress { get; set; }
        public string FacilityCity { get; set; }
        public string FacilityCommunityCode { get; set; }
        public string FacilityContactPhone { get; set; }
    }

    public class TransportationTaxiReferral : Referral
    {
        public string FromAddress { get; set; }
        public string ToAddress { get; set; }
    }

    public class TransportationOtherReferral : Referral
    {
        public double TotalAmount { get; set; }
        public string TransportMode { get; set; }
    }

    public enum SupportStatus
    {
        Active = 1,
        Expired = 174360000,
        Void = 2
    }

    public enum SupportVoidReason
    {
        ErrorOnPrintedReferral = 174360000,
        NewSupplierRequired = 174360001,
        SupplierCouldNotMeetNeed = 174360002
    }

    public enum EraTwoOptions
    {
        Yes = 174360000,
        No = 174360001
    }

    public enum SupportMethod
    {
        Referral = 174360000
    }

    public enum SupportType
    {
        FoodGroceries = 174360000,
        FoodRestaurant = 174360001,
        LodgingHotel = 174360002,
        LodgingBilleting = 174360003,
        LodgingGroup = 174360004,
        Incidentals = 174360005,
        Clothing = 174360006,
        TransporationTaxi = 174360007,
        TransportationOther = 174360008
    }
}
