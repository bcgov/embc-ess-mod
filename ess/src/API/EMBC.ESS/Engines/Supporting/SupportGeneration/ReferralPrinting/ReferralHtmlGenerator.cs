using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using EMBC.Utilities.Extensions;
using HandlebarsDotNet;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting
{
    internal class ReferralHtmlGenerator
    {
        public static readonly string PageBreak = $@"{Environment.NewLine}<div class=""page-break""></div>{Environment.NewLine}";

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

        public static string CreateSingleHtmlDocument(PrintRequestingUser printingUser, IEnumerable<PrintReferral> referrals, bool includeSummary, bool displayWatermark)
        {
            var html = new StringBuilder();
            if (includeSummary)
            {
                html.Append(CreateReferalHtmlSummary(referrals, printingUser, displayWatermark));
                html.Append(PageBreak);
            }
            foreach (var referral in referrals)
            {
                html.Append(CreateReferralHtmlPage(referral));
                html.Append(PageBreak);
            }

            return CreateDocument(html.ToString());
        }

        private static string CreateDocument(string html)
        {
            var handlebars = CreateHandleBars();
            handlebars.RegisterTemplate("stylePartial", GetCSSPartialView());
            handlebars.RegisterTemplate("bodyPartial", html);
            var template = handlebars.Compile(LoadTemplate("MasterLayout"));

            return template(string.Empty);
        }

        public static string CreateReferralHtmlPage(PrintReferral referral)
        {
            var handlebars = CreateHandleBars();
            handlebars.RegisterTemplate("stylePartial", GetCSSPartialView());

            var partialViewType = referral.Type;

            handlebars.RegisterTemplate("itemsPartial", GetItemsPartialView(partialViewType));
            handlebars.RegisterTemplate("itemsDetailTitle", string.Empty);
            handlebars.RegisterTemplate("supplierPartial", GetSupplierPartialView(partialViewType));
            handlebars.RegisterTemplate("checklistPartial", GetChecklistPartialView(partialViewType));

            var template = handlebars.Compile(LoadTemplate(ReferalMainViews.Referral.ToString()));

            return template(referral);
        }

        public static string CreateReferalHtmlSummary(IEnumerable<PrintReferral> supports, PrintRequestingUser requestingUser, bool displayWatermark)
        {
            var handlebars = CreateHandleBars();

            var summaryBreakCount = 0;
            var printedCount = 0;
            var html = new StringBuilder();
            var items = new StringBuilder();
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

                handlebars.RegisterTemplate("itemsPartial", GetItemsPartialView(partialViewType, useSummaryVersion));
                handlebars.RegisterTemplate("itemsDetailTitle", "Details");
                handlebars.RegisterTemplate("notesPartial", GetNotesPartialView(partialViewType));

                var template = handlebars.Compile(LoadTemplate(ReferalMainViews.SummaryItem.ToString()));

                var purchaserName = printReferral.PurchaserName;
                var volunteerFirstName = requestingUser.FirstName;
                var volunteerLastName = requestingUser.LastName;
                var itemResult = template(printReferral);
                items.Append(itemResult);

                if (summaryBreakCount == 3 || printedCount == supports.Count())
                {
                    summaryBreakCount = 0;
                    handlebars.RegisterTemplate("summaryItemsPartial", items.ToString());

                    var mainTemplate = handlebars.Compile(LoadTemplate(ReferalMainViews.Summary.ToString()));
                    var data = new { volunteerFirstName, volunteerLastName, purchaserName, displayWatermark };
                    html.Append(mainTemplate(data));
                    html.Append(PageBreak);
                    items.Clear();
                }
            }
            return html.ToString();
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

        private static string GetChecklistPartialView(PrintReferralType partialView) => LoadTemplate($"{partialView}.{partialView}ChecklistPartial");

        private static string GetSupplierPartialView(PrintReferralType partialView) => LoadTemplate($"{partialView}.{partialView}SupplierPartial");

        private static string GetNotesPartialView(PrintReferralType partialView) => LoadTemplate($"{partialView}.{partialView}NotesPartial");

        private enum ReferalMainViews
        {
            Referral,
            Summary,
            SummaryItem
        }

        private static string LoadTemplate(string name) =>
            Assembly.GetExecutingAssembly().GetManifestResourceString($"EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting.Views.{name}.hbs");
    }
}
