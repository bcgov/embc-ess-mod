// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System;
using System.Collections.Generic;
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
        private readonly EssContext essContext;
        private readonly IMapper mapper;

        public SupplierRepository(EssContext essContext, IMapper mapper)
        {
            this.essContext = essContext;
            this.mapper = mapper;
        }

        public async Task<SupplierCommandResult> ManageSupplier(SupplierCommand cmd)
        {
            return cmd.GetType().Name switch
            {
                nameof(SaveSupplier) => await HandleSaveSupplier((SaveSupplier)cmd),
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
            var supplier = mapper.Map<era_supplier>(cmd.Supplier);
            var existingSupplier = supplier.era_supplierid.HasValue
                ? essContext.era_suppliers
                    .Expand(s => s.era_era_supplier_era_essteamsupplier_SupplierId)
                    .Where(s => s.era_supplierid == supplier.era_supplierid.Value).SingleOrDefault()
                    : null;

            essContext.DetachAll();

            if (existingSupplier == null)
            {
                supplier.era_supplierid = Guid.NewGuid();
                essContext.AddToera_suppliers(supplier);
            }
            else
            {
                supplier.era_supplierid = existingSupplier.era_supplierid;
                supplier.era_era_supplier_era_essteamsupplier_SupplierId = existingSupplier.era_era_supplier_era_essteamsupplier_SupplierId;
                essContext.AttachTo(nameof(EssContext.era_suppliers), supplier);
                essContext.UpdateObject(supplier);
            }

            essContext.SetLink(supplier, nameof(era_supplier.era_RelatedCity), essContext.LookupJurisdictionByCode(cmd.Supplier.Address.Community));
            essContext.SetLink(supplier, nameof(era_supplier.era_RelatedProvinceState), essContext.LookupStateProvinceByCode(cmd.Supplier.Address.StateProvince));

            await essContext.SaveChangesAsync();
            essContext.DetachAll();
            essContext.AttachTo(nameof(EssContext.era_suppliers), supplier);

            //Save/Create SupplierContact
            var supplierContact = mapper.Map<era_suppliercontact>(cmd.Supplier);

            var existinContact = supplier._era_primarycontact_value.HasValue
                ? essContext.era_suppliercontacts
                    .Where(s => s.era_suppliercontactid == supplier._era_primarycontact_value.Value).SingleOrDefault()
                    : null;

            essContext.DetachAll();
            essContext.AttachTo(nameof(EssContext.era_suppliers), supplier);

            if (existinContact == null)
            {
                supplierContact.era_suppliercontactid = Guid.NewGuid();
                essContext.AddToera_suppliercontacts(supplierContact);
            }
            else
            {
                supplierContact.era_suppliercontactid = existinContact.era_suppliercontactid;
                essContext.AttachTo(nameof(EssContext.era_suppliercontacts), supplierContact);
                essContext.UpdateObject(supplierContact);
            }

            essContext.SetLink(supplier, nameof(era_supplier.era_PrimaryContact), supplierContact);

            await essContext.SaveChangesAsync();
            essContext.DetachAll();
            essContext.AttachTo(nameof(EssContext.era_suppliers), supplier);

            //Save/Create TeamSupplier
            if (!string.IsNullOrEmpty(cmd.Supplier.Team.Id))
            {
                var teamSupplier = essContext.era_essteamsuppliers
                    .Where(s => s._era_essteamid_value == Guid.Parse(cmd.Supplier.Team.Id))
                    .Where(s => s._era_supplierid_value == supplier.era_supplierid).SingleOrDefault();

                if (teamSupplier == null)
                {
                    teamSupplier = new era_essteamsupplier();
                    teamSupplier.era_essteamsupplierid = Guid.NewGuid();
                    teamSupplier.era_isprimarysupplier = true;

                    essContext.AddToera_essteamsuppliers(teamSupplier);
                }

                teamSupplier.era_active = cmd.Supplier.Status == SupplierStatus.Active;
                essContext.UpdateObject(teamSupplier);
                essContext.SetLink(teamSupplier, nameof(era_essteamsupplier.era_SupplierId), supplier);

                await essContext.SaveChangesAsync();

                var team = essContext.era_essteams
                    .Where(t => t.era_essteamid == Guid.Parse(cmd.Supplier.Team.Id)).SingleOrDefault();

                if (team != null) essContext.SetLink(teamSupplier, nameof(era_essteamsupplier.era_ESSTeamID), team);

                await essContext.SaveChangesAsync();
                essContext.DetachAll();
            }

            foreach (var ts in supplier.era_era_supplier_era_essteamsupplier_SupplierId)
            {
                ts.era_active = cmd.Supplier.Status == SupplierStatus.Active;
                essContext.AttachTo(nameof(EssContext.era_essteamsuppliers), ts);
                essContext.UpdateObject(ts);
            }

            await essContext.SaveChangesAsync();

            return new SupplierCommandResult { SupplierId = supplier.era_supplierid.ToString() };
        }

        private async Task<SupplierQueryResult> HandleQuery(SuppliersByTeamQuery queryRequest)
        {
            IQueryable<era_essteamsupplier> supplierQuery = essContext.era_essteamsuppliers
                .Expand(s => s.era_SupplierId)
                .Expand(s => s.era_ESSTeamID)
                .Where(s => s.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(queryRequest.TeamId)) supplierQuery = supplierQuery.Where(s => s._era_essteamid_value == Guid.Parse(queryRequest.TeamId));

            var suppliers = (await ((DataServiceQuery<era_essteamsupplier>)supplierQuery).GetAllPagesAsync()).ToArray();

            foreach (var supplier in suppliers)
            {
                essContext.LoadProperty(supplier.era_SupplierId, nameof(era_supplier.era_PrimaryContact));

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
            if ((!string.IsNullOrEmpty(queryRequest.LegalName) && string.IsNullOrEmpty(queryRequest.GSTNumber)) ||
                (!string.IsNullOrEmpty(queryRequest.LegalName) && string.IsNullOrEmpty(queryRequest.GSTNumber)))
            {
                throw new Exception("If searching by legal name and gst, both are required");
            }

            if (string.IsNullOrEmpty(queryRequest.SupplierId) && string.IsNullOrEmpty(queryRequest.LegalName) && string.IsNullOrEmpty(queryRequest.GSTNumber))
            {
                throw new Exception("no search criteria");
            }

            IQueryable<era_supplier> supplierQuery = essContext.era_suppliers
                .Expand(s => s.era_RelatedCity)
                .Expand(s => s.era_RelatedCountry)
                .Expand(s => s.era_RelatedProvinceState);

            if (!string.IsNullOrEmpty(queryRequest.SupplierId)) supplierQuery = supplierQuery.Where(s => s.era_supplierid == Guid.Parse(queryRequest.SupplierId));
            if (!string.IsNullOrEmpty(queryRequest.LegalName) && !string.IsNullOrEmpty(queryRequest.GSTNumber)) supplierQuery = supplierQuery.Where(s => s.era_name == queryRequest.LegalName && s.era_gstnumber == queryRequest.GSTNumber);

            var suppliers = (await ((DataServiceQuery<era_supplier>)supplierQuery).GetAllPagesAsync()).ToArray();
            foreach (var supplier in suppliers)
            {
                var teamSupplierQuery = essContext.era_essteamsuppliers
                        .Expand(s => s.era_ESSTeamID)
                        .Where(s => s._era_supplierid_value == supplier.era_supplierid);

                var teamSuppliers = (await ((DataServiceQuery<era_essteamsupplier>)teamSupplierQuery).GetAllPagesAsync()).ToArray();

                foreach (var ts in teamSuppliers)
                {
                    supplier.era_era_supplier_era_essteamsupplier_SupplierId.Add(ts);
                }
            }

            var items = mapper.Map<IEnumerable<Supplier>>(suppliers);

            essContext.DetachAll();

            return new SupplierQueryResult { Items = items };
        }
    }

    public enum SupplierVerificationStatus
    {
        Verified = 174360000,
        NotVerified = 1
    }
}
