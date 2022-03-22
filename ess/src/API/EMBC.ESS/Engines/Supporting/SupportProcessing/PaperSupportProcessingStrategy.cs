using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Resources.Print;
using EMBC.ESS.Resources.Supports;

namespace EMBC.ESS.Engines.Supporting.SupportProcessing
{
    internal class PaperSupportProcessingStrategy : ISupportProcessingStrategy
    {
        private readonly ISupportRepository supportRepository;
        private readonly IPrintRequestsRepository printRequestsRepository;

        public PaperSupportProcessingStrategy(ISupportRepository supportRepository, IPrintRequestsRepository printRequestsRepository)
        {
            this.supportRepository = supportRepository;
            this.printRequestsRepository = printRequestsRepository;
        }

        public async Task<ProcessResponse> Handle(ProcessRequest request)
        {
            if (!(request is ProcessPaperSupportsRequest r))
                throw new InvalidOperationException($"{nameof(ISupportProcessingStrategy)} of type {nameof(PaperSupportProcessingStrategy)} can only handle {nameof(ProcessPaperSupportsRequest)} request types");
            return await HandleInternal(r);
        }

        public async Task<ValidationResponse> Handle(ValidationRequest request)
        {
            if (!(request is PaperSupportsValidationRequest r))
                throw new InvalidOperationException($"{nameof(ISupportProcessingStrategy)} of type {nameof(PaperSupportProcessingStrategy)} can only handle {nameof(PaperSupportsValidationRequest)} request types");
            return await HandleInternal(r);
        }

        private async Task<ProcessPaperSupportsResponse> HandleInternal(ProcessPaperSupportsRequest r)
        {
            var supportIds = (await supportRepository.Manage(new SaveEvacuationFileSupportCommand
            {
                FileId = r.FileId,
                Supports = r.Supports
            })).Ids.ToArray();

            return new ProcessPaperSupportsResponse { SupportIds = supportIds };
        }

        private async Task<PaperSupportsValidationResponse> HandleInternal(PaperSupportsValidationRequest r)
        {
            await Task.CompletedTask;
            //validate only paper referrals were passed in the command
            var nonePaperReferrals = r.Supports.Where(s => !s.IsPaperReferral);
            if (nonePaperReferrals.Any())
            {
                return new PaperSupportsValidationResponse
                {
                    Errors = nonePaperReferrals.Select(s => $"{s.GetType().Name} is not a paper referral").ToArray()
                };
            }
            //validate paper id and support types are unique
            //TODO: validate against existing supports
            var duplicates = r.Supports.GroupBy(s => ((Referral)s.SupportDelivery).ManualReferralId).Where(g => g.GroupBy(e => e.GetType()).Any(gt => gt.Count() != 1));
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
