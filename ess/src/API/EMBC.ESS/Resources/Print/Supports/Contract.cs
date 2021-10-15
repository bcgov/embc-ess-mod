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
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Print.Supports
{
    public interface ISupportsService
    {
        Task<string> GetReferralHtmlPagesAsync(SupportsToPrint printSupports);
    }

    public class SupportsToPrint
    {
        public IEnumerable<PrintReferral> Referrals { get; set; }

        public bool AddSummary { get; set; }
        public bool AddWatermark { get; set; }
        public PrintRequestingUser RequestingUser { get; set; }
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
        public string TotalAmountPrinted { get; set; }
        public string Comments { get; set; }
        public string ApprovedItems { get; set; }
        public string CommentsPrinted => ConvertCarriageReturnToHtml(Comments);
        public string ApprovedItemsPrinted => ConvertCarriageReturnToHtml(ApprovedItems);

        public string VolunteerDisplayName { get; set; }
        public bool DisplayWatermark { get; set; }
        public PrintReferralType Type { get; set; }
        public string EssNumber { get; set; }
        public string PurchaserName { get; set; }
        public PrintSupplier Supplier { get; set; }
        public int NumBreakfasts { get; set; }
        public int NumLunches { get; set; }
        public int NumDinners { get; set; }
        public int NumDaysMeals { get; set; }
        public int NumNights { get; set; }
        public int NumRooms { get; set; }
        public string FromAddress { get; set; }
        public string ToAddress { get; set; }
        public string OtherTransportModeDetails { get; set; }
        public IEnumerable<PrintEvacuee> Evacuees { get; set; } = Array.Empty<PrintEvacuee>();

        public PrintableEvacueesRow[] PrintableEvacuees
        {
            get
            {
                var evacueesToPrint = new List<PrintableEvacueesRow>();
                var evacuees = Evacuees.ToArray();

                for (int i = 0; i <= 7; i++)
                {
                    evacueesToPrint.Add(new PrintableEvacueesRow(evacuees.ElementAtOrDefault(i), evacuees.ElementAtOrDefault(i + 7)));
                }
                return evacueesToPrint.ToArray();
            }
        }

        private string ConvertCarriageReturnToHtml(string value)
        {
            return value?.Replace("\n", "<br />")?.Replace("\r", "<br />");
        }
    }

    public class PrintSupplier
    {
        //public string Id { get; set; }
        //public bool Active { get; set; }
        public string Name { get; set; }

        public string Address { get; set; }
        public string City { get; set; }
        public string Province { get; set; }
        public string PostalCode { get; set; }
        public string Telephone { get; set; }
        //public string Fax { get; set; }
    }

    public class PrintEvacuee
    {
        //public string Id { get; set; }
        public string FirstName { get; set; }

        public string LastName { get; set; }
        public string EvacueeTypeCode { get; set; }
    }

    public class PrintableEvacueesRow
    {
        public PrintableEvacueesRow(PrintEvacuee referralEvacuee1, PrintEvacuee referralEvacuee2)
        {
            Column1 = GetEvacueeColumn(referralEvacuee1);
            Column2 = GetEvacueeColumn(referralEvacuee2);
        }

        public string Column1 { get; private set; }
        public string Column1Class => GetEvacueeColumnClass(Column1);
        public string Column2 { get; private set; }
        public string Column2Class => GetEvacueeColumnClass(Column2);

        private string GetEvacueeColumn(PrintEvacuee referralEvacuee)
        {
            if (referralEvacuee == null)
            {
                return string.Empty;
            }

            return $"{referralEvacuee.LastName}, {referralEvacuee.FirstName} ({referralEvacuee.EvacueeTypeCode})";
        }

        private string GetEvacueeColumnClass(string columnText)
        {
            return string.IsNullOrEmpty(columnText) ? "nobody" : "evacuee";
        }
    }

    public class PrintRequestingUser
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
    }

    public enum PrintReferralType
    {
        [Display(Name = "BILLETING")]
        Billeting,

        [Display(Name = "CLOTHING")]
        Clothing,

        [Display(Name = "FOOD, GROCERIES")]
        Groceries,

        [Display(Name = "GROUP LODGING")]
        GroupLodging,

        [Display(Name = "HOTEL/MOTEL")]
        Hotel,

        [Display(Name = "INCIDENTALS")]
        Incidentals,

        [Display(Name = "FOOD, RESTAURANT MEALS")]
        Meals,

        [Display(Name = "TAXI")]
        Taxi,

        [Display(Name = "TRANSPORTATION")]
        Transportation
    }
}
