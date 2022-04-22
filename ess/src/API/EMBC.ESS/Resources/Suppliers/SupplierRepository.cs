using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace EMBC.ESS.Resources.Suppliers
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly IEssContextFactory essContextFactory;
        private readonly IMapper mapper;

        public SupplierRepository(IEssContextFactory essContextFactory, IMapper mapper)
        {
            this.essContextFactory = essContextFactory;
            this.mapper = mapper;
        }

        public async Task<SupplierCommandResult> ManageSupplier(SupplierCommand cmd)
        {
            return cmd switch
            {
                SaveSupplier c => await HandleSaveSupplier(c),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<SupplierQueryResult> QuerySupplier(SupplierQuery query)
        {
            return query.GetType().Name switch
            {
                nameof(SuppliersByTeamQuery) => await HandleQuery((SuppliersByTeamQuery)query),
                nameof(SupplierSearchQuery) => await HandleQuery((SupplierSearchQuery)query),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        private async Task<SupplierCommandResult> HandleSaveSupplier(SaveSupplier cmd)
        {
            var essContext = essContextFactory.Create();

            var supplier = mapper.Map<era_supplier>(cmd.Supplier);
            var existingSupplier = supplier.era_supplierid.HasValue
                ? essContext.era_suppliers
                    .Where(s => s.era_supplierid == supplier.era_supplierid.Value).SingleOrDefault()
                    : null;

            if (existingSupplier == null)
            {
                supplier.era_supplierid = Guid.NewGuid();
                essContext.AddToera_suppliers(supplier);
            }
            else
            {
                RemoveTeamSuppliers(essContext, existingSupplier, supplier);
                essContext.Detach(existingSupplier);
                supplier.era_supplierid = existingSupplier.era_supplierid;

                supplier._era_primarycontact_value = existingSupplier._era_primarycontact_value;
                essContext.AttachTo(nameof(EssContext.era_suppliers), supplier);
                essContext.UpdateObject(supplier);
            }

            essContext.SetLink(supplier, nameof(era_supplier.era_RelatedCountry), essContext.LookupCountryByCode(cmd.Supplier.Address.Country));
            essContext.SetLink(supplier, nameof(era_supplier.era_RelatedCity), essContext.LookupJurisdictionByCode(cmd.Supplier.Address.Community));
            essContext.SetLink(supplier, nameof(era_supplier.era_RelatedProvinceState), essContext.LookupStateProvinceByCode(cmd.Supplier.Address.StateProvince));

            var contact = mapper.Map<era_suppliercontact>(cmd.Supplier.Contact);

            AddSupplierContact(essContext, supplier, contact);

            foreach (var ts in supplier.era_era_supplier_era_essteamsupplier_SupplierId)
            {
                ts.era_active = cmd.Supplier.Status == SupplierStatus.Active;
                ts.era_isprimarysupplier = cmd.Supplier.Team?.Id != null ? ts._era_essteamid_value == Guid.Parse(cmd.Supplier.Team.Id) : false;
            }

            AddTeamSuppliers(essContext, existingSupplier, supplier);

            await essContext.SaveChangesAsync();
            essContext.DetachAll();

            return new SupplierCommandResult { SupplierId = supplier.era_supplierid.ToString() };
        }

        private async Task<SupplierQueryResult> HandleQuery(SuppliersByTeamQuery queryRequest)
        {
            var essContext = essContextFactory.CreateReadOnly();

            IQueryable<era_essteamsupplier> supplierQuery = essContext.era_essteamsuppliers
                .Expand(s => s.era_SupplierId)
                .Expand(s => s.era_ESSTeamID)
                .Where(s => s.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(queryRequest.TeamId)) supplierQuery = supplierQuery.Where(s => s._era_essteamid_value == Guid.Parse(queryRequest.TeamId));

            var suppliers = (await ((DataServiceQuery<era_essteamsupplier>)supplierQuery).GetAllPagesAsync()).ToArray();
            suppliers = suppliers.Where(s => s.era_SupplierId.statecode == (int)EntityState.Active).ToArray();
            if (queryRequest.ActiveOnly) suppliers = suppliers.Where(s => s.era_active.HasValue ? s.era_active.Value : false).ToArray();

            foreach (var supplier in suppliers)
            {
                essContext.AttachTo(nameof(EssContext.era_essteamsuppliers), supplier);
                essContext.AttachTo(nameof(EssContext.era_suppliers), supplier.era_SupplierId);
                await essContext.LoadPropertyAsync(supplier.era_SupplierId, nameof(era_supplier.era_PrimaryContact));
                await essContext.LoadPropertyAsync(supplier.era_SupplierId, nameof(era_supplier.era_RelatedCity));
                await essContext.LoadPropertyAsync(supplier.era_SupplierId, nameof(era_supplier.era_RelatedCountry));
                await essContext.LoadPropertyAsync(supplier.era_SupplierId, nameof(era_supplier.era_RelatedProvinceState));

                var teamSupplierQuery = essContext.era_essteamsuppliers
                    .Expand(s => s.era_ESSTeamID)
                    .Where(s => s._era_supplierid_value == supplier._era_supplierid_value);

                var teamSuppliers = (await ((DataServiceQuery<era_essteamsupplier>)teamSupplierQuery).GetAllPagesAsync()).ToArray();

                foreach (var ts in teamSuppliers)
                {
                    supplier.era_SupplierId.era_era_supplier_era_essteamsupplier_SupplierId.Add(ts);
                }
            }

            var items = mapper.Map<IEnumerable<Supplier>>(suppliers.Select(s => s.era_SupplierId));

            essContext.DetachAll();

            return new SupplierQueryResult { Items = items };
        }

        private async Task<SupplierQueryResult> HandleQuery(SupplierSearchQuery queryRequest)
        {
            var essContext = essContextFactory.CreateReadOnly();

            if ((!string.IsNullOrEmpty(queryRequest.LegalName) && string.IsNullOrEmpty(queryRequest.GSTNumber)) ||
                (!string.IsNullOrEmpty(queryRequest.LegalName) && string.IsNullOrEmpty(queryRequest.GSTNumber)))
            {
                throw new ArgumentException("If searching by legal name and gst, both are required");
            }

            if (string.IsNullOrEmpty(queryRequest.SupplierId) && string.IsNullOrEmpty(queryRequest.LegalName) && string.IsNullOrEmpty(queryRequest.GSTNumber))
            {
                throw new ArgumentException("no search criteria");
            }

            IQueryable<era_supplier> supplierQuery = essContext.era_suppliers
                .Expand(s => s.era_PrimaryContact)
                .Expand(s => s.era_RelatedCity)
                .Expand(s => s.era_RelatedCountry)
                .Expand(s => s.era_RelatedProvinceState);

            if (queryRequest.ActiveOnly) supplierQuery = supplierQuery.Where(s => s.statecode == (int)EntityState.Active);
            if (!string.IsNullOrEmpty(queryRequest.SupplierId)) supplierQuery = supplierQuery.Where(s => s.era_supplierid == Guid.Parse(queryRequest.SupplierId));
            if (!string.IsNullOrEmpty(queryRequest.LegalName) && !string.IsNullOrEmpty(queryRequest.GSTNumber)) supplierQuery = supplierQuery.Where(s => s.era_name == queryRequest.LegalName && s.era_gstnumber == queryRequest.GSTNumber);

            var suppliers = (await ((DataServiceQuery<era_supplier>)supplierQuery).GetAllPagesAsync()).ToArray();
            foreach (var supplier in suppliers)
            {
                var teamSupplierQuery = essContext.era_essteamsuppliers
                        .Expand(s => s.era_ESSTeamID)
                        .Where(s => s._era_supplierid_value == supplier.era_supplierid);

                supplier.era_era_supplier_era_essteamsupplier_SupplierId = new Collection<era_essteamsupplier>((await ((DataServiceQuery<era_essteamsupplier>)teamSupplierQuery).GetAllPagesAsync()).ToArray());
            }

            var items = mapper.Map<IEnumerable<Supplier>>(suppliers);

            essContext.DetachAll();

            return new SupplierQueryResult { Items = items };
        }

        private static void AddSupplierContact(EssContext essContext, era_supplier supplier, era_suppliercontact contact)
        {
            var existinContact = supplier._era_primarycontact_value.HasValue
                ? essContext.era_suppliercontacts
                    .Where(s => s.era_suppliercontactid == supplier._era_primarycontact_value.Value).SingleOrDefault()
                    : null;

            if (existinContact == null)
            {
                contact.era_suppliercontactid = Guid.NewGuid();
                essContext.AddToera_suppliercontacts(contact);
            }
            else
            {
                essContext.Detach(existinContact);
                contact.era_suppliercontactid = existinContact.era_suppliercontactid;
                essContext.AttachTo(nameof(EssContext.era_suppliercontacts), contact);
                essContext.UpdateObject(contact);
            }

            essContext.SetLink(supplier, nameof(era_supplier.era_PrimaryContact), contact);
            essContext.SetLink(contact, nameof(era_suppliercontact.era_RelatedSupplier), supplier);
        }

        private static void AddTeamSuppliers(EssContext essContext, era_supplier existingSupplier, era_supplier updatedSupplier)
        {
            foreach (var ts1 in updatedSupplier.era_era_supplier_era_essteamsupplier_SupplierId)
            {
                var team = essContext.era_essteams
                        .Where(t => t.era_essteamid == ts1._era_essteamid_value).SingleOrDefault();

                if (team == null) continue;

                var currentTeamSupplier = existingSupplier != null ? existingSupplier.era_era_supplier_era_essteamsupplier_SupplierId.Where(ts2 => ts2._era_essteamid_value == ts1._era_essteamid_value).SingleOrDefault() : null;
                if (currentTeamSupplier == null)
                {
                    essContext.AddToera_essteamsuppliers(ts1);
                    essContext.AddLink(updatedSupplier, nameof(updatedSupplier.era_era_supplier_era_essteamsupplier_SupplierId), ts1);
                    essContext.SetLink(ts1, nameof(era_essteamsupplier.era_SupplierId), updatedSupplier);

                    essContext.AddLink(team, nameof(team.era_essteam_essteamsupplier_ESSTeamID), ts1);
                    essContext.SetLink(ts1, nameof(era_essteamsupplier.era_ESSTeamID), team);
                }
                else
                {
                    currentTeamSupplier.era_isprimarysupplier = ts1.era_isprimarysupplier;
                    currentTeamSupplier.era_active = ts1.era_active;
                    essContext.UpdateObject(currentTeamSupplier);
                    essContext.SetLink(currentTeamSupplier, nameof(era_essteamsupplier.era_SupplierId), updatedSupplier);
                    essContext.SetLink(currentTeamSupplier, nameof(era_essteamsupplier.era_ESSTeamID), team);
                }
            }
        }

        private static void RemoveTeamSuppliers(EssContext essContext, era_supplier existingSupplier, era_supplier updatedSupplier)
        {
            essContext.LoadProperty(existingSupplier, nameof(existingSupplier.era_era_supplier_era_essteamsupplier_SupplierId));

            foreach (var ts1 in existingSupplier.era_era_supplier_era_essteamsupplier_SupplierId)
            {
                var currentTeamSupplier = updatedSupplier.era_era_supplier_era_essteamsupplier_SupplierId.Where(ts2 => ts2._era_essteamid_value == ts1._era_essteamid_value).SingleOrDefault();
                if (currentTeamSupplier == null)
                {
                    essContext.DeleteObject(ts1);
                    essContext.DeleteLink(existingSupplier, nameof(existingSupplier.era_era_supplier_era_essteamsupplier_SupplierId), ts1);
                }
            }
        }
    }

#pragma warning disable CA1008 // Enums should have zero value

    public enum SupplierVerificationStatus
    {
        Verified = 174360000,
        NotVerified = 1
    }

#pragma warning restore CA1008 // Enums should have zero value
}
