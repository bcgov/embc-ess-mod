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
using EMBC.ESS.Resources.Contacts;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Microsoft.OData.Edm;

namespace EMBC.ESS.Resources.Cases.Evacuations
{
    public class EvacuationRepository : IEvacuationRepository
    {
        private readonly EssContext context;
        private readonly IMapper mapper;

        public EvacuationRepository(EssContext dynamicsClientContext, IMapper mapper)
        {
            this.context = dynamicsClientContext;
            this.mapper = mapper;
        }

        public Task<ManageCaseCommandResult> ManageCase(ManageCaseCommand cmd)
        {
            throw new NotImplementedException();
        }

        public Task<CaseQueryResult> QueryCase(CaseQuery query)
        {
            throw new NotImplementedException();
        }

        public async Task<string> Create(string userId, EvacuationFile evacuationFile)
        {
            // get dynamics contact by BCServicesCardId
            contact dynamicsContact = GetDynamicsContactByBCSC(userId);

            if (dynamicsContact == null)
            {
                return string.Empty;
            }

            // return contact as a profile
            var contact = mapper.Map<Contact>(dynamicsContact);
            var essFileNumber = new Random().Next(999999999); // temporary ESS file number random generator

            // New era evacuation file mapped from incoming evacuation file
            var eraEvacuationFile = mapper.Map<era_evacuationfile>(evacuationFile);

            eraEvacuationFile.era_evacuationfileid = Guid.NewGuid();
            eraEvacuationFile.era_essfilenumber = essFileNumber;
            eraEvacuationFile.era_evacuationfiledate = DateTimeOffset.UtcNow;
            eraEvacuationFile.era_secrettext = contact.SecretPhrase;

            // add evacuation file to dynamics context
            context.AddToera_evacuationfiles(eraEvacuationFile);
            // link primary registrant to evacuation file
            context.AddLink(dynamicsContact, nameof(dynamicsContact.era_evacuationfile_Registrant), eraEvacuationFile);
            // add jurisdiction/city to evacuation
            context.AddLink(context.LookupJurisdictionByCode(evacuationFile.EvacuatedFromAddress.Community), nameof(era_jurisdiction.era_evacuationfile_Jurisdiction), eraEvacuationFile);

            foreach (var needsAssessment in evacuationFile.NeedsAssessments)
            {
                // New needs assessment mapped from incoming evacuation file Needs Assessment
                var eraNeedsAssessment = mapper.Map<era_needassessment>(needsAssessment);

                eraNeedsAssessment.era_needassessmentid = Guid.NewGuid();
                eraNeedsAssessment.era_needsassessmentdate = DateTimeOffset.UtcNow;
                eraNeedsAssessment.era_EvacuationFile = eraEvacuationFile;

                // New Contacts (Household Members)
                var members = mapper.Map<IEnumerable<contact>>(needsAssessment.HouseholdMembers);

                foreach (var member in members)
                {
                    member.contactid = Guid.NewGuid();
                    member.era_registranttype = (int?)RegistrantType.Member;
                    member.era_authenticated = false;
                    member.era_verified = false;
                    member.era_registrationdate = DateTimeOffset.UtcNow;
                }

                // New needs assessment evacuee as pet
                var pets = mapper.Map<IEnumerable<era_needsassessmentevacuee>>(needsAssessment.Pets);

                foreach (var pet in pets)
                {
                    pet.era_needsassessmentevacueeid = Guid.NewGuid();
                    pet.era_evacueetype = (int?)EvacueeType.Pet;
                }

                // add needs assessment to dynamics context
                context.AddToera_needassessments(eraNeedsAssessment);
                // link evacuation file to needs assessment
                context.AddLink(eraEvacuationFile, nameof(eraEvacuationFile.era_needsassessment_EvacuationFile), eraNeedsAssessment);

                // New needs assessment evacuee as primary registrant
                var newNeedsAssessmentEvacueeRegistrant = new era_needsassessmentevacuee
                {
                    era_needsassessmentevacueeid = Guid.NewGuid(),
                    era_isprimaryregistrant = true,
                    era_evacueetype = (int?)EvacueeType.Person,
                    era_isunder19 = CheckIfUnder19Years(Date.Parse(contact.DateOfBirth), Date.Now)
                };
                context.AddToera_needsassessmentevacuees(newNeedsAssessmentEvacueeRegistrant);
                // link registrant (contact) and needs assessment to evacuee record
                context.AddLink(dynamicsContact, nameof(dynamicsContact.era_NeedsAssessmentEvacuee_RegistrantID), newNeedsAssessmentEvacueeRegistrant);
                context.AddLink(eraNeedsAssessment, nameof(eraNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), newNeedsAssessmentEvacueeRegistrant);

                // Add New needs assessment evacuee members to dynamics context
                foreach (var member in members)
                {
                    context.AddTocontacts(member);
                    var newNeedsAssessmentEvacueeMember = new era_needsassessmentevacuee
                    {
                        era_needsassessmentevacueeid = Guid.NewGuid(),
                        era_isprimaryregistrant = false,
                        era_evacueetype = (int?)EvacueeType.Person
                    };
                    context.AddToera_needsassessmentevacuees(newNeedsAssessmentEvacueeMember);
                    // link members and needs assessment to evacuee record
                    context.AddLink(member, nameof(member.era_NeedsAssessmentEvacuee_RegistrantID), newNeedsAssessmentEvacueeMember);
                    context.AddLink(eraNeedsAssessment, nameof(eraNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), newNeedsAssessmentEvacueeMember);

                    // link registrant primary and mailing address city, province, country
                    context.AddLink(context.LookupCountryByCode(contact.PrimaryAddress.Country), nameof(era_country.era_contact_Country), member);
                    context.AddLink(context.LookupStateProvinceByCode(contact.PrimaryAddress.StateProvince), nameof(era_provinceterritories.era_provinceterritories_contact_ProvinceState), member);
                    context.AddLink(context.LookupJurisdictionByCode(contact.PrimaryAddress.Community), nameof(era_jurisdiction.era_jurisdiction_contact_City), member);

                    context.AddLink(context.LookupCountryByCode(contact.MailingAddress.Country), nameof(era_country.era_country_contact_MailingCountry), member);
                    context.AddLink(context.LookupStateProvinceByCode(contact.MailingAddress.StateProvince), nameof(era_provinceterritories.era_provinceterritories_contact_MailingProvinceState), member);
                    context.AddLink(context.LookupJurisdictionByCode(contact.MailingAddress.Community), nameof(era_jurisdiction.era_jurisdiction_contact_MailingCity), member);
                }

                // Add New needs assessment evacuee pets to dynamics context
                foreach (var petMember in pets)
                {
                    context.AddToera_needsassessmentevacuees(petMember);
                    // link pet to evacuee record
                    context.AddLink(eraNeedsAssessment, nameof(eraNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), petMember);
                }
            }

            //post as batch is not accepted by SSG. Sending with default option (multiple requests to the server stopping on the first failure)
            var results = await context.SaveChangesAsync<era_evacuationfile>(SaveChangesOptions.BatchWithSingleChangeset);

            context.Detach(eraEvacuationFile.era_needsassessment_EvacuationFile);
            context.Detach(eraEvacuationFile);

            var queryResult = context.era_evacuationfiles
                .Where(f => f.era_evacuationfileid == eraEvacuationFile.era_evacuationfileid).FirstOrDefault();

            essFileNumber = (int)queryResult?.era_essfilenumber;

            context.DetachAll();

            return essFileNumber.ToString();
        }

        public async Task Delete(string userId, string essFileNumber)
        {
            await Task.CompletedTask;

            // get dynamics contact by BCServicesCardId
            contact dynamicsContact = GetDynamicsContactByBCSC(userId);

            if (dynamicsContact != null)
            {
                var evacuationFile = context.era_evacuationfiles
                    .Where(ef => ef.era_essfilenumber == int.Parse(essFileNumber)).FirstOrDefault();

                if (evacuationFile != null)
                {
                    context.DeleteObject(evacuationFile);
                    await context.SaveChangesAsync();
                }
            }
            context.DetachAll();
        }

        private async Task<EvacuationFile> GetEvacuationFileById(Guid id)
        {
            var dynamicsFile = await context.era_evacuationfiles
                .ByKey(id)
                .Expand(f => f.era_Jurisdiction)
                .Expand(f => f.era_needsassessment_EvacuationFile)
                .GetValueAsync();

            context.LoadProperty(dynamicsFile.era_Jurisdiction, nameof(era_jurisdiction.era_RelatedProvinceState));
            context.LoadProperty(dynamicsFile.era_Jurisdiction.era_RelatedProvinceState, nameof(era_provinceterritories.era_RelatedCountry));

            var file = mapper.Map<EvacuationFile>(dynamicsFile);
            foreach (var na in file.NeedsAssessments)
            {
                var evacuees = context.era_needsassessmentevacuees
                    .Expand(ev => ev.era_RegistrantID)
                    .Where(ev => ev.era_NeedsAssessmentID.era_needassessmentid == Guid.Parse(na.Id) && ev.era_evacueetype == (int)EvacueeType.Person)
                    .ToArray()
                    ;

                na.HouseholdMembers = mapper.Map<IEnumerable<HouseholdMember>>(evacuees);

                var pets = context.era_needsassessmentevacuees
                    .Where(ev => ev.era_NeedsAssessmentID.era_needassessmentid == Guid.Parse(na.Id) && ev.era_evacueetype == (int)EvacueeType.Pet)
                    .ToArray();

                na.Pets = mapper.Map<IEnumerable<Pet>>(pets);
            }

            return file;
        }

        public async Task<IEnumerable<EvacuationFile>> Read(string userId)
        {
            var registrant = context.contacts.Where(c => c.era_bcservicescardid == userId).Select(c => new { c.contactid }).ToArray().SingleOrDefault();

            if (registrant == null)
            {
                return Array.Empty<EvacuationFile>();
            }

            var fileIds = context.era_needsassessmentevacuees
                .Expand(ev => ev.era_NeedsAssessmentID)
                .Where(ev => ev.era_RegistrantID.contactid == registrant.contactid)
                .ToArray()
                .Select(ev => ev.era_NeedsAssessmentID?._era_evacuationfile_value)
                .Where(id => id.HasValue)
                .Distinct()
                ;
            context.DetachAll();

            var evacuationFiles = fileIds.Select(id => GetEvacuationFileById(id.Value).GetAwaiter().GetResult()).ToArray();

            context.DetachAll();
            return await Task.FromResult(evacuationFiles);
        }

        public async Task<EvacuationFile> Read(string userId, string essFileNumber)
        {
            var evacuationFileId = context.era_evacuationfiles
                .Where(f => f.era_essfilenumber == int.Parse(essFileNumber))
                .SingleOrDefault()?.era_evacuationfileid;

            if (!evacuationFileId.HasValue) return null;

            context.DetachAll();

            var file = await GetEvacuationFileById(evacuationFileId.Value);

            context.DetachAll();
            return file;
        }

        public async Task<string> Update(string userId, string essFileNumber, EvacuationFile evacuationFileIn)
        {
            await Task.CompletedTask;

            // get dynamics contact by BCServicesCardId
            contact primaryRegistrant = GetDynamicsContactByBCSC(userId);

            if (primaryRegistrant == null) throw new Exception($"Primary registrant {userId} not found");

            context.Detach(primaryRegistrant);

            var existingEvacuationFile = context.era_evacuationfiles
                .Where(e => e.era_essfilenumber == int.Parse(essFileNumber)).FirstOrDefault();

            context.LoadProperty(existingEvacuationFile, nameof(era_evacuationfile.era_needsassessment_EvacuationFile));

            context.Detach(existingEvacuationFile);

            // return contact
            var contact = mapper.Map<Contact>(primaryRegistrant);

            // New evacuation file mapped from entered evacaution file
            var updatedEvacuationFile = mapper.Map<era_evacuationfile>(evacuationFileIn);

            updatedEvacuationFile.era_evacuationfileid = existingEvacuationFile.era_evacuationfileid;

            // attach evacuation file to dynamics context
            context.AttachTo(nameof(context.era_evacuationfiles), updatedEvacuationFile);
            context.UpdateObject(updatedEvacuationFile);

            // add jurisdiction/city to evacuation
            if (!string.IsNullOrEmpty(evacuationFileIn.EvacuatedFromAddress.Community))
            {
                var evacuatedFromJurisdiction = context.LookupJurisdictionByCode(evacuationFileIn.EvacuatedFromAddress.Community);
                context.AddLink(evacuatedFromJurisdiction, nameof(era_jurisdiction.era_evacuationfile_Jurisdiction), updatedEvacuationFile);
            }

            var existingNeedsAssessments = existingEvacuationFile.era_needsassessment_EvacuationFile.ToArray();

            foreach (var needsAssessment in evacuationFileIn.NeedsAssessments)
            {
                var updatedNeedsAssessment = mapper.Map<era_needassessment>(needsAssessment);
                var existingNeedsAssessment = existingNeedsAssessments.Where(na => na.era_needassessmentid == updatedNeedsAssessment.era_needassessmentid).SingleOrDefault();
                if (existingNeedsAssessment == null) throw new Exception($"needs assessment {updatedNeedsAssessment.era_needassessmentid} not found");

                context.LoadProperty(existingNeedsAssessment, nameof(era_needassessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID));

                updatedNeedsAssessment.era_needsassessmentdate = existingNeedsAssessment.era_needsassessmentdate;
                updatedNeedsAssessment.era_EvacuationFile = updatedEvacuationFile;

                context.Detach(existingNeedsAssessment);
                // attach needs assessment to dynamics context
                context.AttachTo(nameof(context.era_needassessments), updatedNeedsAssessment);
                context.UpdateObject(updatedNeedsAssessment);

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

                        context.AddTocontacts(era_contact);
                        var evacuee = new era_needsassessmentevacuee
                        {
                            era_needsassessmentevacueeid = Guid.NewGuid(),
                            era_isprimaryregistrant = false,
                            era_evacueetype = (int?)EvacueeType.Person,
                            era_isunder19 = CheckIfUnder19Years((Date)era_contact.birthdate, Date.Now)
                        };
                        context.AddToera_needsassessmentevacuees(evacuee);

                        // link members and needs assessment to evacuee record
                        context.AddLink(era_contact, nameof(era_contact.era_NeedsAssessmentEvacuee_RegistrantID), evacuee);
                        context.AddLink(updatedNeedsAssessment, nameof(era_needassessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), evacuee);

                        // link registrant primary and mailing address city, province, country
                        context.AddLink(context.LookupCountryByCode(contact.PrimaryAddress.Country), nameof(era_country.era_contact_Country), era_contact);
                        context.AddLink(context.LookupStateProvinceByCode(contact.PrimaryAddress.StateProvince), nameof(era_provinceterritories.era_provinceterritories_contact_ProvinceState), era_contact);
                        context.AddLink(context.LookupJurisdictionByCode(contact.PrimaryAddress.Community), nameof(era_jurisdiction.era_jurisdiction_contact_City), era_contact);

                        context.AddLink(context.LookupCountryByCode(contact.MailingAddress.Country), nameof(era_country.era_country_contact_MailingCountry), era_contact);
                        context.AddLink(context.LookupStateProvinceByCode(contact.MailingAddress.StateProvince), nameof(era_provinceterritories.era_provinceterritories_contact_MailingProvinceState), era_contact);
                        context.AddLink(context.LookupJurisdictionByCode(contact.MailingAddress.Community), nameof(era_jurisdiction.era_jurisdiction_contact_MailingCity), era_contact);
                    }
                    else
                    {
                        // Existing member
                        var existingContact = context.contacts
                            .Where(c => c.contactid == era_contact.contactid).FirstOrDefault();

                        var existingBirthdate = existingContact.birthdate;

                        context.Detach(existingContact);

                        context.AttachTo(nameof(context.contacts), era_contact);

                        var evacuee = currentEvacuees.FirstOrDefault(e => e._era_registrantid_value == era_contact.contactid);
                        if (evacuee == null) throw new Exception($"evacuee {era_contact.contactid} not found in needs assessment {existingNeedsAssessment.era_needassessmentid}");

                        if (era_contact.birthdate != existingBirthdate)
                        {
                            // When updating the birthdate, recheck if evacuee is under 19 years of age
                            evacuee.era_isunder19 = CheckIfUnder19Years((Date)era_contact.birthdate, Date.Now);
                        }

                        context.UpdateObject(era_contact);
                        context.UpdateObject(evacuee);
                        updatedEvacuees.Add(evacuee.era_needsassessmentevacueeid.Value);
                    }
                }

                var evacueesToDelete = currentEvacuees.Where(e => !updatedEvacuees.Any(id => id == e.era_needsassessmentevacueeid));

                foreach (var evacuee in evacueesToDelete)
                {
                    context.DeleteObject(evacuee);
                    //TODO: delete contact and related link
                }

                //TODO: add, update and delete pets

                // Needs assessment evacuee as pet
                // Currently no good way to identify the specific pet to update. Will revisit when Pet table has been added.
                var currentPets = existingNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID
                    .Where(e => e.era_evacueetype == (int?)EvacueeType.Pet).ToArray();
                foreach (var pet in currentPets)
                {
                    context.UpdateObject(pet);
                }
            }

            //post as batch is not accepted by SSG. Sending with default option (multiple requests to the server stopping on the first failure)
            await context.SaveChangesAsync();

            var queryResult = context.era_evacuationfiles
                .Expand(f => f.era_needsassessment_EvacuationFile)
                .Where(f => f.era_evacuationfileid == updatedEvacuationFile.era_evacuationfileid).FirstOrDefault();

            essFileNumber = queryResult?.era_essfilenumber.ToString();

            context.DetachAll();

            return $"{essFileNumber:D9}";
        }

        private contact GetDynamicsContactByBCSC(string BCServicesCardId)
        {
            return context.contacts
                               .Expand(c => c.era_City)
                               .Expand(c => c.era_ProvinceState)
                               .Expand(c => c.era_Country)
                               .Expand(c => c.era_MailingCity)
                               .Expand(c => c.era_MailingProvinceState)
                               .Expand(c => c.era_MailingCountry)
                               .Where(c => c.era_bcservicescardid == BCServicesCardId).FirstOrDefault();
        }

        public bool CheckIfUnder19Years(Date birthdate, Date currentDate)
        {
            return birthdate.AddYears(19) >= currentDate;
        }
    }
}
