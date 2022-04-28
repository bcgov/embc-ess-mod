using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace EMBC.ESS.Engines.Search
{
    internal partial class SearchEngine
    {
        private async Task<SupportSearchResponse> Handle(SupportSearchRequest request)
        {
            return request switch
            {
                PendingPaymentSupportSearchRequest r => await HandleInternal(r),

                _ => throw new NotImplementedException($"{nameof(SupportSearchRequest)} of type {request.GetType().Name} is not implemented")
            };
        }

        private async Task<PendingPaymentSupportSearchResponse> HandleInternal(PendingPaymentSupportSearchRequest _)
        {
            var ctx = essContextFactory.CreateReadOnly();

            var pendingPaymentSupports = await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports
                .Expand(s => s.era_EvacuationFileId)
                .Expand(s => s.era_PayeeId)
                .Where(s => s.statuscode == (int)SupportStatus.Approved && s.era_etransfertransactioncreated != true))
                .GetAllPagesAsync();

            return new PendingPaymentSupportSearchResponse
            {
                Supports = pendingPaymentSupports.Select(s => new PayableSupport
                {
                    Amount = s.era_totalamount ?? 0m,
                    FileId = s.era_EvacuationFileId.era_name,
                    SupportId = s.era_name,
                    PayeeId = s.era_PayeeId.contactid?.ToString(),
                    Delivery = new PayableSupportInteracDelivery
                    {
                        NotificationEmail = s.era_notificationemailaddress,
                        NotificationPhone = s.era_notificationphonenumber,
                        RecipientFirstName = s.era_PayeeId?.firstname,
                        RecipientLastName = s.era_PayeeId?.lastname
                    }
                })
            };
        }
    }

    internal enum SupportStatus
    {
        Active = 1,
        Expired = 174360000,
        Void = 2,
        PendingApproval = 174360001,
        Approved = 174360002,
        Paid = 174360003,
        Cancelled = 174360004,
        UnderReview = 174360005,
        PendingScan = 174360006,
    }
}
