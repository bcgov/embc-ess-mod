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

namespace EMBC.ESS.Resources.Supports
{
    public interface ISupportRepository
    {
        public Task<ManageSupportCommandResult> Manage(ManageSupportCommand cmd);

        public Task<SupportQueryResults> Query(SupportQuery query);
    }

    public abstract class ManageSupportCommand
    {
    }

    public class ManageSupportCommandResult
    {
        public IEnumerable<string> Ids { get; set; }
    }

    public class SaveEvacuationFileSupportCommand : ManageSupportCommand
    {
        public string FileId { get; set; }
        public IEnumerable<Support> Supports { get; set; }
    }

    public class VoidEvacuationFileSupportCommand : ManageSupportCommand
    {
        public string FileId { get; set; }
        public string SupportId { get; set; }
        public SupportVoidReason VoidReason { get; set; }
    }

    public abstract class SupportQuery
    {
    }

    public class SupportQueryResults
    {
        public IEnumerable<Support> Items { get; set; }
    }

    public class SearchSupportsQuery : SupportQuery
    {
        public string ById { get; set; }
        public string ByExternalReferenceId { get; set; }
        public string ByEvacuationFileId { get; set; }
    }

    public abstract class Support
    {
        public string Id { get; set; }
        public string FileId { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedByTeamMemberId { get; set; }
        public DateTime? IssuedOn { get; set; }
        public string OriginatingNeedsAssessmentId { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public SupportStatus Status { get; set; } = SupportStatus.Active;
        public IEnumerable<string> IncludedHouseholdMembers { get; set; } = Array.Empty<string>();
        public SupportDelivery SupportDelivery { get; set; }
        public bool IsPaperReferral => SupportDelivery is Referral r && r.ManualReferralId != null;
        public bool IsReferral => SupportDelivery is Referral;
        public bool IsEtransfer => SupportDelivery is ETransfer;
    }

    public abstract class SupportDelivery
    { }

    public class Referral : SupportDelivery
    {
        public string? SupplierId { get; set; }
        public string? SupplierNotes { get; set; }
        public string IssuedToPersonName { get; set; }
        public string? ManualReferralId { get; set; }
        public string? IssuedByDisplayName { get; set; }
    }

    public abstract class ETransfer : SupportDelivery
    { }

    public class Interac : ETransfer
    {
        public string? NotificationEmail { get; set; }
        public string? NotificationMobile { get; set; }
        public string ReceivingRegistrantId { get; set; }
    }

    public class ClothingSupport : Support
    {
        public bool ExtremeWinterConditions { get; set; }
        public double TotalAmount { get; set; }
        public string? ApproverName { get; set; }
    }

    public class IncidentalsSupport : Support
    {
        public string ApprovedItems { get; set; }
        public double TotalAmount { get; set; }
        public string? ApproverName { get; set; }
    }

    public class FoodGroceriesSupport : Support
    {
        public int NumberOfDays { get; set; }
        public double TotalAmount { get; set; }
        public string? ApproverName { get; set; }
    }

    public class FoodRestaurantSupport : Support
    {
        public int NumberOfBreakfastsPerPerson { get; set; }
        public int NumberOfLunchesPerPerson { get; set; }
        public int NumberOfDinnersPerPerson { get; set; }
        public double TotalAmount { get; set; }
    }

    public class LodgingHotelSupport : Support
    {
        public int NumberOfNights { get; set; }
        public int NumberOfRooms { get; set; }
    }

    public class LodgingBilletingSupport : Support
    {
        public int NumberOfNights { get; set; }
        public string HostName { get; set; }
        public string HostAddress { get; set; }
        public string HostCity { get; set; }
        public string HostEmail { get; set; }
        public string HostPhone { get; set; }
    }

    public class LodgingGroupSupport : Support
    {
        public int NumberOfNights { get; set; }
        public string FacilityName { get; set; }
        public string FacilityAddress { get; set; }
        public string FacilityCity { get; set; }
        public string FacilityCommunityCode { get; set; }
        public string FacilityContactPhone { get; set; }
    }

    public class TransportationTaxiSupport : Support
    {
        public string FromAddress { get; set; }
        public string ToAddress { get; set; }
    }

    public class TransportationOtherSupport : Support
    {
        public double TotalAmount { get; set; }
        public string TransportMode { get; set; }
    }

#pragma warning disable CA1008 // Enums should have zero value

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
        Referral = 174360000,
        ETransfer = 174360001
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

#pragma warning restore CA1008 // Enums should have zero value
}
