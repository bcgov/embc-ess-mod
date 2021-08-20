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
using System.Text.Json.Serialization;

namespace EMBC.ESS.Shared.Contracts.Submissions
{
    [JsonConverter(typeof(PolymorphicJsonConverter<Support>))]
    public abstract class Support
    {
        public string Id { get; set; }
        public DateTime IssuedOn { get; set; }
        public TeamMember IssuedBy { get; set; }
        public string OriginatingNeedsAssessmentId { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public SupportStatus Status { get; set; } = SupportStatus.Active;
        public IEnumerable<string> IncludedHouseholdMembers { get; set; } = Array.Empty<string>();
    }

    public abstract class Referral : Support
    {
        public string SupplierNotes { get; set; }
        public string IssuedToPersonName { get; set; }
        public SupplierDetails SupplierDetails { get; set; }
    }

    public class SupplierDetails
    {
        public string Id { get; set; }
        public Address Address { get; set; }
        public string Name { get; set; }
        public string TeamId { get; set; }
        public string TeamName { get; set; }
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
        Active,
        Expired,
        Void
    }
}
