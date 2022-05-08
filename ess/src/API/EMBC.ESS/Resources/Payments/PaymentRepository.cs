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
            GetCasPaymentStatusRequest r => await Handle(r),

            _ => throw new NotSupportedException($"type {request.GetType().Name}")
        };

        private async Task<SavePaymentResponse> Handle(SavePaymentRequest request)
        {
            if (request.Payment.PayeeId == null) throw new ArgumentNullException(nameof(request.Payment.PayeeId));
            if (request.Payment is InteracSupportPayment isp && !isp.LinkedSupportIds.Any()) throw new ArgumentException("Interac payment must be linked to at least one support");

            var ct = CreateCancellationToken();
            var ctx = essContextFactory.Create();

            var payment = mapper.Map<era_etransfertransaction>(request.Payment);

            if (string.IsNullOrEmpty(request.Payment.Id))
            {
                payment.era_etransfertransactionid = Guid.NewGuid();
                ctx.AddToera_etransfertransactions(payment);
                // create in locking status
                UpdatePaymentStatus(ctx, payment, PaymentStatus.Processing);
                await ctx.SaveChangesAsync(ct);
                // release from lock
                UpdatePaymentStatus(ctx, payment, request.Payment.Status);
            }
            else
            {
                payment.era_etransfertransactionid = ctx.era_etransfertransactions.Where(t => t.era_name == request.Payment.Id).SingleOrDefault()?.era_etransfertransactionid;
                if (!payment.era_etransfertransactionid.HasValue) throw new InvalidOperationException($"payment id {request.Payment.Id} not found");
            }

            if (request.Payment is InteracSupportPayment ip)
            {
                //link the payment to the related supports
                foreach (var supportId in ip.LinkedSupportIds)
                {
                    var support = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(s => s.era_name == supportId)).ExecuteAsync(ct)).SingleOrDefault();
                    if (support == null) throw new InvalidOperationException($"support id {supportId} not found");
                    ctx.AddLink(payment, nameof(era_etransfertransaction.era_era_etransfertransaction_era_evacueesuppo), support);
                    // set the flag on support so it would not be processed again
                    support.era_etransfertransactioncreated = true;
                    ctx.UpdateObject(support);
                }
            }
            if (payment._era_payee_value.HasValue)
            {
                var payee = await ctx.contacts.ByKey(payment._era_payee_value).GetValueAsync();
                payment.era_suppliernumber = payee.era_sitesuppliernumber;
                payment.era_sitesuppliernumber = payee.era_sitesuppliernumber;

                ctx.SetLink(payment, nameof(era_etransfertransaction.era_Payee_contact), payee);
            }

            ctx.UpdateObject(payment);
            await ctx.SaveChangesAsync();

            ctx.DetachAll();

            var id = (await ctx.era_etransfertransactions.ByKey(payment.era_etransfertransactionid).GetValueAsync(ct)).era_name;

            return new SavePaymentResponse { Id = id };
        }

        private async Task<SearchPaymentResponse> Handle(SearchPaymentRequest request)
        {
            if (string.IsNullOrEmpty(request.ById) && string.IsNullOrEmpty(request.ByLinkedSupportId) && !request.ByStatus.HasValue)
                throw new ArgumentException("Payments query must have at least one criteria", nameof(request));

            var ct = CreateCancellationToken();
            var ctx = essContextFactory.CreateReadOnly();

            IEnumerable<era_etransfertransaction> payments = Array.Empty<era_etransfertransaction>();
            if (!string.IsNullOrEmpty(request.ByLinkedSupportId))
            {
                // search only for a single support
                var support = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(s => s.era_name == request.ByLinkedSupportId)).GetAllPagesAsync(ct)).SingleOrDefault();
                if (support != null)
                {
                    ctx.AttachTo(nameof(EssContext.era_evacueesupports), support);
                    await ctx.LoadPropertyAsync(support, nameof(era_evacueesupport.era_era_etransfertransaction_era_evacueesuppo));
                    payments = support.era_era_etransfertransaction_era_evacueesuppo;
                    if (request.ByStatus.HasValue) payments = payments.Where(p => p.statuscode == (int)request.ByStatus.Value);
                    if (!string.IsNullOrEmpty(request.ById)) payments = payments.Where(p => p.era_name == request.ById);
                }
            }
            else
            {
                // search all payments
                IQueryable<era_etransfertransaction> query = ctx.era_etransfertransactions;
                if (!string.IsNullOrEmpty(request.ById)) query = query.Where(tx => tx.era_name == request.ById);
                if (request.ByStatus.HasValue) query = query.Where(tx => tx.statuscode == (int)request.ByStatus.Value);
                query = query.OrderBy(q => q.createdon);
                if (request.LimitNumberOfItems.HasValue) query = query.Take(request.LimitNumberOfItems.Value);

                payments = (await ((DataServiceQuery<era_etransfertransaction>)query).GetAllPagesAsync(ct)).ToArray();
                payments.AsParallel().ForAll(tx => ctx.AttachTo(nameof(EssContext.era_etransfertransactions), tx));
                await Parallel.ForEachAsync(payments, ct, async (tx, ct) => await ctx.LoadPropertyAsync(tx, nameof(era_etransfertransaction.era_era_etransfertransaction_era_evacueesuppo), ct));
            }
            ctx.DetachAll();

            return new SearchPaymentResponse { Items = mapper.Map<IEnumerable<Payment>>(payments).ToArray() };
        }

        private async Task<SendPaymentToCasResponse> Handle(SendPaymentToCasRequest request)
        {
            var ct = CreateCancellationToken();

            var processedPayments = new List<string>();
            var failedPayments = new List<(string Id, string Reason)>();

            await Parallel.ForEachAsync(request.Items, ct, async (casPayment, ct) =>
            {
                var result = await SendPaymentToCas(essContextFactory.Create(), casPayment.PaymentId, request.CasBatchName, ct);
                if (result.Success)
                    processedPayments.Add(casPayment.PaymentId);
                else
                    failedPayments.Add((casPayment.PaymentId, result.ErrorMessage));
            });

            return new SendPaymentToCasResponse
            {
                SentItems = processedPayments.ToArray(),
                FailedItems = failedPayments.ToArray()
            };
        }

        private async Task<(bool Success, string ErrorMessage)> SendPaymentToCas(EssContext ctx, string paymentId, string batch, CancellationToken ct)
        {
            var payment = (await ((DataServiceQuery<era_etransfertransaction>)ctx.era_etransfertransactions
                .Where(tx => tx.era_name == paymentId))
                .ExecuteAsync(ct))
                .SingleOrDefault();

            if (payment == null) throw new Exception($"Payment {paymentId} not found");

            //load related supports
            await ctx.LoadPropertyAsync(payment, nameof(era_etransfertransaction.era_era_etransfertransaction_era_evacueesuppo), ct);

            try
            {
                //validate payment
                var validations = ValidatePaymentBeforeSendingToCas(payment).ToArray();
                if (validations.Any()) throw new InvalidOperationException($"Payment {paymentId} cannot be sent to CAS: {string.Join(';', validations)}");

                //lock payment from being picked up by somebody else
                UpdatePaymentStatus(ctx, payment, PaymentStatus.Sending);
                await ctx.SaveChangesAsync(ct);

                var payee = (await ((DataServiceQuery<contact>)ctx.contacts
                    .Expand(c => c.era_ProvinceState)
                    .Expand(c => c.era_Country)
                    .Expand(c => c.era_City)
                    .Where(c => c.contactid == payment._era_payee_value))
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
                }

                // update CAS related fields
                var now = DateTime.UtcNow;
                payment.era_gldate = now;
                payment.era_invoicedate = now;
                payment.era_dateinvoicereceived = now;
                payment.era_suppliernumber = payee.era_suppliernumber;
                payment.era_sitesuppliernumber = payee.era_sitesuppliernumber;

                //send to CAS
                await casGateway.CreateInvoice(batch, payment, ct);
                payment.era_processingresponse = string.Empty;
                UpdatePaymentStatus(ctx, payment, PaymentStatus.Sent);

                ctx.UpdateObject(payment);
                await ctx.SaveChangesAsync(ct);

                return (true, string.Empty);
            }
            catch (DataServiceRequestException e) when (e.InnerException is DataServiceClientException ie)
            {
                //guard against Dynamics RowVersion check when saving
                return (false, "Failed to update payment, likely because somebody else updated it at the same time");
            }
            catch (Exception e)
            {
                payment.era_processingresponse = e.Message;
                UpdatePaymentStatus(ctx, payment, PaymentStatus.Failed);
                ctx.UpdateObject(payment);
                await ctx.SaveChangesAsync(ct);

                return (false, e.Message);
            }
        }

        private static IEnumerable<string> ValidatePaymentBeforeSendingToCas(era_etransfertransaction payment)
        {
            if (payment.statuscode != (int)PaymentStatus.Pending) yield return $"Payment is in status {(PaymentStatus)payment.statuscode} - expected Pending status";
            if (!payment._era_payee_value.HasValue) yield return "Payment has no payee";
            if (!payment.era_era_etransfertransaction_era_evacueesuppo.Any()) yield return "Payment is not linked to any support";
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
            Issued = 174360007
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
                case PaymentStatus.Sending:
                case PaymentStatus.Failed:
                case PaymentStatus.Issued:
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
                case SupportStatus.Issued:
                    ctx.ActivateObject(support, (int)status);
                    break;

                default:
                    support.statuscode = (int)status;
                    break;
            }
        }
    }
}
