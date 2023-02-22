using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Suppliers
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly IEssContextFactory essContextFactory;
        private readonly IMapper mapper;

        private CancellationToken GetCancellationToken() => new CancellationTokenSource().Token;

        public SupplierRepository(IEssContextFactory essContextFactory, IMapper mapper)
        {
            this.essContextFactory = essContextFactory;
            this.mapper = mapper;
        }

        public async Task<SupplierCommandResult> ManageSupplier(SupplierCommand cmd)
        {
            return cmd switch
            {
                SaveSupplier c => await HandleSaveSupplier(c, GetCancellationToken()),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<SupplierQueryResult> QuerySupplier(SupplierQuery query)
        {
            return query switch
            {
                SuppliersByTeamQuery q => await HandleQuery(q, GetCancellationToken()),
                SupplierSearchQuery q => await HandleQuery(q, GetCancellationToken()),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        private async Task<SupplierCommandResult> HandleSaveSupplier(SaveSupplier cmd, CancellationToken ct)
        {
            var essContext = essContextFactory.Create();

            var supplier = mapper.Map<era_supplier>(cmd.Supplier);
            var existingSupplier = supplier.era_supplierid.HasValue
                ? await essContext.era_suppliers.Where(s => s.era_supplierid == supplier.era_supplierid.Value).SingleOrDefaultAsync(ct)
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
                essContext.AttachTo(nameof(EssContext.era_suppliers), supplier);

                supplier.era_supplierid = existingSupplier.era_supplierid;
                supplier._era_primarycontact_value = existingSupplier._era_primarycontact_value;
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
                ts.era_isprimarysupplier = cmd.Supplier.PrimaryTeams.Any(t => ts._era_essteamid_value == Guid.Parse(t.Id));
            }

            AddTeamSuppliers(essContext, existingSupplier, supplier);

            await essContext.SaveChangesAsync(ct);
            essContext.DetachAll();

            return new SupplierCommandResult { SupplierId = supplier.era_supplierid.ToString() };
        }

        private async Task<SupplierQueryResult> HandleQuery(SuppliersByTeamQuery queryRequest, CancellationToken ct)
        {
            var essContext = essContextFactory.CreateReadOnly();

            var supplierQuery = essContext.era_essteamsuppliers
                .Expand(s => s.era_SupplierId)
                .Expand(s => s.era_ESSTeamID)
                .Where(s => s.era_SupplierId != null && s.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(queryRequest.TeamId)) supplierQuery = supplierQuery.Where(s => s._era_essteamid_value == Guid.Parse(queryRequest.TeamId));
            if (queryRequest.ActiveOnly) supplierQuery = supplierQuery.Where(s => s.era_active == true);

            // get all active suppliers
            var foundSuppliers = (await supplierQuery.GetAllPagesAsync(ct))
                .Select(s => s.era_SupplierId)
                .Where(s => s.statecode == (int)EntityState.Active)
                .ToArray();

            var suppliers = new ConcurrentBag<era_supplier>();
            await Parallel.ForEachAsync(foundSuppliers, ct, async (supplier, ct) =>
            {
                supplier = await essContext.era_suppliers
                    .Expand(s => s.era_PrimaryContact)
                    .Expand(s => s.era_RelatedCity)
                    .Expand(s => s.era_RelatedProvinceState)
                    .Expand(s => s.era_RelatedCountry)
                    .Where(s => s.era_supplierid == supplier.era_supplierid)
                    .SingleOrDefaultAsync(ct);
                essContext.AttachTo(nameof(EssContext.era_suppliers), supplier);
                await essContext.LoadPropertyAsync(supplier, nameof(era_supplier.era_era_supplier_era_essteamsupplier_SupplierId), ct);
                essContext.Detach(supplier);
                await Parallel.ForEachAsync(supplier.era_era_supplier_era_essteamsupplier_SupplierId, ct, async (ts, ct) =>
                {
                    essContext.AttachTo(nameof(EssContext.era_essteamsuppliers), ts);
                    await essContext.LoadPropertyAsync(ts, nameof(era_essteamsupplier.era_ESSTeamID), ct);
                    essContext.Detach(ts);
                });
                suppliers.Add(supplier);
            });

            essContext.DetachAll();

            return new SupplierQueryResult { Items = mapper.Map<IEnumerable<Supplier>>(suppliers) };
        }

        private async Task<SupplierQueryResult> HandleQuery(SupplierSearchQuery queryRequest, CancellationToken ct)
        {
            var essContext = essContextFactory.CreateReadOnly();

            if ((!string.IsNullOrEmpty(queryRequest.LegalName) && string.IsNullOrEmpty(queryRequest.GSTNumber)) ||
                (string.IsNullOrEmpty(queryRequest.LegalName) && !string.IsNullOrEmpty(queryRequest.GSTNumber)))
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

            var suppliers = (await supplierQuery.GetAllPagesAsync(ct)).ToArray();

            await Parallel.ForEachAsync(suppliers, ct, async (supplier, ct) =>
            {
                var teamSuppliers = await essContext.era_essteamsuppliers
                    .Expand(s => s.era_ESSTeamID)
                    .Where(ts => ts._era_supplierid_value == supplier.era_supplierid)
                    .GetAllPagesAsync(ct);
                supplier.era_era_supplier_era_essteamsupplier_SupplierId = new Collection<era_essteamsupplier>(teamSuppliers.ToArray());
            });
            essContext.DetachAll();

            return new SupplierQueryResult { Items = mapper.Map<IEnumerable<Supplier>>(suppliers) };
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
            foreach (var teamSupplier in updatedSupplier.era_era_supplier_era_essteamsupplier_SupplierId)
            {
                var sharedWithTeam = essContext.era_essteams.Where(t => t.era_essteamid == teamSupplier._era_essteamid_value).SingleOrDefault();
                if (sharedWithTeam == null) throw new InvalidOperationException($"shared with team '{teamSupplier._era_essteamid_value}' not found");

                var sharingTeam = essContext.era_essteams.Where(t => t.era_essteamid == teamSupplier._era_sharingteam_value).SingleOrDefault();
                if (teamSupplier.era_isprimarysupplier == false && sharingTeam == null) throw new InvalidOperationException($"sharing team '{teamSupplier._era_sharingteam_value}' not found");

                var currentTeamSupplier = existingSupplier != null ? existingSupplier.era_era_supplier_era_essteamsupplier_SupplierId.SingleOrDefault(ts => ts._era_essteamid_value == teamSupplier._era_essteamid_value) : null;
                if (currentTeamSupplier == null)
                {
                    essContext.AddToera_essteamsuppliers(teamSupplier);
                    essContext.AddLink(updatedSupplier, nameof(updatedSupplier.era_era_supplier_era_essteamsupplier_SupplierId), teamSupplier);
                    essContext.SetLink(teamSupplier, nameof(era_essteamsupplier.era_SupplierId), updatedSupplier);

                    essContext.AddLink(sharedWithTeam, nameof(sharedWithTeam.era_essteam_essteamsupplier_ESSTeamID), teamSupplier);
                    essContext.SetLink(teamSupplier, nameof(era_essteamsupplier.era_ESSTeamID), sharedWithTeam);

                    if (sharingTeam != null)
                    {
                        essContext.AddLink(sharingTeam, nameof(sharedWithTeam.era_essteam_era_essteamsupplier_SharingTeam), teamSupplier);
                        essContext.SetLink(teamSupplier, nameof(era_essteamsupplier.era_SharingTeam), sharingTeam);
                    }
                }
                else
                {
                    currentTeamSupplier.era_isprimarysupplier = teamSupplier.era_isprimarysupplier;
                    currentTeamSupplier.era_active = teamSupplier.era_active;
                    essContext.UpdateObject(currentTeamSupplier);
                    essContext.SetLink(currentTeamSupplier, nameof(era_essteamsupplier.era_SupplierId), updatedSupplier);

                    essContext.SetLink(currentTeamSupplier, nameof(era_essteamsupplier.era_ESSTeamID), sharedWithTeam);

                    if (sharingTeam != null)
                    {
                        essContext.AddLink(sharingTeam, nameof(sharedWithTeam.era_essteam_era_essteamsupplier_SharingTeam), currentTeamSupplier);
                        essContext.SetLink(currentTeamSupplier, nameof(era_essteamsupplier.era_SharingTeam), sharingTeam);
                    }
                }
            }
        }

        private static void RemoveTeamSuppliers(EssContext essContext, era_supplier existingSupplier, era_supplier updatedSupplier)
        {
            essContext.LoadProperty(existingSupplier, nameof(existingSupplier.era_era_supplier_era_essteamsupplier_SupplierId));

            foreach (var ts1 in existingSupplier.era_era_supplier_era_essteamsupplier_SupplierId)
            {
                var existsInUpdatedSupplier = !updatedSupplier.era_era_supplier_era_essteamsupplier_SupplierId.Any(ts2 => ts2._era_essteamid_value == ts1._era_essteamid_value);
                if (existsInUpdatedSupplier)
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
