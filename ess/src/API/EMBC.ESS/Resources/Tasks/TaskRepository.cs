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
using EMBC.ESS.Utilities.Cache;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace EMBC.ESS.Resources.Tasks
{
    public class TaskRepository : ITaskRepository
    {
        private readonly EssContext essContext;
        private readonly IMapper mapper;
        private readonly ICache cache;

        public TaskRepository(IEssContextFactory essContextFactory, IMapper mapper, ICache cache)
        {
            this.essContext = essContextFactory.CreateReadOnly();
            this.mapper = mapper;
            this.cache = cache;
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
            if (queryRequest.ById == null) throw new ArgumentNullException(nameof(queryRequest.ById), "Only task query by id is supported");
            var tasks = await cache.GetOrSet($"tasks:{queryRequest.ById}", async () =>
            {
                return mapper.Map<IEnumerable<EssTask>>(await
                    ((DataServiceQuery<era_task>)essContext.era_tasks
                    .Expand(c => c.era_JurisdictionID)
                    .Where(t => t.era_name == queryRequest.ById))
                    .GetAllPagesAsync());
            }, TimeSpan.FromMinutes(1));

            if (queryRequest.ByStatus.Any()) tasks = tasks.Where(t => queryRequest.ByStatus.Any(s => s == t.Status));

            return new TaskQueryResult { Items = tasks.ToArray() };
        }
    }
}
