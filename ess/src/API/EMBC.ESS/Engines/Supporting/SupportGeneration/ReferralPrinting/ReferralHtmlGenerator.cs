using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using EMBC.Utilities.Extensions;
using HandlebarsDotNet;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting
{
    internal static class ReferralHtmlGenerator
    {
        public static readonly string PageBreak = $@"{Environment.NewLine}<div class=""page-break""></div>{Environment.NewLine}";

        private static IHandlebars CreateHandleBars()
        {
            var handleBars = Handlebars.Create();
            handleBars.RegisterHelper("zeroIndex", (output, context, arguments) =>
            {
                var incoming = (string)arguments[0];
                output.WriteSafeString(incoming?.ToUpperInvariant()[0]);
            });
            handleBars.RegisterHelper("dateFormatter", (output, context, arguments) =>
            {
                output.WriteSafeString(arguments[0]);
            });
            handleBars.RegisterHelper("timeFormatter", (output, context, arguments) =>
            {
                var samp = Convert.ToDateTime((string)arguments[0]);
                output.WriteSafeString(samp.ToString("hh:mm tt"));
            });
            handleBars.RegisterHelper("upperCase", (output, context, arguments) =>
            {
                var upperCaseString = (string)arguments[0];
                output.WriteSafeString(upperCaseString?.ToUpperInvariant());
            });

            return handleBars;
        }

        public static async Task<string> CreateSingleHtmlDocument(PrintRequestingUser printingUser, IEnumerable<PrintReferral> referrals, IEnumerable<PrintSummary> summaryItems, bool includeSummary, bool displayWatermark, string title, PrintEvacuee evacuee)
        {
            var html = new StringBuilder();
            if (includeSummary)
            {
                html.Append(await CreateReferalHtmlSummary(summaryItems, printingUser, displayWatermark, evacuee));
                html.Append(PageBreak);
            }
            foreach (var referral in referrals)
            {
                html.Append(await CreateReferralHtmlPage(referral));
                html.Append(PageBreak);
            }

            return await CreateDocument(html.ToString(), title);
        }

        private static async Task<string> CreateDocument(string html, string documentTitle)
        {
            var handlebars = CreateHandleBars();
            handlebars.RegisterTemplate("stylePartial", await GetCSSPartialView());
            handlebars.RegisterTemplate("bodyPartial", html);
            var template = handlebars.Compile(await LoadTemplate("MasterLayout"));

            return template(new { documentTitle });
        }

        private static async Task<string> CreateReferralHtmlPage(PrintReferral referral)
        {
            var handlebars = CreateHandleBars();
            handlebars.RegisterTemplate("stylePartial", await GetCSSPartialView());

            var partialViewType = referral.Type;

            handlebars.RegisterTemplate("itemsPartial", await GetItemsPartialView(partialViewType));
            handlebars.RegisterTemplate("itemsDetailTitle", string.Empty);
            handlebars.RegisterTemplate("supplierPartial", await GetSupplierPartialView(partialViewType));
            handlebars.RegisterTemplate("checklistPartial", await GetChecklistPartialView(partialViewType));
            handlebars.RegisterTemplate("additionalInfoPartial", await GetAdditionalInfoPartialView(partialViewType));

            var template = handlebars.Compile(await LoadTemplate(ReferalMainViews.Referral.ToString()));

            return template(referral);
        }

        private static async Task<string> CreateReferalHtmlSummary(IEnumerable<PrintSummary> summaryItems, PrintRequestingUser requestingUser, bool displayWatermark, PrintEvacuee evacuee)
        {
            var handlebars = CreateHandleBars();

            var summaryBreakCount = 0;
            var printedCount = 0;
            var html = new StringBuilder();
            var items = new StringBuilder();
            foreach (var summary in summaryItems)
            {
                summaryBreakCount += summary.IsEtransfer ? 2 : 1;
                printedCount += 1;
                var partialViewType = summary.Type;
                var partialViewDisplayName = partialViewType.GetType()
                        .GetMember(partialViewType.ToString())
                        .First()
                        .GetCustomAttribute<DisplayAttribute>()
                        .GetName();
                handlebars.RegisterTemplate("titlePartial", partialViewDisplayName);

                var useSummaryVersion = partialViewType == PrintReferralType.Hotel || partialViewType == PrintReferralType.Billeting || partialViewType == PrintReferralType.ShelterAllowance;

                handlebars.RegisterTemplate("itemsPartial", await GetItemsPartialView(partialViewType, useSummaryVersion));
                handlebars.RegisterTemplate("itemsDetailTitle", "Details");
                handlebars.RegisterTemplate("notesPartial", await GetNotesPartialView(partialViewType));
                handlebars.RegisterTemplate("deliverySummaryPartial", await GetDeliverySummaryPartialView(partialViewType));

                var template = handlebars.Compile(await LoadTemplate(ReferalMainViews.SummaryItem.ToString()));

                var purchaserName = summary.PurchaserName;
                var volunteerFirstName = requestingUser.FirstName;
                var volunteerLastName = requestingUser.LastName;
                var itemResult = template(summary);
                var essNumber = summary.EssNumber;
                var evacueeName = evacuee.LastName + ", " + evacuee.FirstName;
                items.Append(itemResult);

                if (summaryBreakCount >= 3 || printedCount == summaryItems.Count())
                {
                    summaryBreakCount = 0;
                    handlebars.RegisterTemplate("summaryItemsPartial", items.ToString());

                    var mainTemplate = handlebars.Compile(await LoadTemplate(ReferalMainViews.Summary.ToString()));
                    var data = new { volunteerFirstName, volunteerLastName, purchaserName, displayWatermark, essNumber, evacueeName };
                    html.Append(mainTemplate(data));
                    html.Append(PageBreak);
                    items.Clear();
                }
            }
            return html.ToString();
        }

        private static Task<string> GetCSSPartialView()
        {
            return LoadTemplate("Css");
        }

        private static Task<string> GetItemsPartialView(PrintReferralType partialView, bool useSummaryPartial = false)
        {
            var summary = useSummaryPartial ? "Summary" : string.Empty;
            var name = $"{partialView}.{partialView}Items{summary}Partial";
            return LoadTemplate(name);
        }

        private static Task<string> GetChecklistPartialView(PrintReferralType partialView) => LoadTemplate($"{partialView}.{partialView}ChecklistPartial");

        private static Task<string> GetSupplierPartialView(PrintReferralType partialView) => LoadTemplate($"{partialView}.{partialView}SupplierPartial");

        private static Task<string> GetNotesPartialView(PrintReferralType partialView) => LoadTemplate($"{partialView}.{partialView}NotesPartial");

        private static Task<string> GetAdditionalInfoPartialView(PrintReferralType partialView) => LoadTemplate($"{partialView}.{partialView}AdditionalInfoPartial");

        private static Task<string> GetDeliverySummaryPartialView(PrintReferralType partialView) => LoadTemplate($"{partialView}.{partialView}DeliverySummaryPartial");

        private enum ReferalMainViews
        {
            Referral,
            Summary,
            SummaryItem
        }

        private static async Task<string> LoadTemplate(string name) =>
           await Assembly.GetExecutingAssembly().GetManifestResourceString($"EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting.Views.{name}.hbs");
    }
}
