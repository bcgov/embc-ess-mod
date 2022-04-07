using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Payments
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly IMapper mapper;
        private readonly IEssContextFactory essContextFactory;

        public PaymentRepository(IMapper mapper, IEssContextFactory essContextFactory)
        {
            this.mapper = mapper;
            this.essContextFactory = essContextFactory;
        }

        public async Task<ManagePaymentResponse> Manage(ManagePaymentRequest request) =>
            request switch
            {
                SavePaymentRequest r => await Handle(r),

                _ => throw new NotSupportedException($"type {request.GetType().Name}")
            };

        private async Task<SavePaymentResponse> Handle(SavePaymentRequest request)
        {
            var ctx = essContextFactory.Create();

            var tx = mapper.Map<era_etransfertransaction>(request.Payment);
            if (string.IsNullOrEmpty(request.Payment.Id))
            {
                tx.era_etransfertransactionid = Guid.NewGuid();
                ctx.AddToera_etransfertransactions(tx);
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
                }
            }

            await ctx.SaveChangesAsync();

            ctx.DetachAll();

            var id = ctx.era_etransfertransactions.Where(t => t.era_etransfertransactionid == tx.era_etransfertransactionid).Single().era_name;

            return new SavePaymentResponse { Id = id };
        }

        public Task<QueryPaymentResponse> Query(QueryPaymentRequest request) =>
            request switch
            {
                _ => throw new NotSupportedException($"type {request.GetType().Name}")
            };
    }
}
