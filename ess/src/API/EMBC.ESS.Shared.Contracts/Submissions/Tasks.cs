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
using System.Text;

namespace EMBC.ESS.Shared.Contracts.Submissions
{
    public class TasksSearchQuery : Query<TasksSearchQueryResult>
    {
        public string TaskId { get; set; }
    }

    public class TasksSearchQueryResult
    {
        public IEnumerable<IncidentTask> Items { get; set; }
    }

    public class IncidentTask
    {
        public string Id { get; set; } //task number
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string CommunityCode { get; set; }
        public string Description { get; set; }
        public IncidentTaskStatus Status { get; set; }
    }

    public enum IncidentTaskStatus
    {
        Active,
        Expired
    }
}
