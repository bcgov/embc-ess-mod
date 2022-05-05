using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Cas;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace EMBC.ESS.Resources.Payments
{
    internal class PaymentRepository : IPaymentRepository
    {
        private readonly IMapper mapper;
        private readonly IEssContextFactory essContextFactory;
        private readonly ICasGateway casGateway;

        private static CancellationToken CreateCancellationToken() => new CancellationTokenSource().Token;

        public PaymentRepository(IMapper mapper, IEssContextFactory essContextFactory, ICasGateway casGateway)
        {
            this.mapper = mapper;
            this.essContextFactory = essContextFactory;
            this.casGateway = casGateway;
        }

        public async Task<ManagePaymentResponse> Manage(ManagePaymentRequest request) =>
            request switch
            {
                SavePaymentRequest r => await Handle(r),
                SendPaymentToCasRequest r => await Handle(r),
                UpdateCasPaymentStatusRequest r => await Handle(r),

                _ => throw new NotSupportedException($"type {request.GetType().Name}")
            };

        public async Task<QueryPaymentResponse> Query(QueryPaymentRequest request) =>
        request switch
        {
            SearchPaymentRequest r => await Handle(r),
            GetCasPayeeDetailsRequest r => await Handle(r),
            GetCasPaymentStatusRequest r => await Handle(r),

            _ => throw new NotSupportedException($"type {request.GetType().Name}")
        };

        private async Task<SavePaymentResponse> Handle(SavePaymentRequest request)
        {
            var ct = CreateCancellationToken();
            var ctx = essContextFactory.Create();

            var tx = mapper.Map<era_etransfertransaction>(request.Payment);

            if (string.IsNullOrEmpty(request.Payment.Id))
            {
                tx.era_etransfertransactionid = Guid.NewGuid();
                ctx.AddToera_etransfertransactions(tx);
                await ctx.SaveChangesAsync(ct);
            }
            else
            {
                tx.era_etransfertransactionid = ctx.era_etransfertransactions.Where(t => t.era_name == request.Payment.Id).SingleOrDefault()?.era_etransfertransactionid;
                if (!tx.era_etransfertransactionid.HasValue) throw new InvalidOperationException($"payment id {request.Payment.Id} not found");
                ctx.UpdateObject(tx);
            }
            if (request.Payment is InteracSupportPayment ip)
            {
                foreach (var supportId in ip.LinkedSupportIds)
                {
                    var support = ctx.era_evacueesupports.Where(s => s.era_name == supportId).SingleOrDefault();
                    if (support == null) throw new InvalidOperationException($"support id {supportId} not found");
                    ctx.AddLink(tx, nameof(era_etransfertransaction.era_era_etransfertransaction_era_evacueesuppo), support);
                    // set the flag on support so it would not be processed again
                    support.era_etransfertransactioncreated = true;
                    ctx.UpdateObject(support);
                }
            }
            if (tx._era_payee_value.HasValue)
            {
                var payee = await ctx.contacts.ByKey(tx._era_payee_value).GetValueAsync();
                tx.era_suppliernumber = payee.era_sitesuppliernumber;
                tx.era_sitesuppliernumber = payee.era_sitesuppliernumber;

                ctx.SetLink(tx, nameof(era_etransfertransaction.era_Payee_contact), payee);
            }

            await ctx.SaveChangesAsync();

            ctx.DetachAll();

            var id = (await ctx.era_etransfertransactions.ByKey(tx.era_etransfertransactionid).GetValueAsync(ct)).era_name;

            return new SavePaymentResponse { Id = id };
        }

        private async Task<SearchPaymentResponse> Handle(SearchPaymentRequest request)
        {
            if (string.IsNullOrEmpty(request.ById) && !request.ByStatus.HasValue)
                throw new ArgumentException("Payments query must have at least one criteria", nameof(request));

            var ct = CreateCancellationToken();
            var ctx = essContextFactory.CreateReadOnly();

            IQueryable<era_etransfertransaction> query = ctx.era_etransfertransactions;
            if (!string.IsNullOrEmpty(request.ById)) query = query.Where(tx => tx.era_name == request.ById);
            if (request.ByStatus.HasValue) query = query.Where(tx => tx.statuscode == (int)request.ByStatus.Value);
            query = query.OrderBy(q => q.createdon);
            if (request.LimitNumberOfItems.HasValue) query = query.Take(request.LimitNumberOfItems.Value);

            var txs = (await ((DataServiceQuery<era_etransfertransaction>)query).GetAllPagesAsync(ct)).ToArray();
            txs.AsParallel().ForAll(tx => ctx.AttachTo(nameof(EssContext.era_etransfertransactions), tx));
            await Parallel.ForEachAsync(txs, ct, (tx, ct) => new ValueTask(ctx.LoadPropertyAsync(tx, nameof(era_etransfertransaction.era_era_etransfertransaction_era_evacueesuppo), ct)));

            ctx.DetachAll();

            return new SearchPaymentResponse { Items = mapper.Map<IEnumerable<Payment>>(txs).ToArray() };
        }

        private async Task<SendPaymentToCasResponse> Handle(SendPaymentToCasRequest request)
        {
            var ct = CreateCancellationToken();
            var ctx = essContextFactory.Create();

            List<string> processedPayments = new List<string>();
            List<(string Id, string Reason)> failedPayments = new List<(string Id, string Reason)>();

            foreach (var casPayment in request.Items)
            {
                var paymentId = casPayment.PaymentId;
                var payment = (await ((DataServiceQuery<era_etransfertransaction>)ctx.era_etransfertransactions.Where(tx => tx.era_name == paymentId)).ExecuteAsync(ct)).SingleOrDefault();
                if (payment == null) throw new Exception($"Payment {paymentId} not found");

                try
                {
                    if (payment.statuscode != (int)PaymentStatus.Pending) throw new InvalidOperationException($"Payment is in status {(PaymentStatus)payment.statuscode} - cannot send to CAS");

                    // update CAS related fields
                    var now = DateTime.UtcNow;
                    payment.era_gldate = now;
                    payment.era_invoicedate = now;
                    payment.era_dateinvoicereceived = now;
                    if (payment.era_suppliernumber == null) payment.era_suppliernumber = casPayment.PayeeDetails.SupplierNumber;
                    if (payment.era_sitesuppliernumber == null) payment.era_sitesuppliernumber = casPayment.PayeeDetails.SupplierSiteCode;

                    UpdatePaymentStatus(ctx, payment, PaymentStatus.Sent);
                    payment.era_processingresponse = string.Empty;
                    processedPayments.Add(paymentId);
                }
                catch (Exception e)
                {
                    UpdatePaymentStatus(ctx, payment, PaymentStatus.Failed);
                    payment.era_processingresponse = e.Message;
                    failedPayments.Add((paymentId, e.Message));
                }
                ctx.UpdateObject(payment);
                await ctx.SaveChangesAsync(ct);
            }

            return new SendPaymentToCasResponse
            {
                SentItems = processedPayments.ToArray(),
                FailedItems = failedPayments.ToArray()
            };
        }

        private async Task<GetCasPayeeDetailsResponse> Handle(GetCasPayeeDetailsRequest request)
        {
            if (string.IsNullOrEmpty(request.PayeeId) || !Guid.TryParse(request.PayeeId, out var payeeId)) throw new ArgumentNullException(nameof(request.PayeeId));

            var ct = CreateCancellationToken();
            var ctx = essContextFactory.Create();

            var payee = (await ((DataServiceQuery<contact>)ctx.contacts
                .Expand(c => c.era_ProvinceState)
                .Expand(c => c.era_Country)
                .Expand(c => c.era_City)
                .Where(c => c.contactid == payeeId))
                .ExecuteAsync(ct))
                .SingleOrDefault();

            if (payee.era_suppliernumber == null)
            {
                // payee has no supplier number, search CAS
                var supplierDetails = await casGateway.GetSupplier(payee, ct);

                if (supplierDetails == null)
                {
                    // no matching supplier in CAS, create a new one
                    supplierDetails = await casGateway.CreateSupplier(payee, ct);
                }
                payee.era_suppliernumber = supplierDetails.Value.SupplierNumber;
                payee.era_sitesuppliernumber = supplierDetails.Value.SiteCode;

                ctx.UpdateObject(payee);

                await ctx.SaveChangesAsync(ct);
            }

            var response = new GetCasPayeeDetailsResponse
            {
                CasSupplierNumber = payee.era_suppliernumber,
                CasSupplierSiteNumber = payee.era_sitesuppliernumber
            };

            ctx.DetachAll();

            return response;
        }

        private async Task<GetCasPaymentStatusResponse> Handle(GetCasPaymentStatusRequest request)
        {
            var ct = CreateCancellationToken();
            var casStatuses = CasStatusResolver(request.InStatus);

            var invoices = new List<InvoiceItem>();
            foreach (var status in casStatuses)
            {
                invoices.AddRange(await casGateway.QueryInvoices(status, request.ChangedFrom, ct));
            }

            return new GetCasPaymentStatusResponse
            {
                Payments = invoices.Select(p => new CasPaymentDetails
                {
                    PaymentId = p.Invoicenumber,
                    Status = CasStatusResolver(p.Paymentstatus),
                    StatusChangeDate = p.Paymentstatusdate,
                    CasReferenceNumber = p.Paymentnumber?.ToString(),
                    StatusDescription = p.Voidreason
                })
            };
        }

        private static IEnumerable<string> CasStatusResolver(CasPaymentStatus? s) =>
            s switch
            {
                CasPaymentStatus.Paid => new[] { "RECONCILED", "RECONCILED UNACCOUNTED" },
                CasPaymentStatus.Pending => new[] { "NEGOTIABLE" },
                CasPaymentStatus.Failed => new[] { "VOIDED" },

                _ => new[] { string.Empty }
            };

        private static CasPaymentStatus CasStatusResolver(string? s) =>
            s switch
            {
                "RECONCILED" => CasPaymentStatus.Paid,
                "RECONCILED UNACCOUNTED" => CasPaymentStatus.Paid,
                "VOIDED" => CasPaymentStatus.Failed,

                _ => CasPaymentStatus.Pending
            };

        private static SupportStatus ResolveSupportStatus(PaymentStatus paymentStatus) =>
            paymentStatus switch
            {
                PaymentStatus.Failed => SupportStatus.UnderReview,
                PaymentStatus.Paid => SupportStatus.Paid,
                _ => throw new NotImplementedException($"missing map from payment status {paymentStatus} to support status")
            };

        private enum SupportStatus
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

        private async Task<UpdateCasPaymentStatusResponse> Handle(UpdateCasPaymentStatusRequest request)
        {
            if (string.IsNullOrEmpty(request.PaymentId)) throw new ArgumentNullException(nameof(request.PaymentId));

            var ct = CreateCancellationToken();
            var ctx = essContextFactory.Create();

            var tx = (await ((DataServiceQuery<era_etransfertransaction>)ctx.era_etransfertransactions.Where(t => t.era_name == request.PaymentId)).ExecuteAsync(ct)).SingleOrDefault();
            if (tx == null) return new UpdateCasPaymentStatusResponse { };
            await ctx.LoadPropertyAsync(tx, nameof(era_etransfertransaction.era_era_etransfertransaction_era_evacueesuppo), ct);

            UpdatePaymentStatus(ctx, tx, request.ToPaymentStatus);
            tx.era_casresponsedate = request.StatusChangeDate;
            tx.era_casreferencenumber = request.CasReferenceNumber;
            tx.era_processingresponse = request.Reason;

            ctx.UpdateObject(tx);

            foreach (var support in tx.era_era_etransfertransaction_era_evacueesuppo)
            {
                UpdateSupportStatus(ctx, support, ResolveSupportStatus(request.ToPaymentStatus));
                ctx.UpdateObject(support);
            }

            await ctx.SaveChangesAsync(ct);

            return new UpdateCasPaymentStatusResponse { PaymentId = request.PaymentId };
        }

        private static void UpdatePaymentStatus(EssContext ctx, era_etransfertransaction payment, PaymentStatus status)
        {
            switch (status)
            {
                case PaymentStatus.Pending:
                case PaymentStatus.Sent:
                case PaymentStatus.Failed:
                    ctx.ActivateObject(payment, (int)status);
                    break;

                case PaymentStatus.Paid:
                case PaymentStatus.Cancelled:
                    ctx.DeactivateObject(payment, (int)status);
                    break;

                default:
                    throw new NotImplementedException($"Update payment status to {status}");
            }
        }

        private static void UpdateSupportStatus(EssContext ctx, era_evacueesupport support, SupportStatus status)
        {
            switch (status)
            {
                case SupportStatus.Paid:
                    ctx.DeactivateObject(support, (int)status);
                    break;

                case SupportStatus.UnderReview:
                    ctx.ActivateObject(support, (int)status);
                    break;

                default:
                    support.statuscode = (int)status;
                    break;
            }
        }
    }
}
