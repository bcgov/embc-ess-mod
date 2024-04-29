using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Engines.Search;
using EMBC.ESS.Engines.Supporting;
using EMBC.ESS.Resources.Evacuees;
using EMBC.ESS.Resources.Payments;
using EMBC.ESS.Resources.Print;
using EMBC.ESS.Resources.Supports;
using EMBC.ESS.Resources.Tasks;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;
using EMBC.Utilities.Extensions;
using EMBC.Utilities.Telemetry;
using Microsoft.Extensions.Hosting;

namespace EMBC.ESS.Managers.Events;

public partial class EventsManager
{
    public async Task<string> Handle(ProcessSupportsCommand cmd)
    {
        if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException(nameof(cmd.FileId));
        if (string.IsNullOrEmpty(cmd.RequestingUserId)) throw new ArgumentNullException(nameof(cmd.RequestingUserId));

        var requestingUser = (await teamRepository.GetMembers(userId: cmd.RequestingUserId, includeStatuses: activeOnlyStatus)).SingleOrDefault();
        if (requestingUser == null) throw new BusinessValidationException($"User {cmd.RequestingUserId} not found");

        foreach (var support in cmd.Supports)
        {
            support.CreatedBy = new Shared.Contracts.Events.TeamMember { Id = requestingUser.Id };
            support.CreatedOn = DateTime.UtcNow;
        }

        var validationResponse = (DigitalSupportsValidationResponse)await supportingEngine.Validate(new DigitalSupportsValidationRequest
        {
            FileId = cmd.FileId,
            Supports = cmd.Supports
        });
        if (!validationResponse.IsValid) throw new BusinessValidationException(string.Join(',', validationResponse.Errors));

        var response = (ProcessDigitalSupportsResponse)await supportingEngine.Process(new ProcessDigitalSupportsRequest
        {
            FileId = cmd.FileId,
            Supports = cmd.Supports,
            RequestingUserId = requestingUser.Id,
            IncludeSummaryInReferralsPrintout = cmd.IncludeSummaryInReferralsPrintout
        });

        return response.PrintRequestId;
    }

    public async System.Threading.Tasks.Task Handle(ProcessPaperSupportsCommand cmd)
    {
        if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException(nameof(cmd.FileId));
        if (string.IsNullOrEmpty(cmd.RequestingUserId)) throw new ArgumentNullException(nameof(cmd.RequestingUserId));

        var requestingUser = (await teamRepository.GetMembers(userId: cmd.RequestingUserId, includeStatuses: activeOnlyStatus)).SingleOrDefault();
        if (requestingUser == null) throw new BusinessValidationException($"User {cmd.RequestingUserId} not found");

        foreach (var referral in cmd.Supports)
        {
            referral.CreatedBy = new Shared.Contracts.Events.TeamMember { Id = requestingUser.Id };
            referral.CreatedOn = DateTime.UtcNow;
        }

        var validationResponse = (PaperSupportsValidationResponse)await supportingEngine.Validate(new PaperSupportsValidationRequest
        {
            FileId = cmd.FileId,
            Supports = cmd.Supports
        });
        if (!validationResponse.IsValid) throw new BusinessValidationException(string.Join(',', validationResponse.Errors));

        await supportingEngine.Process(new ProcessPaperSupportsRequest { FileId = cmd.FileId, Supports = cmd.Supports });
    }

    public async Task<string> Handle(VoidSupportCommand cmd)
    {
        if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException("FileId is required");
        if (string.IsNullOrEmpty(cmd.SupportId)) throw new ArgumentNullException("SupportId is required");

        var id = ((ChangeSupportStatusCommandResult)await supportRepository.Manage(new ChangeSupportStatusCommand
        {
            Items = new[]
            {
                SupportStatusTransition.VoidSupport(cmd.SupportId, Enum.Parse<Resources.Supports.SupportVoidReason>(cmd.VoidReason.ToString()))
            }
        })).Ids.SingleOrDefault();
        return id;
    }

    public async Task<string> Handle(CancelSupportCommand cmd)
    {
        if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException("FileId is required");
        if (string.IsNullOrEmpty(cmd.SupportId)) throw new ArgumentNullException("SupportId is required");

        // check invariants
        var support = ((SearchSupportQueryResult)await supportRepository.Query(new Resources.Supports.SearchSupportsQuery { ById = cmd.SupportId })).Items.SingleOrDefault();
        if (support == null) throw new NotFoundException($"Support {cmd.SupportId} not found");
        if (support.SupportDelivery is not Resources.Supports.ETransfer) throw new BusinessValidationException($"Support {cmd.SupportId} is not an etransfer and cannot be cancelled");
        var relatedPayments = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest { ByLinkedSupportId = cmd.SupportId })).Items;
        if (relatedPayments.Any()) throw new BusinessValidationException($"Support {cmd.SupportId} already has associated payments");

        var id = ((ChangeSupportStatusCommandResult)await supportRepository.Manage(new ChangeSupportStatusCommand
        {
            Items = new[]
            {
               new SupportStatusTransition { SupportId = cmd.SupportId, ToStatus = Resources.Supports.SupportStatus.Cancelled, Reason = cmd.Reason }
            }
        })).Ids.SingleOrDefault();
        return id;
    }

    public async Task<PrintRequestQueryResult> Handle(PrintRequestQuery query)
    {
        if (string.IsNullOrEmpty(query.PrintRequestId)) throw new ArgumentNullException(nameof(query.PrintRequestId));
        if (string.IsNullOrEmpty(query.RequestingUserId)) throw new ArgumentNullException(nameof(query.RequestingUserId));

        //get the print request
        var printRequest = (await printingRepository.Query(new QueryPrintRequests { ById = query.PrintRequestId })).Cast<ReferralPrintRequest>().SingleOrDefault();
        if (printRequest == null) throw new NotFoundException("print request not found", query.PrintRequestId);

        //get requesting user
        if (printRequest.RequestingUserId != query.RequestingUserId) throw new BusinessLogicException($"User {query.RequestingUserId} cannot query print for another user ({printRequest.RequestingUserId})");
        var requestingUser = mapper.Map<Shared.Contracts.Events.TeamMember>((await teamRepository.GetMembers(userId: printRequest.RequestingUserId, includeStatuses: activeOnlyStatus)).SingleOrDefault());
        if (requestingUser == null) throw new NotFoundException($"User {printRequest.RequestingUserId} not found", printRequest.RequestingUserId);

        //load the file
        var file = mapper.Map<Shared.Contracts.Events.EvacuationFile>((await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery
        {
            FileId = printRequest.FileId
        })).Items.SingleOrDefault());
        if (file == null) throw new NotFoundException($"Evacuation file {printRequest.FileId} not found", printRequest.Id);

        var registrant = mapper.Map<RegistrantProfile>((await evacueesRepository.Query(new EvacueeQuery { EvacueeId = file.PrimaryRegistrantId })).Items.SingleOrDefault());

        if (registrant == null) throw new NotFoundException($"Registrant not found '{file.PrimaryRegistrantId}'", file.PrimaryRegistrantId);

        var ct = new CancellationTokenSource().Token;
        await evacuationFileLoader.Load(file, ct);

        //Find referrals to print
        var referrals = file.Supports.Where(s => printRequest.SupportIds.Contains(s.Id)).ToArray();
        if (referrals.Length != printRequest.SupportIds.Count())
            throw new BusinessLogicException($"Print request {printRequest.Id} has {printRequest.SupportIds.Count()} linked supports, but evacuation file {printRequest.FileId} doesn't have all of them");

        var isProduction = env.IsProduction();

        //convert referrals to html
        var generatedReferrals = (GenerateReferralsResponse)await supportingEngine.Generate(new GenerateReferralsRequest()
        {
            File = file,
            Supports = referrals,
            AddSummary = printRequest.IncludeSummary,
            AddWatermark = !isProduction,
            PrintingMember = requestingUser,
            Evacuee = registrant
        });

        var content = generatedReferrals.Content;
        var contentType = "text/html";

        await printingRepository.Manage(new MarkPrintRequestAsComplete { PrintRequestId = printRequest.Id });

        return new PrintRequestQueryResult
        {
            Content = content,
            ContentType = contentType,
            PrintedOn = printRequest.CreatedOn
        };
    }

    public async Task<string> Handle(ReprintSupportCommand cmd)
    {
        if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException(nameof(cmd.FileId));
        if (string.IsNullOrEmpty(cmd.RequestingUserId)) throw new ArgumentNullException(nameof(cmd.RequestingUserId));
        if (string.IsNullOrEmpty(cmd.SupportId)) throw new ArgumentNullException(nameof(cmd.SupportId));

        var requestingUser = (await teamRepository.GetMembers(userId: cmd.RequestingUserId, includeStatuses: activeOnlyStatus)).Single();

        var now = DateTime.UtcNow;
        var referralPrintId = await printingRepository.Manage(new SavePrintRequest
        {
            PrintRequest = new ReferralPrintRequest
            {
                FileId = cmd.FileId,
                SupportIds = new[] { cmd.SupportId },
                IncludeSummary = cmd.IncludeSummary,
                RequestingUserId = requestingUser.Id,
                Type = ReferralPrintType.Reprint,
                Comments = cmd.ReprintReason,
                Title = $"referral-{cmd.SupportId}-{now:yyyyMMddhhmmss:R}"
            }
        });

        return referralPrintId;
    }

    public async System.Threading.Tasks.Task Handle(ProcessPendingSupportsCommand _)
    {
        var logger = telemetryProvider.Get(nameof(ProcessPendingSupportsCommand));
        var ct = new CancellationTokenSource().Token;

        var foundSupports = true;
        //handle limited number of pending support at a time
        while (foundSupports)
        {
            // get all pending scan supports
            var pendingScanSupports = ((SearchSupportQueryResult)await supportRepository.Query(new Resources.Supports.SearchSupportsQuery
            {
                ByStatus = Resources.Supports.SupportStatus.PendingScan,
                LimitNumberOfResults = 20
            })).Items.ToArray();

            foundSupports = pendingScanSupports.Any();

            if (foundSupports)
            {
                logger.LogInformation("Found {0} pending scan supports", pendingScanSupports.Length);
                // scan and get flags
                var response = (CheckSupportComplianceResponse)await supportingEngine.Validate(new CheckSupportComplianceRequest
                {
                    Supports = mapper.Map<IEnumerable<Shared.Contracts.Events.Support>>(pendingScanSupports)
                });

                await Parallel.ForEachAsync(response.Flags, ct, async (sf, ct) =>
                {
                    try
                    {
                        var currentSupport = ((SearchSupportQueryResult)await supportRepository.Query(new Resources.Supports.SearchSupportsQuery { ById = sf.Key.Id })).Items.SingleOrDefault();
                        if (currentSupport == null) throw new InvalidOperationException($"Couldnt find support {sf.Key.Id}");
                        var task = (EssTask)(await taskRepository.QueryTask(new TaskQuery { ById = currentSupport.TaskId })).Items.SingleOrDefault();
                        if (task == null) throw new InvalidOperationException($"Couldnt find task {currentSupport.TaskId}");

                        var flags = mapper.Map<IEnumerable<Resources.Supports.SupportFlag>>(sf.Value);

                        await supportRepository.Manage(new SubmitSupportForApprovalCommand
                        {
                            SupportId = currentSupport.Id,
                            Flags = flags
                        });

                        if (!flags.Any() && task.AutoApprovedEnabled)
                        {
                            await supportRepository.Manage(new ApproveSupportCommand
                            {
                                SupportId = currentSupport.Id
                            });
                        }
                    }
                    catch (Exception e)
                    {
                        logger.LogError(e, "Failed to process pending support {0}", sf.Key.Id);
                    }
                });
            }
        }
    }

    public async System.Threading.Tasks.Task Handle(ProcessApprovedSupportsCommand _)
    {
        var logger = telemetryProvider.Get(nameof(ProcessApprovedSupportsCommand));
        var foundSupports = true;
        while (foundSupports)
        {
            var approvedSupports = ((PendingPaymentSupportSearchResponse)await searchEngine.Search(new PendingPaymentSupportSearchRequest())).Supports.ToArray();

            foundSupports = approvedSupports.Any();

            if (foundSupports)
            {
                logger.LogInformation("Found {0} approved supports", approvedSupports.Length);
                var payments = ((GeneratePaymentsResponse)await supportingEngine.Generate(new GeneratePaymentsRequest
                {
                    Supports = approvedSupports.Select(s => new Engines.Supporting.PayableSupport
                    {
                        Amount = s.Amount,
                        FileId = s.FileId,
                        SupportId = s.SupportId,
                        PayeeId = s.PayeeId,
                        Delivery = s.Delivery is PayableSupportInteracDelivery d
                            ? new PaymentDelivery
                            {
                                NotificationEmail = d.NotificationEmail,
                                NotificationPhone = d.NotificationPhone,
                                RecipientFirstName = d.RecipientFirstName,
                                RecipientLastName = d.RecipientLastName
                            }
                            : null
                    }).ToArray()
                })).Payments.ToArray();

                logger.LogInformation("Generating {0} payments", payments.Length);

                foreach (var payment in payments)
                {
                    await paymentRepository.Manage(new CreatePaymentRequest { Payment = payment });
                }
            }
        }
    }

    public async System.Threading.Tasks.Task Handle(OptOutSelfServeCommand cmd)
    {
        await System.Threading.Tasks.Task.CompletedTask;
    }

    public async Task<DraftSelfServeSupportQueryResponse> Handle(DraftSelfServeSupportQuery query)
    {
        var file = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery { FileId = query.EvacuationFileId })).Items.SingleOrDefault();
        if (file == null) throw new NotFoundException("file not found", query.EvacuationFileId);
        if (file.NeedsAssessment.EligibilityCheck == null) throw new BusinessValidationException($"File {query.EvacuationFileId} is not eligable for self serve");

        var task = (await taskRepository.QueryTask(new TaskQuery { ById = file.NeedsAssessment.EligibilityCheck.TaskId, ByStatus = [Resources.Tasks.TaskStatus.Active] })).Items.SingleOrDefault() as EssTask;
        if (task == null) throw new NotFoundException("task not found", file.NeedsAssessment.EligibilityCheck.TaskId);

        if (query.Items == null)
        {
            //generate the supports based on the file
            var response = (GenerateSelfServeSupportsResponse)await supportingEngine.Generate(new GenerateSelfServeSupports(mapper.Map<IEnumerable<IdentifiedNeed>>(file.NeedsAssessment.Needs),
                task.StartDate.ToPST(),
                task.EndDate.ToPST(),
                file.NeedsAssessment.EligibilityCheck.From.Value.DateTime.ToPST(),
                file.NeedsAssessment.EligibilityCheck.To.Value.DateTime.ToPST(),
                file.HouseholdMembers.Select(hm => new SelfServeHouseholdMember(hm.Id, hm.IsMinor)).ToList()));

            return new DraftSelfServeSupportQueryResponse
            {
                Items = response.Supports
            };
        }
        else
        {
            //recalculate the totals and return as is
            var response = (GenerateSelfServeSupportsResponse)await supportingEngine.Generate(new CalculateSelfServeSupports(query.Items, file.NeedsAssessment.HouseholdMembers.Select(hm => new SelfServeHouseholdMember(hm.Id, hm.IsMinor))));

            return new DraftSelfServeSupportQueryResponse
            {
                Items = response.Supports
            };
        }
    }

    public async System.Threading.Tasks.Task Handle(CheckEligibileForSelfServeCommand cmd)
    {
        var ct = CancellationToken.None;
        // move to engine to determine eligibility
        //var file = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery { FileId = cmd.EvacuationFileId })).Items.SingleOrDefault();
        //if (file == null) throw new NotFoundException("file not found", cmd.EvacuationFileId);

        //var evacuee = (await evacueesRepository.Query(new EvacueeQuery { EvacueeId = file.PrimaryRegistrantId })).Items.SingleOrDefault();
        //if (evacuee == null) throw new NotFoundException("evacuee not found", file.PrimaryRegistrantId);

        // var taskNumber = await GetTaskNumberForAddress(evacuee.GeocodedHomeAddress.Geocode.Coordinates, ct);
        //var task = taskNumber == null ? null : (await taskRepository.QueryTask(new TaskQuery { ByStatus = [Resources.Tasks.TaskStatus.Active] })).Items.FirstOrDefault();

        var eligibilityResult = ((ValidateSelfServeSupportsEligibilityResponse)await supportingEngine.Validate(
            //new ValidateSelfServeSupportsEligibility(mapper.Map<EvacuationFile>(file), mapper.Map<RegistrantProfile>(evacuee), mapper.Map<IncidentTask>(task), evacuee.GeocodedHomeAddress.Geocode.Accuracy))).Eligibility;
            new ValidateSelfServeSupportsEligibility(cmd.EvacuationFileId), ct)).Eligibility;

        await evacuationRepository.Manage(new Resources.Evacuations.AddEligibilityCheck
        {
            FileId = cmd.EvacuationFileId,
            Eligible = eligibilityResult.Eligible,
            TaskNumber = eligibilityResult.TaskNumber,
            From = eligibilityResult.From,
            To = eligibilityResult.To
        });
    }

    //private async Task<string?> GetTaskNumberForAddress(Coordinates coordinates, CancellationToken ct)
    //{
    //    var locationProperties = await locationService.GetGeocodeAttributes(new Utilities.Spatial.Coordinates(coordinates.Latitude, coordinates.Latitude), ct);
    //    return locationProperties.SingleOrDefault(p => p.Name == "ESS_TASK_NUMBER")?.Value;
    //}

    public async Task<EligibilityCheckQueryResponse> Handle(EligibilityCheckQuery query)
    {
        var file = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery { FileId = query.EvacuationFileId })).Items.SingleOrDefault();
        if (file == null) throw new NotFoundException("file not found", query.EvacuationFileId);

        return new EligibilityCheckQueryResponse
        {
            Eligibility = new SupportEligibility
            {
                IsEligible = file.NeedsAssessment.EligibilityCheck?.Eligible ?? false,
                TaskNumber = file.NeedsAssessment.EligibilityCheck?.TaskId,
                From = file.NeedsAssessment.EligibilityCheck?.From,
                To = file.NeedsAssessment.EligibilityCheck?.From
            }
        };
    }

    public async System.Threading.Tasks.Task Handle(SubmitSelfServeSupportsCommand cmd)
    {
        var file = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery { FileId = cmd.EvacuationFileId })).Items.SingleOrDefault();
        if (file == null) throw new NotFoundException("file not found", cmd.EvacuationFileId);

        //map self serve supports into e-transfer supports and create them
    }
}
