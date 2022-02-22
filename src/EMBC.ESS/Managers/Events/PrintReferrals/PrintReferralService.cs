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
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Extensions;
using HandlebarsDotNet;

namespace EMBC.ESS.Managers.Events.PrintReferrals
{
    public class PrintReferralService : IPrintReferralService
    {
        private static string pageBreak = $@"{Environment.NewLine}<div class=""page-break""></div>{Environment.NewLine}";

        public async Task<string> GetReferralHtmlPagesAsync(SupportsToPrint printSupports)
        {
            return await AssembleReferralHtml(printSupports.RequestingUser, printSupports.Referrals, printSupports.AddSummary, printSupports.AddWatermark);
        }

        private async Task<string> AssembleReferralHtml(PrintRequestingUser requestingUser, IEnumerable<PrintReferral> referrals, bool includeSummary, bool addWatermark)
        {
            var handlebars = CreateHandleBars();
            var html = new StringBuilder();
            if (includeSummary)
            {
                html.Append(CreateReferalHtmlSummary(handlebars, referrals, requestingUser, addWatermark));
            }
            foreach (var referral in referrals)
            {
                referral.VolunteerFirstName = requestingUser.FirstName;
                referral.VolunteerLastName = requestingUser.LastName;
                referral.DisplayWatermark = addWatermark;
                html.Append(CreateReferralHtmlPages(handlebars, referral));
            }
            handlebars.RegisterTemplate("stylePartial", GetCSSPartialView());
            handlebars.RegisterTemplate("bodyPartial", html.ToString());
            var template = handlebars.Compile(LoadTemplate("MasterLayout"));
            var assembledHtml = template(string.Empty);

            return await Task.FromResult(assembledHtml);
        }

        private static IHandlebars CreateHandleBars()
        {
            var handleBars = Handlebars.Create();
            handleBars.RegisterHelper("zeroIndex", (output, context, arguments) =>
            {
                var incoming = (string)arguments[0];
                output.WriteSafeString(incoming[0]);
            });
            handleBars.RegisterHelper("dateFormatter", (output, context, arguments) =>
            {
                if (DateTime.TryParse((string)arguments[0], out var parsedDate)) output.WriteSafeString(parsedDate.ToString("dd-MMM-yyyy"));
            });
            handleBars.RegisterHelper("timeFormatter", (output, context, arguments) =>
            {
                var samp = Convert.ToDateTime((string)arguments[0]);
                output.WriteSafeString(samp.ToString("hh:mm tt"));
            });
            handleBars.RegisterHelper("upperCase", (output, context, arguments) =>
            {
                var upperCaseString = (string)arguments[0];
                output.WriteSafeString(upperCaseString.ToUpperInvariant());
            });

            return handleBars;
        }

        private static string CreateReferralHtmlPages(IHandlebars handlebars, PrintReferral referral)
        {
            handlebars.RegisterTemplate("stylePartial", GetCSSPartialView());

            var partialViewType = referral.Type;

            var partialItemsSource = GetItemsPartialView(partialViewType);
            handlebars.RegisterTemplate("itemsPartial", partialItemsSource);

            handlebars.RegisterTemplate("itemsDetailTitle", string.Empty);

            var partialSupplierSource = GetSupplierPartialView(partialViewType);
            handlebars.RegisterTemplate("supplierPartial", partialSupplierSource);

            var partialChecklistSource = GetChecklistPartialView(partialViewType);
            handlebars.RegisterTemplate("checklistPartial", partialChecklistSource);

            var template = handlebars.Compile(LoadTemplate(ReferalMainViews.Referral.ToString()));

            var result = template(referral);

            return $"{result}{pageBreak}";
        }

        private static string CreateReferalHtmlSummary(IHandlebars handlebars, IEnumerable<PrintReferral> supports, PrintRequestingUser requestingUser, bool addWatermark)
        {
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
                handlebars.RegisterTemplate("titlePartial", partialViewDisplayName);

                var useSummaryVersion = partialViewType == PrintReferralType.Hotel || partialViewType == PrintReferralType.Billeting;
                var partialItemsSource = GetItemsPartialView(partialViewType, useSummaryVersion);
                handlebars.RegisterTemplate("itemsPartial", partialItemsSource);

                handlebars.RegisterTemplate("itemsDetailTitle", "Details");

                var partialNotesSource = GetNotesPartialView(partialViewType);
                handlebars.RegisterTemplate("notesPartial", partialNotesSource);

                var template = handlebars.Compile(LoadTemplate(ReferalMainViews.SummaryItem.ToString()));

                var purchaserName = printReferral.PurchaserName;
                var volunteerFirstName = requestingUser.FirstName;
                var volunteerLastName = requestingUser.LastName;
                var itemResult = template(printReferral);
                itemsHtml = $"{itemsHtml}{itemResult}";

                if (summaryBreakCount == 3 || printedCount == supports.Count())
                {
                    summaryBreakCount = 0;
                    handlebars.RegisterTemplate("summaryItemsPartial", itemsHtml);

                    var mainTemplate = handlebars.Compile(LoadTemplate(ReferalMainViews.Summary.ToString()));
                    var data = new { volunteerFirstName, volunteerLastName, purchaserName };
                    result = $"{result}{mainTemplate(data)}{pageBreak}";
                    itemsHtml = string.Empty;
                }
            }

            return result;
        }

        private static string GetCSSPartialView()
        {
            return LoadTemplate("Css");
        }

        private static string GetItemsPartialView(PrintReferralType partialView, bool useSummaryPartial = false)
        {
            var summary = useSummaryPartial ? "Summary" : string.Empty;
            var name = $"{partialView}.{partialView}Items{summary}Partial";
            return LoadTemplate(name);
        }

        private static string GetChecklistPartialView(PrintReferralType partialView)
        {
            var name = $"{partialView}.{partialView}ChecklistPartial";
            return LoadTemplate(name);
        }

        private static string GetSupplierPartialView(PrintReferralType partialView)
        {
            var name = $"{partialView}.{partialView}SupplierPartial";
            return LoadTemplate(name);
        }

        private static string GetNotesPartialView(PrintReferralType partialView)
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
            var manifestName = $"EMBC.ESS.Managers.Events.PrintReferrals.Views.{name}.hbs";
            return assembly.GetManifestResourceString(manifestName);
        }
    }
}
