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

namespace EMBC.ESS.Resources.Print
{
    public class PrintRequestsRepository : IPrintRequestsRepository
    {
        private readonly IMapper mapper;
        private readonly EssContext essContext;

        public PrintRequestsRepository(IMapper mapper, EssContext essContext)
        {
            this.mapper = mapper;
            this.essContext = essContext;
        }

        public async Task<string> Manage(SavePrintRequest request)
        {
            return request.PrintRequest switch
            {
                ReferralPrintRequest pr => await SavePrintRequest(pr),
                _ => throw new NotImplementedException()
            };
        }

        public async Task<IEnumerable<PrintRequest>> Query(QueryPrintRequests query)
        {
            return await QueryReferralPrintRequests(query);
        }

        private async Task<string> SavePrintRequest(ReferralPrintRequest printRequest)
        {
            var newreferralprint = mapper.Map<era_referralprint>(printRequest);
            newreferralprint.era_referralprintid = Guid.NewGuid();
            essContext.AddToera_referralprints(newreferralprint);

            //must save the new referral print entity in order to link it to the supports
            await essContext.SaveChangesAsync();

            foreach (var supportId in printRequest.SupportIds)
            {
                var support = essContext.era_evacueesupports.Where(s => s.statecode == (int)EntityState.Active && s.era_name == supportId).Single();
                essContext.AddLink(newreferralprint, nameof(era_referralprint.era_era_referralprint_era_evacueesupport), support);
            }

            var file = essContext.era_evacuationfiles.Where(f => f.statecode == (int)EntityState.Active && f.era_name == printRequest.FileId).Single();
            essContext.SetLink(newreferralprint, nameof(era_referralprint.era_ESSFileId), file);

            var teamMember = essContext.era_essteamusers.Where(u => u.statecode == (int)EntityState.Active && u.era_essteamuserid == Guid.Parse(printRequest.RequestingUserId)).Single();
            essContext.SetLink(newreferralprint, nameof(era_referralprint.era_RequestingUserId), teamMember);

            await essContext.SaveChangesAsync();

            essContext.DetachAll();

            return newreferralprint.era_referralprintid.ToString();
        }

        public async Task<IEnumerable<ReferralPrintRequest>> QueryReferralPrintRequests(QueryPrintRequests query)
        {
            var requests = (await ((DataServiceQuery<era_referralprint>)essContext.era_referralprints
                .Expand(r => r.era_RequestingUserId)
                .Expand(r => r.era_ESSFileId)
                .Where(r => r.statecode == (int)EntityState.Active && r.era_referralprintid == new Guid(query.ById)))
                .GetAllPagesAsync()).ToArray();

            foreach (var request in requests)
            {
                await essContext.LoadPropertyAsync(request, nameof(era_referralprint.era_era_referralprint_era_evacueesupport));
            }
            essContext.DetachAll();

            return mapper.Map<IEnumerable<ReferralPrintRequest>>(requests);
        }
    }
}
