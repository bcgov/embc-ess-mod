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
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using HandlebarsDotNet;

namespace EMBC.ESS.Resources.Print.Supports
{
    public class SupportsService : ISupportsService
    {
        private readonly string pageBreak = $@"{Environment.NewLine}<div class=""page-break""></div>{Environment.NewLine}";

        public async Task<string> GetReferralHtmlPagesAsync(SupportsToPrint supportsToPrint)
        {
            return await AssembleReferralHtml(supportsToPrint.RequestingUser, supportsToPrint.Referrals, supportsToPrint.AddSummary, supportsToPrint.AddWatermark);
        }

        private async Task<string> AssembleReferralHtml(PrintRequestingUser requestingUser, IEnumerable<PrintReferral> referrals, bool includeSummary, bool addWatermark)
        {
            var referralHtml = string.Empty;

            foreach (var referral in referrals)
            {
                referral.VolunteerDisplayName = requestingUser.DisplayName;
                referral.DisplayWatermark = addWatermark;

                var newHtml = CreateReferralHtmlPages(referral);
                referralHtml = $"{referralHtml}{newHtml}";
            }

            var summaryHtml = includeSummary ? await CreateReferalHtmlSummary(referrals) : string.Empty;
            var finalHtml = $"{summaryHtml}{referralHtml}";

            var handleBars = Handlebars.Create();
            handleBars.RegisterTemplate("stylePartial", GetCSSPartialView());
            handleBars.RegisterTemplate("bodyPartial", finalHtml);
            var template = handleBars.Compile(LoadTemplate("MasterLayout"));
            var assembledHtml = template(string.Empty);

            return assembledHtml;
        }

        private string CreateReferralHtmlPages(PrintReferral referral)
        {
            var handleBars = Handlebars.Create();

            handleBars.RegisterTemplate("stylePartial", GetCSSPartialView());

            var partialViewType = referral.Type;

            var partialItemsSource = GetItemsPartialView(partialViewType);
            handleBars.RegisterTemplate("itemsPartial", partialItemsSource);

            handleBars.RegisterTemplate("itemsDetailTitle", string.Empty);

            var partialSupplierSource = GetSupplierPartialView(partialViewType);
            handleBars.RegisterTemplate("supplierPartial", partialSupplierSource);

            var partialChecklistSource = GetChecklistPartialView(partialViewType);
            handleBars.RegisterTemplate("checklistPartial", partialChecklistSource);

            var template = handleBars.Compile(LoadTemplate(ReferalMainViews.Referral.ToString()));

            var result = template(referral);

            return $"{result}{pageBreak}";
        }

        private async Task<string> CreateReferalHtmlSummary(IEnumerable<PrintReferral> supports)
        {
            await Task.CompletedTask;
            var handleBars = Handlebars.Create();

            var result = string.Empty;
            var itemsHtml = string.Empty;
            var summaryBreakCount = 0;
            var printedCount = 0;
            foreach (var printReferral in supports)
            {
                summaryBreakCount += 1;
                printedCount += 1;
                var partialViewType = printReferral.Type;

                var partialViewDisplayName = partialViewType.GetType()
                        .GetMember(partialViewType.ToString())
                        .First()
                        .GetCustomAttribute<DisplayAttribute>()
                        .GetName();

                handleBars.RegisterTemplate("titlePartial", partialViewDisplayName);

                var useSummaryVersion = partialViewType == PrintReferralType.Hotel || partialViewType == PrintReferralType.Billeting;
                var partialItemsSource = GetItemsPartialView(partialViewType, useSummaryVersion);
                handleBars.RegisterTemplate("itemsPartial", partialItemsSource);

                handleBars.RegisterTemplate("itemsDetailTitle", "Details");

                var partialNotesSource = GetNotesPartialView(partialViewType);
                handleBars.RegisterTemplate("notesPartial", partialNotesSource);

                var template = handleBars.Compile(LoadTemplate(ReferalMainViews.SummaryItem.ToString()));

                var purchaserName = printReferral.PurchaserName;
                var itemResult = template(printReferral);

                itemsHtml = $"{itemsHtml}{itemResult}";

                if (summaryBreakCount == 3 || printedCount == supports.Count())
                {
                    summaryBreakCount = 0;

                    handleBars.RegisterTemplate("summaryItemsPartial", itemsHtml);

                    var mainTemplate = handleBars.Compile(LoadTemplate(ReferalMainViews.Summary.ToString()));

                    var data = new { printReferral.VolunteerDisplayName, purchaserName };
                    result = $"{result}{mainTemplate(data)}{pageBreak}";
                    itemsHtml = string.Empty;
                }
            }

            return result;
        }

        private string GetCSSPartialView()
        {
            return LoadTemplate("Css");
        }

        private string GetItemsPartialView(PrintReferralType partialView, bool useSummaryPartial = false)
        {
            var summary = useSummaryPartial ? "Summary" : string.Empty;
            var name = $"{partialView}.{partialView}Items{summary}Partial";
            return LoadTemplate(name);
        }

        private string GetChecklistPartialView(PrintReferralType partialView)
        {
            var name = $"{partialView}.{partialView}ChecklistPartial";
            return LoadTemplate(name);
        }

        private string GetSupplierPartialView(PrintReferralType partialView)
        {
            var name = $"{partialView}.{partialView}SupplierPartial";
            return LoadTemplate(name);
        }

        private string GetNotesPartialView(PrintReferralType partialView)
        {
            var name = $"{partialView}.{partialView}NotesPartial";
            return LoadTemplate(name);
        }

        public enum ReferalMainViews
        {
            Referral,
            Summary,
            SummaryItem
        }

        private static string LoadTemplate(string name)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var manifestName = $"EMBC.ESS.Resources.Print.Supports.Views.{name}.hbs";
            using (var stream = assembly.GetManifestResourceStream(manifestName))
            {
                using (var reader = new StreamReader(stream))
                {
                    string template = reader.ReadToEnd();
                    return template;
                }
            }
        }
    }
}
