using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Xrm.Tools.WebAPI;

namespace EMBC.Suppliers.API.SubmissionModule.Models.Dynamics
{
    public class SubmissionDynamicsCustomActionHandler : ISubmissionDynamicsCustomActionHandler
    {
        private readonly CRMWebAPI api;
        private readonly ILogger<SubmissionDynamicsCustomActionHandler> logger;

        public SubmissionDynamicsCustomActionHandler(CRMWebAPI api, ILogger<SubmissionDynamicsCustomActionHandler> logger)
        {
            this.api = api;
            this.logger = logger;
        }

        public async Task Handle(SubmissionSavedEvent evt)
        {
            if (evt == null) throw new ArgumentNullException(nameof(evt));

            var referenceNumber = evt.ReferenceNumber;
            var supplierInformation = evt.Submission.Suppliers.First();
            var remittanceInformation = evt.Submission.Suppliers.SingleOrDefault(i => i.ForRemittance);

            var receiptLineItems = evt.Submission.Receipts.Select(r => (receipt: r, lineItems: evt.Submission.LineItems.Where(li => li.ReceiptNumber == r.ReceiptNumber)));
            var referralLineItems = evt.Submission.Referrals.Select(r => (referral: r, lineItems: evt.Submission.LineItems.Where(li => string.IsNullOrEmpty(li.ReceiptNumber) && li.ReferralNumber == r.ReferralNumber)));

            var receiptAttachments = evt.Submission.Receipts.Select(r => (receipt: r, attachments: evt.Submission.Attachments.Where(a => a.ReferralNumber == r.ReceiptNumber && a.Type == AttachmentType.Receipt)));
            var referralAttachments = evt.Submission.Referrals.Select(r => (referral: r, attachments: evt.Submission.Attachments.Where(a => a.ReferralNumber == r.ReferralNumber && a.Type == AttachmentType.Referral)));
            var invoiceAttachments = evt.Submission.Invoices.Select(i => (invoic: i, attachments: evt.Submission.Attachments.Where(a => a.InvoiceNumber == i.InvoiceNumber && a.Type == AttachmentType.Invoice)));

            var submission = new
            {
                isInvoice = evt.Submission.Invoices.Any(),
                invoiceCollection = evt.Submission.Invoices.MapInvoices(referenceNumber, supplierInformation, remittanceInformation),
                referralCollection = evt.Submission.Referrals.MapReferrals(referenceNumber),
                lineItemCollection = receiptLineItems.SelectMany(rli => rli.lineItems.MapLineItems(referenceNumber, rli.receipt))
                                        .Concat(referralLineItems.SelectMany(rli => rli.lineItems.MapLineItems(referenceNumber, rli.referral))),
                documentCollection = evt.Submission.Attachments.Any()
                                        ? receiptAttachments.SelectMany(ra => ra.attachments.MapAttachments())
                                            .Concat(referralAttachments.SelectMany(ra => ra.attachments.MapAttachments()))
                                            .Concat(invoiceAttachments.SelectMany(ra => ra.attachments.MapAttachments()))
                                        : null
            };

            logger.LogDebug(JsonConvert.SerializeObject(submission));

            dynamic result = await api.ExecuteAction("era_SubmitUnauthInvoices", submission);

            if (!result.submissionFlag)
            {
                throw new Exception($"era_SubmitUnauthInvoices call failed: {result.message}");
            }
        }
    }
}
