using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Resources.Evacuees;
using EMBC.ESS.Resources.Payments;
using EMBC.ESS.Resources.Suppliers;
using EMBC.ESS.Resources.Supports;
using EMBC.ESS.Resources.Tasks;
using EMBC.ESS.Resources.Teams;
using EMBC.ESS.Shared.Contracts.Events;

namespace EMBC.ESS.Managers.Events
{
    internal class EvacuationFileLoader
    {
        private readonly IMapper mapper;
        private readonly ITeamRepository teamRepository;
        private readonly ITaskRepository taskRepository;
        private readonly ISupplierRepository supplierRepository;
        private readonly ISupportRepository supportRepository;
        private readonly IEvacueesRepository evacueesRepository;
        private readonly IPaymentRepository paymentRepository;

        public EvacuationFileLoader(IMapper mapper,
            ITeamRepository teamRepository,
            ITaskRepository taskRepository,
            ISupplierRepository supplierRepository,
            ISupportRepository supportRepository,
            IEvacueesRepository evacueesRepository,
            IPaymentRepository paymentRepository)
        {
            this.mapper = mapper;
            this.teamRepository = teamRepository;
            this.taskRepository = taskRepository;
            this.supplierRepository = supplierRepository;
            this.supportRepository = supportRepository;
            this.evacueesRepository = evacueesRepository;
            this.paymentRepository = paymentRepository;
        }

        public async System.Threading.Tasks.Task Load(EvacuationFile file, CancellationToken ct)
        {
            if (file.NeedsAssessment.CompletedBy?.Id != null)
            {
                var member = (await teamRepository.GetMembers(userId: file.NeedsAssessment.CompletedBy.Id)).SingleOrDefault();
                if (member != null)
                {
                    file.NeedsAssessment.CompletedBy.DisplayName = FormatTeamMemberName(member);
                    file.NeedsAssessment.CompletedBy.TeamId = member.TeamId;
                    file.NeedsAssessment.CompletedBy.TeamName = member.TeamName;
                }
            }
            if (file.RelatedTask?.Id != null)
            {
                var task = (EssTask)(await taskRepository.QueryTask(new TaskQuery { ById = file.RelatedTask.Id })).Items.SingleOrDefault();
                if (task != null) file.RelatedTask = mapper.Map<IncidentTask>(task);
            }

            await Parallel.ForEachAsync(file.Notes, ct, async (note, ct) =>
            {
                if (string.IsNullOrEmpty(note.CreatedBy?.Id)) return;
                var member = (await teamRepository.GetMembers(null, null, note.CreatedBy.Id)).SingleOrDefault();
                if (member != null)
                {
                    note.CreatedBy.DisplayName = FormatTeamMemberName(member);
                    note.CreatedBy.TeamId = member.TeamId;
                    note.CreatedBy.TeamName = member.TeamName;
                }
            });

            var supports = ((SearchSupportQueryResult)await supportRepository.Query(new Resources.Supports.SearchSupportsQuery { ByEvacuationFileId = file.Id })).Items;
            file.Supports = mapper.Map<IEnumerable<Shared.Contracts.Events.Support>>(supports);
            await Parallel.ForEachAsync(file.Supports, ct, async (s, ct) => await Load(s, ct));
        }

        private static string FormatTeamMemberName(Resources.Teams.TeamMember member) => $"{member.FirstName} {member.LastName.Substring(0, 1)}.";

        public async System.Threading.Tasks.Task Load(Shared.Contracts.Events.Support support, CancellationToken ct)
        {
            if (!string.IsNullOrEmpty(support.CreatedBy?.Id))
            {
                var member = (await teamRepository.GetMembers(userId: support.CreatedBy.Id)).SingleOrDefault();
                if (member != null)
                {
                    support.CreatedBy.DisplayName = FormatTeamMemberName(member);
                    support.CreatedBy.TeamId = member.TeamId;
                    support.CreatedBy.TeamName = member.TeamName;
                    if (support.IssuedBy == null) support.IssuedBy = support.CreatedBy;
                }
            }
            if (support.SupportDelivery is Shared.Contracts.Events.Referral referral && !string.IsNullOrEmpty(referral.SupplierDetails?.Id))
            {
                var supplier = (await supplierRepository.QuerySupplier(new SupplierSearchQuery { SupplierId = referral.SupplierDetails.Id, ActiveOnly = false })).Items.SingleOrDefault();
                if (supplier != null)
                {
                    referral.SupplierDetails.Name = supplier.Name;
                    referral.SupplierDetails.LegalName = supplier.LegalName;
                    referral.SupplierDetails.Address = mapper.Map<Shared.Contracts.Events.Address>(supplier.Address);
                    referral.SupplierDetails.Phone = supplier.Contact.Phone;
                }
            }
            if (support.SupportDelivery is Shared.Contracts.Events.Interac interac && !string.IsNullOrEmpty(interac.ReceivingRegistrantId))
            {
                var recipient = (await evacueesRepository.Query(new EvacueeQuery { EvacueeId = interac.ReceivingRegistrantId })).Items.SingleOrDefault();
                if (recipient != null)
                {
                    interac.RecipientFirstName = recipient.FirstName;
                    interac.RecipientLastName = recipient.LastName;
                }

                var payment = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest
                {
                    ByLinkedSupportId = support.Id
                })).Items.Where(p => p.Status != PaymentStatus.Cancelled).Cast<InteracSupportPayment>().OrderByDescending(p => p.CreatedOn).FirstOrDefault();

                if (payment != null)
                {
                    interac.SecurityAnswer = payment.SecurityAnswer;
                    interac.SecurityQuestion = payment.SecurityAnswer;
                    interac.RelatedPaymentId = payment.Id;
                }
            }
        }
    }
}
