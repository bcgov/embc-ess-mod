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

using System.Collections.Generic;

namespace EMBC.ESS.Print.Supports
{
    public class SupportsToPrint
    {
        public IEnumerable<string> SupportsIds { get; set; }
        public bool AddSummary { get; set; }
    }

    public class PrintReferral
    {
        public string Id { get; set; }
        public string IncidentTaskNumber { get; set; }
        public string HostCommunity { get; set; }
        public string FromDate { get; set; }
        public string FromTime { get; set; }
        public string ToDate { get; set; }
        public string ToTime { get; set; }
        public string PrintDate { get; set; }

        //public IEnumerable<PrintEvacuee> PrintEvacuees { get; set; }
        public string TotalAmountPrinted { get; set; }

        //public string CommentsPrinted => ConvertCarriageReturnToHtml(Comments);
        //public string ApprovedItemsPrinted => ConvertCarriageReturnToHtml(ApprovedItems);

        // Not mapped, only used when printing a referral.
        public string VolunteerDisplayName { get; set; }

        // Not mapped, flag that enables the TRAINING SAMPLE watermark if true
        public bool DisplayWatermark { get; set; }

        public string SupportType { get; set; }
        public string EssNumber { get; set; }
        public bool Active { get; set; }

        public string Purchaser { get; set; }
        public string Type { get; set; }

        public string SubType { get; set; }

        //public DateRange ValidDates { get; set; }
        //public IEnumerable<ReferralEvacuee> Evacuees { get; set; }
        public PrintSupplier Supplier { get; set; }

        public string Comments { get; set; }

        public bool ConfirmChecked { get; set; }
        public int? NumBreakfasts { get; set; }
        public int? NumLunches { get; set; }
        public int? NumDinners { get; set; }
        public int? NumDaysMeals { get; set; }
        public int? NumNights { get; set; }
        public int? NumRooms { get; set; }
        public string ApprovedItems { get; set; }
        public bool ExtremeWinterConditions { get; set; }
        public string FromAddress { get; set; }
        public string ToAddress { get; set; }
        public string OtherTransportModeDetails { get; set; }
    }

    public class PrintSupplier
    {
        public string Id { get; set; }
        public bool Active { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Province { get; set; }
        public string PostalCode { get; set; }
        public string Telephone { get; set; }
        public string Fax { get; set; }
    }
}
