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
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using EMBC.ESS.Utilities.Extensions;
using Microsoft.OData.Client;

namespace EMBC.ESS.Resources.Cases.Evacuations
{
    public class EvacuationRepository : IEvacuationRepository
    {
        private readonly EssContext essContext;
        private readonly IMapper mapper;

        public EvacuationRepository(EssContext essContext, IMapper mapper)
        {
            this.essContext = essContext;
            this.mapper = mapper;
        }

        public async Task<string> Create(EvacuationFile evacuationFile)
        {
            VerifyEvacuationFileInvariants(evacuationFile);

            var primaryContact = essContext.contacts.Where(c => c.statecode == (int)EntityState.Active && c.contactid == Guid.Parse(evacuationFile.PrimaryRegistrantId)).SingleOrDefault();
            if (primaryContact == null) throw new Exception($"Primary registrant {evacuationFile.PrimaryRegistrantId} not found");

            var file = mapper.Map<era_evacuationfile>(evacuationFile);
            file.era_evacuationfileid = Guid.NewGuid();

            essContext.AddToera_evacuationfiles(file);
            AssignPrimaryRegistrant(file, primaryContact);
            AssignToTask(file, evacuationFile.TaskId);
            AddPets(file);

            AddNeedsAssessment(file, file.era_CurrentNeedsAssessmentid);

            await essContext.SaveChangesAsync();

            essContext.Detach(file);
            var essFileNumber = essContext.era_evacuationfiles.Where(f => f.era_evacuationfileid == file.era_evacuationfileid).Select(f => f.era_name).Single();

            essContext.DetachAll();

            return essFileNumber;
        }

        public async Task<string> Update(EvacuationFile evacuationFile)
        {
            VerifyEvacuationFileInvariants(evacuationFile);

            var currentFile = essContext.era_evacuationfiles
                .Where(f => f.era_name == evacuationFile.Id).SingleOrDefault();
            if (currentFile == null) throw new Exception($"Evacuation file {evacuationFile.Id} not found");

            var primaryContact = essContext.contacts.Where(c => c.statecode == (int)EntityState.Active && c.contactid == Guid.Parse(evacuationFile.PrimaryRegistrantId)).SingleOrDefault();
            if (primaryContact == null) throw new Exception($"Primary registrant {evacuationFile.PrimaryRegistrantId} not found");

            RemovePets(currentFile);

            essContext.Detach(currentFile);
            var file = mapper.Map<era_evacuationfile>(evacuationFile);
            file.era_evacuationfileid = currentFile.era_evacuationfileid;

            essContext.AttachTo(nameof(essContext.era_evacuationfiles), file);
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
            if (task == null) throw new Exception($"Task {taskId} not found");
            essContext.AddLink(task, nameof(era_task.era_era_task_era_evacuationfileId), file);
        }

        private void AssignHouseholdMember(era_evacuationfile file, era_householdmember member)
        {
            if (member._era_registrant_value != null)
            {
                var registrant = essContext.contacts.Where(c => c.contactid == member._era_registrant_value).SingleOrDefault();
                if (registrant == null) throw new Exception($"Household member has registrant id {member._era_registrant_value} which was not found");
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
                essContext.DeleteObject(pet);
                essContext.DeleteLink(file, nameof(era_evacuationfile.era_era_evacuationfile_era_animal_ESSFileid), pet);
            }
        }

        private void VerifyEvacuationFileInvariants(EvacuationFile evacuationFile)
        {
            //Check invariants
            if (string.IsNullOrEmpty(evacuationFile.PrimaryRegistrantId))
            {
                throw new Exception($"The file has no associated primary registrant");
            }
            if (evacuationFile.NeedsAssessment == null)
            {
                throw new Exception($"File {evacuationFile.Id} must have a needs assessment");
            }
            if (evacuationFile.NeedsAssessment.HouseholdMembers.Count(m => m.IsPrimaryRegistrant) != 1)
            {
                throw new Exception($"File {evacuationFile.Id} must have a single primary registrant household member");
            }
            if (evacuationFile.NeedsAssessment.HouseholdMembers.Count(m => m.IsPrimaryRegistrant && m.LinkedRegistrantId != null) != 1)
            {
                throw new Exception($"File {evacuationFile.Id} primary registrant household member must be linked to a profile");
            }
        }

        public async Task<string> Delete(string essFileNumber)
        {
            var evacuationFile = essContext.era_evacuationfiles
                .Where(ef => ef.era_name == essFileNumber)
                .ToArray()
                .SingleOrDefault();

            if (evacuationFile != null)
            {
                essContext.DeleteObject(evacuationFile);
                await essContext.SaveChangesAsync();
            }
            essContext.DetachAll();

            return essFileNumber;
        }

        private EvacuationFile MapEvacuationFile(era_evacuationfile file, bool maskSecurityPhrase = true) =>
            mapper.Map<EvacuationFile>(file, opt => opt.Items["MaskSecurityPhrase"] = maskSecurityPhrase.ToString());

        private static async Task<era_evacuationfile> LoadEvacuationFileAsync(EssContext ctx, era_evacuationfile file)
        {
            if (file == null || file.statecode != (int)EntityState.Active) return null;
            if (!file._era_currentneedsassessmentid_value.HasValue) return null;

            ctx.AttachTo(nameof(EssContext.era_evacuationfiles), file);

            var loadTasks = new List<Task>();
            loadTasks.Add(Task.Run(() => ctx.LoadProperty(file, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid))));
            loadTasks.Add(Task.Run(() => ctx.LoadProperty(file, nameof(era_evacuationfile.era_era_evacuationfile_era_animal_ESSFileid))));
            loadTasks.Add(Task.Run(() => ctx.LoadProperty(file, nameof(era_evacuationfile.era_era_evacuationfile_era_essfilenote_ESSFileID))));
            loadTasks.Add(Task.Run(() => ctx.LoadProperty(file, nameof(era_evacuationfile.era_TaskId))));

            loadTasks.Add(Task.Run(() =>
            {
                if (file.era_CurrentNeedsAssessmentid == null)
                    ctx.LoadProperty(file, nameof(era_evacuationfile.era_CurrentNeedsAssessmentid));
                // else
                ctx.AttachTo(nameof(EssContext.era_needassessments), file.era_CurrentNeedsAssessmentid);

                ctx.LoadProperty(file.era_CurrentNeedsAssessmentid, nameof(era_needassessment.era_era_householdmember_era_needassessment));
                foreach (var member in file.era_CurrentNeedsAssessmentid.era_era_householdmember_era_needassessment)
                {
                    if (member._era_registrant_value.HasValue)
                    {
                        ctx.AttachTo(nameof(EssContext.era_householdmembers), member);
                        ctx.LoadProperty(member, nameof(era_householdmember.era_Registrant));
                        ctx.Detach(member);
                    }
                }
                ctx.Detach(file.era_CurrentNeedsAssessmentid);
            }));
            await Task.WhenAll(loadTasks.ToArray());

            ctx.Detach(file);

            return file;
        }

        public async Task<IEnumerable<EvacuationFile>> Read(EvacuationFilesQuery query)
        {
            var readCtx = essContext.Clone();
            readCtx.MergeOption = MergeOption.NoTracking;

            var queryContacts =

               !string.IsNullOrEmpty(query.PrimaryRegistrantId) ||
                !string.IsNullOrEmpty(query.HouseholdMemberId);

            IEnumerable<era_evacuationfile> allFiles = Array.Empty<era_evacuationfile>();

            if (queryContacts)
            {
                allFiles = await QueryHouseholdMemberFiles(readCtx, query);
            }
            else
            {
                allFiles = await QueryEvacuationFiles(readCtx, query);
            }

            var results = new ConcurrentBag<era_evacuationfile>();
            await allFiles.ForEachAsync(10, async f => results.Add(await LoadEvacuationFileAsync(readCtx, f)));

            var files = results.Where(f => f != null).Select(f => MapEvacuationFile(f, query.MaskSecurityPhrase));
            if (query.Limit.HasValue) files = files.OrderByDescending(f => f.Id).Take(query.Limit.Value);

            return files.ToArray();
        }

        private static async Task<IEnumerable<era_evacuationfile>> QueryHouseholdMemberFiles(EssContext ctx, EvacuationFilesQuery query)
        {
            var contactQuery = ctx.era_householdmembers
                 .Expand(m => m.era_EvacuationFileid)
                 .Where(m => m.statecode == (int)EntityState.Active)
                 .Where(m => m._era_evacuationfileid_value != null);

            if (!string.IsNullOrEmpty(query.PrimaryRegistrantId)) contactQuery = contactQuery.Where(m => m.era_isprimaryregistrant == true && m._era_registrant_value == Guid.Parse(query.PrimaryRegistrantId));
            if (!string.IsNullOrEmpty(query.HouseholdMemberId)) contactQuery = contactQuery.Where(m => m.era_householdmemberid == Guid.Parse(query.HouseholdMemberId));

            var files = (await ((DataServiceQuery<era_householdmember>)contactQuery).GetAllPagesAsync()).Select(f => f.era_EvacuationFileid);

            //filter files after querying the server as there is no way to have a 2nd level queries
            if (!string.IsNullOrEmpty(query.FileId)) files = files.Where(f => f.era_name == query.FileId);
            if (query.RegistraionDateFrom.HasValue) files = files.Where(f => f.createdon >= query.RegistraionDateFrom.Value);
            if (query.RegistraionDateTo.HasValue) files = files.Where(f => f.createdon <= query.RegistraionDateTo.Value);
            if (query.IncludeFilesInStatuses.Any()) files = files.Where(f => query.IncludeFilesInStatuses.Any(s => (int)s == f.statuscode));

            return files.ToArray();
        }

        private static async Task<IEnumerable<era_evacuationfile>> QueryEvacuationFiles(EssContext ctx, EvacuationFilesQuery query)
        {
            var files = ctx.era_evacuationfiles
                .Expand(f => f.era_CurrentNeedsAssessmentid)
                .Where(f => f.statecode == (int)EntityState.Active);
            if (!string.IsNullOrEmpty(query.FileId)) files = files.Where(f => f.era_name == query.FileId);
            if (query.RegistraionDateFrom.HasValue) files = files.Where(f => f.createdon >= query.RegistraionDateFrom.Value);
            if (query.RegistraionDateTo.HasValue) files = files.Where(f => f.createdon <= query.RegistraionDateTo.Value);
            if (query.IncludeFilesInStatuses.Any()) files = files.Where(f => query.IncludeFilesInStatuses.Any(s => (int)s == f.statuscode));

            return (await ((DataServiceQuery<era_evacuationfile>)files).GetAllPagesAsync()).ToArray();
        }

        public async Task<string> UpdateSecurityPhrase(string fileId, string securityPhrase)
        {
            var evacuationFile = essContext.era_evacuationfiles
                .Where(f => f.era_name == fileId)
                .ToArray()
                .FirstOrDefault();

            if (evacuationFile == null) throw new Exception($"Evacuation File {fileId} not found");

            evacuationFile.era_securityphrase = securityPhrase;
            essContext.UpdateObject(evacuationFile);
            await essContext.SaveChangesAsync();

            essContext.DetachAll();

            return evacuationFile.era_name;
        }

        public async Task<IEnumerable<Note>> GetNotes(EvacuationFileNotesQuery query)
        {
            if (string.IsNullOrEmpty(query.FileId)) throw new Exception("FileId is required");

            var evacuationFile = essContext.era_evacuationfiles
                .Where(f => f.era_name == query.FileId)
                .Single();

            essContext.LoadProperty(evacuationFile, nameof(era_evacuationfile.era_era_evacuationfile_era_essfilenote_ESSFileID));

            var notes = evacuationFile.era_era_evacuationfile_era_essfilenote_ESSFileID.ToArray();

            if (!string.IsNullOrEmpty(query.NoteId))
            {
                notes = notes.Where(n => n.era_essfilenoteid == Guid.Parse(query.NoteId)).ToArray();
            }

            await Task.CompletedTask;

            return mapper.Map<IEnumerable<Note>>(notes);
        }

        public async Task<string> CreateNote(string essFileId, Note note)
        {
            var file = essContext.era_evacuationfiles
                .Where(f => f.era_name == essFileId).SingleOrDefault();
            if (file == null) throw new Exception($"Evacuation file {essFileId} not found");

            var era_essfilenote = mapper.Map<era_essfilenote>(note);
            era_essfilenote.era_essfilenoteid = Guid.NewGuid();
            AddNote(file, era_essfilenote);

            await essContext.SaveChangesAsync();

            essContext.DetachAll();

            return era_essfilenote.era_essfilenoteid.ToString();
        }

        public async Task<string> UpdateNote(string essFileId, Note note)
        {
            var era_essfilenote = mapper.Map<era_essfilenote>(note);
            var existingNote = essContext.era_essfilenotes
                .Where(n => n.era_essfilenoteid == new Guid(note.Id)).SingleOrDefault();
            essContext.DetachAll();

            if (existingNote == null) throw new Exception($"Evacuation file note {note.Id} not found");

            era_essfilenote.era_essfilenoteid = existingNote.era_essfilenoteid;
            essContext.AttachTo(nameof(EssContext.era_essfilenotes), era_essfilenote);
            essContext.UpdateObject(era_essfilenote);

            await essContext.SaveChangesAsync();

            essContext.DetachAll();

            return era_essfilenote.era_essfilenoteid.ToString();
        }

        private void AddNote(era_evacuationfile file, era_essfilenote note)
        {
            essContext.AddToera_essfilenotes(note);
            essContext.AddLink(file, nameof(era_evacuationfile.era_era_evacuationfile_era_essfilenote_ESSFileID), note);
            essContext.SetLink(note, nameof(era_essfilenote.era_ESSFileID), file);

            if (note._era_essteamuserid_value.HasValue)
            {
                var user = essContext.era_essteamusers.Where(u => u.era_essteamuserid == note._era_essteamuserid_value).SingleOrDefault();
                if (user != null) essContext.AddLink(user, nameof(era_essteamuser.era_era_essteamuser_era_essfilenote_ESSTeamUser), note);
            }
        }
    }
}
