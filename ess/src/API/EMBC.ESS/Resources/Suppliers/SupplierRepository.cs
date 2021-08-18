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

        public async Task<SupplierQueryResult> QuerySupplier(SupplierQuery query)
        {
            return query.GetType().Name switch
            {
                nameof(SuppliersByTeamQuery) => await HandleQuery((SuppliersByTeamQuery)query),
                nameof(SupplierSearchQuery) => await HandleQuery((SupplierSearchQuery)query),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
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

            IQueryable<era_supplier> supplierQuery = essContext.era_suppliers;

            if (!string.IsNullOrEmpty(queryRequest.SupplierId)) supplierQuery = supplierQuery.Where(s => s.era_supplierid == Guid.Parse(queryRequest.SupplierId));
            if (!string.IsNullOrEmpty(queryRequest.LegalName) && !string.IsNullOrEmpty(queryRequest.GSTNumber)) supplierQuery = supplierQuery.Where(s => s.era_supplierlegalname == queryRequest.LegalName && s.era_gstnumber == queryRequest.GSTNumber);

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
