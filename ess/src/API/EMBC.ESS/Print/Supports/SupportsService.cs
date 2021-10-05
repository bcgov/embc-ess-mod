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
using AutoMapper;
using EMBC.ESS.Print.Utils;
using EMBC.ESS.Resources.Cases;
using EMBC.ESS.Resources.Suppliers;
using EMBC.ESS.Utilities.PdfGenerator;
using HandlebarsDotNet;
using Microsoft.Extensions.Hosting;

namespace EMBC.ESS.Print.Supports
{
    public class SupportsService
    {
        private readonly ICaseRepository caseRepository;
        private readonly IMapper mapper;
        private readonly ISupplierRepository supplierRepository;
        private readonly IPdfGenerator pdfGenerator;
        private readonly IHostEnvironment env;

        private string currentUser;

        private readonly string pageBreak = $@"{Environment.NewLine}<div class=""page-break""></div>{Environment.NewLine}";

        public SupportsService(ICaseRepository caseRepository, IMapper mapper, ISupplierRepository supplierRepository, IHostEnvironment environment, IPdfGenerator pdfGenerator)
        {
            this.caseRepository = caseRepository;
            this.mapper = mapper;
            this.supplierRepository = supplierRepository;
            this.pdfGenerator = pdfGenerator;
            this.env = environment;
            this.currentUser = string.Empty;
        }

        public async Task<byte[]> GetReferralPdfsAsync(SupportsToPrint printReferrals)
        {
            this.currentUser = printReferrals.CurrentLoggedInUser;
            var content = await GetReferralHtmlPagesAsync(printReferrals);

            if (content == null)
            {
                return null;
            }

            var result = await pdfGenerator.Generate(content);
            return result;
        }

        public async Task<string> GetReferralHtmlPagesAsync(SupportsToPrint printSupports)
        {
            var supports = await caseRepository.QuerySupports(printSupports);

            if (!supports.Any())
            {
                return null;
            }

            var html = await AssembleReferralHtml(supports, printSupports.AddSummary);

            return html;
        }

        private async Task<string> AssembleReferralHtml(IEnumerable<Support> supports, bool includeSummary)
        {
            var referralHtml = string.Empty;

            foreach (var support in supports)
            {
                var referral = (Referral)support;
                var printsupplier = new PrintSupplier();

                if (!string.IsNullOrEmpty(referral.SupplierId))
                {
                    var supplier = (await supplierRepository.QuerySupplier(new SupplierSearchQuery
                    {
                        SupplierId = referral.SupplierId,
                    })).Items.SingleOrDefault(m => m.Id == referral.SupplierId);
                    printsupplier = mapper.Map<PrintSupplier>(supplier);
                }

                var printReferral = mapper.Map<PrintReferral>(referral);
                if (!string.IsNullOrEmpty(printsupplier.Id))
                    printReferral.Supplier = printsupplier;
                var newHtml = CreateReferralHtmlPages(printReferral);
                referralHtml = $"{referralHtml}{newHtml}";
            }

            var summaryHtml = includeSummary ? CreateReferalHtmlSummary(supports) : string.Empty;
            var finalHtml = $"{summaryHtml}{referralHtml}";

            var handleBars = Handlebars.Create();
            handleBars.RegisterTemplate("stylePartial", GetCSSPartialView());
            handleBars.RegisterTemplate("bodyPartial", finalHtml);
            var template = handleBars.Compile(TemplateLoader.LoadTemplate("MasterLayout"));
            var assembledHtml = template(string.Empty);

            return assembledHtml;
        }

        private string CreateReferralHtmlPages(PrintReferral referral)
        {
            var handleBars = Handlebars.Create();

            handleBars.RegisterTemplate("stylePartial", GetCSSPartialView());

            var partialViewType = MapToReferralType(referral.SupportType);

            var partialItemsSource = GetItemsPartialView(partialViewType);
            handleBars.RegisterTemplate("itemsPartial", partialItemsSource);

            handleBars.RegisterTemplate("itemsDetailTitle", string.Empty);

            var partialSupplierSource = GetSupplierPartialView(partialViewType);
            handleBars.RegisterTemplate("supplierPartial", partialSupplierSource);

            var partialChecklistSource = GetChecklistPartialView(partialViewType);
            handleBars.RegisterTemplate("checklistPartial", partialChecklistSource);

            var template = handleBars.Compile(TemplateLoader.LoadTemplate(ReferalMainViews.Referral.ToString()));

            referral.VolunteerDisplayName = this.currentUser;
            // If we're in prod, we don't want the watermark
            referral.DisplayWatermark = !env.IsProduction();

            var result = template(referral);

            return $"{result}{pageBreak}";
        }

        private string CreateReferalHtmlSummary(IEnumerable<Support> supports)
        {
            //var handleBars = Handlebars.Create();

            var result = string.Empty;
            //var itemsHtml = string.Empty;
            //var summaryBreakCount = 0;
            //var printedCount = 0;
            //var volunteerDisplayName = userService.GetDisplayName();
            //var purchaserName = supports.FirstOrDefault()?.Purchaser;
            //foreach (var support in supports)
            //{
            //    summaryBreakCount += 1;
            //    printedCount += 1;
            //    var partialViewType = MapToReferralType(support.SupportType.ToString());

            //    handleBars.RegisterTemplate("titlePartial", partialViewType.GetDisplayName());

            //    var useSummaryVersion = partialViewType == ReferralPartialView.Hotel || partialViewType == ReferralPartialView.Billeting;
            //    var partialItemsSource = GetItemsPartialView(partialViewType, useSummaryVersion);
            //    handleBars.RegisterTemplate("itemsPartial", partialItemsSource);

            //    handleBars.RegisterTemplate("itemsDetailTitle", "Details");

            //    var partialNotesSource = GetNotesPartialView(partialViewType);
            //    handleBars.RegisterTemplate("notesPartial", partialNotesSource);

            //    var template = handleBars.Compile(TemplateLoader.LoadTemplate(ReferalMainViews.SummaryItem.ToString()));
            //    var itemResult = template(support);

            //    itemsHtml = $"{itemsHtml}{itemResult}";

            //    if (summaryBreakCount == 3 || printedCount == support.Count())
            //    {
            //        summaryBreakCount = 0;

            //        handleBars.RegisterTemplate("summaryItemsPartial", itemsHtml);

            //        var mainTemplate = handleBars.Compile(TemplateLoader.LoadTemplate(ReferalMainViews.Summary.ToString()));

            //        var data = new { volunteerDisplayName, purchaserName };
            //        result = $"{result}{mainTemplate(data)}{pageBreak}";
            //        itemsHtml = string.Empty;
            //    }
            //}

            return result;
        }

        private string GetCSSPartialView()
        {
            return TemplateLoader.LoadTemplate("Css");
        }

        private string GetItemsPartialView(ReferralPartialView partialView, bool useSummaryPartial = false)
        {
            var summary = useSummaryPartial ? "Summary" : string.Empty;
            var name = $"{partialView.ToString()}.{partialView.ToString()}Items{summary}Partial";
            return TemplateLoader.LoadTemplate(name);
        }

        private string GetChecklistPartialView(ReferralPartialView partialView)
        {
            var name = $"{partialView.ToString()}.{partialView.ToString()}ChecklistPartial";
            return TemplateLoader.LoadTemplate(name);
        }

        private string GetSupplierPartialView(ReferralPartialView partialView)
        {
            var name = $"{partialView.ToString()}.{partialView.ToString()}SupplierPartial";
            return TemplateLoader.LoadTemplate(name);
        }

        private string GetNotesPartialView(ReferralPartialView partialView)
        {
            var name = $"{partialView.ToString()}.{partialView.ToString()}NotesPartial";
            return TemplateLoader.LoadTemplate(name);
        }

        public enum ReferalMainViews
        {
            Referral,
            Summary,
            SummaryItem
        }

        public enum ReferralPartialView
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

        //public bool IsValidReferralType(string type, string subType)
        //{
        //    subType = string.IsNullOrEmpty(subType) ? "" : "_" + subType;
        //    return Enum.GetNames(typeof(Models.Db.ReferralType)).Any(t => t.Equals($"{type}{subType}", StringComparison.OrdinalIgnoreCase));
        //}

        private ReferralPartialView MapToReferralType(string referralType)
        {
            var referralTypeEnum = EnumHelper<SupportType>.GetValueFromName(referralType);

            switch (EnumHelper<SupportType>.GetValueFromName(referralType))
            {
                case SupportType.Clothing:
                    return ReferralPartialView.Clothing;

                case SupportType.FoodGroceries:
                    return ReferralPartialView.Groceries;

                case SupportType.FoodRestaurant:
                    return ReferralPartialView.Meals;

                case SupportType.Incidentals:
                    return ReferralPartialView.Incidentals;

                case SupportType.LodgingBilleting:
                    return ReferralPartialView.Billeting;

                case SupportType.LodgingGroup:
                    return ReferralPartialView.GroupLodging;

                case SupportType.LodgingHotel:
                    return ReferralPartialView.Hotel;

                case SupportType.TransportationOther:
                    return ReferralPartialView.Transportation;

                case SupportType.TransporationTaxi:
                    return ReferralPartialView.Taxi;

                default:
                    throw new ArgumentException($"{referralType} not a valid ReferralType");
            }
        }
    }
}
