using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Resources.Print;
using EMBC.ESS.Resources.Supports;

namespace EMBC.ESS.Engines.Supporting.SupportProcessing
{
    internal class PaperSupportProcessingStrategy : ISupportProcessingStrategy
    {
        private readonly IMapper mapper;
        private readonly ISupportRepository supportRepository;
        private readonly IPrintRequestsRepository printRequestsRepository;

        public PaperSupportProcessingStrategy(IMapper mapper, ISupportRepository supportRepository, IPrintRequestsRepository printRequestsRepository)
        {
            this.mapper = mapper;
            this.supportRepository = supportRepository;
            this.printRequestsRepository = printRequestsRepository;
        }

        public async Task<ProcessResponse> Process(ProcessRequest request)
        {
            if (!(request is ProcessPaperSupportsRequest r))
                throw new InvalidOperationException($"{nameof(ISupportProcessingStrategy)} of type {nameof(PaperSupportProcessingStrategy)} can only handle {nameof(ProcessPaperSupportsRequest)} request types");
            return await HandleInternal(r);
        }

        public async Task<ValidationResponse> Validate(ValidationRequest request)
        {
            if (!(request is PaperSupportsValidationRequest r))
                throw new InvalidOperationException($"{nameof(ISupportProcessingStrategy)} of type {nameof(PaperSupportProcessingStrategy)} can only handle {nameof(PaperSupportsValidationRequest)} request types");
            return await HandleInternal(r);
        }

        private async Task<ProcessPaperSupportsResponse> HandleInternal(ProcessPaperSupportsRequest r)
        {
            var supports = mapper.Map<IEnumerable<Support>>(r.Supports);

            var procesedSupports = ((CreateNewSupportsCommandResult)await supportRepository.Manage(new CreateNewSupportsCommand
            {
                FileId = r.FileId,
                Supports = supports
            })).Supports.ToArray();

            return new ProcessPaperSupportsResponse { Supports = mapper.Map<IEnumerable<Shared.Contracts.Events.Support>>(procesedSupports) };
        }

        private async Task<PaperSupportsValidationResponse> HandleInternal(PaperSupportsValidationRequest r)
        {
            await Task.CompletedTask;
            //validate only paper referrals were passed in the command
            var nonePaperReferrals = r.Supports.Where(s => s.SupportDelivery is Shared.Contracts.Events.Referral r && string.IsNullOrEmpty(r.ManualReferralId));
            if (nonePaperReferrals.Any())
            {
                return new PaperSupportsValidationResponse
                {
                    Errors = nonePaperReferrals.Select(s => $"{s.GetType().Name} is not a paper referral").ToArray()
                };
            }
            //validate paper id and support types are unique
            var duplicates = r.Supports.GroupBy(s => ((Shared.Contracts.Events.Referral)s.SupportDelivery).ManualReferralId).Where(g => g.GroupBy(e => e.GetType()).Any(gt => gt.Count() != 1));
            if (duplicates.Any())
            {
                return new PaperSupportsValidationResponse
                {
                    Errors = duplicates.Select(d => $"").ToArray()
                };
            }

            return new PaperSupportsValidationResponse();
        }
    }
}
