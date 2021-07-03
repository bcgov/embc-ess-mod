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
using Microsoft.OData.Edm;

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

        private async Task<era_evacuationfile> LoadEvacuationFile(era_evacuationfile file)
        {
            if (file == null || file.statecode != (int)EntityState.Active) return null;
            if (!file._era_currentneedsassessmentid_value.HasValue) return null;

            var loadTasks = new List<Task>();
            loadTasks.Add(Task.Run(() => essContext.LoadProperty(file, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid))));
            loadTasks.Add(Task.Run(() => essContext.LoadProperty(file, nameof(era_evacuationfile.era_era_evacuationfile_era_animal_ESSFileid))));
            loadTasks.Add(Task.Run(() => essContext.LoadProperty(file, nameof(era_evacuationfile.era_era_evacuationfile_era_essfilenote_ESSFileID))));

            loadTasks.Add(Task.Run(() =>
            {
                if (file.era_CurrentNeedsAssessmentid == null) essContext.LoadProperty(file, nameof(era_evacuationfile.era_CurrentNeedsAssessmentid));
                essContext.LoadProperty(file.era_CurrentNeedsAssessmentid, nameof(era_needassessment.era_era_householdmember_era_needassessment));
                foreach (var member in file.era_CurrentNeedsAssessmentid.era_era_householdmember_era_needassessment)
                {
                    if (member._era_registrant_value.HasValue)
                    {
                        essContext.LoadProperty(member, nameof(era_householdmember.era_Registrant));
                    }
                }
            }));
            await Task.WhenAll(loadTasks.ToArray());
            return file;
        }

        public async Task<IEnumerable<EvacuationFile>> Read(EvacuationFilesQuery query)
        {
            essContext.MergeOption = MergeOption.OverwriteChanges;
            var queryContacts =
               !string.IsNullOrEmpty(query.FirstName) ||
               !string.IsNullOrEmpty(query.LastName) ||
               !string.IsNullOrEmpty(query.DateOfBirth) ||
               !string.IsNullOrEmpty(query.PrimaryRegistrantId);

            var queryFiles =
                      !string.IsNullOrEmpty(query.FileId) ||
                      query.IncludeFilesInStatuses.Any() ||
                      query.RegistraionDateFrom.HasValue ||
                      query.RegistraionDateTo.HasValue;

            IEnumerable<era_evacuationfile> allFiles = Array.Empty<era_evacuationfile>();

            if (queryContacts)
            {
                allFiles = allFiles.Concat(await QueryHouseholdMemberFiles(query));
            }
            if (queryFiles)
            {
                var evacuationFiles = await QueryEvacuationFiles(query);
                allFiles = queryContacts
                     ? allFiles.Intersect(evacuationFiles, new LambdaComparer<era_evacuationfile>((f1, f2) => f1.era_evacuationfileid == f2.era_evacuationfileid))
                     : allFiles.Concat(evacuationFiles);
            }

            var results = new ConcurrentBag<era_evacuationfile>();
            await allFiles.ForEachAsync(10, async f => results.Add(await LoadEvacuationFile(f)));

            var files = results.Select(f => MapEvacuationFile(f, query.MaskSecurityPhrase)).Where(f => f != null);
            if (query.Limit.HasValue) files = files.OrderByDescending(f => f.Id).Take(query.Limit.Value);

            essContext.DetachAll();

            return files.ToArray();
        }

        private IEnumerable<era_evacuationfile> FilterFiles(IEnumerable<era_evacuationfile> source, EvacuationFilesQuery query)
        {
            if (!string.IsNullOrEmpty(query.FileId)) source = source.Where(f => f.era_name == query.FileId);
            if (query.RegistraionDateFrom.HasValue) source = source.Where(f => f.createdon >= query.RegistraionDateFrom.Value);
            if (query.RegistraionDateTo.HasValue) source = source.Where(f => f.createdon <= query.RegistraionDateTo.Value);
            if (query.IncludeFilesInStatuses.Any()) source = source.Where(f => query.IncludeFilesInStatuses.Any(s => (int)s == f.statuscode));

            return source;
        }

        private async Task<IEnumerable<era_evacuationfile>> QueryHouseholdMemberFiles(EvacuationFilesQuery query)
        {
            var contactQuery = essContext.era_householdmembers
                 .Expand(m => m.era_EvacuationFileid)
                 .Where(m => m.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(query.PrimaryRegistrantId)) contactQuery = contactQuery.Where(m => m.era_isprimaryregistrant == true && m._era_registrant_value == Guid.Parse(query.PrimaryRegistrantId));
            if (!string.IsNullOrEmpty(query.LastName)) contactQuery = contactQuery.Where(m => m.era_lastname.Equals(query.LastName, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(query.FirstName)) contactQuery = contactQuery.Where(m => m.era_firstname.Equals(query.FirstName, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(query.DateOfBirth)) contactQuery = contactQuery.Where(m => m.era_dateofbirth.Equals(Date.Parse(query.DateOfBirth)));

            var matchingHouseholdMembersFiles = FilterFiles(
                (await ((DataServiceQuery<era_householdmember>)contactQuery).GetAllPagesAsync()).Select(f => f.era_EvacuationFileid), query)
                .ToArray();

            return matchingHouseholdMembersFiles;
        }

        private async Task<IEnumerable<era_evacuationfile>> QueryEvacuationFiles(EvacuationFilesQuery query)
        {
            var filesQuery = essContext.era_evacuationfiles
                .Expand(f => f.era_CurrentNeedsAssessmentid)
                .Where(f => f.statecode == (int)EntityState.Active);
            if (!string.IsNullOrEmpty(query.FileId)) filesQuery = filesQuery.Where(f => f.era_name == query.FileId);
            if (query.RegistraionDateFrom.HasValue) filesQuery = filesQuery.Where(f => f.createdon >= query.RegistraionDateFrom.Value);
            if (query.RegistraionDateTo.HasValue) filesQuery = filesQuery.Where(f => f.createdon <= query.RegistraionDateTo.Value);
            if (query.IncludeFilesInStatuses.Any()) filesQuery = filesQuery.Where(f => query.IncludeFilesInStatuses.Any(s => (int)s == f.statuscode));

            var matchingFiles = (await ((DataServiceQuery<era_evacuationfile>)filesQuery)
                .GetAllPagesAsync())
                .ToArray();

            return matchingFiles;
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
    }
}
