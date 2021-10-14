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
using EMBC.ESS.Resources.Cases;
using EMBC.ESS.Resources.Reports;
using EMBC.ESS.Shared.Contracts.Reports;
using EMBC.ESS.Utilities.CsvConverter;

namespace EMBC.ESS.Managers.Reports
{
    public class ReportsManager
    {
        private readonly IMapper mapper;
        private readonly IReportRepository reportRepository;

        public ReportsManager(
            IMapper mapper,
            IReportRepository reportRepository)
        {
            this.mapper = mapper;
            this.reportRepository = reportRepository;
        }

        public async Task<EvacueeReportQueryResult> Handle(EvacueeReportQuery query)
        {
            var evacueeQuery = new EvacueeQuery
            {
                FileId = query.FileId,
                TaskNumber = query.TaskNumber,
                EvacuatedFrom = query.EvacuatedFrom,
                EvacuatedTo = query.EvacuatedTo,
            };

            var evacuees = (await reportRepository.QueryEvacuee(evacueeQuery)).Items;

            var csv = evacuees.ToCSV(evacueeQuery);
            return new EvacueeReportQueryResult { EvacueeReport = csv };
        }
    }
}
