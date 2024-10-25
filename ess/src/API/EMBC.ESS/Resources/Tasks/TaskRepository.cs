using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
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

        public async Task<TaskQueryResult> QueryTask(TaskQuery query, CancellationToken ct = default)
        {
            return query.GetType().Name switch
            {
                nameof(TaskQuery) => await HandleQuery(query, ct),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        private async Task<TaskQueryResult> HandleQuery(TaskQuery queryRequest, CancellationToken ct)
        {
            if (queryRequest.ById == null) throw new ArgumentNullException(nameof(queryRequest.ById), "Only task query by id is supported");
            var tasks = await cache.GetOrSet($"tasks:{queryRequest.ById}", async () =>
            {
                var tasks = mapper.Map<IEnumerable<EssTask>>(await QueryTasks(queryRequest, ct));
                var autoApproveEnabled = await AutoApprovalEnabled();
                foreach (var task in tasks) task.AutoApprovedEnabled = autoApproveEnabled;
                return tasks;
            }, TimeSpan.FromSeconds(30));

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

        private async Task<IEnumerable<era_task>> QueryTasks(TaskQuery query, CancellationToken ct)
        {
            var tasks = (await
                   essContext.era_tasks
                   .Expand(t => t.era_JurisdictionID)
                   .Expand(t => t.era_era_task_era_selfservesupportlimits_Task)
                   .Expand(t => t.era_era_task_era_supportlimit_Task)
                   .Where(t => t.era_name == query.ById)
                   .GetAllPagesAsync(ct)).ToList();

            await Parallel.ForEachAsync(tasks, ct, async (t, ct1) =>
            {
                var selfServeSupports = (await essContext.era_selfservesupportlimitses.Expand(sl => sl.era_SupportType).Where(sl => sl._era_task_value == t.era_taskid).GetAllPagesAsync(ct1)).ToList();
                t.era_era_task_era_selfservesupportlimits_Task = new System.Collections.ObjectModel.Collection<era_selfservesupportlimits>(selfServeSupports);

                var supportLimits = (await essContext.era_supportlimits.Expand(sl => sl.era_SupportType).Where(sl => sl._era_task_value == t.era_taskid).GetAllPagesAsync(ct1)).ToList();
                t.era_era_task_era_supportlimit_Task = new System.Collections.ObjectModel.Collection<era_supportlimit>(supportLimits);
            });

            return tasks;
        }
    }
}
