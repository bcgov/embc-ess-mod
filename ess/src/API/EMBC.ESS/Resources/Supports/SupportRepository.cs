using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace EMBC.ESS.Resources.Supports
{
    public class SupportRepository : ISupportRepository
    {
        private readonly IEssContextFactory essContextFactory;
        private readonly IMapper mapper;

        public SupportRepository(IEssContextFactory essContextFactory, IMapper mapper)
        {
            this.essContextFactory = essContextFactory;
            this.mapper = mapper;
        }

        public async Task<ManageSupportCommandResult> Manage(ManageSupportCommand cmd)
        {
            return cmd switch
            {
                SaveEvacuationFileSupportCommand c => await Handle(c),
                ChangeSupportStatusCommand c => await Handle(c),
                SubmitSupportForApprovalCommand c => await Handle(c),
                SetFlagsCommand c => await Handle(c),
                ClearFlagsCommand c => await Handle(c),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<SupportQueryResult> Query(SupportQuery query)
        {
            return query switch
            {
                SearchSupportsQuery q => await Handle(q),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        private async Task<SetFlagCommandResult> Handle(SetFlagsCommand c)
        {
            var ctx = essContextFactory.Create();

            var support = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(s => s.era_name == c.SupportId)).GetAllPagesAsync()).SingleOrDefault();
            if (support == null) throw new ArgumentException($"Support id {c.SupportId} not found", nameof(c.SupportId));

            var flagTypes = (await ctx.era_supportflagtypes.GetAllPagesAsync()).ToArray();
            foreach (var flag in c.Flags)
            {
                var supportFlag = mapper.Map<era_supportflag>(flag);
                ctx.AddToera_supportflags(supportFlag);
                ctx.SetLink(supportFlag, nameof(era_supportflag.era_FlagType), flagTypes.Single(t => t.era_supportflagtypeid == supportFlag._era_flagtype_value));
                ctx.SetLink(supportFlag, nameof(era_supportflag.era_EvacueeSupport), support);
                if (flag is DuplicateSupportFlag dup)
                {
                    var duplicateSupport = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(s => s.era_name == dup.DuplicatedSupportId))
                        .GetAllPagesAsync()).SingleOrDefault();
                    if (duplicateSupport == null) throw new InvalidOperationException($"Support {dup.DuplicatedSupportId} not found");
                    ctx.SetLink(supportFlag, nameof(era_supportflag.era_SupportDuplicate), duplicateSupport);
                }
            }

            await ctx.SaveChangesAsync();

            ctx.DetachAll();

            return new SetFlagCommandResult();
        }

        private static readonly Guid ApprovalQueueId = new("a4f0fbbe-89a1-ec11-b831-00505683fbf4");
        private static readonly Guid ReviewQueueId = new("e969aae7-8aa1-ec11-b831-00505683fbf4");

        private async Task<AssignSupportToQueueCommandResult> Handle(SubmitSupportForApprovalCommand cmd)
        {
            await Task.CompletedTask;
            var ctx = essContextFactory.Create();

            var queues = (await ctx.queues.GetAllPagesAsync()).ToArray();

            foreach (var supportId in cmd.SupportIds)
            {
                var support = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(s => s.era_name == supportId)).GetAllPagesAsync()).SingleOrDefault();
                if (support == null) throw new InvalidOperationException($"Support {supportId} not found");
                await ctx.LoadPropertyAsync(support, nameof(era_evacueesupport.era_era_evacueesupport_era_supportflag_EvacueeSupport));

                var queue = queues.Single(q => q.queueid == (support.era_era_evacueesupport_era_supportflag_EvacueeSupport.Any() ? ReviewQueueId : ApprovalQueueId));
                var queueItem = new queueitem
                {
                    queueitemid = Guid.NewGuid(),
                    objecttypecode = 10056 //support type picklist value
                };

                // create queue item
                ctx.AddToqueueitems(queueItem);
                ctx.SetLink(queueItem, nameof(queueItem.queueid), queue);
                ctx.SetLink(queueItem, nameof(queueItem.objectid_era_evacueesupport), support);

                // update support status
                support.statuscode = (int)SupportStatus.PendingApproval;
                ctx.UpdateObject(support);
            }

            await ctx.SaveChangesAsync();

            ctx.DetachAll();

            return new AssignSupportToQueueCommandResult();
        }

        private async Task<ClearFlagCommandResult> Handle(ClearFlagsCommand c)
        {
            var ctx = essContextFactory.Create();

            var support = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(s => s.era_name == c.SupportId)).GetAllPagesAsync()).SingleOrDefault();
            if (support == null) throw new InvalidOperationException($"Support {c.SupportId} not found");
            await ctx.LoadPropertyAsync(support, nameof(era_evacueesupport.era_era_evacueesupport_era_supportflag_EvacueeSupport));
            foreach (var flag in support.era_era_evacueesupport_era_supportflag_EvacueeSupport)
            {
                ctx.DeleteObject(flag);
            }

            await ctx.SaveChangesAsync();

            ctx.DetachAll();

            return new ClearFlagCommandResult();
        }

        private async Task<SaveEvacuationFileSupportCommandResult> Handle(SaveEvacuationFileSupportCommand cmd)
        {
            var ctx = essContextFactory.Create();
            var file = ctx.era_evacuationfiles.Expand(f => f.era_CurrentNeedsAssessmentid).Where(f => f.era_name == cmd.FileId).SingleOrDefault();
            if (file == null) throw new ArgumentException($"Evacuation file {cmd.FileId} not found");

            var mappedSupports = mapper.Map<IEnumerable<era_evacueesupport>>(cmd.Supports).ToArray();
            foreach (var support in mappedSupports)
            {
                if (support.era_name == null)
                {
                    CreateSupport(ctx, file, support);
                }
                else
                {
                    UpdateSupport(ctx, file, support);
                }
            }

            await ctx.SaveChangesAsync();

            ctx.DetachAll();

            Parallel.ForEach(mappedSupports, s => s.era_name = ctx.era_evacueesupports.ByKey(s.era_evacueesupportid).Select(s => s.era_name).GetValue());

            ctx.DetachAll();

            return new SaveEvacuationFileSupportCommandResult { Supports = mapper.Map<IEnumerable<Support>>(mappedSupports).ToArray() };
        }

        private async Task<ManageSupportCommandResult> Handle(ChangeSupportStatusCommand cmd)
        {
            var ctx = essContextFactory.Create();
            var changesSupportIds = new List<string>();
            foreach (var item in cmd.Items)
            {
                var support = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(s => s.era_name == item.SupportId)).GetAllPagesAsync()).SingleOrDefault();
                if (support == null) throw new InvalidOperationException($"Support {item.SupportId} not found, can't update its status");
                ChangeSupportStatus(ctx, support, item.ToStatus, item.Reason);
                ctx.UpdateObject(support);
                changesSupportIds.Add(item.SupportId);
            }

            await ctx.SaveChangesAsync();
            ctx.DetachAll();
            return new ChangeSupportStatusCommandResult { Ids = changesSupportIds.ToArray() };
        }

        private async Task<SearchSupportQueryResult> Handle(SearchSupportsQuery query)
        {
            var ctx = essContextFactory.CreateReadOnly();
            var supports = (await Search(ctx, query)).ToArray();
            await Task.WhenAll(supports.Select(s => LoadSupportDetails(ctx, s)));

            var results = new SearchSupportQueryResult { Items = mapper.Map<IEnumerable<Support>>(supports).ToArray() };

            ctx.DetachAll();

            return results;
        }

        private static async Task<IEnumerable<era_evacueesupport>> Search(EssContext ctx, SearchSupportsQuery query)
        {
            if (string.IsNullOrEmpty(query.ById) &&
                string.IsNullOrEmpty(query.ByManualReferralId) &&
                string.IsNullOrEmpty(query.ByEvacuationFileId) &&
                !query.ByStatus.HasValue)
                throw new ArgumentException("Supports query must have at least one criteria", nameof(query));

            // search a specific file
            if (!string.IsNullOrEmpty(query.ByEvacuationFileId))
            {
                var file = ctx.era_evacuationfiles.Where(f => f.era_name == query.ByEvacuationFileId).SingleOrDefault();
                if (file == null) return Array.Empty<era_evacueesupport>();

                ctx.AttachTo(nameof(EssContext.era_evacuationfiles), file);
                await ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId));
                IEnumerable<era_evacueesupport> supports = file.era_era_evacuationfile_era_evacueesupport_ESSFileId;
                if (!string.IsNullOrEmpty(query.ById)) supports = supports.Where(s => s.era_name == query.ById);
                if (!string.IsNullOrEmpty(query.ByManualReferralId)) supports = supports.Where(s => s.era_manualsupport == query.ByManualReferralId);
                supports = supports.OrderBy(s => s.createdon);

                return supports;
            }

            // search all supports
            IQueryable<era_evacueesupport> supportsQuery = ctx.era_evacueesupports;

            if (!string.IsNullOrEmpty(query.ById)) supportsQuery = supportsQuery.Where(s => s.era_name == query.ById);
            if (!string.IsNullOrEmpty(query.ByManualReferralId)) supportsQuery = supportsQuery.Where(s => s.era_manualsupport == query.ByManualReferralId);
            if (query.ByStatus.HasValue) supportsQuery = supportsQuery.Where(s => s.statuscode == (int)query.ByStatus.Value);
            supportsQuery = supportsQuery.OrderBy(s => s.createdon);
            if (query.LimitNumberOfResults.HasValue) supportsQuery = supportsQuery.Take(query.LimitNumberOfResults.Value);

            return await ((DataServiceQuery<era_evacueesupport>)supportsQuery).GetAllPagesAsync();
        }

        private static async Task LoadSupportDetails(EssContext ctx, era_evacueesupport support)
        {
            ctx.AttachTo(nameof(EssContext.era_evacueesupports), support);
            await ctx.LoadPropertyAsync(support, nameof(era_evacueesupport.era_EvacuationFileId));
            await ctx.LoadPropertyAsync(support, nameof(era_evacueesupport.era_era_householdmember_era_evacueesupport));
            await ctx.LoadPropertyAsync(support, nameof(era_evacueesupport.era_era_evacueesupport_era_supportflag_EvacueeSupport));
            foreach (var flag in support.era_era_evacueesupport_era_supportflag_EvacueeSupport)
            {
                if (flag._era_supportduplicate_value.HasValue)
                {
                    ctx.AttachTo(nameof(EssContext.era_supportflags), flag);
                    await ctx.LoadPropertyAsync(flag, nameof(era_supportflag.era_SupportDuplicate));
                }
            }
        }

        private static void CreateSupport(EssContext ctx, era_evacuationfile file, era_evacueesupport support)
        {
            support.era_evacueesupportid = Guid.NewGuid();

            ctx.AddToera_evacueesupports(support);
            ctx.AddLink(file, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId), support);
            ctx.AddLink(file.era_CurrentNeedsAssessmentid, nameof(era_needassessment.era_era_needassessment_era_evacueesupport_NeedsAssessmentID), support);
            ctx.SetLink(support, nameof(era_evacueesupport.era_EvacuationFileId), file);
            ctx.SetLink(support, nameof(era_evacueesupport.era_NeedsAssessmentID), file.era_CurrentNeedsAssessmentid);
            ctx.SetLink(support, nameof(era_evacueesupport.era_GroupLodgingCityID), ctx.LookupJurisdictionByCode(support._era_grouplodgingcityid_value?.ToString()));

            var teamMember = ctx.era_essteamusers.Where(tu => tu.era_essteamuserid == support._era_issuedbyid_value).SingleOrDefault();
            if (teamMember == null) throw new InvalidOperationException($"team member {support._era_issuedbyid_value} not found");
            ctx.SetLink(support, nameof(era_evacueesupport.era_IssuedById), teamMember);

            AssignHouseholdMembersToSupport(ctx, support, support.era_era_householdmember_era_evacueesupport);
            AssignSupplierToSupport(ctx, support);
            AssignETransferRecipientToSupport(ctx, support);
        }

        private static void UpdateSupport(EssContext ctx, era_evacuationfile file, era_evacueesupport support)
        {
            var existingSupport = ctx.era_evacueesupports
                .Where(s => s.era_name == support.era_name)
                .SingleOrDefault();

            if (existingSupport == null) throw new ArgumentException($"Support {support.era_name} not found");
            if (existingSupport._era_evacuationfileid_value != file.era_evacuationfileid)
                throw new InvalidOperationException($"Support {support.era_name} not found in file {file.era_name}");

            ctx.LoadProperty(existingSupport, nameof(era_evacueesupport.era_era_householdmember_era_evacueesupport));
            var currentHouseholdMembers = existingSupport.era_era_householdmember_era_evacueesupport.ToArray();

            ctx.Detach(existingSupport);
            // foreach (var member in existingSupport.era_era_householdmember_era_evacueesupport) essContext.Detach(member);

            support.era_evacueesupportid = existingSupport.era_evacueesupportid;
            ctx.AttachTo(nameof(EssContext.era_evacueesupports), support);
            ctx.SetLink(support, nameof(era_evacueesupport.era_GroupLodgingCityID), ctx.LookupJurisdictionByCode(support._era_grouplodgingcityid_value?.ToString()));

            var teamMember = ctx.era_essteamusers.ByKey(support._era_issuedbyid_value).GetValue();
            ctx.SetLink(support, nameof(era_evacueesupport.era_IssuedById), teamMember);

            ctx.UpdateObject(support);
            // remove household members no longer part of the support
            RemoveHouseholdMembersFromSupport(ctx, support, currentHouseholdMembers.Where(m => !support.era_era_householdmember_era_evacueesupport.Any(im => im.era_householdmemberid == m.era_householdmemberid)));
            // add household members to support
            AssignHouseholdMembersToSupport(ctx, support, support.era_era_householdmember_era_evacueesupport.Where(m => !currentHouseholdMembers.Any(im => im.era_householdmemberid == m.era_householdmemberid)));
            AssignSupplierToSupport(ctx, support);
            AssignETransferRecipientToSupport(ctx, support);
        }

        private static void ChangeSupportStatus(EssContext ctx, era_evacueesupport support, SupportStatus status, string changeReason)
        {
            var supportDeliveryType = (SupportMethod)support.era_supportdeliverytype;

            switch (status)
            {
                case SupportStatus.Void when supportDeliveryType == SupportMethod.Referral:
                    support.era_voidreason = (int)Enum.Parse<SupportVoidReason>(changeReason);
                    ctx.DeactivateObject(support, (int)status);
                    break;

                case SupportStatus.Cancelled when supportDeliveryType == SupportMethod.ETransfer:
                    ctx.DeactivateObject(support, (int)status);
                    break;

                default:
                    support.statuscode = (int)status;
                    break;
            }
        }

        private static void AssignHouseholdMembersToSupport(EssContext ctx, era_evacueesupport support, IEnumerable<era_householdmember> householdMembers)
        {
            foreach (var member in householdMembers)
            {
                ctx.AddLink(ctx.AttachOrGetTracked(nameof(EssContext.era_householdmembers), member, member => member.era_householdmemberid), nameof(era_householdmember.era_era_householdmember_era_evacueesupport), support);
            }
        }

        private static void RemoveHouseholdMembersFromSupport(EssContext essContext, era_evacueesupport support, IEnumerable<era_householdmember> householdMembers)
        {
            foreach (var member in householdMembers)
            {
                essContext.DeleteLink(essContext.AttachOrGetTracked(nameof(EssContext.era_householdmembers), member, member => member.era_householdmemberid), nameof(era_householdmember.era_era_householdmember_era_evacueesupport), support);
            }
        }

        private static void AssignSupplierToSupport(EssContext ctx, era_evacueesupport support)
        {
            if (support._era_supplierid_value.HasValue)
            {
                var supplier = ctx.era_suppliers.Where(s => s.era_supplierid == support._era_supplierid_value && s.statecode == (int)EntityState.Active).SingleOrDefault();
                if (supplier == null) throw new ArgumentException($"Supplier id {support._era_supplierid_value} not found or is not active");
                ctx.SetLink(support, nameof(era_evacueesupport.era_SupplierId), supplier);
            }
        }

        private static void AssignETransferRecipientToSupport(EssContext ctx, era_evacueesupport support)
        {
            if (support._era_payeeid_value.HasValue)
            {
                var registrant = ctx.contacts.Where(s => s.contactid == support._era_payeeid_value && s.statecode == (int)EntityState.Active).SingleOrDefault();
                if (registrant == null) throw new ArgumentException($"Registrant id {support._era_payeeid_value} not found or is not active");
                ctx.SetLink(support, nameof(era_evacueesupport.era_PayeeId), registrant);
            }
        }
    }
}
