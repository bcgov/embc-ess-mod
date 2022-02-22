﻿// -------------------------------------------------------------------------
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
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Tasks
{
    public interface ITaskRepository
    {
        Task<TaskQueryResult> QueryTask(TaskQuery query);
    }

    public class TaskQuery
    {
        public string ById { get; set; }
        public IEnumerable<TaskStatus> ByStatus { get; set; } = Array.Empty<TaskStatus>();
    }

    public class TaskQueryResult
    {
        public IEnumerable<Task> Items { get; set; }
    }

    public abstract class Task
    {
        public string Id { get; set; }
        public TaskStatus Status { get; set; }
    }

#pragma warning disable CA1008 // Enums should have zero value

    public enum TaskStatus
    {
        Active = 1,
        Expired = 2
    }

#pragma warning restore CA1008 // Enums should have zero value

    public class EssTask : Task
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string CommunityCode { get; set; }
        public string Description { get; set; }
    }
}
