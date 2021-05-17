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
            if (string.IsNullOrEmpty(evacuationFile.PrimaryRegistrantId)) throw new Exception($"The file has no associated primary registrant");

            var primaryContact = essContext.contacts.Where(c => c.contactid == Guid.Parse(evacuationFile.PrimaryRegistrantId)).SingleOrDefault();
            if (primaryContact == null) throw new Exception($"Primary registrant {evacuationFile.PrimaryRegistrantId} not found");

            var eraEvacuationFile = mapper.Map<era_evacuationfile>(evacuationFile);

            eraEvacuationFile.era_evacuationfileid = Guid.NewGuid();
            eraEvacuationFile.era_evacuationfiledate = DateTimeOffset.UtcNow;

            essContext.AddToera_evacuationfiles(eraEvacuationFile);
            essContext.AddLink(primaryContact, nameof(primaryContact.era_evacuationfile_Registrant), eraEvacuationFile);
            essContext.AddLink(essContext.LookupJurisdictionByCode(evacuationFile.EvacuatedFromAddress.Community), nameof(era_jurisdiction.era_evacuationfile_Jurisdiction), eraEvacuationFile);

            foreach (var needsAssessment in evacuationFile.NeedsAssessments)
            {
                var eraNeedsAssessment = mapper.Map<era_needassessment>(needsAssessment);

                eraNeedsAssessment.era_needassessmentid = Guid.NewGuid();
                eraNeedsAssessment.era_needsassessmentdate = DateTimeOffset.UtcNow;
                eraNeedsAssessment.era_EvacuationFile = eraEvacuationFile;

                essContext.AddToera_needassessments(eraNeedsAssessment);
                essContext.AddLink(eraEvacuationFile, nameof(eraEvacuationFile.era_needsassessment_EvacuationFile), eraNeedsAssessment);

                var primaryRegistrant = new era_needsassessmentevacuee
                {
                    era_needsassessmentevacueeid = Guid.NewGuid(),
                    era_isprimaryregistrant = true,
                    era_evacueetype = (int?)EvacueeType.Person,
                    era_isunder19 = primaryContact.birthdate.HasValue ? CheckIfUnder19Years(primaryContact.birthdate.Value, Date.Now) : (bool?)null
                };
                essContext.AddToera_needsassessmentevacuees(primaryRegistrant);
                essContext.AddLink(primaryContact, nameof(primaryContact.era_NeedsAssessmentEvacuee_RegistrantID), primaryRegistrant);
                essContext.AddLink(eraNeedsAssessment, nameof(eraNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), primaryRegistrant);

                var members = mapper.Map<IEnumerable<contact>>(needsAssessment.HouseholdMembers);

                // TODO: move into mapper
                foreach (var member in members)
                {
                    member.contactid = Guid.NewGuid();
                    member.era_registranttype = (int?)RegistrantType.Member;
                    member.era_authenticated = false;
                    member.era_verified = false;
                    member.era_registrationdate = DateTimeOffset.UtcNow;
                }
                // Add New needs assessment evacuee members to dynamics context
                foreach (var member in members)
                {
                    essContext.AddTocontacts(member);
                    var needsAssessmentMember = new era_needsassessmentevacuee
                    {
                        era_needsassessmentevacueeid = Guid.NewGuid(),
                        era_isprimaryregistrant = false,
                        era_evacueetype = (int?)EvacueeType.Person
                    };
                    essContext.AddToera_needsassessmentevacuees(needsAssessmentMember);
                    essContext.AddLink(member, nameof(member.era_NeedsAssessmentEvacuee_RegistrantID), needsAssessmentMember);
                    essContext.AddLink(eraNeedsAssessment, nameof(eraNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), needsAssessmentMember);
                }

                var pets = mapper.Map<IEnumerable<era_needsassessmentevacuee>>(needsAssessment.Pets);

                // TODO: move into mapper
                foreach (var pet in pets)
                {
                    pet.era_needsassessmentevacueeid = Guid.NewGuid();
                    pet.era_evacueetype = (int?)EvacueeType.Pet;
                }

                foreach (var petMember in pets)
                {
                    essContext.AddToera_needsassessmentevacuees(petMember);
                    essContext.AddLink(eraNeedsAssessment, nameof(eraNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), petMember);
                }
            }

            await essContext.SaveChangesAsync();

            essContext.Detach(eraEvacuationFile);
            var createdFile = essContext.era_evacuationfiles.Where(f => f.era_evacuationfileid == eraEvacuationFile.era_evacuationfileid).Single();

            var essFileNumber = createdFile.era_name;

            essContext.DetachAll();

            return essFileNumber;
        }

        public async Task<string> Delete(string essFileNumber)
        {
            //TODO: change to single
            var evacuationFile = essContext.era_evacuationfiles
                .Where(ef => ef.era_name == essFileNumber)
                .ToArray()
                .LastOrDefault();

            if (evacuationFile != null)
            {
                essContext.DeleteObject(evacuationFile);
                await essContext.SaveChangesAsync();
            }
            essContext.DetachAll();

            return essFileNumber;
        }

        private async Task<EvacuationFile> GetEvacuationFileById(Guid id)
        {
            var dynamicsFile = await essContext.era_evacuationfiles
                .ByKey(id)
                .Expand(f => f.era_Jurisdiction)
                .Expand(f => f.era_needsassessment_EvacuationFile)
                .Expand(f => f.era_Registrant)
                .GetValueAsync();

            essContext.LoadProperty(dynamicsFile.era_Jurisdiction, nameof(era_jurisdiction.era_RelatedProvinceState));
            essContext.LoadProperty(dynamicsFile.era_Jurisdiction.era_RelatedProvinceState, nameof(era_provinceterritories.era_RelatedCountry));

            var file = mapper.Map<EvacuationFile>(dynamicsFile);
            foreach (var na in file.NeedsAssessments)
            {
                var evacuees = essContext.era_needsassessmentevacuees
                    .Expand(ev => ev.era_RegistrantID)
                    .Where(ev => ev.era_NeedsAssessmentID.era_needassessmentid == Guid.Parse(na.Id) && ev.era_evacueetype == (int)EvacueeType.Person)
                    .ToArray()
                    ;

                na.HouseholdMembers = mapper.Map<IEnumerable<HouseholdMember>>(evacuees);

                var pets = essContext.era_needsassessmentevacuees
                    .Where(ev => ev.era_NeedsAssessmentID.era_needassessmentid == Guid.Parse(na.Id) && ev.era_evacueetype == (int)EvacueeType.Pet)
                    .ToArray();

                na.Pets = mapper.Map<IEnumerable<Pet>>(pets);
            }

            return file;
        }

        public async Task<IEnumerable<EvacuationFile>> ReadAll(EvacuationFilesQuery query)
        {
            IQueryable<contact> contactQuery = essContext.contacts
                  .Expand(c => c.era_City)
                  .Expand(c => c.era_ProvinceState)
                  .Expand(c => c.era_Country)
                  .Expand(c => c.era_MailingCity)
                  .Expand(c => c.era_MailingProvinceState)
                  .Expand(c => c.era_MailingCountry)
                  .Where(c => c.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(query.UserId)) contactQuery = contactQuery.Where(c => c.era_bcservicescardid.Equals(query.UserId, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(query.LastName)) contactQuery = contactQuery.Where(c => c.lastname.Equals(query.LastName, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(query.FirstName)) contactQuery = contactQuery.Where(c => c.firstname.Equals(query.FirstName, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(query.DateOfBirth)) contactQuery = contactQuery.Where(c => c.birthdate.Equals(Date.Parse(query.DateOfBirth)));
            if (!query.IncludeRestrictedAccess) contactQuery = contactQuery.Where(c => c.era_restriction.Equals(false));

            /*
            public bool IncludeHouseholdMembers
            public EvacuationFileStatus[] IncludeFilesInStatuses
            */

            var contacts = await ((DataServiceQuery<contact>)contactQuery).GetAllPagesAsync();

            essContext.DetachAll();

            if (contacts == null)
            {
                return Array.Empty<EvacuationFile>();
            }

            var contactIds = contacts.Select(c => c.contactid).Distinct().ToList();

            var fileIds = new List<Guid?>();
            foreach (Guid contactId in contactIds)
            {
                var evacuees = essContext.era_needsassessmentevacuees
                    .Expand(ev => ev.era_RegistrantID)
                    .Expand(ev => ev.era_NeedsAssessmentID)
                    .Where(ev => ev.era_RegistrantID.contactid == contactId)
                    .ToArray();

                var ids = evacuees.Select(ev => ev.era_NeedsAssessmentID?._era_evacuationfile_value.Value).Where(id => id.HasValue).Distinct().ToList();
                foreach (Guid fileId in ids)
                {
                    fileIds.Add(fileId);
                }

                essContext.DetachAll();
            }
            var evacuationFiles = fileIds.Select(id => GetEvacuationFileById(id.Value).GetAwaiter().GetResult()).ToArray();
            if (!string.IsNullOrEmpty(query.FileId)) evacuationFiles = evacuationFiles.Where(ef => ef.Id.Equals(query.FileId, StringComparison.OrdinalIgnoreCase)).ToArray();
            if (!(query.IncludeFilesInStatuses.Length == 0)) evacuationFiles = evacuationFiles.Where(ef => query.IncludeFilesInStatuses.Contains(ef.Status)).ToArray();

            essContext.DetachAll();
            return await Task.FromResult(evacuationFiles);
        }

        public async Task<EvacuationFile> Read(string essFileNumber)
        {
            //TODO: change to singleordefault
            var evacuationFileId = essContext.era_evacuationfiles
                .Where(f => f.era_name == essFileNumber)
                .ToArray()
                .LastOrDefault()?.era_evacuationfileid;

            if (!evacuationFileId.HasValue) return null;

            essContext.DetachAll();

            var file = await GetEvacuationFileById(evacuationFileId.Value);

            essContext.DetachAll();
            return file;
        }

        public async Task<string> Update(EvacuationFile file)
        {
            if (string.IsNullOrEmpty(file.PrimaryRegistrantId)) throw new Exception($"The file has no associated primary registrant");

            //TODO: change to single
            var existingEvacuationFile = essContext.era_evacuationfiles
                .Where(e => e.era_name == file.Id)
                .ToArray()
                .LastOrDefault();

            if (existingEvacuationFile == null) throw new Exception($"File {file.Id} not found");

            essContext.LoadProperty(existingEvacuationFile, nameof(era_evacuationfile.era_needsassessment_EvacuationFile));
            var existingNeedsAssessments = existingEvacuationFile.era_needsassessment_EvacuationFile.ToArray();

            essContext.Detach(existingEvacuationFile);

            // New evacuation file mapped from entered evacaution file
            var updatedEvacuationFile = mapper.Map<era_evacuationfile>(file);

            updatedEvacuationFile.era_evacuationfileid = existingEvacuationFile.era_evacuationfileid;

            // attach evacuation file to dynamics context
            essContext.AttachTo(nameof(essContext.era_evacuationfiles), updatedEvacuationFile);
            essContext.UpdateObject(updatedEvacuationFile);

            // add jurisdiction/city to evacuation
            if (!string.IsNullOrEmpty(file.EvacuatedFromAddress.Community))
            {
                var evacuatedFromJurisdiction = essContext.LookupJurisdictionByCode(file.EvacuatedFromAddress.Community);
                essContext.AddLink(evacuatedFromJurisdiction, nameof(era_jurisdiction.era_evacuationfile_Jurisdiction), updatedEvacuationFile);
            }

            foreach (var needsAssessment in file.NeedsAssessments)
            {
                var updatedNeedsAssessment = mapper.Map<era_needassessment>(needsAssessment);
                var existingNeedsAssessment = existingNeedsAssessments.Where(na => na.era_needassessmentid == updatedNeedsAssessment.era_needassessmentid).SingleOrDefault();
                if (existingNeedsAssessment == null) throw new Exception($"needs assessment {updatedNeedsAssessment.era_needassessmentid} not found");

                essContext.LoadProperty(existingNeedsAssessment, nameof(era_needassessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID));

                updatedNeedsAssessment.era_needsassessmentdate = existingNeedsAssessment.era_needsassessmentdate;
                updatedNeedsAssessment.era_EvacuationFile = updatedEvacuationFile;

                essContext.Detach(existingNeedsAssessment);
                // attach needs assessment to dynamics context
                essContext.AttachTo(nameof(essContext.era_needassessments), updatedNeedsAssessment);
                essContext.UpdateObject(updatedNeedsAssessment);

                // Contacts (Household Members)
                // Add New needs assessment evacuee members to dynamics context
                var currentEvacuees = existingNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID
                    .Where(e => e.era_evacueetype == (int?)EvacueeType.Person).ToArray();
                var updatedEvacuees = new List<Guid>();
                foreach (var member in needsAssessment.HouseholdMembers)
                {
                    var era_contact = mapper.Map<contact>(member);

                    if (era_contact.contactid == null)
                    {
                        // New member
                        era_contact.contactid = Guid.NewGuid();
                        era_contact.era_registranttype = (int?)RegistrantType.Member;
                        era_contact.era_authenticated = false;
                        era_contact.era_verified = false;
                        era_contact.era_registrationdate = DateTimeOffset.UtcNow;

                        essContext.AddTocontacts(era_contact);
                        var evacuee = new era_needsassessmentevacuee
                        {
                            era_needsassessmentevacueeid = Guid.NewGuid(),
                            era_isprimaryregistrant = false,
                            era_evacueetype = (int?)EvacueeType.Person,
                            era_isunder19 = CheckIfUnder19Years((Date)era_contact.birthdate, Date.Now)
                        };
                        essContext.AddToera_needsassessmentevacuees(evacuee);

                        // link members and needs assessment to evacuee record
                        essContext.AddLink(era_contact, nameof(era_contact.era_NeedsAssessmentEvacuee_RegistrantID), evacuee);
                        essContext.AddLink(updatedNeedsAssessment, nameof(era_needassessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), evacuee);
                    }
                    else
                    {
                        // Existing member
                        var existingContact = essContext.contacts
                            .Where(c => c.contactid == era_contact.contactid).FirstOrDefault();

                        var existingBirthdate = existingContact.birthdate;

                        essContext.Detach(existingContact);

                        essContext.AttachTo(nameof(essContext.contacts), era_contact);

                        var evacuee = currentEvacuees.FirstOrDefault(e => e._era_registrantid_value == era_contact.contactid);
                        if (evacuee == null) throw new Exception($"evacuee {era_contact.contactid} not found in needs assessment {existingNeedsAssessment.era_needassessmentid}");

                        if (era_contact.birthdate != existingBirthdate)
                        {
                            // When updating the birthdate, recheck if evacuee is under 19 years of age
                            evacuee.era_isunder19 = CheckIfUnder19Years((Date)era_contact.birthdate, Date.Now);
                        }

                        essContext.UpdateObject(era_contact);
                        essContext.UpdateObject(evacuee);
                        updatedEvacuees.Add(evacuee.era_needsassessmentevacueeid.Value);
                    }
                }

                var evacueesToDelete = currentEvacuees.Where(e => !updatedEvacuees.Any(id => id == e.era_needsassessmentevacueeid));

                foreach (var evacuee in evacueesToDelete)
                {
                    essContext.DeleteObject(evacuee);
                    //TODO: delete contact and related link
                }

                //TODO: add, update and delete pets

                // Needs assessment evacuee as pet
                // Currently no good way to identify the specific pet to update. Will revisit when Pet table has been added.
                var currentPets = existingNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID
                    .Where(e => e.era_evacueetype == (int?)EvacueeType.Pet).ToArray();
                foreach (var pet in currentPets)
                {
                    essContext.UpdateObject(pet);
                }
            }

            await essContext.SaveChangesAsync();

            essContext.DetachAll();

            return updatedEvacuationFile.era_name;
        }

        private Guid? GetContactIdForBcscId(string bcscId) =>
      string.IsNullOrEmpty(bcscId)
          ? null
          : essContext.contacts
              .Where(c => c.era_bcservicescardid == bcscId)
              .Select(c => new { c.contactid, c.era_bcservicescardid })
              .SingleOrDefault()?.contactid;

        public bool CheckIfUnder19Years(Date birthdate, Date currentDate)
        {
            return birthdate.AddYears(19) >= currentDate;
        }
    }
}
