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

        public async Task<TeamSupplierQueryResult> QueryTeamSupplier(TeamSupplierQuery query)
        {
            return query.GetType().Name switch
            {
                nameof(TeamSupplierQuery) => await HandleQuery(query),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        public async Task<SupplierContactQueryResult> QuerySupplierContact(SupplierContactQuery query)
        {
            return query.GetType().Name switch
            {
                nameof(SupplierContactQuery) => await HandleQuery(query),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        private async Task<TeamSupplierQueryResult> HandleQuery(TeamSupplierQuery queryRequest)
        {
            if (string.IsNullOrEmpty(queryRequest.TeamId)) throw new ArgumentNullException(nameof(TeamSupplierQuery.TeamId));

            IQueryable<era_essteamsupplier> supplierQuery = essContext.era_essteamsuppliers
                .Expand(s => s.era_SupplierId)
                .Expand(s => s.era_ESSTeamID)
                .Where(s => s.statecode == (int)EntityState.Active)
                .Where(s => s._era_essteamid_value == Guid.Parse(queryRequest.TeamId));

            var teamSuppliers = await ((DataServiceQuery<era_essteamsupplier>)supplierQuery).GetAllPagesAsync();

            essContext.DetachAll();

            var items = mapper.Map<IEnumerable<TeamSupplier>>(teamSuppliers);

            if (!string.IsNullOrEmpty(queryRequest.Name))
            {
                items = items.Where(s =>
                            (s.Supplier.Name != null && s.Supplier.Name.Contains(queryRequest.Name, StringComparison.OrdinalIgnoreCase))
                            || (s.Supplier.LegalName != null && s.Supplier.LegalName.Contains(queryRequest.Name, StringComparison.OrdinalIgnoreCase)));
            }

            return new TeamSupplierQueryResult { Items = items };
        }

        private async Task<SupplierContactQueryResult> HandleQuery(SupplierContactQuery queryRequest)
        {
            if (string.IsNullOrEmpty(queryRequest.ContactId)) throw new ArgumentNullException(nameof(SupplierContactQuery.ContactId));

            IQueryable<era_suppliercontact> supplierQuery = essContext.era_suppliercontacts
                .Where(s => s.statecode == (int)EntityState.Active)
                .Where(s => s.era_suppliercontactid == Guid.Parse(queryRequest.ContactId));

            var supplierContacts = await ((DataServiceQuery<era_suppliercontact>)supplierQuery).GetAllPagesAsync();

            essContext.DetachAll();

            var items = mapper.Map<IEnumerable<SupplierContact>>(supplierContacts);
            return new SupplierContactQueryResult { Items = items };
        }
    }
}
