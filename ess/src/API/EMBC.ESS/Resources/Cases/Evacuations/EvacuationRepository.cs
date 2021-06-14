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

            era_task task = null;
            if (evacuationFile.TaskId != null)
            {
                task = essContext.era_tasks.Where(t => t.era_name == evacuationFile.TaskId).SingleOrDefault();
                if (task == null) throw new Exception($"Task {evacuationFile.TaskId} not found");
            }

            var file = mapper.Map<era_evacuationfile>(evacuationFile);
            file.era_evacuationfileid = Guid.NewGuid();

            essContext.AddToera_evacuationfiles(file);
            essContext.AddLink(primaryContact, nameof(primaryContact.era_evacuationfile_Registrant), file);
            essContext.SetLink(file, nameof(era_evacuationfile.era_Registrant), primaryContact);
            if (task != null) essContext.AddLink(task, nameof(era_task.era_era_task_era_evacuationfileId), file);

            var needsAssessment = file.era_CurrentNeedsAssessmentid;

            essContext.AddToera_needassessments(needsAssessment);
            essContext.SetLink(file, nameof(era_evacuationfile.era_CurrentNeedsAssessmentid), needsAssessment);
            essContext.AddLink(file, nameof(era_evacuationfile.era_needsassessment_EvacuationFile), needsAssessment);
            essContext.SetLink(needsAssessment, nameof(era_needassessment.era_EvacuationFile), file);
            essContext.SetLink(needsAssessment, nameof(era_needassessment.era_Jurisdictionid), essContext.LookupJurisdictionByCode(needsAssessment._era_jurisdictionid_value?.ToString()));

            //foreach (var member in file.era_era_evacuationfile_era_householdmember_EvacuationFileid)
            //{
            //    essContext.AddToera_householdmembers(member);
            //    if (member._era_registrant_value != null)
            //    {
            //        var registrant = essContext.contacts.Where(c => c.contactid == member._era_registrant_value).SingleOrDefault();
            //        if (registrant == null) throw new Exception($"Household member has registrant id {member._era_registrant_value} which was not found");
            //        essContext.AddLink(registrant, nameof(contact.era_contact_era_householdmember_Registrantid), member);
            //    }
            //    essContext.AddLink(file, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid), member);
            //    essContext.SetLink(member, nameof(era_householdmember.era_EvacuationFileid), file);
            //}
            foreach (var member in needsAssessment.era_era_householdmember_era_needassessment)
            {
                essContext.AddToera_householdmembers(member);
                if (member._era_registrant_value != null)
                {
                    var registrant = essContext.contacts.Where(c => c.contactid == member._era_registrant_value).SingleOrDefault();
                    if (registrant == null) throw new Exception($"Household member has registrant id {member._era_registrant_value} which was not found");
                    essContext.AddLink(registrant, nameof(contact.era_contact_era_householdmember_Registrantid), member);
                }
                essContext.AddLink(file, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid), member);
                essContext.SetLink(member, nameof(era_householdmember.era_EvacuationFileid), file);
                essContext.AddLink(member, nameof(era_householdmember.era_era_householdmember_era_needassessment), needsAssessment);
            }

            foreach (var pet in needsAssessment.era_era_needassessment_era_needsassessmentanimal_NeedsAssessment)
            {
                essContext.AddToera_needsassessmentanimals(pet);
                essContext.AddLink(needsAssessment, nameof(era_needassessment.era_era_needassessment_era_needsassessmentanimal_NeedsAssessment), pet);
                essContext.SetLink(pet, nameof(era_needsassessmentanimal.era_NeedsAssessment), needsAssessment);
            }

            await essContext.SaveChangesAsync();

            essContext.Detach(file);
            var essFileNumber = essContext.era_evacuationfiles.Where(f => f.era_evacuationfileid == file.era_evacuationfileid).Select(f => f.era_name).Single();

            essContext.DetachAll();

            return essFileNumber;
        }

        public async Task<string> Update(EvacuationFile file)
        {
            await Task.CompletedTask;
            throw new NotImplementedException();
            //VerifyEvacuationFileInvariants(file);

            //var existingEvacuationFile = essContext.era_evacuationfiles.Where(e => e.era_name == file.Id).SingleOrDefault();

            //if (existingEvacuationFile == null) throw new Exception($"File {file.Id} not found");

            //var primaryContact = essContext.contacts.Where(c => c.statecode == (int)EntityState.Active && c.contactid == Guid.Parse(file.PrimaryRegistrantId)).SingleOrDefault();
            //if (primaryContact == null) throw new Exception($"Primary registrant {file.PrimaryRegistrantId} not found");

            //var updatedEvacuationFile = mapper.Map<era_evacuationfile>(file);
            //updatedEvacuationFile.era_evacuationfileid = existingEvacuationFile.era_evacuationfileid;

            //essContext.Detach(existingEvacuationFile);
            //essContext.AttachTo(nameof(essContext.era_evacuationfiles), updatedEvacuationFile);
            //essContext.UpdateObject(updatedEvacuationFile);
            //essContext.AddLink(primaryContact, nameof(contact.era_evacuationfile_Registrant), updatedEvacuationFile);
            //essContext.SetLink(updatedEvacuationFile, nameof(era_evacuationfile.era_Registrant), primaryContact);
            //essContext.AddLink(essContext.LookupJurisdictionByCode(file.EvacuatedFromAddress.CommunityCode), nameof(era_jurisdiction.era_evacuationfile_Jurisdiction), updatedEvacuationFile);

            //var needsAssessment = mapper.Map<era_needassessment>(file.CurrentNeedsAssessment);
            //var members = mapper.Map<IEnumerable<era_householdmember>>(file.CurrentNeedsAssessment.HouseholdMembers);
            //var pets = mapper.Map<IEnumerable<era_needsassessmentanimal>>(file.CurrentNeedsAssessment.Pets);

            //CreateNeedsAssessment(updatedEvacuationFile, needsAssessment, members, pets);

            //await essContext.SaveChangesAsync();

            //essContext.DetachAll();

            //return updatedEvacuationFile.era_name;
        }

        private void VerifyEvacuationFileInvariants(EvacuationFile evacuationFile)
        {
            //Check invariants
            if (string.IsNullOrEmpty(evacuationFile.PrimaryRegistrantId))
            {
                throw new Exception($"The file has no associated primary registrant");
            }
            if (evacuationFile.CurrentNeedsAssessment.HouseholdMembers.Count(m => m.IsPrimaryRegistrant) != 1)
            {
                throw new Exception($"File {evacuationFile.Id} must have a single primary registrant household member");
            }
            if (evacuationFile.CurrentNeedsAssessment.HouseholdMembers.Count(m => m.IsPrimaryRegistrant && m.LinkedRegistrantId != null) != 1)
            {
                throw new Exception($"File {evacuationFile.Id} primary registrant must be linked to a profile");
            }
        }

        //private void CreateNeedsAssessment(era_evacuationfile eraEvacuationFile, era_needassessment eraNeedsAssessment)
        //{
        //    //eraNeedsAssessment.era_needassessmentid = Guid.NewGuid();
        //    //eraNeedsAssessment.era_needsassessmentdate = DateTimeOffset.UtcNow;
        //    //essContext.AddLink(essContext.LookupJurisdictionByCode(file.EvacuatedFromAddress.CommunityCode), nameof(era_jurisdiction.era_evacuationfile_Jurisdiction), eraEvacuationFile);

        //    essContext.AddToera_needassessments(eraNeedsAssessment);
        //    essContext.AddLink(eraEvacuationFile, nameof(eraEvacuationFile.era_needsassessment_EvacuationFile), eraNeedsAssessment);

        //    foreach (var member in members)
        //    {
        //        CreateHouseholdMember(eraEvacuationFile, eraNeedsAssessment, member);
        //    }

        //    foreach (var pet in pets)
        //    {
        //        CreatePet(eraNeedsAssessment, pet);
        //    }
        //}

        //private void CreatePet(era_needassessment eraNeedsAssessment, era_needsassessmentanimal pet)
        //{
        //    pet.era_needsassessmentanimalid = Guid.NewGuid();

        //    essContext.AddToera_needsassessmentanimals(pet);
        //    essContext.SetLink(pet, nameof(era_needsassessmentanimal.era_NeedsAssessment), eraNeedsAssessment);
        //    essContext.AddLink(eraNeedsAssessment, nameof(eraNeedsAssessment.era_era_needassessment_era_needsassessmentanimal_NeedsAssessment), pet);
        //}

        //private void CreateHouseholdMember(era_evacuationfile eraEvacuationFile, era_needassessment eraNeedsAssessment, era_householdmember member)
        //{
        //    member.era_householdmemberid = Guid.NewGuid();
        //    var contact = member.era_Registrant;

        //    if (contact.contactid.HasValue)
        //    {
        //        //TODO: figure out a nicer way to handle already tracked primary contact handling
        //        var trackedContact = (contact)essContext.EntityTracker.Entities.SingleOrDefault(e => e.Entity is contact c && c.contactid == contact.contactid).Entity;
        //        if (trackedContact != null)
        //        {
        //            contact = trackedContact;
        //        }
        //        else
        //        {
        //            essContext.AttachTo(nameof(essContext.contacts), contact);
        //        }
        //    }
        //    else
        //    {
        //        contact.contactid = Guid.NewGuid();
        //        contact.era_authenticated = false;
        //        contact.era_verified = false;
        //        contact.era_registrationdate = DateTimeOffset.UtcNow;
        //        essContext.AddTocontacts(contact);
        //    }
        //    essContext.AddToera_householdmembers(member);
        //    essContext.AddLink(member, nameof(era_householdmember.era_era_householdmember_era_needassessment), eraNeedsAssessment);
        //    //essContext.AddLink(eraNeedsAssessment, nameof(era_needassessment.era_era_householdmember_era_needassessment), member);
        //    essContext.SetLink(member, nameof(era_householdmember.era_EvacuationFileid), eraEvacuationFile);
        //    essContext.SetLink(member, nameof(era_householdmember.era_Registrant), contact);
        //    essContext.AddLink(contact, nameof(contact.era_contact_era_householdmember_Registrantid), member);
        //}

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

            essContext.LoadProperty(file, nameof(era_evacuationfile.era_era_evacuationfile_era_householdmember_EvacuationFileid));
            if (file._era_currentneedsassessmentid_value.HasValue)
            {
                essContext.LoadProperty(file.era_CurrentNeedsAssessmentid, nameof(era_needassessment.era_era_householdmember_era_needassessment));
                foreach (var member in file.era_CurrentNeedsAssessmentid.era_era_householdmember_era_needassessment)
                {
                    if (member._era_registrant_value.HasValue)
                    {
                        essContext.LoadProperty(member, nameof(era_householdmember.era_Registrant));
                    }
                }
                essContext.LoadProperty(file.era_CurrentNeedsAssessmentid, nameof(era_needassessment.era_era_needassessment_era_needsassessmentanimal_NeedsAssessment));
            }
            var evacuationFile = mapper.Map<EvacuationFile>(file, opt => opt.Items["MaskSecurityPhrase"] = maskSecurityPhrase.ToString());

            return evacuationFile;
        }

        public async Task<IEnumerable<EvacuationFile>> Read(EvacuationFilesQuery query)
        {
            IEnumerable<Guid> fileIds = Array.Empty<Guid>();
            var queryContacts = !string.IsNullOrEmpty(query.FirstName) ||
                !string.IsNullOrEmpty(query.LastName) ||
                !string.IsNullOrEmpty(query.DateOfBirth) ||
                !string.IsNullOrEmpty(query.PrimaryRegistrantId);

            var queryFiles = !string.IsNullOrEmpty(query.FileId) ||
                query.IncludeFilesInStatuses.Any() ||
                query.RegistraionDateFrom.HasValue ||
                query.RegistraionDateTo.HasValue;

            if (queryContacts)
            {
                var contactQuery = essContext.contacts
                  .Where(c => c.statecode == (int)EntityState.Active);

                //if (!string.IsNullOrEmpty(query.PrimaryRegistrantUserId)) contactQuery = contactQuery.Where(c => c.era_bcservicescardid.Equals(query.PrimaryRegistrantUserId, StringComparison.OrdinalIgnoreCase));
                if (!string.IsNullOrEmpty(query.PrimaryRegistrantId)) contactQuery = contactQuery.Where(c => c.contactid == Guid.Parse(query.PrimaryRegistrantId));
                if (!string.IsNullOrEmpty(query.LastName)) contactQuery = contactQuery.Where(c => c.lastname.Equals(query.LastName, StringComparison.OrdinalIgnoreCase));
                if (!string.IsNullOrEmpty(query.FirstName)) contactQuery = contactQuery.Where(c => c.firstname.Equals(query.FirstName, StringComparison.OrdinalIgnoreCase));
                if (!string.IsNullOrEmpty(query.DateOfBirth)) contactQuery = contactQuery.Where(c => c.birthdate.Equals(Date.Parse(query.DateOfBirth)));
                if (!query.IncludeHouseholdMembers) contactQuery = contactQuery.Where(m => m.era_registranttype == (int)RegistrantType.Primary);

                var matchingContactIds = (await ((DataServiceQuery<contact>)contactQuery).GetAllPagesAsync()).Select(c => c.contactid).ToArray();

                Func<DataServiceQuery<era_needsassessmentevacuee>> householdMembersQuery = () =>
                    (DataServiceQuery<era_needsassessmentevacuee>)essContext.era_needsassessmentevacuees
                        .Expand(m => m.era_NeedsAssessmentID)
                        .Where(m => m.statecode == (int)EntityState.Active);

                var matchingContactFileIds = matchingContactIds
                   .Select(id => householdMembersQuery()
                       .Where(m => m.era_RegistrantID.contactid == id && m.era_NeedsAssessmentID != null)
                       .ToArray()
                       .Select(m => m.era_NeedsAssessmentID._era_evacuationfile_value.Value))
                   .SelectMany(f => f)
                   .ToArray();

                //merge matching file ids
                fileIds = fileIds.Any()
                    ? fileIds.Union(matchingContactFileIds)
                    : fileIds.Concat(matchingContactFileIds);
            }

            if (queryFiles)
            {
                var fileQuery = essContext.era_evacuationfiles.Where(f => f.statecode == (int)EntityState.Active);
                if (!string.IsNullOrEmpty(query.FileId)) fileQuery = fileQuery.Where(f => f.era_name == query.FileId);
                if (query.RegistraionDateFrom.HasValue) fileQuery = fileQuery.Where(f => f.createdon >= query.RegistraionDateFrom.Value);
                if (query.RegistraionDateTo.HasValue) fileQuery = fileQuery.Where(f => f.createdon <= query.RegistraionDateTo.Value);
                if (query.IncludeFilesInStatuses.Any()) fileQuery = fileQuery.Where(f => query.IncludeFilesInStatuses.Any(s => (int)s == f.statuscode));

                var matchingFileIds = (await ((DataServiceQuery<era_evacuationfile>)fileQuery).GetAllPagesAsync()).Select(f => f.era_evacuationfileid.Value).ToArray();

                //merge matching file ids
                fileIds = fileIds.Any()
                    ? fileIds.Union(matchingFileIds)
                    : fileIds.Concat(matchingFileIds);
            }

            if (query.Limit.HasValue) fileIds = fileIds.OrderByDescending(id => id).Take(query.Limit.Value);

            essContext.DetachAll();
            var evacuationFiles = new List<EvacuationFile>();
            var evacuationFilesTasks = fileIds.Distinct().Select(async id => evacuationFiles.Add(await GetEvacuationFileById(id, query.MaskSecurityPhrase)));

            //Task.WaitAll(evacuationFilesTasks.ToArray());
            foreach (var task in evacuationFilesTasks) await task;

            essContext.DetachAll();

            return evacuationFiles;
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
