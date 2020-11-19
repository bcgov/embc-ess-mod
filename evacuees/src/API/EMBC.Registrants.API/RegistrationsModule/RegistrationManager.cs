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
using EMBC.ResourceAccess.Dynamics;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Microsoft.OData.Edm;

namespace EMBC.Registrants.API.RegistrationsModule
{
    public interface IRegistrationManager
    {
        Task<string> RegisterNew(AnonymousRegistration registration);
    }

    public class RegistrationManager : IRegistrationManager
    {
        private readonly DynamicsClientContext dynamicsClient;

        public RegistrationManager(DynamicsClientContext dynamicsClient)
        {
            this.dynamicsClient = dynamicsClient;
        }

        public async Task<string> RegisterNew(AnonymousRegistration registration)
        {
            var now = DateTimeOffset.Now;
#pragma warning disable CA5394 // Do not use insecure randomness
            var essFileNumber = new Random().Next(999999999); //temporary ESS file number random generator
#pragma warning restore CA5394 // Do not use insecure randomness

            // evacuation file
            var file = new era_evacuationfile
            {
                era_evacuationfileid = Guid.NewGuid(),
                era_essfilenumber = essFileNumber,
                era_evacuationfiledate = now,
                era_addressline1 = registration.PerliminaryNeedsAssessment.EvacuatedFromAddress.AddressLine1,
                era_addressline2 = registration.PerliminaryNeedsAssessment.EvacuatedFromAddress.AddressLine1,
                era_city = registration.PerliminaryNeedsAssessment.EvacuatedFromAddress.AddressLine1,
                era_Jurisdiction = Lookup(registration.PerliminaryNeedsAssessment.EvacuatedFromAddress.Jurisdiction),
                era_province = registration.PerliminaryNeedsAssessment.EvacuatedFromAddress.StateProvince.StateProvinceCode,
                era_country = registration.PerliminaryNeedsAssessment.EvacuatedFromAddress.Country.CountryCode,
                era_collectionandauthorization = true,
                era_sharingrestriction = registration.RegistrationDetails.RestrictedAccess,
                era_phonenumberrefusal = string.IsNullOrEmpty(registration.RegistrationDetails.ContactDetails.Phone),
                era_emailrefusal = string.IsNullOrEmpty(registration.RegistrationDetails.ContactDetails.Email),
                era_secrettext = registration.RegistrationDetails.SecretPhrase,
            };

            // registrant
            var registrant = new contact
            {
                contactid = Guid.NewGuid(),
                era_registranttype = 174360000,
                era_authenticated = false,
                era_verified = false,
                era_registrationdate = now,
                firstname = registration.RegistrationDetails.PersonalDetails.FirstName,
                lastname = registration.RegistrationDetails.PersonalDetails.LastName,
                era_preferredname = registration.RegistrationDetails.PersonalDetails.PreferredName,
                era_initials = registration.RegistrationDetails.PersonalDetails.Initials,
                gendercode = LookupGender(registration.RegistrationDetails.PersonalDetails.Gender),
                birthdate = FromDateTime(DateTime.Parse(registration.RegistrationDetails.PersonalDetails.DateOfBirth)),
                era_collectionandauthorization = registration.RegistrationDetails.InformationCollectionConsent,
                era_sharingrestriction = registration.RegistrationDetails.RestrictedAccess,

                address1_line1 = registration.RegistrationDetails.PrimaryAddress.AddressLine1,
                address1_line2 = registration.RegistrationDetails.PrimaryAddress.AddressLine1,
                address1_city = registration.RegistrationDetails.PrimaryAddress.Jurisdiction.JurisdictionName,
                address1_country = registration.RegistrationDetails.PrimaryAddress.Country.CountryCode,
                era_RelatedCity = Lookup(registration.RegistrationDetails.PrimaryAddress.Jurisdiction),
                era_RelatedProvince = Lookup(registration.RegistrationDetails.PrimaryAddress.StateProvince),
                era_Country = Lookup(registration.RegistrationDetails.PrimaryAddress.Country),
                address1_postalcode = registration.RegistrationDetails.PrimaryAddress.PostalCode,

                address2_line1 = registration.RegistrationDetails.MailingAddress.AddressLine1,
                address2_line2 = registration.RegistrationDetails.MailingAddress.AddressLine1,
                address2_city = registration.RegistrationDetails.MailingAddress.Jurisdiction.JurisdictionName,
                address2_country = registration.RegistrationDetails.MailingAddress.Country.CountryName,
                era_RelatedMailingCity = Lookup(registration.RegistrationDetails.MailingAddress.Jurisdiction),
                era_RelatedMailingProvince = Lookup(registration.RegistrationDetails.MailingAddress.StateProvince),
                era_RelatedMailingCountry = Lookup(registration.RegistrationDetails.MailingAddress.Country),
                address2_postalcode = registration.RegistrationDetails.MailingAddress.PostalCode,

                emailaddress1 = registration.RegistrationDetails.ContactDetails.Email,
                telephone1 = registration.RegistrationDetails.ContactDetails.Phone,

                era_phonenumberrefusal = string.IsNullOrEmpty(registration.RegistrationDetails.ContactDetails.Phone),
                era_emailrefusal = string.IsNullOrEmpty(registration.RegistrationDetails.ContactDetails.Email),
                era_secrettext = registration.RegistrationDetails.SecretPhrase,
            };

            // members
            var members = (registration.PerliminaryNeedsAssessment.FamilyMembers ?? Array.Empty<PersonDetails>()).Select(fm => new contact
            {
                contactid = Guid.NewGuid(),
                era_registranttype = 174360001,
                firstname = fm.FirstName,
                lastname = fm.LastName,
                era_preferredname = fm.PreferredName,
                era_initials = fm.Initials,
                gendercode = LookupGender(fm.Gender),
                birthdate = FromDateTime(DateTime.Parse(fm.DateOfBirth)),
            });

            // needs assessment
            var needsAssessment = new era_needassessment
            {
                era_needassessmentid = Guid.NewGuid(),
                era_needsassessmentdate = now,
                era_EvacuationFile = file,
                era_needsassessmenttype = 174360000,
                era_foodrequirement = Lookup(registration.PerliminaryNeedsAssessment.RequiresFood),
                era_clothingrequirement = Lookup(registration.PerliminaryNeedsAssessment.RequiresFood),
                era_dietaryrequirement = registration.PerliminaryNeedsAssessment.RequiresFood,
                era_incidentalrequirement = Lookup(registration.PerliminaryNeedsAssessment.RequiresFood),
                era_lodgingrequirement = Lookup(registration.PerliminaryNeedsAssessment.RequiresFood),
                era_medicationrequirement = registration.PerliminaryNeedsAssessment.RequiresFood,
                era_insurancecoverage = Lookup(registration.PerliminaryNeedsAssessment.Insurance)
            };

            // pets
            var pets = (registration.PerliminaryNeedsAssessment.Pets ?? Array.Empty<Pet>()).Select(p => new era_evacuee
            {
                era_evacueeid = Guid.NewGuid(),
                era_needsassessment = needsAssessment,
                //era_amountofpets = p.Quantity,
                era_typeofpet = p.Type
            });

            // set enity data and entity links in Dynamics

            // save evacuation file to dynamics
            dynamicsClient.AddToera_evacuationfiles(file);
            // save needs assessment to dynamics
            dynamicsClient.AddToera_needassessments(needsAssessment);
            // link evacuation file to needs assessment
            dynamicsClient.AddLink(file, nameof(file.era_needsassessment_EvacuationFile), needsAssessment);

            // save registrant to dynamics
            dynamicsClient.AddTocontacts(registrant);
            var evacueeRegistrant = new era_evacuee
            {
                era_evacueeid = Guid.NewGuid(),
                era_needsassessment = needsAssessment,
                era_Registrant = registrant
            };
            dynamicsClient.AddToera_evacuees(evacueeRegistrant);
            // link registrant and needs assessment to evacuee record
            dynamicsClient.AddLink(registrant, nameof(registrant.era_contact_evacuee_Registrant), evacueeRegistrant);
            dynamicsClient.AddLink(needsAssessment, nameof(needsAssessment.era_era_needassessment_era_evacuee_needsassessment), evacueeRegistrant);

            // save members to dynamics
            foreach (var member in members)
            {
                dynamicsClient.AddTocontacts(member);
                var evacueeMember = new era_evacuee
                {
                    era_evacueeid = Guid.NewGuid(),
                    era_needsassessment = needsAssessment,
                    era_Registrant = member
                };
                dynamicsClient.AddToera_evacuees(evacueeMember);
                // link members and needs assessment to evacuee record
                dynamicsClient.AddLink(member, nameof(member.era_contact_evacuee_Registrant), evacueeMember);
                dynamicsClient.AddLink(needsAssessment, nameof(needsAssessment.era_era_needassessment_era_evacuee_needsassessment), evacueeMember);
            }

            // save pets to dynamics
            foreach (var pet in pets)
            {
                var petMember = new era_evacuee
                {
                    era_evacueeid = Guid.NewGuid(),
                    era_needsassessment = needsAssessment,
                    era_typeofpet = pet.era_typeofpet,
                    era_amountofpets = pet.era_amountofpets
                };
                dynamicsClient.AddToera_evacuees(petMember);
                // link pet to evacuee record
                dynamicsClient.AddLink(needsAssessment, nameof(needsAssessment.era_era_needassessment_era_evacuee_needsassessment), petMember);
            }

            //post as batch is not accepted by SSG. Sending with default option (multiple requests to the server stopping on the first failure)
            //var results = await dynamicsClient.SaveChangesAsync(SaveChangesOptions.BatchWithSingleChangeset);
            var results = await dynamicsClient.SaveChangesAsync(SaveChangesOptions.None);

            //var newEvacuationFileId = ((era_evacuationfile)results
            //    .Select(r => (EntityDescriptor)((ChangeOperationResponse)r).Descriptor)
            //    .Single(ed => ed.Entity is era_evacuationfile).Entity).era_evacuationfileid;

            //var essFileNumber = dynamicsClient.era_evacuationfiles
            //    .Where(ef => ef.era_evacuationfileid == newEvacuationFileId)
            //    .Single().era_essfilenumber;

            return $"E{essFileNumber:D9}";
        }

        private era_country Lookup(Country country) =>
            string.IsNullOrEmpty(country.CountryCode)
            ? null
            : dynamicsClient.era_countries.Where(c => c.era_countrycode == country.CountryCode).SingleOrDefault();

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

        private era_provinceterritories Lookup(StateProvince stateProvince) =>
        string.IsNullOrEmpty(stateProvince.StateProvinceCode)
            ? null
            : dynamicsClient.era_provinceterritorieses.Where(p => p.era_code == stateProvince.StateProvinceCode).SingleOrDefault();

        private era_jurisdiction Lookup(Jurisdiction jurisdiction) =>
            string.IsNullOrEmpty(jurisdiction.JurisdictionCode)
            ? null
            : dynamicsClient.era_jurisdictions.Where(j => j.era_jurisdictionid == Guid.Parse(jurisdiction.JurisdictionCode)).SingleOrDefault();

        //private int Lookup(string entityName, string optionSetName, string label) =>
        //    dynamicsClient.Execute<AttributeMetadata>(new Uri($"EntityDefinitions(LogicalName='{entityName}')/Attributes(LogicalName='{optionSetName}')"))
        //    .Cast<OptionSetMetadata>()
        //    .Single().Options.Single(o => o.ExternalValue == label).Value.Value;

        private Date? FromDateTime(DateTime? dateTime) => dateTime.HasValue ? new Date(dateTime.Value.Year, dateTime.Value.Month, dateTime.Value.Day) : (Date?)null;
    }
}
