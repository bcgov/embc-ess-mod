using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.Utilities.Caching;

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
                var tasks = mapper.Map<IEnumerable<EssTask>>(await
                    essContext.era_tasks
                    .Expand(c => c.era_JurisdictionID)
                    .Where(t => t.era_name == queryRequest.ById)
                    .GetAllPagesAsync());
                var autoApproveEnabled = await AutoApprovalEnabled();
                foreach (var task in tasks)
                {
                    task.AutoApprovedEnabled = autoApproveEnabled;
                }
                return tasks;
            }, TimeSpan.FromMinutes(1));

            if (queryRequest.ByStatus.Any()) tasks = tasks.Where(t => queryRequest.ByStatus.Any(s => s == t.Status));

            return new TaskQueryResult { Items = tasks.ToArray() };
        }

        private async Task<bool> AutoApprovalEnabled()
        {
            var configValue = await essContext.era_systemconfigs
                    .Where(sc => sc.era_group == "Auto Approval" && sc.era_systemconfigid == Guid.Parse("3f626da4-73f2-ec11-b833-00505683fbf4"))
                    .SingleOrDefaultAsync();

            return configValue != null
                && !string.IsNullOrEmpty(configValue.era_value)
                && configValue.era_value.Equals("Yes", StringComparison.OrdinalIgnoreCase);
        }
    }
}
