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
using EMBC.Registrants.API.Shared;
using EMBC.Registrants.API.Utils;
using EMBC.ResourceAccess.Dynamics;
using Microsoft.Dynamics.CRM;
using Microsoft.OData;
using Microsoft.OData.Client;

namespace EMBC.Registrants.API.EvacuationsModule
{
    public interface IEvacuationRepository
    {
        Task<string> Create(string userId, NeedsAssessment needsAssessment);

        Task<IEnumerable<NeedsAssessment>> Read(string userId);

        Task Update(string userId, string essFileNumber, NeedsAssessment needsAssessment);

        Task<bool> DoesEvacuationExist(string userId, string essFileNumber);

        Task Delete(string userId, string essFileNumber);
    }

    public class EvacuationRepository : IEvacuationRepository
    {
        private readonly DynamicsClientContext dynamicsClient;
        private readonly IMapper mapper;
        private readonly IEmailSender emailSender;

        public EvacuationRepository(DynamicsClientContext dynamicsClient, IMapper mapper, IEmailSender emailSender)
        {
            this.dynamicsClient = dynamicsClient;
            this.mapper = mapper;
            this.emailSender = emailSender;
        }

        public async Task<string> Create(string userId, NeedsAssessment needsAssessment)
        {
            // get dynamics contact by BCServicesCardId
            contact dynamicsContact = GetDynamicsContactByBCSC(userId);

            if (dynamicsContact == null)
            {
                throw new Exception("Profile Not Found. Id: " + userId);
            }

            // return contact as a profile
            var profile = mapper.Map<ProfilesModule.Profile>(dynamicsContact);
            var essFileNumber = new Random().Next(999999999); // temporary ESS file number random generator

            // New evacuation file mapped from needsAssessment
            var evacuationFile = mapper.Map<era_evacuationfile>(needsAssessment);
            //var evacuationFile = new era_evacuationfile();

            evacuationFile.era_evacuationfileid = Guid.NewGuid();
            evacuationFile.era_essfilenumber = essFileNumber;
            evacuationFile.era_evacuationfiledate = DateTimeOffset.UtcNow;
            evacuationFile.era_secrettext = profile.SecretPhrase;

            // New needs assessment mapped from Preliminary Needs Assessment
            var eraNeedsAssessment = mapper.Map<era_needassessment>(needsAssessment);

            eraNeedsAssessment.era_needassessmentid = Guid.NewGuid();
            eraNeedsAssessment.era_needsassessmentdate = DateTimeOffset.UtcNow;
            eraNeedsAssessment.era_EvacuationFile = evacuationFile;
            eraNeedsAssessment.era_needsassessmenttype = (int?)NeedsAssessmentType.Preliminary;

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

            // add evacuation file to dynamics context
            dynamicsClient.AddToera_evacuationfiles(evacuationFile);
            // link primary registrant to evacuation file
            dynamicsClient.TryAddLink(dynamicsContact, nameof(dynamicsContact.era_evacuationfile_Registrant), evacuationFile);
            // add jurisdiction/city to evacuation
            dynamicsClient.TryAddLink(dynamicsClient.LookupJurisdictionByCode(profile.PrimaryAddress.Jurisdiction.Code), nameof(era_jurisdiction.era_evacuationfile_Jurisdiction), evacuationFile);

            // add needs assessment to dynamics context
            dynamicsClient.AddToera_needassessments(eraNeedsAssessment);
            // link evacuation file to needs assessment
            dynamicsClient.TryAddLink(evacuationFile, nameof(evacuationFile.era_needsassessment_EvacuationFile), eraNeedsAssessment);

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

            //post as batch is not accepted by SSG. Sending with default option (multiple requests to the server stopping on the first failure)
            try
            {
                var results = await dynamicsClient.SaveChangesAsync<era_evacuationfile>(SaveChangesOptions.BatchWithSingleChangeset);
            }
            catch (DataServiceRequestException ex)
            {
                throw new ApplicationException(
                    "An error occurred when saving changes.", ex);
            }
            dynamicsClient.Detach(evacuationFile);

            var queryResult = dynamicsClient.era_evacuationfiles
                .Where(f => f.era_evacuationfileid == evacuationFile.era_evacuationfileid).FirstOrDefault();

            essFileNumber = (int)queryResult?.era_essfilenumber;

            // Check if email address defined for profile
            if (dynamicsContact.emailaddress1 != null)
            {
                // Send email notification of new registrant record created
                EmailAddress registrantEmailAddress = new EmailAddress
                {
                    Name = dynamicsContact.firstname + " " + dynamicsContact.lastname,
                    Address = dynamicsContact.emailaddress1
                };
                SendEvacuationSubmissionNotificationEmail(registrantEmailAddress, essFileNumber.ToString());
            }
            return $"{evacuationFile.era_essfilenumber:D9}";
        }

        public Task Delete(string userId, string essFileNumber)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DoesEvacuationExist(string userId, string essFileNumber)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<NeedsAssessment>> Read(string userId)
        {
            await Task.CompletedTask;

            // get dynamics contact by BCServicesCardId
            contact dynamicsContact = GetDynamicsContactByBCSC(userId);

            if (dynamicsContact == null)
            {
                throw new Exception("Profile Not Found. Id: " + userId);
            }

            /* Step 1. query era_needsassessmentevacuee by contactid expand needsassessment => needsassessmentevacuee, needsassessment
             * Step 2. query evacuationfile by needsassessmentid from previous query => evacuationfile
             * Step 3. query era_needsassessmentevacuee by needsassessmentid expand contact => members
             */
            /*
                        IQueryable queryResult = null;
                        var needsAssessmentsFound = new Dictionary<Guid?, era_needassessment>();
                        var evacuationFilesFound = new Dictionary<Guid?, era_evacuationfile>();
                        var needsAssessmentEvacueesFound = new Dictionary<Guid?, era_needsassessmentevacuee>();
                        var registrantsFound = new Dictionary<Guid?, contact>();

                        try
                        {
                            // Step 1.
                            queryResult = dynamicsClient.era_needsassessmentevacuees
                                .Expand(n => n.era_NeedsAssessmentID)
                                .Where(n => n.era_RegistrantID.contactid == dynamicsContact.contactid);

                            foreach (era_needsassessmentevacuee nae in queryResult)
                            {
                                // add needs assessment
                                needsAssessmentsFound.Add(nae._era_needsassessmentid_value, nae.era_NeedsAssessmentID);
                            }

                            foreach (var needsAssessmentObject in needsAssessmentsFound)
                            {
                                // Step 2.
                                var efQueryResult = dynamicsClient.era_evacuationfiles
                                    .Expand(ef => ef.era_Jurisdiction)
                                    .Where(ef => ef.era_evacuationfileid == needsAssessmentObject.Value._era_evacuationfile_value).FirstOrDefault();

                                // add evacuation file
                                evacuationFilesFound.Add(efQueryResult.era_evacuationfileid, efQueryResult);

                                // Step 3.
                                var naeQueryResult = dynamicsClient.era_needsassessmentevacuees
                                    .Expand(nae => nae.era_RegistrantID)
                                    .Where(nae => nae.era_NeedsAssessmentID.era_needassessmentid == needsAssessmentObject.Key);

                                foreach (era_needsassessmentevacuee nae in naeQueryResult)
                                {
                                    // add needs assessment evacuee
                                    needsAssessmentEvacueesFound.Add(nae.era_needsassessmentevacueeid, nae);

                                    // add registrant to hashtable. Note: pets don't have a registrant id
                                    if (nae.era_RegistrantID != null)
                                    {
                                        registrantsFound.Add(nae.era_RegistrantID.contactid, nae.era_RegistrantID);
                                    }
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
            */
            IQueryable queryResult = null;
            var needsAssessmentsFound = new Dictionary<Guid?, era_needassessment>();
            var needsAssessmentEvacueesFound = new Dictionary<Guid?, era_needsassessmentevacuee>();
            var registrantsFound = new Dictionary<Guid?, contact>();
            //List<NeedsAssessmentEvacuee> needsAssessmentEvacuees = new List<NeedsAssessment>();
            List<NeedsAssessment> needsAssessments = new List<NeedsAssessment>();

            queryResult = dynamicsClient.era_needsassessmentevacuees
                .Expand(n => n.era_NeedsAssessmentID)
                .Where(n => n.era_RegistrantID.contactid == dynamicsContact.contactid);

            foreach (era_needsassessmentevacuee nae in queryResult)
            {
                // add needs assessment
                needsAssessmentsFound.Add(nae._era_needsassessmentid_value, nae.era_NeedsAssessmentID);
            }

            foreach (var needsAssessmentObject in needsAssessmentsFound)
            {
                var era_needsassessments = dynamicsClient.era_needassessments
                    .Expand(n => n.era_NeedsAssessmentEvacuee_NeedsAssessmentID)
                    .Expand(n => n.era_EvacuationFile)
                    .Where(n => n.era_needassessmentid == needsAssessmentObject.Key);

                foreach (era_needassessment na in era_needsassessments)
                {
                    List<PersonDetails> familyMembers = new List<PersonDetails>();
                    List<Pet> petMembers = new List<Pet>();
                    era_evacuationfile evacuationFile;

                    // Step 2.
                    var efQueryResult = dynamicsClient.era_evacuationfiles
                        .Expand(ef => ef.era_Jurisdiction)
                        .Where(ef => ef.era_evacuationfileid == needsAssessmentObject.Value._era_evacuationfile_value).FirstOrDefault();

                    // add evacuation file to needs assessment
                    evacuationFile = efQueryResult;

                    var jurQueryResult = dynamicsClient.era_jurisdictions
                        .Where(j => j.era_jurisdictionid == evacuationFile._era_jurisdiction_value).FirstOrDefault();

                    evacuationFile.era_Jurisdiction = jurQueryResult;

                    na.era_EvacuationFile = evacuationFile;

                    // Step 3.
                    var naeQueryResult = dynamicsClient.era_needsassessmentevacuees
                        .Expand(nae => nae.era_RegistrantID)
                        .Where(nae => nae.era_NeedsAssessmentID.era_needassessmentid == na.era_needassessmentid);

                    foreach (era_needsassessmentevacuee nae in naeQueryResult)
                    {
                        // add needs assessment evacuee
                        needsAssessmentEvacueesFound.Add(nae.era_needsassessmentevacueeid, nae);

                        // add registrant to hashtable. Note: pets don't have a registrant id
                        if (nae.era_evacueetype == (int)EvacueeType.Person)
                        {
                            var member = mapper.Map<PersonDetails>(nae.era_RegistrantID);
                            familyMembers.Add(member);
                        }
                        else
                        {
                            var pet = mapper.Map<Pet>(nae);
                            petMembers.Add(pet);
                        }
                    }

                    var needsAssessment = mapper.Map<NeedsAssessment>(na);
                    needsAssessment.FamilyMembers = familyMembers;
                    needsAssessment.Pets = petMembers;
                    needsAssessments.Add(needsAssessment);
                }
            }

            if (needsAssessments == null) return null;

            dynamicsClient.Detach(needsAssessments);

            return mapper.Map<IEnumerable<NeedsAssessment>>(needsAssessments);
        }

        public Task Update(string userId, string essFileNumber, NeedsAssessment evacuation)
        {
            throw new NotImplementedException();
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

        /// <summary>
        /// Sends a notification email to a verified Registrant after they submit an Evacuation
        /// </summary>
        /// <param name="toAddress">Registrant's Email Address</param>
        /// <param name="essFileNumber">ESS File Number</param>
        private void SendEvacuationSubmissionNotificationEmail(EmailAddress toAddress, string essFileNumber)
        {
            System.Collections.Generic.List<EmailAddress> toList = new System.Collections.Generic.List<EmailAddress> { toAddress };
            string emailSubject = "Registration completed successfully";
            string emailBody = $@"
<p><b>Submission Complete</b>
<p>
<p>Your Emergency Support Services (ESS) File Number is: " + essFileNumber + $@"
<p>Thank you for submitting your online self-registration.
<p>
<p><b>Next Steps</b>
<p>Please keep a record of your Emergency Support Services File Number to receive emergency support services that can be
    provided up to 72 hours starting from the time connecting in with a local ESS Responder at a Reception Centre. After
    a need's assessment interview with a local ESS Responder has been completed, supports are provided to purchase goods
    and services if eligible. Any goods and services purchased prior to a need’s assessment interview are not eligible
    for retroactive reimbursement.
<p>
<p>If you are under <b>EVACUATION ALERT</b> or <b>DO NOT</b> require emergency serves at this time, no further action is
    required.
<p>
<p>If you are under <b>EVACUATION ORDER</b>, and require emergency supports, proceed to your nearest Reception Centre. A
    list of open Reception Centres can be found at Emergency Info BC.
<p>
<p>If <b>NO</b> nearby Reception Centre is open and immediate action is required, please contact your First Nation
    Government or Local Authority for next steps.";

            EmailMessage emailMessage = new EmailMessage(toList, emailSubject, emailBody);
            emailSender.Send(emailMessage);
        }
    }
}
