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

            essContext.Detach(currentFile);
            var file = mapper.Map<era_evacuationfile>(evacuationFile);
            file.era_evacuationfileid = currentFile.era_evacuationfileid;

            essContext.AttachTo(nameof(essContext.era_evacuationfiles), file);
            essContext.UpdateObject(file);
            AssignPrimaryRegistrant(file, primaryContact);
            AssignToTask(file, evacuationFile.TaskId);

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

            foreach (var pet in needsAssessment.era_era_needassessment_era_needsassessmentanimal_NeedsAssessment)
            {
                essContext.AddToera_needsassessmentanimals(pet);
                AssignPet(needsAssessment, pet);
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

        private void AssignPet(era_needassessment needsAssessment, era_needsassessmentanimal pet)
        {
            essContext.AddLink(needsAssessment, nameof(era_needassessment.era_era_needassessment_era_needsassessmentanimal_NeedsAssessment), pet);
            essContext.SetLink(pet, nameof(era_needsassessmentanimal.era_NeedsAssessment), needsAssessment);
        }

        private void VerifyEvacuationFileInvariants(EvacuationFile evacuationFile)
        {
            //Check invariants
            if (string.IsNullOrEmpty(evacuationFile.PrimaryRegistrantId))
            {
                throw new Exception($"The file has no associated primary registrant");
            }
            if (evacuationFile.CurrentNeedsAssessment == null)
            {
                throw new Exception($"File {evacuationFile.Id} must have a needs assessment");
            }
            if (evacuationFile.CurrentNeedsAssessment.HouseholdMembers.Count(m => m.IsPrimaryRegistrant) != 1)
            {
                throw new Exception($"File {evacuationFile.Id} must have a single primary registrant household member");
            }
            if (evacuationFile.CurrentNeedsAssessment.HouseholdMembers.Count(m => m.IsPrimaryRegistrant && m.LinkedRegistrantId != null) != 1)
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

        private async Task<EvacuationFile> GetEvacuationFileById(Guid id, bool maskSecurityPhrase = true)
        {
            var file = await essContext.era_evacuationfiles
                .ByKey(id)
                .Expand(f => f.era_CurrentNeedsAssessmentid)
                .GetValueAsync();

            if (file == null || file.statecode != (int)EntityState.Active) return null;
            if (!file._era_currentneedsassessmentid_value.HasValue) return null;

            essContext.LoadProperty(file, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid));

            essContext.LoadProperty(file.era_CurrentNeedsAssessmentid, nameof(era_needassessment.era_era_householdmember_era_needassessment));
            foreach (var member in file.era_CurrentNeedsAssessmentid.era_era_householdmember_era_needassessment)
            {
                if (member._era_registrant_value.HasValue)
                {
                    essContext.LoadProperty(member, nameof(era_householdmember.era_Registrant));
                }
            }
            essContext.LoadProperty(file.era_CurrentNeedsAssessmentid, nameof(era_needassessment.era_era_needassessment_era_needsassessmentanimal_NeedsAssessment));

            var evacuationFile = mapper.Map<EvacuationFile>(file, opt => opt.Items["MaskSecurityPhrase"] = maskSecurityPhrase.ToString());

            return await Task.FromResult(evacuationFile);
        }

        public async Task<IEnumerable<EvacuationFile>> Read(EvacuationFilesQuery query)
        {
            IEnumerable<Guid> fileIds = Array.Empty<Guid>();
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

            if (queryContacts)
            {
                var matchingContactFileIds = await QueryHouseholdMembers(query);

                //merge matching file ids
                fileIds = fileIds.Any()
                    ? fileIds.Intersect(matchingContactFileIds)
                    : fileIds.Concat(matchingContactFileIds);
            }

            if (queryFiles)
            {
                var matchingFileIds = await QueryFiles(query);

                //merge matching file ids
                fileIds = fileIds.Any()
                    ? fileIds.Intersect(matchingFileIds)
                    : fileIds.Concat(matchingFileIds);
            }

            essContext.DetachAll();
            var evacuationFiles = new ConcurrentBag<EvacuationFile>();
            var evacuationFilesTasks = fileIds.Distinct().Select(async id => evacuationFiles.Add(await GetEvacuationFileById(id, query.MaskSecurityPhrase)));
            //magic to query files in parallel
            await evacuationFilesTasks.ForEachAsync(10, async t => await t);

            essContext.DetachAll();

            var files = evacuationFiles.Where(f => f != null);
            if (query.Limit.HasValue) files = files.OrderByDescending(f => f.Id).Take(query.Limit.Value);
            return files.ToArray();
        }

        private async Task<IEnumerable<Guid>> QueryFiles(EvacuationFilesQuery query)
        {
            var fileQuery = essContext.era_evacuationfiles.Where(f => f.statecode == (int)EntityState.Active);
            if (!string.IsNullOrEmpty(query.FileId)) fileQuery = fileQuery.Where(f => f.era_name == query.FileId);
            if (query.RegistraionDateFrom.HasValue) fileQuery = fileQuery.Where(f => f.createdon >= query.RegistraionDateFrom.Value);
            if (query.RegistraionDateTo.HasValue) fileQuery = fileQuery.Where(f => f.createdon <= query.RegistraionDateTo.Value);
            if (query.IncludeFilesInStatuses.Any()) fileQuery = fileQuery.Where(f => query.IncludeFilesInStatuses.Any(s => (int)s == f.statuscode));

            var matchingFileIds = (await ((DataServiceQuery<era_evacuationfile>)fileQuery).GetAllPagesAsync()).Select(f => f.era_evacuationfileid.Value).ToArray();
            return matchingFileIds;
        }

        private async Task<IEnumerable<Guid>> QueryHouseholdMembers(EvacuationFilesQuery query)
        {
            var contactQuery = essContext.era_householdmembers
              .Where(c => c.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(query.PrimaryRegistrantId)) contactQuery = contactQuery.Where(c => c.era_isprimaryregistrant == true && c._era_registrant_value == Guid.Parse(query.PrimaryRegistrantId));
            if (!string.IsNullOrEmpty(query.LastName)) contactQuery = contactQuery.Where(c => c.era_lastname.Equals(query.LastName, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(query.FirstName)) contactQuery = contactQuery.Where(c => c.era_firstname.Equals(query.FirstName, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(query.DateOfBirth)) contactQuery = contactQuery.Where(c => c.era_dateofbirth.Equals(Date.Parse(query.DateOfBirth)));

            var matchingContactFileIds = (await ((DataServiceQuery<era_householdmember>)contactQuery).GetAllPagesAsync())
                .Select(m => m._era_evacuationfileid_value.Value).ToArray();
            return matchingContactFileIds;
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
