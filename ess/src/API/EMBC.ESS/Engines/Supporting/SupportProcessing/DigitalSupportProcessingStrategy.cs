using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Resources.Print;
using EMBC.ESS.Resources.Supports;

namespace EMBC.ESS.Engines.Supporting.SupportProcessing
{
    internal class DigitalSupportProcessingStrategy : ISupportProcessingStrategy
    {
        private readonly IMapper mapper;
        private readonly ISupportRepository supportRepository;
        private readonly IPrintRequestsRepository printRequestsRepository;

        public DigitalSupportProcessingStrategy(IMapper mapper, ISupportRepository supportRepository, IPrintRequestsRepository printRequestsRepository)
        {
            this.mapper = mapper;
            this.supportRepository = supportRepository;
            this.printRequestsRepository = printRequestsRepository;
        }

        public async Task<ProcessResponse> Process(ProcessRequest request, CancellationToken ct) =>
            request switch
            {
                ProcessDigitalSupportsRequest r => await HandleInternal(r, ct),

                _ => throw new NotImplementedException($"{request.GetType().Name}")
            };

        public async Task<ValidationResponse> Validate(ValidationRequest request, CancellationToken ct) =>
            request switch
            {
                DigitalSupportsValidationRequest r => await HandleInternal(r, ct),

                _ => throw new NotImplementedException($"{request.GetType().Name}")
            };

        private async Task<ProcessDigitalSupportsResponse> HandleInternal(ProcessDigitalSupportsRequest r, CancellationToken ct)
        {
            if (r.FileId == null) throw new ArgumentNullException(nameof(r.FileId));
            if (r.PrintReferrals && r.RequestingUserId == null) throw new ArgumentNullException(nameof(r.RequestingUserId));

            var supports = mapper.Map<IEnumerable<Support>>(r.Supports);

            var processedSupports = ((CreateNewSupportsCommandResult)await supportRepository.Manage(new CreateNewSupportsCommand
            {
                FileId = r.FileId,
                Supports = supports
            })).Supports.ToArray();

            if (r.PrintReferrals)
            {
                try
                {
                    var printRequestId = await printRequestsRepository.Manage(new SavePrintRequest
                    {
                        PrintRequest = new ReferralPrintRequest
                        {
                            FileId = r.FileId,
                            SupportIds = processedSupports.Select(s => s.Id).ToArray(),
                            IncludeSummary = r.IncludeSummaryInReferralsPrintout,
                            RequestingUserId = r.RequestingUserId,
                            Type = ReferralPrintType.New,
                            Comments = "Process supports"
                        }
                    });

                    return new ProcessDigitalSupportsResponse
                    {
                        Supports = mapper.Map<IEnumerable<Shared.Contracts.Events.Support>>(processedSupports),
                        PrintRequestId = printRequestId
                    };
                }
                catch (Exception)
                {
                    await supportRepository.Manage(new ChangeSupportStatusCommand
                    {
                        Items = processedSupports.Select(s => SupportStatusTransition.VoidSupport(s.Id, SupportVoidReason.ErrorOnPrintedReferral)).ToArray()
                    });
                    throw;
                }
            }
            return new ProcessDigitalSupportsResponse { Supports = mapper.Map<IEnumerable<Shared.Contracts.Events.Support>>(processedSupports), PrintRequestId = null };
        }

        private async Task<ValidationResponse> HandleInternal(DigitalSupportsValidationRequest r, CancellationToken ct)
        {
            await Task.CompletedTask;
            //verify no paper supports included
            var paperReferrals = r.Supports.Where(s => s.SupportDelivery is Shared.Contracts.Events.Referral r && !string.IsNullOrEmpty(r.ManualReferralId))
                .Select(r => ((Shared.Contracts.Events.Referral)r.SupportDelivery).ManualReferralId)
                .ToArray();
            if (paperReferrals.Any())
            {
                return new DigitalSupportsValidationResponse
                {
                    Errors = paperReferrals.Select(s => $"{s} is a paper referral").ToArray(),
                };
            }
            return new DigitalSupportsValidationResponse();
        }
    }
}
