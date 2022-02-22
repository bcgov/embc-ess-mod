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

using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Resources.Reports;
using EMBC.ESS.Shared.Contracts.Reports;
using EMBC.Utilities.Csv;

namespace EMBC.ESS.Managers.Reports
{
    public class ReportsManager
    {
        private readonly IMapper mapper;
        private readonly IReportRepository reportRepository;
        private readonly IMetadataRepository metadataRepository;

        public ReportsManager(
            IMapper mapper,
            IReportRepository reportRepository,
            IMetadataRepository metadataRepository)
        {
            this.mapper = mapper;
            this.reportRepository = reportRepository;
            this.metadataRepository = metadataRepository;
        }

        public async Task<ReportQueryResult> Handle(EvacueeReportQuery query)
        {
            var evacueeQuery = new ReportQuery
            {
                FileId = query.FileId,
                TaskNumber = query.TaskNumber,
                EvacuatedFrom = query.EvacuatedFrom,
                EvacuatedTo = query.EvacuatedTo,
            };

            var results = (await reportRepository.QueryEvacuee(evacueeQuery)).Items;
            var evacuees = mapper.Map<IEnumerable<Evacuee>>(results, opt => opt.Items["IncludePersonalInfo"] = query.IncludePersonalInfo.ToString());

            var communities = await metadataRepository.GetCommunities();
            evacueeQuery.EvacuatedFrom = communities.Where(c => c.Code == evacueeQuery.EvacuatedFrom).SingleOrDefault()?.Name;
            evacueeQuery.EvacuatedTo = communities.Where(c => c.Code == evacueeQuery.EvacuatedTo).SingleOrDefault()?.Name;

            var csv = evacuees.ToCSV(evacueeQuery);

            var content = Encoding.UTF8.GetBytes(csv);
            var contentType = "text/csv";

            return new ReportQueryResult
            {
                Content = content,
                ContentType = contentType
            };
        }

        public async Task<ReportQueryResult> Handle(SupportReportQuery query)
        {
            var supportQuery = new ReportQuery
            {
                FileId = query.FileId,
                TaskNumber = query.TaskNumber,
                EvacuatedFrom = query.EvacuatedFrom,
                EvacuatedTo = query.EvacuatedTo,
            };

            var supports = (await reportRepository.QuerySupport(supportQuery)).Items;

            var communities = await metadataRepository.GetCommunities();
            supportQuery.EvacuatedFrom = communities.Where(c => c.Code == supportQuery.EvacuatedFrom).SingleOrDefault()?.Name;
            supportQuery.EvacuatedTo = communities.Where(c => c.Code == supportQuery.EvacuatedTo).SingleOrDefault()?.Name;

            var csv = supports.ToCSV(supportQuery, "\"");

            var content = Encoding.UTF8.GetBytes(csv);
            var contentType = "text/csv";

            return new ReportQueryResult
            {
                Content = content,
                ContentType = contentType
            };
        }
    }
}
