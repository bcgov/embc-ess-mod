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

namespace EMBC.ESS.Resources.Tasks
{
    public class TaskRepository : ITaskRepository
    {
        private readonly EssContext essContext;
        private readonly IMapper mapper;

        public TaskRepository(EssContext essContext, IMapper mapper)
        {
            this.essContext = essContext;
            this.mapper = mapper;
        }

        public async Task<TaskQueryResult> QueryTask(TaskQuery query)
        {
            return query.GetType().Name switch
            {
                nameof(TaskQuery) => await HandleQuery(query),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        private async Task<TaskQueryResult> HandleQuery(TaskQuery queryRequest)
        {
            if (string.IsNullOrEmpty(queryRequest.ById)) throw new ArgumentNullException($"only query a specific task is currently allowed", nameof(TaskQuery.ById));
            IQueryable<era_task> taskQuery = essContext.era_tasks
                .Expand(c => c.era_JurisdictionID);

            if (!string.IsNullOrEmpty(queryRequest.ById)) taskQuery = taskQuery.Where(t => t.era_name == queryRequest.ById);

            var esstask = await ((DataServiceQuery<era_task>)taskQuery).GetAllPagesAsync();

            essContext.DetachAll();

            var items = mapper.Map<IEnumerable<EssTask>>(esstask);
            return new TaskQueryResult { Items = items };
        }
    }
}
