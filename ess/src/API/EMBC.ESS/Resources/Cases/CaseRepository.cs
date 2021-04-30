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
using Microsoft.OData.Edm;

namespace EMBC.ESS.Resources.Cases
{
    public class CaseRepository : ICaseRepository
    {
        private readonly EssContext essContext;
        private readonly IMapper mapper;

        public CaseRepository(EssContext essContext, IMapper mapper)
        {
            this.essContext = essContext;
            this.mapper = mapper;
        }

        public async Task<ManageCaseCommandResult> ManageCase(ManageCaseCommand cmd)
        {
            return cmd.GetType().Name switch
            {
                nameof(SaveEvacuationFile) => await HandleSaveEvacuationFile((SaveEvacuationFile)cmd),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public Task<CaseQueryResult> QueryCase(CaseQuery query)
        {
            throw new NotImplementedException();
        }

        private async Task<ManageCaseCommandResult> HandleSaveEvacuationFile(SaveEvacuationFile cmd)
        {
            var evacuationFile = cmd.EvacuationFile;

            var primaryContact = essContext.contacts.Where(c => c.contactid == Guid.Parse(evacuationFile.PrimaryRegistrantId)).SingleOrDefault();
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
                    era_isunder19 = CheckIfUnder19Years(primaryContact.birthdate.Value, Date.Now)
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

                    // link registrant primary and mailing address city, province, country
                    //essContext.AddLink(essContext.LookupCountryByCode(profile.PrimaryAddress.Country), nameof(era_country.era_contact_Country), member);
                    //essContext.AddLink(essContext.LookupStateProvinceByCode(profile.PrimaryAddress.StateProvince), nameof(era_provinceterritories.era_provinceterritories_contact_ProvinceState), member);
                    //essContext.AddLink(essContext.LookupJurisdictionByCode(profile.PrimaryAddress.Jurisdiction), nameof(era_jurisdiction.era_jurisdiction_contact_City), member);

                    //essContext.AddLink(essContext.LookupCountryByCode(profile.MailingAddress.Country), nameof(era_country.era_country_contact_MailingCountry), member);
                    //essContext.AddLink(essContext.LookupStateProvinceByCode(profile.MailingAddress.StateProvince), nameof(era_provinceterritories.era_provinceterritories_contact_MailingProvinceState), member);
                    //essContext.AddLink(essContext.LookupJurisdictionByCode(profile.MailingAddress.Jurisdiction), nameof(era_jurisdiction.era_jurisdiction_contact_MailingCity), member);
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

            return new ManageCaseCommandResult { CaseId = essFileNumber };
        }

        private bool CheckIfUnder19Years(Date birthdate, Date currentDate)
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
