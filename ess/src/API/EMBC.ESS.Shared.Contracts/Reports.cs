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

namespace EMBC.ESS.Shared.Contracts.Reports
{
    public class EvacueeReportQuery : Query<EvacueeReportQueryResult>
    {
        public string TaskNumber { get; set; }
        public string FileId { get; set; }
        public string EvacuatedFrom { get; set; }
        public string EvacuatedTo { get; set; }
        public bool IncludePersonalInfo { get; set; }
    }

    public class EvacueeReportQueryResult
    {
        public string EvacueeReport { get; set; }
    }
}
