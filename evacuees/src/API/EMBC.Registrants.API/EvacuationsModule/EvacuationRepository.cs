// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
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
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Registrants.API.LocationModule;
using EMBC.Registrants.API.Shared;
using EMBC.ResourceAccess.Dynamics;
using Microsoft.Dynamics.CRM;
using Microsoft.OData;
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
            dynamicsClient.TryAddLink(dynamicsClient.LookupJurisdictionByCode(eraEvacuationFile.era_Jurisdiction.era_jurisdictionid.ToString()), nameof(era_jurisdiction.era_evacuationfile_Jurisdiction), eraEvacuationFile);

            foreach (var needsAssessment in evacuationFile.NeedsAssessments)
            {
                // New needs assessment mapped from incoming evacuation file Needs Assessment
                var eraNeedsAssessment = mapper.Map<era_needassessment>(needsAssessment);

                eraNeedsAssessment.era_needassessmentid = Guid.NewGuid();
                eraNeedsAssessment.era_needsassessmentdate = DateTimeOffset.UtcNow;
                eraNeedsAssessment.era_EvacuationFile = eraEvacuationFile;

                // New Contacts (Household Members)
                var members = mapper.Map<IEnumerable<contact>>(needsAssessment.FamilyMembers);

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
                    era_evacueetype = (int?)EvacueeType.Person
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

            dynamicsClient.Detach(queryResult);

            return essFileNumber.ToString();
        }

        public Task Delete(string userId, string essFileNumber)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<EvacuationFile>> Read(string userId)
        {
            await Task.CompletedTask;

            // get dynamics contact by BCServicesCardId
            contact dynamicsContact = GetDynamicsContactByBCSC(userId);

            if (dynamicsContact == null)
            {
                return mapper.Map<IEnumerable<EvacuationFile>>(new List<EvacuationFile>());
            }

            List<EvacuationFile> evacuationFiles = new List<EvacuationFile>();

            /* Step 1. query era_needsassessmentevacuee by contactid expand needsassessment => needsassessmentevacuee, needsassessment
             * Step 2. query evacuationfile by needsassessmentid from previous query => evacuationfile
             * Step 3. query era_needsassessmentevacuee by needsassessmentid expand contact => members
             */

            IQueryable queryResult = null;
            var needsAssessmentsFound = new List<era_needassessment>();
            var evacuationFilesFound = new List<era_evacuationfile>();
            var needsAssessmentEvacueesFound = new List<era_needsassessmentevacuee>();
            var jurisdictionsFound = new List<era_jurisdiction>();

            try
            {
                // Step 1.
                queryResult = dynamicsClient.era_needsassessmentevacuees
                    .Expand(n => n.era_RegistrantID)
                    .Expand(n => n.era_NeedsAssessmentID)
                    .Where(n => n.era_RegistrantID.contactid == dynamicsContact.contactid);

                foreach (era_needsassessmentevacuee nae in queryResult)
                {
                    // add needs assessment
                    needsAssessmentsFound.Add(nae.era_NeedsAssessmentID);
                }

                foreach (var needsAssessmentObject in needsAssessmentsFound)
                {
                    // Step 2.
                    var efQueryResult = dynamicsClient.era_evacuationfiles
                        .Expand(ef => ef.era_Jurisdiction)
                        .Where(ef => ef.era_evacuationfileid == needsAssessmentObject._era_evacuationfile_value).FirstOrDefault();

                    // add evacuation file
                    evacuationFilesFound.Add(efQueryResult);
                    jurisdictionsFound.Add(efQueryResult.era_Jurisdiction);

                    // Step 3.
                    var naeQueryResult = dynamicsClient.era_needsassessmentevacuees
                        .Expand(nae => nae.era_RegistrantID)
                        .Where(nae => nae.era_NeedsAssessmentID.era_needassessmentid == needsAssessmentObject.era_needassessmentid);

                    foreach (era_needsassessmentevacuee nae in naeQueryResult)
                    {
                        // add needs assessment evacuee
                        needsAssessmentEvacueesFound.Add(nae);
                    }
                }
            }
            catch (DataServiceQueryException ex)
            {
                DataServiceClientException dataServiceClientException = ex.InnerException as DataServiceClientException;

                // don't throw an exception if record is not found
                if (dataServiceClientException.StatusCode == 404)
                {
                    return null;
                }
                else
                {
                    Console.WriteLine("dataServiceClientException: " + dataServiceClientException.Message);
                }

                ODataErrorException odataErrorException = dataServiceClientException.InnerException as ODataErrorException;
                if (odataErrorException != null)
                {
                    Console.WriteLine(odataErrorException.Message);
                    throw dataServiceClientException;
                }
            }

            foreach (var era_evacuationFile in evacuationFilesFound)
            {
                var era_needsAssessments = needsAssessmentsFound
                    .Where(na => na._era_evacuationfile_value == era_evacuationFile.era_evacuationfileid).ToArray();

                List<NeedsAssessment> needsAssessments = new List<NeedsAssessment>();

                foreach (var era_needsAssessment in era_needsAssessments)
                {
                    var jurQueryResult = jurisdictionsFound
                        .Where(j => j.era_jurisdictionid == era_evacuationFile._era_jurisdiction_value).FirstOrDefault();

                    era_evacuationFile.era_Jurisdiction = jurQueryResult;

                    era_needsAssessment.era_EvacuationFile = era_evacuationFile;

                    var naeQueryResult = needsAssessmentEvacueesFound
                        .Where(nae => nae._era_needsassessmentid_value == era_needsAssessment.era_needassessmentid).ToArray();

                    var needsAssessment = mapper.Map<NeedsAssessment>(era_needsAssessment);
                    needsAssessment.FamilyMembers = naeQueryResult.Where(nae => nae.era_evacueetype == (int)EvacueeType.Person).Select(nae => mapper.Map<PersonDetails>(nae.era_RegistrantID)).ToArray();
                    needsAssessment.Pets = naeQueryResult.Where(nae => nae.era_evacueetype != (int)EvacueeType.Person).Select(nae => mapper.Map<Pet>(nae)).ToArray();

                    needsAssessments.Add(needsAssessment);
                }
                var evacuationFile = mapper.Map<EvacuationFile>(era_evacuationFile);
                evacuationFile.NeedsAssessments = needsAssessments;
                evacuationFiles.Add(evacuationFile);
            }

            if (evacuationFiles == null) return null;

            dynamicsClient.Detach(evacuationFiles);

            return mapper.Map<IEnumerable<EvacuationFile>>(evacuationFiles);
        }

        public async Task<EvacuationFile> Read(string userId, string essFileNumber)
        {
            await Task.CompletedTask;

            // get dynamics contact by BCServicesCardId
            contact dynamicsContact = GetDynamicsContactByBCSC(userId);

            if (dynamicsContact == null)
            {
                return mapper.Map<EvacuationFile>(new EvacuationFile());
            }

            EvacuationFile evacuationFile = new EvacuationFile();

            var needsAssessmentEvacuees = dynamicsClient.era_needsassessmentevacuees
                .Expand(n => n.era_RegistrantID)
                .Expand(n => n.era_NeedsAssessmentID)
                .Where(n => n.era_RegistrantID.contactid == dynamicsContact.contactid).ToArray();

            var era_naeNeedsAssessments = needsAssessmentEvacuees
                .Select(nae => nae.era_NeedsAssessmentID).ToArray();

            era_naeNeedsAssessments = era_naeNeedsAssessments
                .Where(na => na.era_EvacuationFile.era_essfilenumber == int.Parse(essFileNumber)).ToArray();

            var era_evacuationFiles = era_naeNeedsAssessments
                .Select(na => na.era_EvacuationFile).ToArray();

            foreach (var era_evacuationFile in era_evacuationFiles)
            {
                evacuationFile = mapper.Map<EvacuationFile>(era_evacuationFile);
                var era_needsAssessments = dynamicsClient.era_needassessments
                    .Expand(na => na.era_EvacuationFile)
                    .Where(na => na._era_evacuationfile_value == era_evacuationFile.era_evacuationfileid).ToArray();

                List<NeedsAssessment> needsAssessments = new List<NeedsAssessment>();

                foreach (var era_needsAssessment in era_needsAssessments)
                {
                    var jurQueryResult = dynamicsClient.era_jurisdictions
                        .Where(j => j.era_jurisdictionid == era_evacuationFile._era_jurisdiction_value).FirstOrDefault();

                    era_evacuationFile.era_Jurisdiction = jurQueryResult;

                    era_needsAssessment.era_EvacuationFile = era_evacuationFile;

                    var naeQueryResult = dynamicsClient.era_needsassessmentevacuees
                        .Expand(nae => nae.era_RegistrantID)
                        .Where(nae => nae.era_NeedsAssessmentID.era_needassessmentid == era_needsAssessment.era_needassessmentid).ToArray();

                    var needsAssessment = mapper.Map<NeedsAssessment>(era_needsAssessment);
                    needsAssessment.FamilyMembers = naeQueryResult.Where(nae => nae.era_evacueetype == (int)EvacueeType.Person).Select(nae => mapper.Map<PersonDetails>(nae.era_RegistrantID)).ToArray();
                    needsAssessment.Pets = naeQueryResult.Where(nae => nae.era_evacueetype != (int)EvacueeType.Person).Select(nae => mapper.Map<Pet>(nae)).ToArray();

                    needsAssessments.Add(needsAssessment);
                }
                evacuationFile.NeedsAssessments = needsAssessments;
            }

            if (evacuationFile == null) return null;

            dynamicsClient.Detach(evacuationFile);

            return mapper.Map<EvacuationFile>(evacuationFile);
        }

        public async Task<string> Update(string userId, string essFileNumber, EvacuationFile evacuationFileIn)
        {
            await Task.CompletedTask;

            // get dynamics contact by BCServicesCardId
            contact dynamicsContact = GetDynamicsContactByBCSC(userId);

            if (dynamicsContact == null)
            {
                return string.Empty;
            }

            var existingEvacuationFile = dynamicsClient.era_evacuationfiles
                .Expand(e => e.era_needsassessment_EvacuationFile)
                .Where(e => e.era_essfilenumber == int.Parse(essFileNumber)).FirstOrDefault();

            var existingNeedsAssessments = dynamicsClient.era_needassessments
                .Expand(na => na.era_NeedsAssessmentEvacuee_NeedsAssessmentID)
                .Where(na => na.era_EvacuationFile.era_evacuationfileid == existingEvacuationFile.era_evacuationfileid).ToArray();

            // return contact as a profile
            var profile = mapper.Map<ProfilesModule.Profile>(dynamicsContact);

            // New evacuation file mapped from entered evacaution file
            var updatedEvacuationFile = mapper.Map<era_evacuationfile>(evacuationFileIn);

            updatedEvacuationFile.era_evacuationfileid = existingEvacuationFile.era_evacuationfileid;
            updatedEvacuationFile.era_essfilenumber = existingEvacuationFile.era_essfilenumber; // Can't be edited
            updatedEvacuationFile.era_secrettext = existingEvacuationFile.era_secrettext; // Can't be edited

            dynamicsClient.Detach(existingEvacuationFile);
            // attach evacuation file to dynamics context
            dynamicsClient.AttachTo(nameof(dynamicsClient.era_evacuationfiles), updatedEvacuationFile);
            // link primary registrant to evacuation file
            dynamicsClient.TryAddLink(dynamicsContact, nameof(dynamicsContact.era_evacuationfile_Registrant), updatedEvacuationFile);
            // add jurisdiction/city to evacuation
            dynamicsClient.TryAddLink(dynamicsClient.LookupJurisdictionByCode(profile.PrimaryAddress.Jurisdiction.Code), nameof(era_jurisdiction.era_evacuationfile_Jurisdiction), updatedEvacuationFile);

            dynamicsClient.Detach(dynamicsContact);

            foreach (var needsAssessment in evacuationFileIn.NeedsAssessments)
            {
                var updatedNeedsAssessment = mapper.Map<era_needassessment>(needsAssessment);
                var existingNeedsAssessment = existingNeedsAssessments
                    .Where(na => na.era_needassessmentid == updatedNeedsAssessment.era_needassessmentid).FirstOrDefault();

                updatedNeedsAssessment.era_needsassessmentdate = existingNeedsAssessment.era_needsassessmentdate;
                updatedNeedsAssessment.era_EvacuationFile = updatedEvacuationFile;

                dynamicsClient.Detach(existingNeedsAssessment);
                // attach needs assessment to dynamics context
                dynamicsClient.AttachTo(nameof(dynamicsClient.era_needassessments), updatedNeedsAssessment);
                // link evacuation file to needs assessment
                dynamicsClient.TryAddLink(updatedEvacuationFile, nameof(updatedEvacuationFile.era_needsassessment_EvacuationFile), updatedNeedsAssessment);

                // Contacts (Household Members)
                // Add New needs assessment evacuee members to dynamics context
                foreach (var member in needsAssessment.FamilyMembers)
                {
                    var updatedMember = mapper.Map<contact>(member);
                    var existingMember = dynamicsClient.contacts
                        .Where(m => m.contactid == updatedMember.contactid).FirstOrDefault();

                    dynamicsClient.Detach(existingMember);
                    dynamicsClient.AttachTo(nameof(dynamicsClient.contacts), updatedMember);

                    var updatedEvacuee = new era_needsassessmentevacuee();
                    var existingEvacuee = dynamicsClient.era_needsassessmentevacuees
                        .Where(e => e.era_NeedsAssessmentID.era_needassessmentid == updatedNeedsAssessment.era_needassessmentid
                            && e.era_evacueetype == (int)EvacueeType.Person
                            && e.era_RegistrantID.contactid == updatedMember.contactid).FirstOrDefault();

                    updatedEvacuee.era_needsassessmentevacueeid = existingEvacuee.era_needsassessmentevacueeid;
                    updatedEvacuee.era_isprimaryregistrant = existingEvacuee.era_isprimaryregistrant;
                    updatedEvacuee.era_evacueetype = existingEvacuee.era_evacueetype;
                    updatedEvacuee.era_NeedsAssessmentID = updatedNeedsAssessment;

                    dynamicsClient.Detach(existingEvacuee);
                    dynamicsClient.AttachTo(nameof(dynamicsClient.era_needsassessmentevacuees), updatedEvacuee);

                    // link members and needs assessment to evacuee record
                    dynamicsClient.TryAddLink(updatedMember, nameof(updatedMember.era_NeedsAssessmentEvacuee_RegistrantID), updatedEvacuee);
                    dynamicsClient.TryAddLink(updatedNeedsAssessment, nameof(updatedNeedsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), updatedEvacuee);

                    dynamicsClient.UpdateObject(updatedEvacuee);
                }

                // Needs assessment evacuee as pet
                // Currently no good way to identify the specific pet to update. Will revisit when Pet table has been added.

                dynamicsClient.UpdateObject(updatedNeedsAssessment);
            }
            dynamicsClient.Detach(existingNeedsAssessments);

            dynamicsClient.UpdateObject(updatedEvacuationFile);

            //post as batch is not accepted by SSG. Sending with default option (multiple requests to the server stopping on the first failure)
            updatedEvacuationFile = await dynamicsClient.SaveChangesAsync<era_evacuationfile>(SaveChangesOptions.BatchWithSingleChangeset);

            dynamicsClient.Detach(updatedEvacuationFile);

            var queryResult = dynamicsClient.era_evacuationfiles
                .Expand(f => f.era_needsassessment_EvacuationFile)
                .Where(f => f.era_evacuationfileid == updatedEvacuationFile.era_evacuationfileid).FirstOrDefault();

            essFileNumber = queryResult?.era_essfilenumber.ToString();

            dynamicsClient.Detach(queryResult);

            return $"{essFileNumber:D9}";
        }

        private contact GetDynamicsContactByBCSC(string BCServicesCardId)
        {
            contact queryResult = null;
            try
            {
                queryResult = dynamicsClient.contacts
                        .Expand(c => c.era_City)
                        .Expand(c => c.era_ProvinceState)
                        .Expand(c => c.era_Country)
                        .Expand(c => c.era_MailingCity)
                        .Expand(c => c.era_MailingProvinceState)
                        .Expand(c => c.era_MailingCountry)
                        .Where(c => c.era_bcservicescardid == BCServicesCardId).FirstOrDefault();
            }
            catch (DataServiceQueryException ex)
            {
                DataServiceClientException dataServiceClientException = ex.InnerException as DataServiceClientException;
                // don't throw an exception if contact is not found, return an empty profile
                if (dataServiceClientException.StatusCode == (int)HttpStatusCode.NotFound)
                {
                    return null;
                }
                else
                {
                    Console.WriteLine("dataServiceClientException: " + dataServiceClientException.Message);
                }
                ODataErrorException odataErrorException = dataServiceClientException.InnerException as ODataErrorException;
                if (odataErrorException != null)
                {
                    Console.WriteLine(odataErrorException.Message);
                    throw dataServiceClientException;
                }
            }
            return queryResult;
        }
    }
}
