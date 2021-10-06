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
using EMBC.ESS.Shared.Contracts.Reports;

namespace EMBC.ESS.Managers.Reports
{
    public class ReportsManager
    {
        private readonly IMapper mapper;
        private readonly ICaseRepository caseRepository;

        public ReportsManager(
            IMapper mapper,
            ICaseRepository caseRepository)
        {
            this.mapper = mapper;
            this.caseRepository = caseRepository;
        }

        public async Task<EvacueeReportQueryResult> Handle(EvacueeReportQuery query)
        {
            bool getAllFiles = string.IsNullOrEmpty(query.FileId) && string.IsNullOrEmpty(query.TaskNumber) && string.IsNullOrEmpty(query.EvacuatedFrom) && string.IsNullOrEmpty(query.EvacuatedTo);
            var cases = (await caseRepository.QueryCase(new Resources.Cases.EvacuationFilesQuery
            {
                FileId = query.FileId,
                TaskNumber = query.TaskNumber,
                EvacuatedFrom = query.EvacuatedFrom,
                EvacuatedTo = query.EvacuatedTo,
                GetAllFiles = getAllFiles
            })).Items.Cast<Resources.Cases.EvacuationFile>();

            var files = mapper.Map<IEnumerable<Shared.Contracts.Submissions.EvacuationFile>>(cases);

            //initialize csv with query parameter info and Headers

            //foreach (var file in files)
            //{
            //    foreach (var member in file.HouseholdMembers)
            //    {
            //        //add line to csv - enforce personal info rule
            //    }
            //}

            //return csv
            return new EvacueeReportQueryResult { EvacueeReport = "test" };
        }
    }
}
