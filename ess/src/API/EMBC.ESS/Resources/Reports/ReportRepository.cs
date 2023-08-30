using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace EMBC.ESS.Resources.Reports
{
    public class ReportRepository : IReportRepository
    {
        private readonly EssContext readCtx;
        private readonly IMapper mapper;

        public ReportRepository(IEssContextFactory essContextFactory, IMapper mapper)
        {
            this.readCtx = essContextFactory.CreateReadOnly();
            this.mapper = mapper;
        }

        public async Task<EvacueeQueryResult> QueryEvacuee(ReportQuery query)
        {
            var ct = new CancellationTokenSource().Token;
            var files = (await QueryEvacuationFiles(readCtx, query, ct)).Concat(await QueryTasks(readCtx, query, ct));

            var results = await ParallelLoadEvacueesAsync(readCtx, files, ct);

            return new EvacueeQueryResult
            {
                Items = mapper.Map<IEnumerable<Evacuee>>(results)
            };
        }

        public async Task<SupportQueryResult> QuerySupport(ReportQuery query)
        {
            var ct = new CancellationTokenSource().Token;
            var files = (await QueryEvacuationFiles(readCtx, query, ct)).Concat(await QueryTasks(readCtx, query, ct));

            var results = await ParallelLoadSupportsAsync(readCtx, files, ct);

            return new SupportQueryResult
            {
                Items = mapper.Map<IEnumerable<Support>>(results)
            };
        }

        private static async Task<IEnumerable<era_evacuationfile>> QueryEvacuationFiles(EssContext ctx, ReportQuery query, CancellationToken ct)
        {
            bool getAllFiles = string.IsNullOrEmpty(query.FileId) && string.IsNullOrEmpty(query.TaskNumber) && string.IsNullOrEmpty(query.EvacuatedFrom) && string.IsNullOrEmpty(query.EvacuatedTo);
            var shouldQueryFiles =
                !string.IsNullOrEmpty(query.FileId) ||
                !string.IsNullOrEmpty(query.EvacuatedFrom) ||
                getAllFiles;

            if (!shouldQueryFiles) return Array.Empty<era_evacuationfile>();

            var filesQuery = ctx.era_evacuationfiles.Expand(f => f.era_TaskId).AsQueryable();

            if (!string.IsNullOrEmpty(query.FileId)) filesQuery = filesQuery.Where(f => f.era_name == query.FileId || f.era_paperbasedessfile == query.FileId);
            if (!string.IsNullOrEmpty(query.EvacuatedFrom)) filesQuery = filesQuery.Where(f => f._era_evacuatedfromid_value == Guid.Parse(query.EvacuatedFrom));
            if (query.StartDate.HasValue) filesQuery = filesQuery.Where(f => f.createdon >= query.StartDate.Value);
            if (query.EndDate.HasValue) filesQuery = filesQuery.Where(f => f.createdon <= query.EndDate.Value);

            var files = (await ((DataServiceQuery<era_evacuationfile>)filesQuery).GetAllPagesAsync(ct)).ToArray();
            if (!string.IsNullOrEmpty(query.TaskNumber)) files = files.Where(f => f.era_TaskId != null && f.era_TaskId.era_name.Equals(query.TaskNumber, StringComparison.OrdinalIgnoreCase)).ToArray();
            if (!string.IsNullOrEmpty(query.EvacuatedTo)) files = files.Where(f => f.era_TaskId != null && f.era_TaskId._era_jurisdictionid_value == Guid.Parse(query.EvacuatedTo)).ToArray();

            return files;
        }

        private static async Task<IEnumerable<era_evacuationfile>> QueryTasks(EssContext ctx, ReportQuery query, CancellationToken ct)
        {
            var shouldQueryTasks = string.IsNullOrEmpty(query.FileId) && string.IsNullOrEmpty(query.EvacuatedFrom) && (!string.IsNullOrEmpty(query.TaskNumber) || !string.IsNullOrEmpty(query.EvacuatedTo));

            if (!shouldQueryTasks) return Array.Empty<era_evacuationfile>();

            var taskQuery = ctx.era_tasks
                .Expand(t => t.era_JurisdictionID)
                .AsQueryable();

            if (!string.IsNullOrEmpty(query.TaskNumber)) taskQuery = taskQuery.Where(f => f.era_name == query.TaskNumber);
            if (!string.IsNullOrEmpty(query.EvacuatedTo)) taskQuery = taskQuery.Where(f => f._era_jurisdictionid_value == Guid.Parse(query.EvacuatedTo));

            var tasks = (await ((DataServiceQuery<era_task>)taskQuery).GetAllPagesAsync(ct)).ToArray();

            await Parallel.ForEachAsync(tasks, ct, async (t, ct) =>
            {
                ctx.AttachTo(nameof(EssContext.era_tasks), t);
                await ctx.LoadPropertyAsync(t, nameof(era_task.era_era_task_era_evacuationfileId), ct);

                t.era_era_task_era_evacuationfileId.AsParallel().ForAll(f => f.era_TaskId = t);
            });

            return tasks.SelectMany(t => t.era_era_task_era_evacuationfileId);
        }

        private static async Task<IEnumerable<era_householdmember>> ParallelLoadEvacueesAsync(EssContext ctx, IEnumerable<era_evacuationfile> files, CancellationToken ct)
        {
            //load files' properties
            await Parallel.ForEachAsync(files, ct, async (f, ct) => await ParallelLoadEvacueeAsync(ctx, f, ct));
            return files.SelectMany(f => f.era_era_evacuationfile_era_householdmember_EvacuationFileid);
        }

        private static async Task ParallelLoadEvacueeAsync(EssContext ctx, era_evacuationfile file, CancellationToken ct)
        {
            ctx.AttachTo(nameof(EssContext.era_evacuationfiles), file);

            var loadTasks = new List<Task>();
            loadTasks.Add(ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_era_evacuationfile_era_animal_ESSFileid), ct));
            loadTasks.Add(ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_TaskId), ct));
            loadTasks.Add(ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId), ct));
            loadTasks.Add(ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_EvacuatedFromID), ct));

            if (file.era_CurrentNeedsAssessmentid == null) loadTasks.Add(ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_CurrentNeedsAssessmentid), ct));

            await Task.WhenAll(loadTasks);

            var householdMembers = (await ((DataServiceQuery<era_householdmember>)ctx.era_householdmembers
                .Expand(m => m.era_Registrant)
                .Where(m => m._era_evacuationfileid_value == file.era_evacuationfileid))
                .GetAllPagesAsync(ct))
                .ToArray();

            householdMembers.AsParallel().ForAll(m => m.era_EvacuationFileid = file);
            file.era_era_evacuationfile_era_householdmember_EvacuationFileid = new Collection<era_householdmember>(householdMembers);
            if (file.era_TaskId != null && file.era_TaskId.era_JurisdictionID == null) file.era_TaskId.era_JurisdictionID = ctx.LookupJurisdictionByCode(file.era_TaskId._era_jurisdictionid_value?.ToString());
        }

        private static async Task<IEnumerable<era_evacueesupport>> ParallelLoadSupportsAsync(EssContext ctx, IEnumerable<era_evacuationfile> files, CancellationToken ct)
        {
            //load files' properties
            await Parallel.ForEachAsync(files, ct, async (f, ct) => await ParallelLoadSupportAsync(ctx, f, ct));
            return files.SelectMany(f => f.era_era_evacuationfile_era_evacueesupport_ESSFileId);
        }

        private static async Task ParallelLoadSupportAsync(EssContext ctx, era_evacuationfile file, CancellationToken ct)
        {
            ctx.AttachTo(nameof(EssContext.era_evacuationfiles), file);

            var loadTasks = new List<Task>();
            loadTasks.Add(ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_TaskId), ct));
            loadTasks.Add(ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_EvacuatedFromID), ct));
            if (file.era_CurrentNeedsAssessmentid == null) loadTasks.Add(ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_CurrentNeedsAssessmentid), ct));

            var supports = (await ((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports
                .Expand(s => s.era_SupplierId)
                .Expand(s => s.era_GroupLodgingCityID)
                .Where(s => s._era_evacuationfileid_value == file.era_evacuationfileid))
                .GetAllPagesAsync(ct))
                .ToArray();

            supports.AsParallel().ForAll(s => ctx.AttachTo(nameof(EssContext.era_evacueesupports), s));

            loadTasks.AddRange(supports.Select(s => ctx.LoadPropertyAsync(s, nameof(era_evacueesupport.era_era_householdmember_era_evacueesupport), ct)));

            await Task.WhenAll(loadTasks);

            file.era_era_evacuationfile_era_evacueesupport_ESSFileId = new Collection<era_evacueesupport>(supports.ToArray());
            if (file.era_TaskId != null) file.era_TaskId.era_JurisdictionID = ctx.LookupJurisdictionByCode(file.era_TaskId._era_jurisdictionid_value?.ToString());
            supports.AsParallel().ForAll(s =>
            {
                if (s.era_SupplierId != null) s.era_SupplierId.era_RelatedCity = ctx.LookupJurisdictionByCode(s.era_SupplierId._era_relatedcity_value.ToString());
                s.era_EvacuationFileId = file;
            });
        }
    }
}
