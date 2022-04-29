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
    public class PaymentRepository : IPaymentRepository
    {
        private readonly IMapper mapper;
        private readonly IEssContextFactory essContextFactory;
        private readonly IWebProxy casWebProxy;

        private static CancellationToken CreateCancellationToken() => new CancellationTokenSource().Token;

        public PaymentRepository(IMapper mapper, IEssContextFactory essContextFactory, IWebProxy casWebProxy)
        {
            this.mapper = mapper;
            this.essContextFactory = essContextFactory;
            this.casWebProxy = casWebProxy;
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
                    if (payment.statuscode != (int)PaymentStatus.Pending) throw new Exception($"Payment is in status {(PaymentStatus)payment.statuscode} - cannot send to CAS");

                    // update CAS related fields
                    var now = DateTime.UtcNow;
                    payment.era_gldate = now;
                    payment.era_invoicedate = now;
                    payment.era_dateinvoicereceived = now;
                    if (payment.era_suppliernumber == null) payment.era_suppliernumber = casPayment.PayeeDetails.SupplierNumber;
                    if (payment.era_sitesuppliernumber == null) payment.era_sitesuppliernumber = casPayment.PayeeDetails.SupplierSiteCode;

                    var invoice = mapper.Map<Invoice>(payment);
                    //TODO: get from Dynamics sys config values
                    invoice.PayGroup = "EMB INC";
                    var distributedAccount = "105.15006.10120.5185.1500000.000000.0000";
                    invoice.InvoiceBatchName = request.CasBatchName;
                    var lineItemNumber = 1;
                    foreach (var lineItem in invoice.InvoiceLineDetails)
                    {
                        lineItem.InvoiceLineNumber = lineItemNumber++;
                        lineItem.DefaultDistributionAccount = distributedAccount;
                    }

                    var response = await casWebProxy.CreateInvoiceAsync(invoice);
                    if (response.IsSuccess())
                    {
                        payment.statuscode = (int)PaymentStatus.Sent;
                        payment.era_processingresponse = string.Empty;
                        processedPayments.Add(paymentId);
                    }
                    else
                    {
                        payment.statuscode = (int)PaymentStatus.Failed;
                        payment.era_processingresponse = response.CASReturnedMessages;
                        failedPayments.Add((paymentId, response.CASReturnedMessages));
                    }
                }
                catch (Exception e)
                {
                    payment.statuscode = (int)PaymentStatus.Failed;
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

        private static string CasSupplierNameFormatter(contact payee) => $"{payee.lastname.ToUpperInvariant()}, {payee.firstname.ToUpperInvariant()}";

        private static string CasPostalCodeFormatter(string postalCode) => postalCode.Replace(" ", string.Empty).ToUpperInvariant();

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
                var supplier = await casWebProxy.GetSupplierAsync(new GetSupplierRequest
                {
                    PostalCode = CasPostalCodeFormatter(payee.address1_postalcode),
                    SupplierName = CasSupplierNameFormatter(payee)
                });
                var supplierAddress = supplier?.SupplierAddress.FirstOrDefault();

                if (supplier == null || supplierAddress == null)
                {
                    // no matching supplier in CAS, create a new one
                    var newSupplier = await casWebProxy.CreateSupplierAsync(new CreateSupplierRequest
                    {
                        SubCategory = "Individual",
                        SupplierName = CasSupplierNameFormatter(payee),
                        SupplierAddress = new[]
                        {
                            new Supplieraddress
                            {
                                ProviderId = "CAS_SU_AT_ESS",
                                AddressLine1 = payee.address1_line1.Replace('.', ' '),
                                AddressLine2 = payee.address1_line2,
                                AddressLine3 = payee.address1_line3,
                                City = payee.era_City?.era_jurisdictionname ?? payee.address1_city,
                                Postalcode = payee.address1_postalcode.Replace(" ", string.Empty),
                                Province = payee.era_ProvinceState.era_code,
                                Country = "CA",
                            }
                        }
                    });
                    if (!newSupplier.IsSuccess()) throw new Exception($"CAS supplier creation failed for payee {payee.contactid}: {newSupplier.CASReturnedMessages}");
                    payee.era_suppliernumber = newSupplier.SupplierNumber;
                    payee.era_sitesuppliernumber = newSupplier.SupplierSiteCode.Replace('[', ' ').Replace(']', ' ').Trim();
                }
                else
                {
                    // supplier found, save CAS values
                    payee.era_suppliernumber = supplier.Suppliernumber;
                    payee.era_sitesuppliernumber = supplierAddress.Suppliersitecode.Replace('[', ' ').Replace(']', ' ').Trim();
                }

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
            var casStatuses = CasStatusResolver(request.InStatus);

            var payments = new List<CasPaymentDetails>();
            foreach (var status in casStatuses)
            {
                var response = await casWebProxy.GetInvoiceAsync(new GetInvoiceRequest
                {
                    PayGroup = "EMB INC",
                    PaymentStatusDateFrom = request.ChangedFrom,
                    PaymentStatus = status
                });

                if (response == null) throw new InvalidOperationException("Failed to retrieve CAS payment statuses");
                payments.AddRange(response.Items.Select(p => new CasPaymentDetails
                {
                    PaymentId = p.Invoicenumber,
                    Status = CasStatusResolver(p.Paymentstatus),
                    StatusChangeDate = p.Paymentstatusdate,
                    CasReferenceNumber = p.Paymentnumber?.ToString()
                }));
            }

            return new GetCasPaymentStatusResponse
            {
                //temp fix for a bug in CAS API
                Payments = payments.Where(p => p.StatusChangeDate.HasValue)
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

        private static int ResolveSupportStatus(PaymentStatus paymentStatus) =>
            paymentStatus switch
            {
                PaymentStatus.Failed => (int)SupportStatus.UnderReview,
                PaymentStatus.Paid => (int)SupportStatus.Paid,
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
            await ctx.LoadPropertyAsync(tx, nameof(era_etransfertransaction.era_era_etransfertransaction_era_evacueesuppo), ct);

            tx.statuscode = (int)request.ToPaymentStatus;
            tx.era_casresponsedate = request.StatusChangeDate;
            tx.era_casreferencenumber = request.CasReferenceNumber;

            foreach (var support in tx.era_era_etransfertransaction_era_evacueesuppo)
            {
                support.statuscode = ResolveSupportStatus(request.ToPaymentStatus);
            }

            await ctx.SaveChangesAsync(ct);

            return new UpdateCasPaymentStatusResponse { };
        }
    }
}
