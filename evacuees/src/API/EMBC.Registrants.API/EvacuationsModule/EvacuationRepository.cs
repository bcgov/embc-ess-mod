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
using EMBC.ResourceAccess.Dynamics;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Microsoft.OData.Edm;

namespace EMBC.Registrants.API.EvacuationsModule
{
    public interface IEvacuationRepository
    {
        Task<string> Create(string userId, EvacuationFile evacuationFile);

        Task<IEnumerable<EvacuationFile>> Read(string userId);

        Task<EvacuationFile> Read(string userId, string essFileNumber);

        Task<string> Update(string userId, string essFileNumber, EvacuationFile evacuationFile);

        Task Delete(string userId, string essFileNumber);
    }

    public class EvacuationRepository : IEvacuationRepository
    {
        private readonly DynamicsClientContext dynamicsClient;
        private readonly IMapper mapper;

        public EvacuationRepository(DynamicsClientContext dynamicsClient, IMapper mapper)
        {
            this.dynamicsClient = dynamicsClient;
            this.mapper = mapper;
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
            var profile = mapper.Map<ProfilesModule.Profile>(dynamicsContact);
            var essFileNumber = new Random().Next(999999999); // temporary ESS file number random generator

            // New era evacuation file mapped from incoming evacuation file
            var eraEvacuationFile = mapper.Map<era_evacuationfile>(evacuationFile);

            eraEvacuationFile.era_evacuationfileid = Guid.NewGuid();
            eraEvacuationFile.era_essfilenumber = essFileNumber;
            eraEvacuationFile.era_evacuationfiledate = DateTimeOffset.UtcNow;
            eraEvacuationFile.era_secrettext = profile.SecretPhrase;

            // add evacuation file to dynamics context
            dynamicsClient.AddToera_evacuationfiles(eraEvacuationFile);
            // link primary registrant to evacuation file
            dynamicsClient.TryAddLink(dynamicsContact, nameof(dynamicsContact.era_evacuationfile_Registrant), eraEvacuationFile);
            // add jurisdiction/city to evacuation
            dynamicsClient.TryAddLink(dynamicsClient.LookupJurisdictionByCode(evacuationFile.EvacuatedFromAddress.Jurisdiction.Code), nameof(era_jurisdiction.era_evacuationfile_Jurisdiction), eraEvacuationFile);

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
                dynamicsClient.AddToera_needassessments(eraNeedsAssessment);
                // link evacuation file to needs assessment
                dynamicsClient.TryAddLink(eraEvacuationFile, nameof(eraEvacuationFile.era_needsassessment_EvacuationFile), eraNeedsAssessment);

                // New needs assessment evacuee as primary registrant
                var newNeedsAssessmentEvacueeRegistrant = new era_needsassessmentevacuee
                {
                    era_needsassessmentevacueeid = Guid.NewGuid(),
                    era_isprimaryregistrant = true,
                    era_evacueetype = (int?)EvacueeType.Person,
                    era_isunder19 = CheckIfUnder19Years(Date.Parse(profile.PersonalDetails.DateOfBirth), Date.Now)
                };
                dynamicsClient.AddToera_needsassessmentevacuees(newNeedsAssessmentEvacueeRegistrant);
                // link registrant (contact) and needs assessment to evacuee record
                dynamicsClient.TryAddLink(dynamicsContact, nameof(dynamicsContact.era_NeedsAssessmentEvacuee_RegistrantID), newNeedsAssessmentEvacueeRegistrant);
                dynamicsClient.TryAddLink(eraNeedsAssessment, nameof(eraNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), newNeedsAssessmentEvacueeRegistrant);

                // Add New needs assessment evacuee members to dynamics context
                foreach (var member in members)
                {
                    dynamicsClient.AddTocontacts(member);
                    var newNeedsAssessmentEvacueeMember = new era_needsassessmentevacuee
                    {
                        era_needsassessmentevacueeid = Guid.NewGuid(),
                        era_isprimaryregistrant = false,
                        era_evacueetype = (int?)EvacueeType.Person
                    };
                    dynamicsClient.AddToera_needsassessmentevacuees(newNeedsAssessmentEvacueeMember);
                    // link members and needs assessment to evacuee record
                    dynamicsClient.TryAddLink(member, nameof(member.era_NeedsAssessmentEvacuee_RegistrantID), newNeedsAssessmentEvacueeMember);
                    dynamicsClient.TryAddLink(eraNeedsAssessment, nameof(eraNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), newNeedsAssessmentEvacueeMember);

                    // link registrant primary and mailing address city, province, country
                    dynamicsClient.TryAddLink(dynamicsClient.LookupCountryByCode(profile.PrimaryAddress.Country.Code), nameof(era_country.era_contact_Country), member);
                    dynamicsClient.TryAddLink(dynamicsClient.LookupStateProvinceByCode(profile.PrimaryAddress.StateProvince.Code), nameof(era_provinceterritories.era_provinceterritories_contact_ProvinceState), member);
                    dynamicsClient.TryAddLink(dynamicsClient.LookupJurisdictionByCode(profile.PrimaryAddress.Jurisdiction.Code), nameof(era_jurisdiction.era_jurisdiction_contact_City), member);

                    dynamicsClient.TryAddLink(dynamicsClient.LookupCountryByCode(profile.MailingAddress.Country.Code), nameof(era_country.era_country_contact_MailingCountry), member);
                    dynamicsClient.TryAddLink(dynamicsClient.LookupStateProvinceByCode(profile.MailingAddress.StateProvince.Code), nameof(era_provinceterritories.era_provinceterritories_contact_MailingProvinceState), member);
                    dynamicsClient.TryAddLink(dynamicsClient.LookupJurisdictionByCode(profile.MailingAddress.Jurisdiction.Code), nameof(era_jurisdiction.era_jurisdiction_contact_MailingCity), member);
                }

                // Add New needs assessment evacuee pets to dynamics context
                foreach (var petMember in pets)
                {
                    dynamicsClient.AddToera_needsassessmentevacuees(petMember);
                    // link pet to evacuee record
                    dynamicsClient.TryAddLink(eraNeedsAssessment, nameof(eraNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), petMember);
                }
            }

            //post as batch is not accepted by SSG. Sending with default option (multiple requests to the server stopping on the first failure)
            var results = await dynamicsClient.SaveChangesAsync<era_evacuationfile>(SaveChangesOptions.BatchWithSingleChangeset);

            dynamicsClient.Detach(eraEvacuationFile.era_needsassessment_EvacuationFile);
            dynamicsClient.Detach(eraEvacuationFile);

            var queryResult = dynamicsClient.era_evacuationfiles
                .Where(f => f.era_evacuationfileid == eraEvacuationFile.era_evacuationfileid).FirstOrDefault();

            essFileNumber = (int)queryResult?.era_essfilenumber;

            dynamicsClient.DetachAll();

            return essFileNumber.ToString();
        }

        public async Task Delete(string userId, string essFileNumber)
        {
            await Task.CompletedTask;

            // get dynamics contact by BCServicesCardId
            contact dynamicsContact = GetDynamicsContactByBCSC(userId);

            if (dynamicsContact != null)
            {
                var evacuationFile = dynamicsClient.era_evacuationfiles
                    .Where(ef => ef.era_essfilenumber == int.Parse(essFileNumber)).FirstOrDefault();

                if (evacuationFile != null)
                {
                    dynamicsClient.DeleteObject(evacuationFile);
                    await dynamicsClient.SaveChangesAsync();
                }
            }
            dynamicsClient.DetachAll();
        }

        private async Task<EvacuationFile> GetEvacuationFileById(Guid id)
        {
            var dynamicsFile = await dynamicsClient.era_evacuationfiles
                .ByKey(id)
                .Expand(f => f.era_Jurisdiction)
                .Expand(f => f.era_needsassessment_EvacuationFile)
                .GetValueAsync();

            var file = mapper.Map<EvacuationFile>(dynamicsFile);
            foreach (var na in file.NeedsAssessments)
            {
                var evacuees = dynamicsClient.era_needsassessmentevacuees
                    .Expand(ev => ev.era_RegistrantID)
                    .Where(ev => ev.era_NeedsAssessmentID.era_needassessmentid == Guid.Parse(na.Id) && ev.era_evacueetype == (int)EvacueeType.Person)
                    .ToArray()
                    ;

                na.HouseholdMembers = mapper.Map<IEnumerable<HouseholdMember>>(evacuees);

                var pets = dynamicsClient.era_needsassessmentevacuees
                    .Where(ev => ev.era_NeedsAssessmentID.era_needassessmentid == Guid.Parse(na.Id) && ev.era_evacueetype == (int)EvacueeType.Pet)
                    .ToArray();

                na.Pets = mapper.Map<IEnumerable<Pet>>(pets);
            }

            return file;
        }

        public async Task<IEnumerable<EvacuationFile>> Read(string userId)
        {
            var registrant = dynamicsClient.contacts.Where(c => c.era_bcservicescardid == userId).Select(c => new { c.contactid }).ToArray().SingleOrDefault();

            if (registrant == null)
            {
                return Array.Empty<EvacuationFile>();
            }

            var fileIds = dynamicsClient.era_needsassessmentevacuees
                .Expand(ev => ev.era_NeedsAssessmentID)
                .Where(ev => ev.era_RegistrantID.contactid == registrant.contactid)
                .ToArray()
                .Select(ev => ev.era_NeedsAssessmentID?._era_evacuationfile_value)
                .Where(id => id.HasValue)
                .Distinct()
                ;
            dynamicsClient.DetachAll();

            var evacuationFiles = fileIds.Select(id => GetEvacuationFileById(id.Value).GetAwaiter().GetResult()).ToArray();

            dynamicsClient.DetachAll();
            return await Task.FromResult(evacuationFiles);
        }

        public async Task<EvacuationFile> Read(string userId, string essFileNumber)
        {
            var evacuationFileId = dynamicsClient.era_evacuationfiles
                .Where(f => f.era_essfilenumber == int.Parse(essFileNumber))
                .SingleOrDefault()?.era_evacuationfileid;

            if (!evacuationFileId.HasValue) return null;

            dynamicsClient.DetachAll();

            var file = await GetEvacuationFileById(evacuationFileId.Value);

            dynamicsClient.DetachAll();
            return file;
        }

        public async Task<string> Update(string userId, string essFileNumber, EvacuationFile evacuationFileIn)
        {
            await Task.CompletedTask;

            // get dynamics contact by BCServicesCardId
            contact primaryRegistrant = GetDynamicsContactByBCSC(userId);

            if (primaryRegistrant == null) throw new Exception($"Primary registrant {userId} not found");

            dynamicsClient.Detach(primaryRegistrant);

            var existingEvacuationFile = dynamicsClient.era_evacuationfiles
                .Where(e => e.era_essfilenumber == int.Parse(essFileNumber)).FirstOrDefault();

            dynamicsClient.LoadProperty(existingEvacuationFile, nameof(era_evacuationfile.era_needsassessment_EvacuationFile));

            dynamicsClient.Detach(existingEvacuationFile);

            // return contact as a profile
            var profile = mapper.Map<ProfilesModule.Profile>(primaryRegistrant);

            // New evacuation file mapped from entered evacaution file
            var updatedEvacuationFile = mapper.Map<era_evacuationfile>(evacuationFileIn);

            updatedEvacuationFile.era_evacuationfileid = existingEvacuationFile.era_evacuationfileid;

            // attach evacuation file to dynamics context
            dynamicsClient.AttachTo(nameof(dynamicsClient.era_evacuationfiles), updatedEvacuationFile);
            dynamicsClient.UpdateObject(updatedEvacuationFile);

            // add jurisdiction/city to evacuation
            if (!string.IsNullOrEmpty(evacuationFileIn.EvacuatedFromAddress.Jurisdiction.Code))
            {
                var evacuatedFromJurisdiction = dynamicsClient.LookupJurisdictionByCode(evacuationFileIn.EvacuatedFromAddress.Jurisdiction.Code);
                dynamicsClient.TryAddLink(evacuatedFromJurisdiction, nameof(era_jurisdiction.era_evacuationfile_Jurisdiction), updatedEvacuationFile);
            }

            var existingNeedsAssessments = existingEvacuationFile.era_needsassessment_EvacuationFile.ToArray();

            foreach (var needsAssessment in evacuationFileIn.NeedsAssessments)
            {
                var updatedNeedsAssessment = mapper.Map<era_needassessment>(needsAssessment);
                var existingNeedsAssessment = existingNeedsAssessments.Where(na => na.era_needassessmentid == updatedNeedsAssessment.era_needassessmentid).SingleOrDefault();
                if (existingNeedsAssessment == null) throw new Exception($"needs assessment {updatedNeedsAssessment.era_needassessmentid} not found");

                dynamicsClient.LoadProperty(existingNeedsAssessment, nameof(era_needassessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID));

                updatedNeedsAssessment.era_needsassessmentdate = existingNeedsAssessment.era_needsassessmentdate;
                updatedNeedsAssessment.era_EvacuationFile = updatedEvacuationFile;

                dynamicsClient.Detach(existingNeedsAssessment);
                // attach needs assessment to dynamics context
                dynamicsClient.AttachTo(nameof(dynamicsClient.era_needassessments), updatedNeedsAssessment);
                dynamicsClient.UpdateObject(updatedNeedsAssessment);

                // Contacts (Household Members)
                // Add New needs assessment evacuee members to dynamics context
                var currentEvacuees = existingNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID
                    .Where(e => e.era_evacueetype == (int?)EvacueeType.Person).ToArray();
                var updatedEvacuees = new List<Guid>();
                foreach (var member in needsAssessment.HouseholdMembers)
                {
                    var contact = mapper.Map<contact>(member);

                    if (contact.contactid == null)
                    {
                        // New member
                        contact.contactid = Guid.NewGuid();
                        contact.era_registranttype = (int?)RegistrantType.Member;
                        contact.era_authenticated = false;
                        contact.era_verified = false;
                        contact.era_registrationdate = DateTimeOffset.UtcNow;

                        dynamicsClient.AddTocontacts(contact);
                        var evacuee = new era_needsassessmentevacuee
                        {
                            era_needsassessmentevacueeid = Guid.NewGuid(),
                            era_isprimaryregistrant = false,
                            era_evacueetype = (int?)EvacueeType.Person,
                            era_isunder19 = CheckIfUnder19Years((Date)contact.birthdate, Date.Now)
                        };
                        dynamicsClient.AddToera_needsassessmentevacuees(evacuee);

                        // link members and needs assessment to evacuee record
                        dynamicsClient.TryAddLink(contact, nameof(contact.era_NeedsAssessmentEvacuee_RegistrantID), evacuee);
                        dynamicsClient.TryAddLink(updatedNeedsAssessment, nameof(era_needassessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), evacuee);

                        // link registrant primary and mailing address city, province, country
                        dynamicsClient.TryAddLink(dynamicsClient.LookupCountryByCode(profile.PrimaryAddress.Country.Code), nameof(era_country.era_contact_Country), contact);
                        dynamicsClient.TryAddLink(dynamicsClient.LookupStateProvinceByCode(profile.PrimaryAddress.StateProvince.Code), nameof(era_provinceterritories.era_provinceterritories_contact_ProvinceState), contact);
                        dynamicsClient.TryAddLink(dynamicsClient.LookupJurisdictionByCode(profile.PrimaryAddress.Jurisdiction.Code), nameof(era_jurisdiction.era_jurisdiction_contact_City), contact);

                        dynamicsClient.TryAddLink(dynamicsClient.LookupCountryByCode(profile.MailingAddress.Country.Code), nameof(era_country.era_country_contact_MailingCountry), contact);
                        dynamicsClient.TryAddLink(dynamicsClient.LookupStateProvinceByCode(profile.MailingAddress.StateProvince.Code), nameof(era_provinceterritories.era_provinceterritories_contact_MailingProvinceState), contact);
                        dynamicsClient.TryAddLink(dynamicsClient.LookupJurisdictionByCode(profile.MailingAddress.Jurisdiction.Code), nameof(era_jurisdiction.era_jurisdiction_contact_MailingCity), contact);
                    }
                    else
                    {
                        // Existing member
                        var existingContact = dynamicsClient.contacts
                            .Where(c => c.contactid == contact.contactid).FirstOrDefault();

                        var existingBirthdate = existingContact.birthdate;

                        dynamicsClient.Detach(existingContact);

                        dynamicsClient.AttachTo(nameof(dynamicsClient.contacts), contact);

                        var evacuee = currentEvacuees.FirstOrDefault(e => e._era_registrantid_value == contact.contactid);
                        if (evacuee == null) throw new Exception($"evacuee {contact.contactid} not found in needs assessment {existingNeedsAssessment.era_needassessmentid}");

                        if (contact.birthdate != existingBirthdate)
                        {
                            // When updating the birthdate, recheck if evacuee is under 19 years of age
                            evacuee.era_isunder19 = CheckIfUnder19Years((Date)contact.birthdate, Date.Now);
                        }

                        dynamicsClient.UpdateObject(contact);
                        dynamicsClient.UpdateObject(evacuee);
                        updatedEvacuees.Add(evacuee.era_needsassessmentevacueeid.Value);
                    }
                }

                var evacueesToDelete = currentEvacuees.Where(e => !updatedEvacuees.Any(id => id == e.era_needsassessmentevacueeid));

                foreach (var evacuee in evacueesToDelete)
                {
                    dynamicsClient.DeleteObject(evacuee);
                    //TODO: delete contact and related link
                }

                //TODO: add, update and delete pets

                // Needs assessment evacuee as pet
                // Currently no good way to identify the specific pet to update. Will revisit when Pet table has been added.
                var currentPets = existingNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID
                    .Where(e => e.era_evacueetype == (int?)EvacueeType.Pet).ToArray();
                foreach (var pet in currentPets)
                {
                    dynamicsClient.UpdateObject(pet);
                }
            }

            //post as batch is not accepted by SSG. Sending with default option (multiple requests to the server stopping on the first failure)
            await dynamicsClient.SaveChangesAsync();

            var queryResult = dynamicsClient.era_evacuationfiles
                .Expand(f => f.era_needsassessment_EvacuationFile)
                .Where(f => f.era_evacuationfileid == updatedEvacuationFile.era_evacuationfileid).FirstOrDefault();

            essFileNumber = queryResult?.era_essfilenumber.ToString();

            dynamicsClient.DetachAll();

            return $"{essFileNumber:D9}";
        }

        private contact GetDynamicsContactByBCSC(string BCServicesCardId)
        {
            return dynamicsClient.contacts
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

    public enum EvacueeType
    {
        Person = 174360000,
        Pet = 174360001
    }

    public enum RegistrantType
    {
        Primary = 174360000,
        Member = 174360001
    }
}