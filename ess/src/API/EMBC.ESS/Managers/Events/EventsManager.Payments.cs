using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Resources.Evacuees;
using EMBC.ESS.Resources.Payments;
using EMBC.ESS.Resources.Supports;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Telemetry;

namespace EMBC.ESS.Managers.Events;

public partial class EventsManager
{
    public async System.Threading.Tasks.Task Handle(ProcessPendingPaymentsCommand _)
    {
        var logger = telemetryProvider.Get(nameof(ProcessPendingPaymentsCommand));
        var ct = new CancellationTokenSource().Token;

        var newPayments = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest
        {
            ByStatus = PaymentStatus.Created,
            ByQueueStatus = QueueStatus.Pending,
        })).Items.Cast<InteracSupportPayment>().ToArray();

        logger.LogInformation("Found {0} new payments", newPayments.Length);

        if (newPayments.Any())
        {
            var casBatchName = $"ERA-batch-{DateTime.Now.ToString("yyyyMMddHHmmss")}";
            var result = (IssuePaymentsBatchResponse)await paymentRepository.Manage(new IssuePaymentsBatchRequest
            {
                BatchId = casBatchName,
                PaymentIds = newPayments.Select(p => p.Id)
            });

            logger.LogInformation("Batch {0} results: {1} issued; {2} failed", casBatchName, result.IssuedPayments.Count(), result.FailedPayments.Count());
        }

        var failedPayments = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest
        {
            ByStatus = PaymentStatus.Failed,
            ByQueueStatus = QueueStatus.Pending,
        })).Items.Cast<InteracSupportPayment>().ToArray();

        logger.LogInformation("Found {0} failed payments", failedPayments.Length);
        await Parallel.ForEachAsync(failedPayments, ct, async (payment, ct) =>
        {
            try
            {
                await paymentRepository.Manage(new CancelPaymentRequest { PaymentId = payment.Id, Reason = payment.FailureReason });
                await Parallel.ForEachAsync(payment.LinkedSupportIds, ct, async (supportId, ct) =>
                {
                    try
                    {
                        await supportRepository.Manage(new SubmitSupportForReviewCommand { SupportId = supportId });
                    }
                    catch (Exception e)
                    {
                        logger.LogError(e, "Payment {0}, support {1}: failed to submit for review", payment.Id, supportId);
                    }
                });
            }
            catch (Exception e)
            {
                logger.LogError(e, "Failed to cancel payment {0}", payment.Id);
            }
        });

        var issuedPayments = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest
        {
            ByStatus = PaymentStatus.Issued,
            ByQueueStatus = QueueStatus.Pending,
        })).Items.Cast<InteracSupportPayment>().ToArray();

        logger.LogInformation("Found {0} issued payments", issuedPayments.Length);
        await Parallel.ForEachAsync(issuedPayments, ct, async (payment, ct) =>
        {
            try
            {
                await paymentRepository.Manage(new MarkPaymentAsIssuedRequest { PaymentId = payment.Id });
                await supportRepository.Manage(new ChangeSupportStatusCommand
                {
                    Items = payment.LinkedSupportIds.Select(s => new SupportStatusTransition { SupportId = s, ToStatus = Resources.Supports.SupportStatus.Issued }).ToArray()
                });
            }
            catch (Exception e)
            {
                logger.LogError(e, "payment {0}: failed to transition related supports to status Issued", payment.Id);
            }
        });

        var clearedPayments = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest
        {
            ByStatus = PaymentStatus.Cleared,
            ByQueueStatus = QueueStatus.Pending,
        })).Items.Cast<InteracSupportPayment>().ToArray();

        logger.LogInformation("Found {0} cleared payments", clearedPayments.Length);
        await Parallel.ForEachAsync(clearedPayments, ct, async (payment, ct) =>
        {
            try
            {
                await paymentRepository.Manage(new MarkPaymentAsPaidRequest { PaymentId = payment.Id });
                await supportRepository.Manage(new ChangeSupportStatusCommand
                {
                    Items = payment.LinkedSupportIds.Select(s => new SupportStatusTransition { SupportId = s, ToStatus = Resources.Supports.SupportStatus.Paid }).ToArray()
                });
            }
            catch (Exception e)
            {
                logger.LogError(e, "payment{0}: failed to mark as paid", payment.Id);
            }
        });
    }

    public async System.Threading.Tasks.Task Handle(ReconcilePaymentsCommand _)
    {
        var ct = new CancellationTokenSource().Token;
        var logger = telemetryProvider.Get(nameof(ReconcilePaymentsCommand));
        var lastPollDate = await CalculateEarliestDateForPolling(ct);
        logger.LogInformation($"Polling for CAS payments after {lastPollDate}");

        var issuedPayments = ((GetCasPaymentStatusResponse)await paymentRepository.Query(new GetCasPaymentStatusRequest
        {
            ChangedFrom = lastPollDate,
            InStatus = CasPaymentStatus.Pending
        })).Payments.ToArray();

        await Parallel.ForEachAsync(issuedPayments, ct, async (paymentDetails, ct) =>
        {
            try
            {
                logger.LogInformation($"Reconciling {paymentDetails.PaymentId}, PaymentDetails.StatusChangeDate is {paymentDetails.StatusChangeDate}");
                await paymentRepository.Manage(new ProcessCasPaymentReconciliationStatusRequest { CasPaymentDetails = paymentDetails });
            }
            catch (Exception e)
            {
                logger.LogError(e, $"Failed to reconcile issued payment {paymentDetails.PaymentId}: {e.Message}");
            }
        });

        var clearedPayments = ((GetCasPaymentStatusResponse)await paymentRepository.Query(new GetCasPaymentStatusRequest
        {
            ChangedFrom = lastPollDate,
            InStatus = CasPaymentStatus.Cleared
        })).Payments.ToArray();

        await Parallel.ForEachAsync(clearedPayments, ct, async (paymentDetails, ct) =>
        {
            try
            {
                await paymentRepository.Manage(new ProcessCasPaymentReconciliationStatusRequest { CasPaymentDetails = paymentDetails });
            }
            catch (Exception e)
            {
                logger.LogError(e, $"Failed to reconcile cleared payment {paymentDetails.PaymentId}: {e.Message}");
            }
        });

        var failedPayments = ((GetCasPaymentStatusResponse)await paymentRepository.Query(new GetCasPaymentStatusRequest
        {
            ChangedFrom = lastPollDate,
            InStatus = CasPaymentStatus.Failed
        })).Payments.ToArray();

        await Parallel.ForEachAsync(failedPayments, ct, async (paymentDetails, ct) =>
        {
            try
            {
                await paymentRepository.Manage(new ProcessCasPaymentReconciliationStatusRequest { CasPaymentDetails = paymentDetails });
            }
            catch (Exception e)
            {
                logger.LogError(e, $"Failed to reconcile failed payment {paymentDetails.PaymentId}: {e.Message}");
            }
        });

        // set the last poll time to -5 mins to account for system clock differences
        var nextPollDate = DateTime.SpecifyKind(DateTime.UtcNow.AddMinutes(-5), DateTimeKind.Utc);
        await cache.Set(paymentPollingCacheKey, nextPollDate, TimeSpan.FromDays(7), ct);

        logger.LogInformation("Reconciled {0} issued payments, {1} failed payments, {2} cleared payments; set last polling date to {3} UTC",
            issuedPayments.Length,
            clearedPayments.Length,
            failedPayments.Length,
            nextPollDate);
    }

    private const string paymentPollingCacheKey = "CASPollDate";

    private async Task<DateTime> CalculateEarliestDateForPolling(CancellationToken ct)
    {
        var lastPollDate = await cache.Get<DateTime?>(paymentPollingCacheKey, ct);
        if (lastPollDate.HasValue) return lastPollDate.Value;

        var earliestSentPayment = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest
        {
            ByStatus = PaymentStatus.Sent,
            ByQueueStatus = QueueStatus.None,
            LimitNumberOfItems = 1,
        })).Items.Cast<InteracSupportPayment>().FirstOrDefault();

        // calculate date of last status update: the earliest date of the payments in status 'Sent'
        lastPollDate = earliestSentPayment?.SentOn ?? new DateTime(2022, 6, 7, 0, 0, 0, DateTimeKind.Utc);

        return lastPollDate.Value;
    }

    public async System.Threading.Tasks.Task Handle(ReconcileSupplierInfoCommand _)
    {
        var logger = telemetryProvider.Get(nameof(ReconcileSupplierInfoCommand));
        var ct = new CancellationTokenSource().Token;

        var evacueesWithNoSupplier = (await evacueesRepository.Query(new EvacueeQuery
        {
            BCSCWithNoSupplierId = true,
        })).Items.ToArray();

        logger.LogInformation("Found {0} Registrants with a BCSC but no SupplierId", evacueesWithNoSupplier.Length);

        await Parallel.ForEachAsync(evacueesWithNoSupplier, ct, async (evacuee, ct) =>
        {
            try
            {
                logger.LogInformation("Attempting to Reconcile Supplier Info for Registrant {0} ", evacuee.Id, evacuee.Id);
                var result = await paymentRepository.Manage(new ReconcileSupplierIdRequest { RegitrantId = evacuee.Id });
                var outResult = (ReconcileSupplierIdResponse)result;
                logger.LogInformation("Registrant {0} updated with SupplierNumber {1}", evacuee.Id, outResult.SupplierNumber);
            }
            catch (CasException e)
            {
                logger.LogInformation("Registrant {0} SupplierNumber was Rejected.", evacuee.Id);
                logger.LogInformation(e.Message);
            }
            catch (ArgumentNullException e)
            {
                logger.LogInformation("Registrant {0} SupplierNumber could not be set do to missing data.", evacuee.Id);
                logger.LogInformation(e.Message);
            }
            catch (Exception e)
            {
                logger.LogError(e, $"Failed to reconcile Supplier Info {evacuee.Id}: {e.Message}");
            }
        });
    }

    public async System.Threading.Tasks.Task Handle(FullReconcilePaymentsCommand _)
    {
        //Fetch all etransfer_transastions
        var logger = telemetryProvider.Get(nameof(FullReconcilePaymentsCommand));
        var ct = new CancellationTokenSource().Token;

        var payments = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest
        {
            InvoiceDateEmpty = true,
        })).Items.ToArray();

        logger.LogInformation("Found {0} etransfer_transactions to Reconcile", payments.Length);

        await Parallel.ForEachAsync(payments, ct, async (payment, ct) =>
        {
            try
            {
                logger.LogInformation("Attempting to Reconcile Invoice Info for etransfer {0} ", payment.Id);
                var result = await paymentRepository.Manage(new ReconcileEtransferRequest { InvoiceId = payment.Id });
                var outResult = (ReconcileEtransferResponse)result;
                if (outResult != null)
                {
                    if (outResult.reconciled)
                    {
                        logger.LogInformation("Invoice {0} has been reconciled", payment.Id);
                    }
                    else
                    {
                        logger.LogInformation("Unable to reconile Invoice {0}", payment.Id);
                    }
                }
            }
            catch (CasException e)
            {
                logger.LogInformation("Unable not Reconcile Invoice Info for etransfer {0} ", payment.Id);
                logger.LogInformation(e.Message);
            }
            catch (ArgumentNullException e)
            {
                logger.LogInformation("Unable not Reconcile Invoice Info for etransfer {0} ", payment.Id);
                logger.LogInformation(e.Message);
            }
            catch (Exception e)
            {
                logger.LogError(e, $"Failed to reconcile Invoice Info {payment.Id}: {e.Message}");
            }
        });
    }
}
