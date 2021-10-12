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
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using EMBC.ESS.Utilities.Extensions;
using Microsoft.OData.Client;

namespace EMBC.ESS.Resources.Reports
{
    public class ReportRepository : IReportRepository
    {
        private readonly EssContext essContext;
        private readonly IMapper mapper;

        public ReportRepository(EssContext essContext, IMapper mapper)
        {
            this.essContext = essContext;
            this.mapper = mapper;
        }

        public async Task<EvacueeQueryResult> QueryEvacuee(EvacueeQuery query)
        {
            var readCtx = essContext.Clone();
            readCtx.MergeOption = MergeOption.NoTracking;

            var evacuees = (await QueryEvacuationFiles(readCtx, query)).Concat(await QueryTasks(readCtx, query));

            //var results = (await ParallelLoadEvacueesAsync(essContext, evacuees)).Select(e => mapper.Map<Evacuee>(e)).ToArray();
            var results = (await LoadEvacuees(essContext, evacuees)).Select(e => mapper.Map<Evacuee>(e)).ToArray();

            return new EvacueeQueryResult
            {
                Items = results
            };
        }

        private static async Task<IEnumerable<era_householdmember>> QueryEvacuationFiles(EssContext ctx, EvacueeQuery query)
        {
            bool getAllFiles = string.IsNullOrEmpty(query.FileId) && string.IsNullOrEmpty(query.TaskNumber) && string.IsNullOrEmpty(query.EvacuatedFrom) && string.IsNullOrEmpty(query.EvacuatedTo);
            var shouldQueryFiles =
                !string.IsNullOrEmpty(query.FileId) ||
                !string.IsNullOrEmpty(query.EvacuatedFrom) ||
                getAllFiles;

            if (!shouldQueryFiles) return Array.Empty<era_householdmember>();

            var filesQuery = ctx.era_evacuationfiles.Expand(f => f.era_TaskId).Where(f => f.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(query.FileId)) filesQuery = filesQuery.Where(f => f.era_name == query.FileId);
            if (!string.IsNullOrEmpty(query.EvacuatedFrom)) filesQuery = filesQuery.Where(f => f._era_evacuatedfromid_value == Guid.Parse(query.EvacuatedFrom));

            var files = (await ((DataServiceQuery<era_evacuationfile>)filesQuery).GetAllPagesAsync()).ToArray();
            if (!string.IsNullOrEmpty(query.TaskNumber)) files = files.Where(f => f.era_TaskId.era_name == query.TaskNumber).ToArray();
            if (!string.IsNullOrEmpty(query.EvacuatedTo)) files = files.Where(f => f.era_TaskId._era_jurisdictionid_value == Guid.Parse(query.EvacuatedTo)).ToArray();

            var ret = new List<era_householdmember>();

            foreach (var file in files)
            {
                ctx.AttachTo(nameof(EssContext.era_evacuationfiles), file);
                var currentMembers = ctx.LoadProperty(file, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid));

                ret = ret.Concat((IEnumerable<era_householdmember>)currentMembers).ToList();
            }

            return ret;
        }

        private static async Task<IEnumerable<era_householdmember>> QueryTasks(EssContext ctx, EvacueeQuery query)
        {
            var shouldQueryTasks = string.IsNullOrEmpty(query.FileId) && string.IsNullOrEmpty(query.EvacuatedFrom) && (!string.IsNullOrEmpty(query.TaskNumber) || !string.IsNullOrEmpty(query.EvacuatedTo));

            if (!shouldQueryTasks) return Array.Empty<era_householdmember>();

            var taskQuery = ctx.era_tasks
                        .Where(n => n.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(query.TaskNumber)) taskQuery = taskQuery.Where(f => f.era_name == query.TaskNumber);
            if (!string.IsNullOrEmpty(query.EvacuatedTo)) taskQuery = taskQuery.Where(f => f._era_jurisdictionid_value == Guid.Parse(query.EvacuatedTo));

            var tasks = (await ((DataServiceQuery<era_task>)taskQuery).GetAllPagesAsync()).ToArray();
            var files = new List<era_evacuationfile>();
            foreach (var task in tasks)
            {
                ctx.AttachTo(nameof(EssContext.era_tasks), task);
                var currentFiles = ctx.LoadProperty(task, nameof(era_task.era_era_task_era_evacuationfileId));
                foreach (var file in currentFiles)
                {
                    files.Add((era_evacuationfile)file);
                }
            }

            var ret = new List<era_householdmember>();

            foreach (var file in files)
            {
                ctx.AttachTo(nameof(EssContext.era_evacuationfiles), file);
                var currentMembers = ctx.LoadProperty(file, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid));

                ret = ret.Concat((IEnumerable<era_householdmember>)currentMembers).ToList();
            }

            return ret;
        }

        private static async Task<IEnumerable<era_householdmember>> LoadEvacuees(EssContext ctx, IEnumerable<era_householdmember> members)
        {
            foreach (var member in members)
            {
                ctx.AttachTo(nameof(EssContext.era_householdmembers), member);
                await ctx.LoadPropertyAsync(member, nameof(era_householdmember.era_Registrant));
                var registrant = member.era_Registrant;
                if (registrant != null)
                {
                    TryAttach(ctx, nameof(EssContext.contacts), registrant);
                    await ctx.LoadPropertyAsync(registrant, nameof(contact.era_City));
                    await ctx.LoadPropertyAsync(registrant, nameof(contact.era_ProvinceState));
                    await ctx.LoadPropertyAsync(registrant, nameof(contact.era_Country));
                    await ctx.LoadPropertyAsync(registrant, nameof(contact.era_MailingCity));
                    await ctx.LoadPropertyAsync(registrant, nameof(contact.era_MailingProvinceState));
                    await ctx.LoadPropertyAsync(registrant, nameof(contact.era_MailingCountry));
                    //ctx.Detach(registrant);
                }

                await ctx.LoadPropertyAsync(member, nameof(era_householdmember.era_EvacuationFileid));
                var file = member.era_EvacuationFileid;
                if (file != null)
                {
                    TryAttach(ctx, nameof(EssContext.era_evacuationfiles), file);
                    await ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_TaskId));
                    await ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_CurrentNeedsAssessmentid));
                    await ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_era_evacuationfile_era_animal_ESSFileid));
                    await ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId));
                    //ctx.Detach(file);
                }
            }

            return members.ToArray();
        }

        private static async Task<IEnumerable<era_householdmember>> ParallelLoadEvacueesAsync(EssContext ctx, IEnumerable<era_householdmember> members)
        {
            var readCtx = ctx.Clone();
            readCtx.MergeOption = MergeOption.NoTracking;

            //load evacuee' properties
            await members.Select(member => ParallelLoadEvacueeAsync(readCtx, member)).ToArray().ForEachAsync(10, t => t);

            return members.ToArray();
        }

        private static async Task ParallelLoadEvacueeAsync(EssContext ctx, era_householdmember member)
        {
            ctx.AttachTo(nameof(EssContext.era_householdmembers), member);

            var loadTasks = new List<Task>();
            loadTasks.Add(Task.Run(async () =>
            {
                await ctx.LoadPropertyAsync(member, nameof(era_householdmember.era_Registrant));
                var registrant = member.era_Registrant;
                if (registrant != null)
                {
                    TryAttach(ctx, nameof(EssContext.contacts), registrant);
                    await ctx.LoadPropertyAsync(registrant, nameof(contact.era_City));
                    await ctx.LoadPropertyAsync(registrant, nameof(contact.era_ProvinceState));
                    await ctx.LoadPropertyAsync(registrant, nameof(contact.era_Country));
                    await ctx.LoadPropertyAsync(registrant, nameof(contact.era_MailingCity));
                    await ctx.LoadPropertyAsync(registrant, nameof(contact.era_MailingProvinceState));
                    await ctx.LoadPropertyAsync(registrant, nameof(contact.era_MailingCountry));
                }
            }));
            loadTasks.Add(Task.Run(async () =>
            {
                await ctx.LoadPropertyAsync(member, nameof(era_householdmember.era_EvacuationFileid));
                var file = member.era_EvacuationFileid;
                if (file != null)
                {
                    TryAttach(ctx, nameof(EssContext.era_evacuationfiles), file);
                    await ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_TaskId));
                    await ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_CurrentNeedsAssessmentid));
                    await ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_era_evacuationfile_era_animal_ESSFileid));
                    await ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId));
                }
            }));

            await Task.WhenAll(loadTasks.ToArray());
        }

        private static void TryAttach(EssContext ctx, string entityName, object obj)
        {
            try
            {
                ctx.AttachTo(entityName, obj);
            }
            catch
            {
                return;
            }
        }
    }
}
