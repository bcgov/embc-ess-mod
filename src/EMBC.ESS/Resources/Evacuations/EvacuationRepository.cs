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
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using EMBC.ESS.Utilities.Extensions;
using EMBC.Utilities;
using Microsoft.OData.Client;

namespace EMBC.ESS.Resources.Evacuations
{
    public class EvacuationRepository : IEvacuationRepository
    {
        private readonly EssContext essContext;
        private readonly IEssContextFactory essContextFactory;
        private readonly IMapper mapper;

        public EvacuationRepository(IEssContextFactory essContextFactory, IMapper mapper)
        {
            essContext = essContextFactory.Create();
            this.essContextFactory = essContextFactory;
            this.mapper = mapper;
        }

        public async Task<ManageEvacuationFileCommandResult> Manage(ManageEvacuationFileCommand cmd)
        {
            return cmd switch
            {
                SubmitEvacuationFileNeedsAssessment c => await HandleSubmitEvacuationFileNeedsAssessment(c),
                LinkEvacuationFileRegistrant c => await HandleLinkEvacuationFileRegistrant(c),
                SaveEvacuationFileNote c => await HandleSaveEvacuationFileNote(c),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<EvacuationFileQueryResult> Query(EvacuationFilesQuery query)
        {
            return query switch
            {
                EvacuationFilesQuery q => await HandleQueryEvacuationFile(q),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        private async Task<EvacuationFileQueryResult> HandleQueryEvacuationFile(EvacuationFilesQuery query)
        {
            var result = new EvacuationFileQueryResult();

            result.Items = await Read(query);

            return result;
        }

        private async Task<ManageEvacuationFileCommandResult> HandleSubmitEvacuationFileNeedsAssessment(SubmitEvacuationFileNeedsAssessment cmd)
        {
            if (string.IsNullOrEmpty(cmd.EvacuationFile.Id))
            {
                return new ManageEvacuationFileCommandResult { Id = await Create(cmd.EvacuationFile) };
            }
            else
            {
                return new ManageEvacuationFileCommandResult { Id = await Update(cmd.EvacuationFile) };
            }
        }

        private async Task<ManageEvacuationFileCommandResult> HandleLinkEvacuationFileRegistrant(LinkEvacuationFileRegistrant cmd)
        {
            return new ManageEvacuationFileCommandResult { Id = await LinkRegistrant(cmd.FileId, cmd.RegistrantId, cmd.HouseholdMemberId) };
        }

        private async Task<ManageEvacuationFileCommandResult> HandleSaveEvacuationFileNote(SaveEvacuationFileNote cmd)
        {
            if (string.IsNullOrEmpty(cmd.Note.Id))
            {
                return new ManageEvacuationFileCommandResult { Id = await CreateNote(cmd.FileId, cmd.Note) };
            }
            else
            {
                return new ManageEvacuationFileCommandResult { Id = await UpdateNote(cmd.FileId, cmd.Note) };
            }
        }

        public async Task<string> Create(EvacuationFile evacuationFile)
        {
            VerifyEvacuationFileInvariants(evacuationFile);

            var primaryContact = essContext.contacts.Where(c => c.statecode == (int)EntityState.Active && c.contactid == Guid.Parse(evacuationFile.PrimaryRegistrantId)).SingleOrDefault();
            if (primaryContact == null) throw new ArgumentException($"Primary registrant {evacuationFile.PrimaryRegistrantId} not found");

            var file = mapper.Map<era_evacuationfile>(evacuationFile);
            file.era_evacuationfileid = Guid.NewGuid();

            essContext.AddToera_evacuationfiles(file);
            essContext.SetLink(file, nameof(era_evacuationfile.era_EvacuatedFromID), essContext.LookupJurisdictionByCode(file._era_evacuatedfromid_value?.ToString()));
            AssignPrimaryRegistrant(file, primaryContact);
            AssignToTask(file, evacuationFile.TaskId);
            AddPets(file);

            AddNeedsAssessment(file, file.era_CurrentNeedsAssessmentid);

            await essContext.SaveChangesAsync();

            essContext.Detach(file);

            //get the autogenerated evacuation file number
            var essFileNumber = essContext.era_evacuationfiles.Where(f => f.era_evacuationfileid == file.era_evacuationfileid).Select(f => f.era_name).Single();

            essContext.DetachAll();

            return essFileNumber;
        }

        public async Task<string> Update(EvacuationFile evacuationFile)
        {
            var currentFile = essContext.era_evacuationfiles
                .Where(f => f.era_name == evacuationFile.Id).SingleOrDefault();
            if (currentFile == null) throw new ArgumentException($"Evacuation file {evacuationFile.Id} not found");

            await essContext.LoadPropertyAsync(currentFile, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid));
            await essContext.LoadPropertyAsync(currentFile, nameof(era_evacuationfile.era_era_evacuationfile_era_animal_ESSFileid));
            VerifyEvacuationFileInvariants(evacuationFile, currentFile);

            essContext.DetachAll();
            RemovePets(currentFile);

            var primaryContact = essContext.contacts.Where(c => c.statecode == (int)EntityState.Active && c.contactid == Guid.Parse(evacuationFile.PrimaryRegistrantId)).SingleOrDefault();
            if (primaryContact == null) throw new ArgumentException($"Primary registrant {evacuationFile.PrimaryRegistrantId} not found");

            var file = mapper.Map<era_evacuationfile>(evacuationFile);
            file.era_evacuationfileid = currentFile.era_evacuationfileid;

            essContext.AttachTo(nameof(essContext.era_evacuationfiles), file);
            essContext.SetLink(file, nameof(era_evacuationfile.era_EvacuatedFromID), essContext.LookupJurisdictionByCode(file._era_evacuatedfromid_value?.ToString()));

            essContext.UpdateObject(file);
            AssignPrimaryRegistrant(file, primaryContact);
            AssignToTask(file, evacuationFile.TaskId);
            AddPets(file);

            AddNeedsAssessment(file, file.era_CurrentNeedsAssessmentid);

            await essContext.SaveChangesAsync();

            essContext.DetachAll();

            return file.era_name;
        }

        private void AddNeedsAssessment(era_evacuationfile file, era_needassessment needsAssessment)
        {
            essContext.AddToera_needassessments(needsAssessment);
            essContext.SetLink(file, nameof(era_evacuationfile.era_CurrentNeedsAssessmentid), needsAssessment);
            essContext.AddLink(file, nameof(era_evacuationfile.era_needsassessment_EvacuationFile), needsAssessment);
            essContext.SetLink(needsAssessment, nameof(era_needassessment.era_EvacuationFile), file);
            essContext.SetLink(needsAssessment, nameof(era_needassessment.era_Jurisdictionid), essContext.LookupJurisdictionByCode(needsAssessment._era_jurisdictionid_value?.ToString()));
            if (needsAssessment._era_reviewedbyid_value.HasValue)
            {
                var teamMember = essContext.era_essteamusers.ByKey(needsAssessment._era_reviewedbyid_value).GetValue();
                essContext.SetLink(needsAssessment, nameof(era_needassessment.era_ReviewedByid), teamMember);
                essContext.AddLink(teamMember, nameof(era_essteamuser.era_era_essteamuser_era_needassessment_ReviewedByid), needsAssessment);
            }

            foreach (var member in needsAssessment.era_era_householdmember_era_needassessment)
            {
                if (member.era_householdmemberid.HasValue)
                {
                    //update member
                    essContext.AttachTo(nameof(essContext.era_householdmembers), member);
                    essContext.UpdateObject(member);
                }
                else
                {
                    //create member
                    member.era_householdmemberid = Guid.NewGuid();
                    essContext.AddToera_householdmembers(member);
                }
                AssignHouseholdMember(file, member);
                AssignHouseholdMember(needsAssessment, member);
            }
        }

        private void AssignPrimaryRegistrant(era_evacuationfile file, contact primaryContact)
        {
            essContext.AddLink(primaryContact, nameof(primaryContact.era_evacuationfile_Registrant), file);
            essContext.SetLink(file, nameof(era_evacuationfile.era_Registrant), primaryContact);
        }

        private void AssignToTask(era_evacuationfile file, string taskId)
        {
            if (string.IsNullOrEmpty(taskId)) return;
            var task = essContext.era_tasks.Where(t => t.era_name == taskId).SingleOrDefault();
            if (task == null) throw new ArgumentException($"Task {taskId} not found");
            essContext.AddLink(task, nameof(era_task.era_era_task_era_evacuationfileId), file);
        }

        private void AssignHouseholdMember(era_evacuationfile file, era_householdmember member)
        {
            if (member._era_registrant_value != null)
            {
                var registrant = essContext.contacts.Where(c => c.contactid == member._era_registrant_value).SingleOrDefault();
                if (registrant == null) throw new ArgumentException($"Household member has registrant id {member._era_registrant_value} which was not found");
                essContext.AddLink(registrant, nameof(contact.era_contact_era_householdmember_Registrantid), member);
            }
            essContext.AddLink(file, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid), member);
            essContext.SetLink(member, nameof(era_householdmember.era_EvacuationFileid), file);
        }

        private void AssignHouseholdMember(era_needassessment needsAssessment, era_householdmember member)
        {
            essContext.AddLink(member, nameof(era_householdmember.era_era_householdmember_era_needassessment), needsAssessment);
            //essContext.AddLink(needsAssessment, nameof(era_needassessment.era_era_householdmember_era_needassessment), member);
        }

        private void AddPets(era_evacuationfile file)
        {
            foreach (var pet in file.era_era_evacuationfile_era_animal_ESSFileid)
            {
                essContext.AddToera_animals(pet);
                essContext.AddLink(file, nameof(era_evacuationfile.era_era_evacuationfile_era_animal_ESSFileid), pet);
                essContext.SetLink(pet, nameof(era_animal.era_ESSFileid), file);
            }
        }

        private void RemovePets(era_evacuationfile file)
        {
            foreach (var pet in file.era_era_evacuationfile_era_animal_ESSFileid)
            {
                essContext.AttachTo(nameof(essContext.era_animals), pet);
                essContext.DeleteObject(pet);
            }
        }

        private void VerifyEvacuationFileInvariants(EvacuationFile evacuationFile, era_evacuationfile currentFile = null)
        {
            //Check invariants
            if (string.IsNullOrEmpty(evacuationFile.PrimaryRegistrantId))
            {
                throw new ArgumentNullException($"The file has no associated primary registrant");
            }
            if (evacuationFile.NeedsAssessment == null)
            {
                throw new ArgumentNullException($"File {evacuationFile.Id} must have a needs assessment");
            }

            if (evacuationFile.Id == null)
            {
                if (evacuationFile.NeedsAssessment.HouseholdMembers.Count(m => m.IsPrimaryRegistrant) != 1)
                {
                    throw new InvalidOperationException($"File {evacuationFile.Id} must have a single primary registrant household member");
                }
            }
            else
            {
                if (evacuationFile.NeedsAssessment.HouseholdMembers.Count(m => m.IsPrimaryRegistrant) > 1)
                {
                    throw new InvalidOperationException($"File {evacuationFile.Id} can not have multiple primary registrant household members");
                }

                if (currentFile != null && currentFile.era_era_evacuationfile_era_householdmember_EvacuationFileid != null &&
                    currentFile.era_era_evacuationfile_era_householdmember_EvacuationFileid.Any(m => m.era_isprimaryregistrant == true) &&
                    evacuationFile.NeedsAssessment.HouseholdMembers.Any(m => m.IsPrimaryRegistrant && string.IsNullOrEmpty(m.Id)))
                {
                    throw new InvalidOperationException($"File {evacuationFile.Id} can not have multiple primary registrant household members");
                }
            }
        }

        public async Task<string> LinkRegistrant(string fileId, string registrantId, string householdMemberId)
        {
            var member = essContext.era_householdmembers.Where(m => m.era_householdmemberid == Guid.Parse(householdMemberId)).SingleOrDefault();
            if (member == null) throw new ArgumentException($"Household member with id {householdMemberId} not found");
            var registrant = essContext.contacts.Where(c => c.contactid == Guid.Parse(registrantId)).SingleOrDefault();
            if (registrant == null) throw new ArgumentException($"Registrant with id {registrantId} not found");

            essContext.AddLink(registrant, nameof(contact.era_contact_era_householdmember_Registrantid), member);
            await essContext.SaveChangesAsync();

            return fileId;
        }

        private EvacuationFile MapEvacuationFile(era_evacuationfile file, bool maskSecurityPhrase = true) =>
            mapper.Map<EvacuationFile>(file, opt => opt.Items["MaskSecurityPhrase"] = maskSecurityPhrase.ToString());

        private static async Task ParallelLoadEvacuationFileAsync(EssContext ctx, era_evacuationfile file)
        {
            ctx.AttachTo(nameof(EssContext.era_evacuationfiles), file);

            var loadTasks = new List<Task>();
            loadTasks.Add(ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_era_evacuationfile_era_animal_ESSFileid)));
            loadTasks.Add(ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_era_evacuationfile_era_essfilenote_ESSFileID)));
            loadTasks.Add(ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_TaskId)));

            loadTasks.Add(ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_era_evacuationfile_era_evacueesupport_ESSFileId)));

            loadTasks.Add(Task.Run(async () =>
            {
                await ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid));
                if (file.era_CurrentNeedsAssessmentid == null)
                    await ctx.LoadPropertyAsync(file, nameof(era_evacuationfile.era_CurrentNeedsAssessmentid));

                ctx.AttachTo(nameof(EssContext.era_needassessments), file.era_CurrentNeedsAssessmentid);
                await ctx.LoadPropertyAsync(file.era_CurrentNeedsAssessmentid, nameof(era_needassessment.era_era_householdmember_era_needassessment));

                foreach (var member in file.era_era_evacuationfile_era_householdmember_EvacuationFileid)
                {
                    if (member._era_registrant_value.HasValue)
                    {
                        ctx.AttachTo(nameof(EssContext.era_householdmembers), member);
                        await ctx.LoadPropertyAsync(member, nameof(era_householdmember.era_Registrant));
                        ctx.Detach(member);
                    }
                }

                foreach (var member in file.era_CurrentNeedsAssessmentid.era_era_householdmember_era_needassessment)
                {
                    if (member._era_registrant_value.HasValue)
                    {
                        ctx.AttachTo(nameof(EssContext.era_householdmembers), member);
                        await ctx.LoadPropertyAsync(member, nameof(era_householdmember.era_Registrant));
                        ctx.Detach(member);
                    }
                }
            }));
            await Task.WhenAll(loadTasks.ToArray());
        }

        private static async Task LoadEvacuationFile(EssContext ctx, era_evacuationfile file)
        {
            var queries = new List<DataServiceQuery>();
            queries.Add((DataServiceQuery<era_animal>)ctx.era_animals.Where(a => a._era_essfileid_value == file.era_evacuationfileid));
            queries.Add((DataServiceQuery<era_essfilenote>)ctx.era_essfilenotes.Where(a => a._era_essfileid_value == file.era_evacuationfileid));
            queries.Add((DataServiceQuery<era_task>)ctx.era_tasks.Where(a => a.era_taskid == file._era_taskid_value));
            queries.Add((DataServiceQuery<era_evacueesupport>)ctx.era_evacueesupports.Where(a => a._era_evacuationfileid_value == file.era_evacuationfileid));
            queries.Add((DataServiceQuery<era_householdmember>)ctx.era_householdmembers.Expand(h => h.era_Registrant).Where(a => a._era_evacuationfileid_value == file.era_evacuationfileid));
            if (file.era_CurrentNeedsAssessmentid == null)
            {
                //query needs assessment if not already loaded
                queries.Add((DataServiceQuery<era_needassessment>)ctx.era_needassessments.Where(a => a.era_needassessmentid == file._era_currentneedsassessmentid_value));
            }

            var batchResult = await ctx.ExecuteBatchAsync(SaveChangesOptions.BatchWithIndependentOperations, queries.ToArray());

            if (batchResult.BatchStatusCode != (int)HttpStatusCode.OK)
            {
                throw new InvalidOperationException($"Evacuation file {file.era_name} failed to load with http status code {batchResult.BatchStatusCode}");
            }

            var queryResults = batchResult.ToArray();
            file.era_era_evacuationfile_era_animal_ESSFileid = new Collection<era_animal>((queryResults
                .First(r => r is QueryOperationResponse<era_animal>) as QueryOperationResponse<era_animal>).ToList());
            file.era_era_evacuationfile_era_essfilenote_ESSFileID = new Collection<era_essfilenote>((queryResults
                .First(r => r is QueryOperationResponse<era_essfilenote>) as QueryOperationResponse<era_essfilenote>).ToList());
            file.era_TaskId = (queryResults.First(r => r is QueryOperationResponse<era_task>) as QueryOperationResponse<era_task>).SingleOrDefault();
            file.era_era_evacuationfile_era_evacueesupport_ESSFileId = new Collection<era_evacueesupport>((queryResults
                .First(r => r is QueryOperationResponse<era_evacueesupport>) as QueryOperationResponse<era_evacueesupport>).ToList());
            file.era_era_evacuationfile_era_householdmember_EvacuationFileid = new Collection<era_householdmember>((queryResults
                .First(r => r is QueryOperationResponse<era_householdmember>) as QueryOperationResponse<era_householdmember>).ToList());

            if (file.era_CurrentNeedsAssessmentid == null)
            {
                //map needs assessment if not already associated
                file.era_CurrentNeedsAssessmentid = (queryResults.First(r => r is QueryOperationResponse<era_needassessment>) as QueryOperationResponse<era_needassessment>).Single();
            }
            // load needs assessment household members and map registrant profiles if already loaded
            ctx.AttachTo(nameof(EssContext.era_needassessments), file.era_CurrentNeedsAssessmentid);
            await ctx.LoadPropertyAsync(file.era_CurrentNeedsAssessmentid, nameof(era_needassessment.era_era_householdmember_era_needassessment));
            foreach (var hm in file.era_CurrentNeedsAssessmentid.era_era_householdmember_era_needassessment)
            {
                hm.era_Registrant = file.era_era_evacuationfile_era_householdmember_EvacuationFileid.SingleOrDefault(h => h.era_householdmemberid == hm.era_householdmemberid).era_Registrant;
            }
        }

        private static async Task<IEnumerable<era_evacuationfile>> ParallelLoadEvacuationFilesAsync(EssContext ctx, IEnumerable<era_evacuationfile> files)
        {
            //load files' properties
            await files.Select(file => ParallelLoadEvacuationFileAsync(ctx, file)).ToArray().ForEachAsync(10, t => t);
            //await files.Select(file => LoadEvacuationFile(ctx, file)).ToArray().ForEachAsync(10, t => t);

            return files.ToArray();
        }

        public async Task<IEnumerable<EvacuationFile>> Read(EvacuationFilesQuery query)
        {
            var readCtx = essContextFactory.CreateReadOnly();

            //get all matching files
            var files = (await QueryHouseholdMemberFiles(readCtx, query))
                .Concat(await QueryEvacuationFiles(readCtx, query))
                .Concat(await QueryNeedsAssessments(readCtx, query));

            //secondary filter after loading the files
            if (!string.IsNullOrEmpty(query.FileId)) files = files.Where(f => f.era_name == query.FileId);
            if (query.RegistraionDateFrom.HasValue) files = files.Where(f => f.createdon.Value.UtcDateTime >= query.RegistraionDateFrom.Value);
            if (query.RegistraionDateTo.HasValue) files = files.Where(f => f.createdon.Value.UtcDateTime <= query.RegistraionDateTo.Value);
            if (query.IncludeFilesInStatuses.Any()) files = files.Where(f => query.IncludeFilesInStatuses.Any(s => (int)s == f.era_essfilestatus));
            if (query.Limit.HasValue) files = files.OrderByDescending(f => f.era_name).Take(query.Limit.Value);

            //ensure files will be loaded only once and have a needs assessment
            files = files
                .Where(f => f.statecode == (int)EntityState.Active && f._era_currentneedsassessmentid_value.HasValue)
                .Distinct(new LambdaComparer<era_evacuationfile>((f1, f2) => f1.era_evacuationfileid == f2.era_evacuationfileid, f => f.era_evacuationfileid.GetHashCode()));

            return (await ParallelLoadEvacuationFilesAsync(readCtx, files)).Select(f => MapEvacuationFile(f, query.MaskSecurityPhrase)).ToArray();
        }

        private static async Task<IEnumerable<era_evacuationfile>> QueryHouseholdMemberFiles(EssContext ctx, EvacuationFilesQuery query)
        {
            var shouldQueryHouseholdMembers =
                string.IsNullOrEmpty(query.FileId) && string.IsNullOrEmpty(query.NeedsAssessmentId) &&
             (!string.IsNullOrEmpty(query.LinkedRegistrantId) ||
             !string.IsNullOrEmpty(query.PrimaryRegistrantId) ||
             !string.IsNullOrEmpty(query.HouseholdMemberId));

            if (!shouldQueryHouseholdMembers) return Array.Empty<era_evacuationfile>();

            var memberQuery = ctx.era_householdmembers.Expand(m => m.era_EvacuationFileid).Where(m => m.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(query.PrimaryRegistrantId)) memberQuery = memberQuery.Where(m => m.era_isprimaryregistrant == true && m._era_registrant_value == Guid.Parse(query.PrimaryRegistrantId));
            if (!string.IsNullOrEmpty(query.HouseholdMemberId)) memberQuery = memberQuery.Where(m => m.era_householdmemberid == Guid.Parse(query.HouseholdMemberId));
            if (!string.IsNullOrEmpty(query.LinkedRegistrantId)) memberQuery = memberQuery.Where(m => m._era_registrant_value == Guid.Parse(query.LinkedRegistrantId));

            return (await ((DataServiceQuery<era_householdmember>)memberQuery).GetAllPagesAsync()).Select(m => m.era_EvacuationFileid).ToArray();
        }

        private static async Task<IEnumerable<era_evacuationfile>> QueryEvacuationFiles(EssContext ctx, EvacuationFilesQuery query)
        {
            var shouldQueryFiles =
                string.IsNullOrEmpty(query.NeedsAssessmentId) &&
                (!string.IsNullOrEmpty(query.FileId) ||
                !string.IsNullOrEmpty(query.ExternalReferenceId) ||
                query.RegistraionDateFrom.HasValue ||
                query.RegistraionDateTo.HasValue);

            if (!shouldQueryFiles) return Array.Empty<era_evacuationfile>();

            var filesQuery = ctx.era_evacuationfiles.Expand(f => f.era_CurrentNeedsAssessmentid).Where(f => f.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(query.FileId)) filesQuery = filesQuery.Where(f => f.era_name == query.FileId);
            if (!string.IsNullOrEmpty(query.ExternalReferenceId)) filesQuery = filesQuery.Where(f => f.era_paperbasedessfile == query.ExternalReferenceId);
            if (query.RegistraionDateFrom.HasValue) filesQuery = filesQuery.Where(f => f.createdon >= query.RegistraionDateFrom.Value);
            if (query.RegistraionDateTo.HasValue) filesQuery = filesQuery.Where(f => f.createdon <= query.RegistraionDateTo.Value);

            return (await ((DataServiceQuery<era_evacuationfile>)filesQuery).GetAllPagesAsync()).ToArray();
        }

        private static async Task<IEnumerable<era_evacuationfile>> QueryNeedsAssessments(EssContext ctx, EvacuationFilesQuery query)
        {
            var shouldQueryNeedsAssessments = !string.IsNullOrEmpty(query.NeedsAssessmentId) && !string.IsNullOrEmpty(query.FileId);

            if (!shouldQueryNeedsAssessments) return Array.Empty<era_evacuationfile>();

            var needsAssessmentQuery = ctx.era_needassessments
               .Expand(na => na.era_EvacuationFile)
                        .Where(n => n.era_needassessmentid == Guid.Parse(query.NeedsAssessmentId));

            return (await ((DataServiceQuery<era_needassessment>)needsAssessmentQuery).GetAllPagesAsync()).Select(na =>
            {
                na.era_EvacuationFile.era_CurrentNeedsAssessmentid = na;
                return na.era_EvacuationFile;
            }).Where(f => f.era_name == query.FileId).ToArray();
        }

        public async Task<string> CreateNote(string fileId, Note note)
        {
            var file = essContext.era_evacuationfiles
                .Where(f => f.era_name == fileId).SingleOrDefault();
            if (file == null) throw new ArgumentException($"Evacuation file {fileId} not found");

            var newNote = mapper.Map<era_essfilenote>(note);
            newNote.era_essfilenoteid = Guid.NewGuid();
            essContext.AddToera_essfilenotes(newNote);
            essContext.AddLink(file, nameof(era_evacuationfile.era_era_evacuationfile_era_essfilenote_ESSFileID), newNote);
            essContext.SetLink(newNote, nameof(newNote.era_ESSFileID), file);

            if (newNote._era_essteamuserid_value.HasValue)
            {
                var user = essContext.era_essteamusers.Where(u => u.era_essteamuserid == newNote._era_essteamuserid_value).SingleOrDefault();
                if (user != null) essContext.AddLink(user, nameof(era_essteamuser.era_era_essteamuser_era_essfilenote_ESSTeamUser), newNote);
            }
            await essContext.SaveChangesAsync();

            essContext.DetachAll();

            return newNote.era_essfilenoteid.ToString();
        }

        public async Task<string> UpdateNote(string fileId, Note note)
        {
            var existingNote = essContext.era_essfilenotes
                .Where(n => n.era_essfilenoteid == new Guid(note.Id)).SingleOrDefault();
            essContext.DetachAll();

            if (existingNote == null) throw new ArgumentException($"Evacuation file note {note.Id} not found");

            var updatedNote = mapper.Map<era_essfilenote>(note);

            updatedNote.era_essfilenoteid = existingNote.era_essfilenoteid;
            essContext.AttachTo(nameof(EssContext.era_essfilenotes), updatedNote);
            essContext.UpdateObject(updatedNote);

            await essContext.SaveChangesAsync();

            essContext.DetachAll();

            return updatedNote.era_essfilenoteid.ToString();
        }
    }
}
