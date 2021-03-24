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
using System.Linq;
using System.Threading.Tasks;
using EMBC.Registrants.API.EvacuationsModule;
using EMBC.Registrants.API.ProfilesModule;
using EMBC.Registrants.API.Shared;
using EMBC.Registrants.API.Utils;
using EMBC.ResourceAccess.Dynamics;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Microsoft.OData.Edm;

namespace EMBC.Registrants.API.RegistrationsModule
{
    public interface IRegistrationManager
    {
        Task<string> CreateRegistrationAnonymous(AnonymousRegistration registration);
    }

    public class RegistrationManager : IRegistrationManager
    {
        private readonly DynamicsClientContext dynamicsClient;
        private readonly ITemplateEmailService emailService;
        private readonly IEmailSender emailSender;
        private DateTimeOffset now;

        public RegistrationManager(DynamicsClientContext dynamicsClient, ITemplateEmailService emailService, IEmailSender emailSender)
        {
            this.dynamicsClient = dynamicsClient;
            this.now = DateTimeOffset.UtcNow;
            this.emailService = emailService;
            this.emailSender = emailSender;
        }

        /// <summary>
        /// Create an Anonymous Registration (evacuation file, self needs assessment, primary registrant and household members)
        /// </summary>
        /// <param name="registration">AnonymousRegistration</param>
        /// <returns>ESS File Number</returns>
        public async Task<string> CreateRegistrationAnonymous(AnonymousRegistration registration)
        {
#pragma warning disable CA5394 // Do not use insecure randomness
            var essFileNumber = new Random().Next(999999999); //temporary ESS file number random generator
#pragma warning restore CA5394 // Do not use insecure randomness

            // New evacuation file
            var evacuationFile = new era_evacuationfile
            {
                era_evacuationfileid = Guid.NewGuid(),
                era_essfilenumber = essFileNumber,
                era_evacuationfiledate = now,
                era_addressline1 = registration.EvacuatedFromAddress.AddressLine1,
                era_addressline2 = registration.EvacuatedFromAddress.AddressLine2,
                era_province = registration.EvacuatedFromAddress.StateProvince.Name,
                era_country = registration.EvacuatedFromAddress.Country.Name,
                era_secrettext = registration.RegistrationDetails.SecretPhrase,
                era_postalcode = registration.EvacuatedFromAddress.PostalCode
            };

            // New needs assessment
            var needsAssessment = new era_needassessment
            {
                era_needassessmentid = Guid.NewGuid(),
                era_needsassessmentdate = now,
                era_EvacuationFile = evacuationFile,
                era_needsassessmenttype = (int?)NeedsAssessmentType.Preliminary,
                era_canevacueeprovidefood = Lookup(registration.PreliminaryNeedsAssessment.CanEvacueeProvideFood),
                era_canevacueeprovideclothing = Lookup(registration.PreliminaryNeedsAssessment.CanEvacueeProvideClothing),
                era_canevacueeprovideincidentals = Lookup(registration.PreliminaryNeedsAssessment.CanEvacueeProvideIncidentals),
                era_canevacueeprovidelodging = Lookup(registration.PreliminaryNeedsAssessment.CanEvacueeProvideLodging),
                era_canevacueeprovidetransportation = Lookup(registration.PreliminaryNeedsAssessment.CanEvacueeProvideTransportation),
                era_haspetfood = Lookup(registration.PreliminaryNeedsAssessment.HasPetsFood),
                era_dietaryrequirement = registration.PreliminaryNeedsAssessment.HaveSpecialDiet,
                era_dietaryrequirementdetails = registration.PreliminaryNeedsAssessment.SpecialDietDetails,
                era_medicationrequirement = registration.PreliminaryNeedsAssessment.HaveMedication,
                era_insurancecoverage = (int?)registration.PreliminaryNeedsAssessment.Insurance,
                era_collectionandauthorization = registration.InformationCollectionConsent,
                era_sharingrestriction = registration.RegistrationDetails.RestrictedAccess,
                era_phonenumberrefusal = string.IsNullOrEmpty(registration.RegistrationDetails.ContactDetails.Phone),
                era_emailrefusal = string.IsNullOrEmpty(registration.RegistrationDetails.ContactDetails.Email)
            };

            // New Contact (Primary Registrant)
            var newPrimaryRegistrant = CreateNewContact(registration.RegistrationDetails, true);
            newPrimaryRegistrant.era_collectionandauthorization = registration.InformationCollectionConsent;

            // New Contacts (Household Members)
            var members = (registration.PreliminaryNeedsAssessment.HouseholdMembers ?? Array.Empty<HouseholdMember>()).Select(fm => new contact
            {
                contactid = Guid.NewGuid(),
                era_registranttype = (int?)RegistrantType.Member,
                era_authenticated = false,
                era_verified = false,
                era_registrationdate = now,
                firstname = fm.Details.FirstName,
                lastname = fm.Details.LastName,
                era_preferredname = fm.Details.PreferredName,
                era_initial = fm.Details.Initials,
                gendercode = LookupGender(fm.Details.Gender),
                birthdate = FromDateTime(DateTime.Parse(fm.Details.DateOfBirth)),
                era_collectionandauthorization = registration.InformationCollectionConsent,
                era_sharingrestriction = registration.RegistrationDetails.RestrictedAccess,

                address1_line1 = registration.RegistrationDetails.PrimaryAddress.AddressLine1,
                address1_line2 = registration.RegistrationDetails.PrimaryAddress.AddressLine2,
                address1_postalcode = registration.RegistrationDetails.PrimaryAddress.PostalCode,

                address2_line1 = registration.RegistrationDetails.MailingAddress.AddressLine1,
                address2_line2 = registration.RegistrationDetails.MailingAddress.AddressLine2,
                address2_postalcode = registration.RegistrationDetails.MailingAddress.PostalCode,

                emailaddress1 = registration.RegistrationDetails.ContactDetails.Email,
                address1_telephone1 = registration.RegistrationDetails.ContactDetails.Phone,

                era_phonenumberrefusal = string.IsNullOrEmpty(registration.RegistrationDetails.ContactDetails.Phone),
                era_emailrefusal = string.IsNullOrEmpty(registration.RegistrationDetails.ContactDetails.Email),
                era_secrettext = registration.RegistrationDetails.SecretPhrase
            });

            // New needs assessment evacuee as pet
            var pets = (registration.PreliminaryNeedsAssessment.Pets ?? Array.Empty<Pet>()).Select(p => new era_needsassessmentevacuee
            {
                era_needsassessmentevacueeid = Guid.NewGuid(),
                era_numberofpets = Convert.ToInt32(p.Quantity),
                era_typeofpet = p.Type,
                era_evacueetype = (int?)EvacueeType.Pet
            });

            // add evacuation file to dynamics context
            dynamicsClient.AddToera_evacuationfiles(evacuationFile);
            // link primary registrant to evacuation file
            dynamicsClient.AddLink(newPrimaryRegistrant, nameof(newPrimaryRegistrant.era_evacuationfile_Registrant), evacuationFile);
            // add jurisdiction/city to evacuation
            var evacuationJurisdiction = Lookup(registration.EvacuatedFromAddress.Jurisdiction);
            if (evacuationJurisdiction == null || !evacuationJurisdiction.era_jurisdictionid.HasValue)
            {
                evacuationFile.era_city = registration.EvacuatedFromAddress.Jurisdiction.Name;
            }
            else
            {
                dynamicsClient.AddLink(evacuationJurisdiction, nameof(evacuationJurisdiction.era_evacuationfile_Jurisdiction), evacuationFile);
            }

            // add needs assessment to dynamics context
            dynamicsClient.AddToera_needassessments(needsAssessment);
            // link evacuation file to needs assessment
            dynamicsClient.AddLink(evacuationFile, nameof(evacuationFile.era_needsassessment_EvacuationFile), needsAssessment);

            // New needs assessment evacuee as primary registrant
            var newNeedsAssessmentEvacueeRegistrant = new era_needsassessmentevacuee
            {
                era_needsassessmentevacueeid = Guid.NewGuid(),
                era_isprimaryregistrant = true,
                era_evacueetype = (int?)EvacueeType.Person
            };
            dynamicsClient.AddToera_needsassessmentevacuees(newNeedsAssessmentEvacueeRegistrant);
            // link registrant and needs assessment to evacuee record
            dynamicsClient.AddLink(newPrimaryRegistrant, nameof(newPrimaryRegistrant.era_NeedsAssessmentEvacuee_RegistrantID), newNeedsAssessmentEvacueeRegistrant);
            dynamicsClient.AddLink(needsAssessment, nameof(needsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), newNeedsAssessmentEvacueeRegistrant);

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
                dynamicsClient.AddLink(member, nameof(member.era_NeedsAssessmentEvacuee_RegistrantID), newNeedsAssessmentEvacueeMember);
                dynamicsClient.AddLink(needsAssessment, nameof(needsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), newNeedsAssessmentEvacueeMember);

                // link registrant primary and mailing address city, province, country
                var primaryAddressCountry = Lookup(registration.RegistrationDetails.PrimaryAddress.Country);
                var primaryAddressProvince = Lookup(registration.RegistrationDetails.PrimaryAddress.StateProvince);
                var primaryAddressCity = Lookup(registration.RegistrationDetails.PrimaryAddress.Jurisdiction);
                // country
                dynamicsClient.AddLink(primaryAddressCountry, nameof(primaryAddressCountry.era_contact_Country), member);
                // province
                if (primaryAddressProvince != null && !string.IsNullOrEmpty(primaryAddressProvince.era_code))
                {
                    dynamicsClient.AddLink(primaryAddressProvince, nameof(primaryAddressProvince.era_provinceterritories_contact_ProvinceState), member);
                }
                // city
                if (primaryAddressCity == null || !primaryAddressCity.era_jurisdictionid.HasValue)
                {
                    member.address1_city = registration.RegistrationDetails.PrimaryAddress.Jurisdiction.Name;
                }
                else
                {
                    dynamicsClient.AddLink(primaryAddressCity, nameof(primaryAddressCity.era_jurisdiction_contact_City), member);
                }

                var mailingAddressCountry = Lookup(registration.RegistrationDetails.MailingAddress.Country);
                var mailingAddressProvince = Lookup(registration.RegistrationDetails.MailingAddress.StateProvince);
                var mailingAddressCity = Lookup(registration.RegistrationDetails.MailingAddress.Jurisdiction);
                // country
                dynamicsClient.AddLink(mailingAddressCountry, nameof(mailingAddressCountry.era_country_contact_MailingCountry), member);
                // province
                if (mailingAddressProvince != null && !string.IsNullOrEmpty(mailingAddressProvince.era_code))
                {
                    dynamicsClient.AddLink(mailingAddressProvince, nameof(mailingAddressProvince.era_provinceterritories_contact_MailingProvinceState), member);
                }
                // city
                if (mailingAddressCity == null || !mailingAddressCity.era_jurisdictionid.HasValue)
                {
                    member.address2_city = registration.RegistrationDetails.MailingAddress.Jurisdiction.Name;
                }
                else
                {
                    dynamicsClient.AddLink(mailingAddressCity, nameof(mailingAddressCity.era_jurisdiction_contact_MailingCity), member);
                }
            }

            // Add New needs assessment evacuee pets to dynamics context
            foreach (var petMember in pets)
            {
                dynamicsClient.AddToera_needsassessmentevacuees(petMember);
                // link pet to evacuee record
                dynamicsClient.AddLink(needsAssessment, nameof(needsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), petMember);
            }

            //post as batch is not accepted by SSG. Sending with default option (multiple requests to the server stopping on the first failure)
            var results = await dynamicsClient.SaveChangesAsync(SaveChangesOptions.BatchWithSingleChangeset);

            var queryResult = dynamicsClient.era_evacuationfiles
                .Where(f => f.era_evacuationfileid == evacuationFile.era_evacuationfileid).FirstOrDefault();

            essFileNumber = (int)queryResult?.era_essfilenumber;

            // Check if email address defined for profile
            if (!string.IsNullOrEmpty(newPrimaryRegistrant?.emailaddress1))
            {
                // Send email notification of new registrant record created
                EmailAddress registrantEmailAddress = new EmailAddress
                {
                    Name = $"{newPrimaryRegistrant.firstname} {newPrimaryRegistrant.lastname}",
                    Address = newPrimaryRegistrant.emailaddress1
                };
                var emailMessage = emailService.GetAnonEvacuationSubmissionNotificationEmailMessage(registrantEmailAddress, essFileNumber.ToString());
                await emailSender.SendAsync(emailMessage);
            }

            return $"{essFileNumber:D9}";
        }

        private era_country Lookup(Country country) =>
            country == null || string.IsNullOrEmpty(country.Code)
            ? null
            : dynamicsClient.era_countries.Where(c => c.era_countrycode == country.Code).FirstOrDefault();

        private int Lookup(bool? value) => value.HasValue ? value.Value ? 174360000 : 174360001 : 174360002;

        private int? LookupGender(string value) => value switch
        {
            "Male" => 1,
            "Female" => 2,
            "X" => 3,
            _ => null
        };

        private era_provinceterritories Lookup(StateProvince stateProvince)
        {
            if (stateProvince == null || string.IsNullOrEmpty(stateProvince.Code))
                return null;

            return dynamicsClient.era_provinceterritorieses.Where(p => p.era_code == stateProvince.Code).FirstOrDefault();
        }

        private era_jurisdiction Lookup(Jurisdiction jurisdiction)
        {
            if (jurisdiction == null || string.IsNullOrEmpty(jurisdiction.Code))
                return null;

            return dynamicsClient.era_jurisdictions.Where(j => j.era_jurisdictionid == Guid.Parse(jurisdiction.Code)).FirstOrDefault();
        }

        private Date? FromDateTime(DateTime? dateTime) => dateTime.HasValue ? new Date(dateTime.Value.Year, dateTime.Value.Month, dateTime.Value.Day) : (Date?)null;

        /// <summary>
        /// Create a new Dynamics Contact (Profile)
        /// </summary>
        /// <param name="profile">Registration values</param>
        /// <param name="isPrimary">Primary or Member Registrant</param>
        /// <returns>Contact</returns>
        private contact CreateNewContact(Profile profile, bool isPrimary)
        {
            var contact = new contact();
            contact.contactid = Guid.NewGuid();
            if (isPrimary)
                contact.era_registranttype = (int?)RegistrantType.Primary;
            else
                contact.era_registranttype = (int?)RegistrantType.Member;
            contact.era_authenticated = true;
            contact.era_verified = false;
            contact.era_registrationdate = now;
            contact.firstname = profile.PersonalDetails.FirstName;
            contact.lastname = profile.PersonalDetails.LastName;
            contact.era_preferredname = profile.PersonalDetails.PreferredName;
            contact.era_initial = profile.PersonalDetails.Initials;
            contact.gendercode = LookupGender(profile.PersonalDetails.Gender);
            contact.birthdate = FromDateTime(DateTime.Parse(profile.PersonalDetails.DateOfBirth));
            contact.era_sharingrestriction = profile.RestrictedAccess;
            contact.era_bcservicescardid = profile.Id;

            contact.address1_line1 = profile.PrimaryAddress.AddressLine1;
            contact.address1_line2 = profile.PrimaryAddress.AddressLine2;
            contact.address1_postalcode = profile.PrimaryAddress.PostalCode;

            contact.address2_line1 = profile.MailingAddress.AddressLine1;
            contact.address2_line2 = profile.MailingAddress.AddressLine2;
            contact.address2_postalcode = profile.MailingAddress.PostalCode;

            contact.emailaddress1 = profile.ContactDetails.Email;
            contact.address1_telephone1 = profile.ContactDetails.Phone;

            contact.era_phonenumberrefusal = string.IsNullOrEmpty(profile.ContactDetails.Phone);
            contact.era_emailrefusal = string.IsNullOrEmpty(profile.ContactDetails.Email);
            contact.era_secrettext = profile.SecretPhrase;

            // add contact to dynamics client
            dynamicsClient.AddTocontacts(contact);

            // add links to dynamics client

            /* NOTES:
             * There are 2 city fields in dynamics, one mapping to a jurisdiction and another set as free text. If the city
             * doesn't exist as a jurisdiction then it shoudl be stored in the free text field, otherwise as jurisdiction.
             * The province/state field is only captured by the front end when country is Canada or USA
             */

            // link registrant primary and mailing address city, province, country
            var primaryAddressCountry = Lookup(profile.PrimaryAddress.Country);
            var primaryAddressProvince = Lookup(profile.PrimaryAddress.StateProvince);
            var primaryAddressCity = Lookup(profile.PrimaryAddress.Jurisdiction);
            // country
            dynamicsClient.AddLink(primaryAddressCountry, nameof(primaryAddressCountry.era_contact_Country), contact);
            // province
            if (primaryAddressProvince != null && !string.IsNullOrEmpty(primaryAddressProvince.era_code))
            {
                dynamicsClient.AddLink(primaryAddressProvince, nameof(primaryAddressProvince.era_provinceterritories_contact_ProvinceState), contact);
            }
            // city
            if (primaryAddressCity == null || !primaryAddressCity.era_jurisdictionid.HasValue)
            {
                contact.address1_city = profile.PrimaryAddress.Jurisdiction.Name;
            }
            else
            {
                dynamicsClient.AddLink(primaryAddressCity, nameof(primaryAddressCity.era_jurisdiction_contact_City), contact);
            }

            var mailingAddressCountry = Lookup(profile.MailingAddress.Country);
            var mailingAddressProvince = Lookup(profile.MailingAddress.StateProvince);
            var mailingAddressCity = Lookup(profile.MailingAddress.Jurisdiction);
            // country
            dynamicsClient.AddLink(mailingAddressCountry, nameof(mailingAddressCountry.era_country_contact_MailingCountry), contact);
            // province
            if (mailingAddressProvince != null && !string.IsNullOrEmpty(mailingAddressProvince.era_code))
            {
                dynamicsClient.AddLink(mailingAddressProvince, nameof(mailingAddressProvince.era_provinceterritories_contact_MailingProvinceState), contact);
            }
            // city
            if (mailingAddressCity == null || !mailingAddressCity.era_jurisdictionid.HasValue)
            {
                contact.address2_city = profile.MailingAddress.Jurisdiction.Name;
            }
            else
            {
                dynamicsClient.AddLink(mailingAddressCity, nameof(mailingAddressCity.era_jurisdiction_contact_MailingCity), contact);
            }

            //return the new contact created
            return contact;
        }

        private bool? LookupYesNoIdontknowValue(int? value) => value switch
        {
            174360000 => true,
            174360001 => false,
            174360002 => null,
            _ => null
        };

        public enum EvacueeType
        {
            Person = 174360000,
            Pet = 174360001
        }

        public enum NeedsAssessmentType
        {
            Preliminary = 174360000,
            Assessed = 174360001
        }

        public enum RegistrantType
        {
            Primary = 174360000,
            Member = 174360001
        }
    }
}
