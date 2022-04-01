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
        private readonly EssContext essContext;
        private readonly IEssContextFactory essContextFactory;
        private readonly IMapper mapper;

        public SupportRepository(IEssContextFactory essContextFactory, IMapper mapper)
        {
            essContext = essContextFactory.Create();
            this.essContextFactory = essContextFactory;
            this.mapper = mapper;
        }

        public async Task<ManageSupportCommandResult> Manage(ManageSupportCommand cmd)
        {
            return cmd switch
            {
                SaveEvacuationFileSupportCommand c => await Handle(c),
                ChangeSupportStatusCommand c => await Handle(c),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<SupportQueryResults> Query(SupportQuery query)
        {
            return query switch
            {
                SearchSupportsQuery q => await Handle(q),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        private async Task<SaveEvacuationFileSupportCommandResult> Handle(SaveEvacuationFileSupportCommand cmd)
        {
            return new SaveEvacuationFileSupportCommandResult { Ids = await SaveSupports(cmd.FileId, cmd.Supports) };
        }

        private async Task<ManageSupportCommandResult> Handle(ChangeSupportStatusCommand cmd)
        {
            var ctx = essContext;
            var changesSupportIds = new List<string>();
            foreach (var item in cmd.Items)
            {
                var supportId = await ChangeSupportStatus(ctx, item.SupportId, item.ToStatus, item.Reason);
                if (!string.IsNullOrEmpty(supportId)) changesSupportIds.Add(supportId);
            }

            await ctx.SaveChangesAsync();
            ctx.DetachAll();
            return new ChangeSupportStatusCommandResult { Ids = changesSupportIds.ToArray() };
        }

        private async Task<SupportQueryResults> Handle(SearchSupportsQuery query)
        {
            var ctx = essContextFactory.Create();
            var supports = await Search(ctx, query);
            foreach (var support in supports)
            {
                await ctx.LoadPropertyAsync(support, nameof(era_evacueesupport.era_EvacuationFileId));
                await ctx.LoadPropertyAsync(support, nameof(era_evacueesupport.era_era_householdmember_era_evacueesupport));
            }
            var results = new SupportQueryResults { Items = mapper.Map<IEnumerable<Support>>(supports).ToArray() };

            ctx.DetachAll();

            return results;
        }

        private static async Task<IEnumerable<era_evacueesupport>> Search(EssContext ctx, SearchSupportsQuery query)
        {
            if (string.IsNullOrEmpty(query.ById) && string.IsNullOrEmpty(query.ByExternalReferenceId) && string.IsNullOrEmpty(query.ByEvacuationFileId))
                throw new ArgumentException("Supports query must have at least one criteria", nameof(query));

            // search a specific file
            if (!string.IsNullOrEmpty(query.ByEvacuationFileId))
            {
                var file = ctx.era_evacuationfiles.Where(f => f.era_name == query.ByEvacuationFileId).SingleOrDefault();
                if (file == null) return Array.Empty<era_evacueesupport>();

                await ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId));
                IEnumerable<era_evacueesupport> supports = file.era_era_evacuationfile_era_evacueesupport_ESSFileId;
                if (!string.IsNullOrEmpty(query.ById)) supports = supports.Where(s => s.era_name == query.ById);
                if (!string.IsNullOrEmpty(query.ByExternalReferenceId)) supports = supports.Where(s => s.era_manualsupport == query.ByExternalReferenceId);

                return supports.ToArray();
            }

            // search all supports
            IQueryable<era_evacueesupport> supportsQuery = ctx.era_evacueesupports;

            if (!string.IsNullOrEmpty(query.ById)) supportsQuery = supportsQuery.Where(s => s.era_name == query.ById);
            if (!string.IsNullOrEmpty(query.ByExternalReferenceId)) supportsQuery = supportsQuery.Where(s => s.era_manualsupport == query.ByExternalReferenceId);

            return (await ((DataServiceQuery<era_evacueesupport>)supportsQuery).GetAllPagesAsync()).ToArray();
        }

        private async Task<string[]> SaveSupports(string fileId, IEnumerable<Support> supports)
        {
            var file = essContext.era_evacuationfiles.Expand(f => f.era_CurrentNeedsAssessmentid).Where(f => f.era_name == fileId).SingleOrDefault();
            if (file == null) throw new ArgumentException($"Evacuation file {fileId} not found");

            var mappedSupports = mapper.Map<IEnumerable<era_evacueesupport>>(supports).ToArray();
            foreach (var support in mappedSupports)
            {
                if (support.era_name == null)
                {
                    CreateSupport(file, support);
                }
                else
                {
                    UpdateSupport(file, support);
                }
            }

            await essContext.SaveChangesAsync();

            essContext.DetachAll();

            foreach (var support in mappedSupports)
            {
                // get the auto generated support id
                support.era_name = essContext.era_evacueesupports
                    .Where(s => s.era_evacueesupportid == support.era_evacueesupportid)
                    .Select(s => s.era_name)
                    .Single();
            }

            essContext.DetachAll();

            return mappedSupports.Select(s => s.era_name).ToArray();
        }

        private void CreateSupport(era_evacuationfile file, era_evacueesupport support)
        {
            support.era_evacueesupportid = Guid.NewGuid();

            essContext.AddToera_evacueesupports(support);
            essContext.AddLink(file, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId), support);
            essContext.AddLink(file.era_CurrentNeedsAssessmentid, nameof(era_needassessment.era_era_needassessment_era_evacueesupport_NeedsAssessmentID), support);
            essContext.SetLink(support, nameof(era_evacueesupport.era_EvacuationFileId), file);
            essContext.SetLink(support, nameof(era_evacueesupport.era_NeedsAssessmentID), file.era_CurrentNeedsAssessmentid);
            essContext.SetLink(support, nameof(era_evacueesupport.era_GroupLodgingCityID), essContext.LookupJurisdictionByCode(support._era_grouplodgingcityid_value?.ToString()));

            var teamMember = essContext.era_essteamusers.Where(tu => tu.era_essteamuserid == support._era_issuedbyid_value).SingleOrDefault();
            essContext.SetLink(support, nameof(era_evacueesupport.era_IssuedById), teamMember);

            AssignHouseholdMembersToSupport(support, support.era_era_householdmember_era_evacueesupport);
            AssignSupplierToSupport(support);
            AssignETransferRecipientToSupport(support);
        }

        private void UpdateSupport(era_evacuationfile file, era_evacueesupport support)
        {
            var existingSupport = essContext.era_evacueesupports
                .Where(s => s.era_name == support.era_name)
                .SingleOrDefault();

            if (existingSupport == null) throw new ArgumentException($"Support {support.era_name} not found");
            if (existingSupport._era_evacuationfileid_value != file.era_evacuationfileid)
                throw new InvalidOperationException($"Support {support.era_name} not found in file {file.era_name}");

            essContext.LoadProperty(existingSupport, nameof(era_evacueesupport.era_era_householdmember_era_evacueesupport));
            var currentHouseholdMembers = existingSupport.era_era_householdmember_era_evacueesupport.ToArray();

            essContext.Detach(existingSupport);
            // foreach (var member in existingSupport.era_era_householdmember_era_evacueesupport) essContext.Detach(member);

            support.era_evacueesupportid = existingSupport.era_evacueesupportid;
            essContext.AttachTo(nameof(EssContext.era_evacueesupports), support);
            essContext.SetLink(support, nameof(era_evacueesupport.era_GroupLodgingCityID), essContext.LookupJurisdictionByCode(support._era_grouplodgingcityid_value?.ToString()));

            var teamMember = essContext.era_essteamusers.ByKey(support._era_issuedbyid_value).GetValue();
            essContext.SetLink(support, nameof(era_evacueesupport.era_IssuedById), teamMember);

            essContext.UpdateObject(support);
            // remove household members no longer part of the support
            RemoveHouseholdMembersFromSupport(support, currentHouseholdMembers.Where(m => !support.era_era_householdmember_era_evacueesupport.Any(im => im.era_householdmemberid == m.era_householdmemberid)));
            // add household members to support
            AssignHouseholdMembersToSupport(support, support.era_era_householdmember_era_evacueesupport.Where(m => !currentHouseholdMembers.Any(im => im.era_householdmemberid == m.era_householdmemberid)));
            AssignSupplierToSupport(support);
            AssignETransferRecipientToSupport(support);
        }

        private static async Task<string> ChangeSupportStatus(EssContext ctx, string supportId, SupportStatus status, string changeReason)
        {
            var support = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(s => s.era_name == supportId)).GetAllPagesAsync()).SingleOrDefault();

            var supportDeliveryType = (SupportMethod)support.era_supportdeliverytype;
            if (support != null)
            {
                switch (status)
                {
                    case SupportStatus.Void when supportDeliveryType == SupportMethod.Referral:
                        support.era_voidreason = (int)Enum.Parse<SupportVoidReason>(changeReason);
                        ctx.DeactivateObject(support, (int)status);
                        break;

                    case SupportStatus.PendingApproval when supportDeliveryType == SupportMethod.ETransfer:
                        support.statuscode = (int)status;
                        break;

                    case SupportStatus.Paid when supportDeliveryType == SupportMethod.ETransfer:
                        support.statuscode = (int)status;
                        break;

                    case SupportStatus.Cancelled when supportDeliveryType == SupportMethod.ETransfer:
                        ctx.DeactivateObject(support, (int)status);
                        break;

                    case SupportStatus.UnderReview when supportDeliveryType == SupportMethod.ETransfer:
                        support.statuscode = (int)status;
                        break;

                    case SupportStatus.PendingScan when supportDeliveryType == SupportMethod.ETransfer:
                        support.statuscode = (int)status;
                        break;

                    default:
                        throw new InvalidOperationException($"Can't change status of {supportId} with delivery type {supportDeliveryType} to {status}");
                }
                return supportId;
            }
            return null;
        }

        private void AssignHouseholdMembersToSupport(era_evacueesupport support, IEnumerable<era_householdmember> householdMembers)
        {
            foreach (var member in householdMembers)
            {
                essContext.AddLink(essContext.AttachOrGetTracked(nameof(EssContext.era_householdmembers), member, member => member.era_householdmemberid), nameof(era_householdmember.era_era_householdmember_era_evacueesupport), support);
            }
        }

        private void RemoveHouseholdMembersFromSupport(era_evacueesupport support, IEnumerable<era_householdmember> householdMembers)
        {
            foreach (var member in householdMembers)
            {
                essContext.DeleteLink(essContext.AttachOrGetTracked(nameof(EssContext.era_householdmembers), member, member => member.era_householdmemberid), nameof(era_householdmember.era_era_householdmember_era_evacueesupport), support);
            }
        }

        private void AssignSupplierToSupport(era_evacueesupport support)
        {
            if (support._era_supplierid_value.HasValue)
            {
                var supplier = essContext.era_suppliers.Where(s => s.era_supplierid == support._era_supplierid_value && s.statecode == (int)EntityState.Active).SingleOrDefault();
                if (supplier == null) throw new ArgumentException($"Supplier id {support._era_supplierid_value} not found or is not active");
                essContext.SetLink(support, nameof(era_evacueesupport.era_SupplierId), supplier);
            }
        }

        private void AssignETransferRecipientToSupport(era_evacueesupport support)
        {
            if (support._era_payeeid_value.HasValue)
            {
                var registrant = essContext.contacts.Where(s => s.contactid == support._era_payeeid_value && s.statecode == (int)EntityState.Active).SingleOrDefault();
                if (registrant == null) throw new ArgumentException($"Registrant id {support._era_payeeid_value} not found or is not active");
                essContext.SetLink(support, nameof(era_evacueesupport.era_PayeeId), registrant);
            }
        }
    }
}
