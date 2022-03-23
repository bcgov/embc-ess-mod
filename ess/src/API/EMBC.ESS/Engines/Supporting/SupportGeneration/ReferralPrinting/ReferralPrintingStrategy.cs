using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting
{
    internal class ReferralPrintingStrategy : ISupportGenerationStrategy
    {
        public async Task<GenerateResponse> Generate(GenerateRequest request)
        {
            if (!(request is GenerateReferralsRequest r))
                throw new InvalidOperationException($"{nameof(ISupportProcessingStrategy)} of type {nameof(ReferralPrintingStrategy)} can only handle {nameof(GenerateReferralsRequest)} request types");
            return await HandleInternal(r);
        }

        private async Task<GenerateReferralsResponse> HandleInternal(GenerateReferralsRequest request)
        {
            var referralsHtml = await AssembleReferralHtml(request.RequestingUser, request.Referrals, request.AddSummary, request.AddWatermark);

            return new GenerateReferralsResponse
            {
                Content = Encoding.UTF8.GetBytes(referralsHtml)
            };
        }

        private async Task<string> AssembleReferralHtml(PrintRequestingUser requestingUser, IEnumerable<PrintReferral> referrals, bool includeSummary, bool displayWatermark)
        {
            var html = new StringBuilder();
            if (includeSummary)
            {
                html.Append(HtmlGenerator.CreateReferalHtmlSummary(referrals, requestingUser, displayWatermark));
            }
            foreach (var referral in referrals)
            {
                referral.VolunteerFirstName = requestingUser.FirstName;
                referral.VolunteerLastName = requestingUser.LastName;
                referral.DisplayWatermark = displayWatermark;
                html.Append(HtmlGenerator.CreateReferralHtmlPage(referral));
            }

            return await Task.FromResult(HtmlGenerator.CreateDocument(html.ToString()));
        }
    }
}
