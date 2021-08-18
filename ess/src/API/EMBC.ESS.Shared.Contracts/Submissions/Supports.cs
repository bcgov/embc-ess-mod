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
    public abstract class Support
    {
        public string Id { get; set; }
        public string OriginatingNeedsAssessmentId { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public SupportStatus Status { get; set; }
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

    public class LodgingGroupReferral : Referral
    {
        public int NumberOfNights { get; set; }
    }

    public enum SupportStatus
    {
        Active,
        Expired,
        Void
    }
}
