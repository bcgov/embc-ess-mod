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
using EMBC.Registrants.API.Utils;
using EMBC.ResourceAccess.Dynamics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Microsoft.OData.Edm;

namespace EMBC.Registrants.API.RegistrationsModule
{
    public interface IRegistrationManager
    {
        Task<string> CreateRegistrationAnonymous(AnonymousRegistration registration);
        Task<OkResult> CreateProfile(Registration profileRegistration);
        Task<Registration> GetProfileById(Guid contactId);
    }

    public class RegistrationManager : IRegistrationManager
    {
        private readonly DynamicsClientContext dynamicsClient;
        private readonly IEmailSender emailSender;
        private DateTimeOffset now;

        public RegistrationManager(DynamicsClientContext dynamicsClient, IEmailSender emailSender)
        {
            this.dynamicsClient = dynamicsClient;
            this.now = DateTimeOffset.UtcNow;
            this.emailSender = emailSender;
        }

        /// <summary>
        /// Create a Profile Registration (dynamics contact)
        /// </summary>
        /// <param name="profileRegistration">Registration</param>
        /// <returns>OkResult</returns>
        public async Task<OkResult> CreateProfile(Registration profileRegistration)
        {
            // Create New Contact (Primary Registrant)
            var newRegistrant = CreateNewContact(profileRegistration, true);

            // save changes to dynamics
            var results = await dynamicsClient.SaveChangesAsync();
            //var results = await dynamicsClient.SaveChangesAsync(SaveChangesOptions.BatchWithSingleChangeset);

            // Send email notification of new registrant record created
            EmailAddress registrantEmailAddress = new EmailAddress
            {
                Name = profileRegistration.PersonalDetails.FirstName + " " + profileRegistration.PersonalDetails.LastName,
                Address = profileRegistration.ContactDetails.Email
            };
            SendRegistrationNotificationEmail(registrantEmailAddress);

            return new OkResult();
        }

        /// <summary>
        /// Create an Anonymous Registration (evacuation file, self needs assessment, primary registrant and household members)
        /// </summary>
        /// <param name="registration">AnonymousRegistration</param>
        /// <returns>string</returns>
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
                era_addressline1 = registration.PreliminaryNeedsAssessment.EvacuatedFromAddress.AddressLine1,
                era_addressline2 = registration.PreliminaryNeedsAssessment.EvacuatedFromAddress.AddressLine2,
                era_city = registration.PreliminaryNeedsAssessment.EvacuatedFromAddress.AddressLine1,
                era_Jurisdiction = Lookup(registration.PreliminaryNeedsAssessment.EvacuatedFromAddress.Jurisdiction),
                era_province = registration.PreliminaryNeedsAssessment.EvacuatedFromAddress.StateProvince.StateProvinceCode,
                era_country = registration.PreliminaryNeedsAssessment.EvacuatedFromAddress.Country.CountryCode,
                era_secrettext = registration.RegistrationDetails.SecretPhrase,
            };

            // New needs assessment
            var needsAssessment = new era_needassessment
            {
                era_needassessmentid = Guid.NewGuid(),
                era_needsassessmentdate = now,
                era_EvacuationFile = evacuationFile,
                era_needsassessmenttype = 174360000,
                era_foodrequirement = Lookup(registration.PreliminaryNeedsAssessment.RequiresFood),
                era_clothingrequirement = Lookup(registration.PreliminaryNeedsAssessment.RequiresClothing),
                era_dietaryrequirement = registration.PreliminaryNeedsAssessment.HaveSpecialDiet,
                era_incidentalrequirement = Lookup(registration.PreliminaryNeedsAssessment.RequiresIncidentals),
                era_lodgingrequirement = Lookup(registration.PreliminaryNeedsAssessment.RequiresLodging),
                era_transportationrequirement = Lookup(registration.PreliminaryNeedsAssessment.RequiresTransportation),
                era_medicationrequirement = registration.PreliminaryNeedsAssessment.HaveMedication,
                era_insurancecoverage = Lookup(registration.PreliminaryNeedsAssessment.Insurance),
                era_collectionandauthorization = registration.RegistrationDetails.InformationCollectionConsent,
                era_sharingrestriction = registration.RegistrationDetails.RestrictedAccess,
                era_phonenumberrefusal = string.IsNullOrEmpty(registration.RegistrationDetails.ContactDetails.Phone),
                era_emailrefusal = string.IsNullOrEmpty(registration.RegistrationDetails.ContactDetails.Email)
            };

            // New Contact (Primary Registrant)
            var newPrimaryRegistrant = CreateNewContact(registration.RegistrationDetails, true);

            // New Contacts (Household Members)
            var members = (registration.PreliminaryNeedsAssessment.FamilyMembers ?? Array.Empty<PersonDetails>()).Select(fm => new contact
            {
                contactid = Guid.NewGuid(),
                era_registranttype = 174360001,
                era_authenticated = false,
                era_verified = false,
                era_registrationdate = now,
                firstname = fm.FirstName,
                lastname = fm.LastName,
                era_preferredname = fm.PreferredName,
                era_initial = fm.Initials,
                gendercode = LookupGender(fm.Gender),
                birthdate = FromDateTime(DateTime.Parse(fm.DateOfBirth)),
                era_collectionandauthorization = registration.RegistrationDetails.InformationCollectionConsent,
                era_sharingrestriction = registration.RegistrationDetails.RestrictedAccess,

                address1_line1 = registration.RegistrationDetails.PrimaryAddress.AddressLine1,
                address1_line2 = registration.RegistrationDetails.PrimaryAddress.AddressLine2,
                address1_city = registration.RegistrationDetails.PrimaryAddress.Jurisdiction.JurisdictionName,
                address1_country = registration.RegistrationDetails.PrimaryAddress.Country.CountryCode,
                era_City = Lookup(registration.RegistrationDetails.PrimaryAddress.Jurisdiction),
                era_ProvinceState = Lookup(registration.RegistrationDetails.PrimaryAddress.StateProvince),
                era_Country = Lookup(registration.RegistrationDetails.PrimaryAddress.Country),
                address1_postalcode = registration.RegistrationDetails.PrimaryAddress.PostalCode,

                address2_line1 = registration.RegistrationDetails.MailingAddress.AddressLine1,
                address2_line2 = registration.RegistrationDetails.MailingAddress.AddressLine2,
                address2_city = registration.RegistrationDetails.MailingAddress.Jurisdiction.JurisdictionName,
                address2_country = registration.RegistrationDetails.MailingAddress.Country.CountryName,
                era_MailingCity = Lookup(registration.RegistrationDetails.MailingAddress.Jurisdiction),
                era_MailingProvinceState = Lookup(registration.RegistrationDetails.MailingAddress.StateProvince),
                era_MailingCountry = Lookup(registration.RegistrationDetails.MailingAddress.Country),
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
                era_evacueetype = LookupEvacueeType("Pet")
            });

            // add evacuation file to dynamics context
            dynamicsClient.AddToera_evacuationfiles(evacuationFile);
            // add needs assessment to dynamics context
            dynamicsClient.AddToera_needassessments(needsAssessment);
            // link evacuation file to needs assessment
            dynamicsClient.AddLink(evacuationFile, nameof(evacuationFile.era_needsassessment_EvacuationFile), needsAssessment);

            // New needs assessment evacuee as primary registrant
            var newNeedsAssessmentEvacueeRegistrant = new era_needsassessmentevacuee
            {
                era_needsassessmentevacueeid = Guid.NewGuid(),
                era_isprimaryregistrant = true,
                era_evacueetype = LookupEvacueeType("Person")
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
                    era_evacueetype = LookupEvacueeType("Person")
                };
                dynamicsClient.AddToera_needsassessmentevacuees(newNeedsAssessmentEvacueeMember);
                // link members and needs assessment to evacuee record
                dynamicsClient.AddLink(member, nameof(member.era_NeedsAssessmentEvacuee_RegistrantID), newNeedsAssessmentEvacueeMember);
                dynamicsClient.AddLink(needsAssessment, nameof(needsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), newNeedsAssessmentEvacueeMember);
            }

            // Add New needs assessment evacuee pets to dynamics context
            foreach (var petMember in pets)
            {
                dynamicsClient.AddToera_needsassessmentevacuees(petMember);
                // link pet to evacuee record
                dynamicsClient.AddLink(needsAssessment, nameof(needsAssessment.era_NeedsAssessmentEvacuee_NeedsAssessmentID), petMember);
            }

            //post as batch is not accepted by SSG. Sending with default option (multiple requests to the server stopping on the first failure)
            //var results = await dynamicsClient.SaveChangesAsync(SaveChangesOptions.BatchWithSingleChangeset);
            var results = await dynamicsClient.SaveChangesAsync();

            var queryResult = dynamicsClient.era_evacuationfiles
                //.Expand(f => f.era_city)
                //.Expand(f => f.era_province)
                //.Expand(f => f.era_country)
                .Where(f => f.era_evacuationfileid == evacuationFile.era_evacuationfileid).FirstOrDefault();

            //return $"E{essFileNumber:D9}";
            return queryResult.era_essfilenumber.ToString();
        }

        public Task<Registration> GetProfileById(Guid contactId)
        {
            var profile = newRegistrationObject();
            var queryResult = dynamicsClient.contacts
                .Expand(c => c.era_City)
                .Expand(c => c.era_ProvinceState)
                .Expand(c => c.era_Country)
                .Where(c => c.contactid == contactId).FirstOrDefault();

            // Personal Details
            profile.PersonalDetails.FirstName = queryResult.firstname;
            profile.PersonalDetails.LastName = queryResult.lastname;
            profile.PersonalDetails.DateOfBirth = queryResult.birthdate.ToString();
            profile.PersonalDetails.Initials = queryResult.era_initial;
            profile.PersonalDetails.PreferredName = queryResult.era_preferredname;
            profile.PersonalDetails.Gender = queryResult.gendercode.ToString();
            // Contact Details
            profile.ContactDetails.Email = queryResult.emailaddress1;
            profile.ContactDetails.HideEmailRequired = queryResult.era_emailrefusal.HasValue ? queryResult.era_emailrefusal.Value : false;
            profile.ContactDetails.Phone = queryResult.address1_telephone1;
            profile.ContactDetails.HidePhoneRequired = queryResult.era_phonenumberrefusal.HasValue ? queryResult.era_phonenumberrefusal.Value : false;
            // Primary Address
            profile.PrimaryAddress.AddressLine1 = queryResult.address1_line1;
            profile.PrimaryAddress.AddressLine2 = queryResult.address1_line2;
            profile.PrimaryAddress.Jurisdiction.JurisdictionCode = queryResult.era_City?.era_jurisdictionid.ToString();
            profile.PrimaryAddress.Jurisdiction.JurisdictionName = queryResult.era_City?.era_jurisdictionname;
            profile.PrimaryAddress.StateProvince.StateProvinceCode = queryResult.era_ProvinceState?.era_code;
            profile.PrimaryAddress.StateProvince.StateProvinceName = queryResult.era_ProvinceState?.era_name;
            profile.PrimaryAddress.Country.CountryCode = queryResult.era_Country?.era_countrycode;
            profile.PrimaryAddress.Country.CountryCode = queryResult.era_Country?.era_name;
            profile.PrimaryAddress.PostalCode = queryResult.address1_postalcode;
            // Mailing Address
            profile.MailingAddress.AddressLine1 = queryResult.address2_line1;
            profile.MailingAddress.AddressLine2 = queryResult.address2_line2;
            profile.MailingAddress.Jurisdiction.JurisdictionCode = "TBD"; // queryResult.;
            profile.MailingAddress.Jurisdiction.JurisdictionName = "TBD"; // queryResult.;
            profile.MailingAddress.StateProvince.StateProvinceCode = queryResult.era_MailingProvinceState?.era_code;
            profile.MailingAddress.StateProvince.StateProvinceName = queryResult.era_MailingProvinceState?.era_name;
            profile.MailingAddress.Country.CountryCode = queryResult.era_MailingCountry?.era_countrycode;
            profile.MailingAddress.Country.CountryName = queryResult.era_MailingCountry?.era_name;
            profile.MailingAddress.PostalCode = queryResult.address2_postalcode;
            // Other
            profile.InformationCollectionConsent = queryResult.era_collectionandauthorization.HasValue ? queryResult.era_collectionandauthorization.Value : false;
            profile.RestrictedAccess = queryResult.era_restriction.HasValue ? queryResult.era_restriction.Value : false;
            profile.SecretPhrase = queryResult.era_secrettext;
            return Task.FromResult(profile);
        }

        private Registration newRegistrationObject()
        {
            var registration = new Registration();
            registration.PersonalDetails = new PersonDetails();
            registration.ContactDetails = new ContactDetails();
            registration.PrimaryAddress = new Address();
            registration.PrimaryAddress.Jurisdiction = new Jurisdiction();
            registration.PrimaryAddress.StateProvince = new StateProvince();
            registration.PrimaryAddress.Country = new Country();
            registration.MailingAddress = new Address();
            registration.MailingAddress.Jurisdiction = new Jurisdiction();
            registration.MailingAddress.StateProvince = new StateProvince();
            registration.MailingAddress.Country = new Country();

            return registration;
        }

        private era_country Lookup(Country country) =>
            string.IsNullOrEmpty(country.CountryCode)
            ? null
            : dynamicsClient.era_countries.Where(c => c.era_countrycode == country.CountryCode).FirstOrDefault();

        private int Lookup(bool? value) => value.HasValue ? value.Value ? 174360000 : 174360001 : 174360002;

        private int? Lookup(NeedsAssessment.InsuranceOption value) => value switch
        {
            NeedsAssessment.InsuranceOption.No => 174360000,
            NeedsAssessment.InsuranceOption.Yes => 174360001,
            NeedsAssessment.InsuranceOption.Unsure => 174360002,
            NeedsAssessment.InsuranceOption.Unknown => 174360003,
            _ => null
        };

        private int? LookupGender(string value) => value switch
        {
            "M" => 1,
            "F" => 2,
            "X" => 3,
            _ => null
        };

        private int? LookupEvacueeType(string value) => value switch
        {
            "Person" => 174360000,
            "Pet" => 174360001,
            _ => null
        };

        private era_provinceterritories Lookup(StateProvince stateProvince)
        {
            if (stateProvince == null || string.IsNullOrEmpty(stateProvince.StateProvinceCode))
                return null;

            return dynamicsClient.era_provinceterritorieses.Where(p => p.era_code == stateProvince.StateProvinceCode).FirstOrDefault();
        }

        private era_jurisdiction Lookup(Jurisdiction jurisdiction)
        {
            if (jurisdiction == null || string.IsNullOrEmpty(jurisdiction.JurisdictionCode))
                return null;

            return dynamicsClient.era_jurisdictions.Where(j => j.era_jurisdictionid == Guid.Parse(jurisdiction.JurisdictionCode)).FirstOrDefault();
        }

        private Date? FromDateTime(DateTime? dateTime) => dateTime.HasValue ? new Date(dateTime.Value.Year, dateTime.Value.Month, dateTime.Value.Day) : (Date?)null;

        /// <summary>
        /// Create a new Dynamics Contact (Profile)
        /// </summary>
        /// <param name="profileRegistration">Registration values</param>
        /// <param name="isPrimary">Primary or Member Registrant</param>
        /// <returns>Contact</returns>
        private contact CreateNewContact(Registration profileRegistration, bool isPrimary)
        {
            var contact = new contact();
            contact.contactid = Guid.NewGuid();
            if (isPrimary)
                contact.era_registranttype = 174360000; // Primary
            else
                contact.era_registranttype = 174360001; // Memeber
            contact.era_authenticated = true;
            contact.era_verified = false;
            contact.era_registrationdate = now;
            contact.firstname = profileRegistration.PersonalDetails.FirstName;
            contact.lastname = profileRegistration.PersonalDetails.LastName;
            contact.era_preferredname = profileRegistration.PersonalDetails.PreferredName;
            contact.era_initial = profileRegistration.PersonalDetails.Initials;
            contact.gendercode = LookupGender(profileRegistration.PersonalDetails.Gender);
            contact.birthdate = FromDateTime(DateTime.Parse(profileRegistration.PersonalDetails.DateOfBirth));
            contact.era_collectionandauthorization = profileRegistration.InformationCollectionConsent;
            contact.era_sharingrestriction = profileRegistration.RestrictedAccess;

            contact.address1_line1 = profileRegistration.PrimaryAddress.AddressLine1;
            contact.address1_line2 = profileRegistration.PrimaryAddress.AddressLine2;
            contact.address1_postalcode = profileRegistration.PrimaryAddress.PostalCode;

            contact.address2_line1 = profileRegistration.MailingAddress.AddressLine1;
            contact.address2_line2 = profileRegistration.MailingAddress.AddressLine2;
            contact.address2_postalcode = profileRegistration.MailingAddress.PostalCode;

            contact.emailaddress1 = profileRegistration.ContactDetails.Email;
            contact.address1_telephone1 = profileRegistration.ContactDetails.Phone;

            contact.era_phonenumberrefusal = string.IsNullOrEmpty(profileRegistration.ContactDetails.Phone);
            contact.era_emailrefusal = string.IsNullOrEmpty(profileRegistration.ContactDetails.Email);
            contact.era_secrettext = profileRegistration.SecretPhrase;

            // add contact to dynamics client
            dynamicsClient.AddTocontacts(contact);

            // add links to dynamics client

            /* NOTES:
             * There are 2 city fields in dynamics, one mapping to a jurisdiction and another set as free text. If the city
             * doesn't exist as a jurisdiction then it shoudl be stored in the free text field, otherwise as jurisdiction.
             * The province/state field is only captured by the front end when country is Canada or USA
             */

            // link registrant primary and mailing address city, province, country
            var primaryAddressCountry = Lookup(profileRegistration.PrimaryAddress.Country);
            var primaryAddressProvince = Lookup(profileRegistration.PrimaryAddress.StateProvince);
            var primaryAddressCity = Lookup(profileRegistration.PrimaryAddress.Jurisdiction);
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
                contact.address1_city = profileRegistration.PrimaryAddress.Jurisdiction.JurisdictionName;
            }
            else
            {
                dynamicsClient.AddLink(primaryAddressCity, nameof(primaryAddressCity.era_jurisdiction_contact_City), contact);
            }

            var mailingAddressCountry = Lookup(profileRegistration.MailingAddress.Country);
            var mailingAddressProvince = Lookup(profileRegistration.MailingAddress.StateProvince);
            var mailingAddressCity = Lookup(profileRegistration.MailingAddress.Jurisdiction);
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
                contact.address2_city = profileRegistration.MailingAddress.Jurisdiction.JurisdictionName;
            }
            else
            {
                dynamicsClient.AddLink(mailingAddressCity, nameof(mailingAddressCity.era_jurisdiction_contact_MailingCity), contact);
            }

            //return the new contact created
            return contact;
        }

        private void SendRegistrationNotificationEmail(EmailAddress toAddress)
        {
            System.Collections.Generic.List<EmailAddress> toList = new System.Collections.Generic.List<EmailAddress> { toAddress };
            string emailSubject = "Registration completed successfully";
            string emailBody = $@"
<p>This email has been generated by the Emergency Support Services program to confirm your profile has been created within the Evacuee Registration and Assistant application (ERA).
<p>
<p>Please use the following link to login to the system and review your profile information, start an evacuation file if required, or review existing evacuation file and support information.
<p>
<p>Go to https://ess.gov.bc.ca/ and select the 'Already have an account? Log in' link.";

            EmailMessage emailMessage = new EmailMessage(toList, emailSubject, emailBody);
            emailSender.Send(emailMessage);
        }
    }
}
