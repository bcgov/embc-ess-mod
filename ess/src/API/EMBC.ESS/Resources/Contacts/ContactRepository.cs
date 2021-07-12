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

namespace EMBC.ESS.Resources.Contacts
{
    public class ContactRepository : IContactRepository
    {
        private readonly EssContext essContext;
        private readonly IMapper mapper;

        public ContactRepository(EssContext essContext, IMapper mapper)
        {
            this.essContext = essContext;
            this.mapper = mapper;
        }

        public async Task<ContactCommandResult> ManageContact(ContactCommand cmd)
        {
            return cmd.GetType().Name switch
            {
                nameof(SaveContact) => await HandleSaveContact((SaveContact)cmd),
                nameof(DeleteContact) => await HandleDeleteContact((DeleteContact)cmd),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<ContactQueryResult> QueryContact(ContactQuery query)
        {
            return query.GetType().Name switch
            {
                nameof(RegistrantQuery) => await HandleSearchQuery((RegistrantQuery)query),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        private async Task<ContactCommandResult> HandleSaveContact(SaveContact cmd)
        {
            var contact = mapper.Map<contact>(cmd.Contact);
            var existingContact = contact.contactid.HasValue
                ? essContext.contacts.Where(c => c.contactid == contact.contactid.Value).SingleOrDefault()
                : GetContactIdForBcscId(contact.era_bcservicescardid);

            essContext.DetachAll();

            if (existingContact == null)
            {
                contact.contactid = Guid.NewGuid();
                essContext.AddTocontacts(contact);
            }
            else
            {
                contact.contactid = existingContact.contactid;
                essContext.AttachTo(nameof(EssContext.contacts), contact);
                essContext.UpdateObject(contact);
            }
            essContext.AddLink(essContext.LookupCountryByCode(cmd.Contact.PrimaryAddress.Country), nameof(era_country.era_contact_Country), contact);
            SetStateProvinceLink(cmd.Contact.PrimaryAddress.StateProvince, nameof(era_provinceterritories.era_provinceterritories_contact_ProvinceState), contact, existingContact?._era_provincestate_value?.ToString());
            SetJurisdictionLink(cmd.Contact.PrimaryAddress.Community, nameof(era_jurisdiction.era_jurisdiction_contact_City), contact, existingContact?._era_city_value?.ToString());

            essContext.AddLink(essContext.LookupCountryByCode(cmd.Contact.MailingAddress.Country), nameof(era_country.era_country_contact_MailingCountry), contact);
            SetStateProvinceLink(cmd.Contact.MailingAddress.StateProvince, nameof(era_provinceterritories.era_provinceterritories_contact_MailingProvinceState), contact, existingContact?._era_mailingprovincestate_value?.ToString());
            SetJurisdictionLink(cmd.Contact.MailingAddress.Community, nameof(era_jurisdiction.era_jurisdiction_contact_MailingCity), contact, existingContact?._era_mailingcity_value?.ToString());

            var results = await essContext.SaveChangesAsync();

            essContext.DetachAll();

            return new ContactCommandResult { ContactId = contact.contactid.ToString() };
        }

        private contact GetContactIdForBcscId(string bcscId) =>
            string.IsNullOrEmpty(bcscId)
                ? null
                : essContext.contacts
                    .Where(c => c.era_bcservicescardid == bcscId)
                    .SingleOrDefault();

        private async Task<ContactCommandResult> HandleDeleteContact(DeleteContact cmd)
        {
            var contact = essContext.contacts.Where(c => c.contactid == Guid.Parse(cmd.ContactId)).SingleOrDefault();
            if (contact != null)
            {
                essContext.DeleteObject(contact);
                await essContext.SaveChangesAsync();
            }

            essContext.DetachAll();

            return new ContactCommandResult { ContactId = cmd.ContactId };
        }

        private async Task<ContactQueryResult> HandleSearchQuery(RegistrantQuery query)
        {
            var readContext = essContext.Clone();
            readContext.MergeOption = MergeOption.NoTracking;

            IQueryable<contact> contactQuery = readContext.contacts
                  .Expand(c => c.era_City)
                  .Expand(c => c.era_ProvinceState)
                  .Expand(c => c.era_Country)
                  .Expand(c => c.era_MailingCity)
                  .Expand(c => c.era_MailingProvinceState)
                  .Expand(c => c.era_MailingCountry)
                  .Where(c => c.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(query.ContactId)) contactQuery = contactQuery.Where(c => c.contactid == Guid.Parse(query.ContactId));
            if (!string.IsNullOrEmpty(query.UserId)) contactQuery = contactQuery.Where(c => c.era_bcservicescardid.Equals(query.UserId, StringComparison.OrdinalIgnoreCase));

            var contacts = await ((DataServiceQuery<contact>)contactQuery).GetAllPagesAsync();

            return new ContactQueryResult { Items = mapper.Map<IEnumerable<Contact>>(contacts, opt => opt.Items["MaskSecurityAnswers"] = query.MaskSecurityAnswers.ToString()) };
        }

        private void SetStateProvinceLink(string stateProvinceCode, string sourceProperty, object target, string oldCode)
        {
            var stateProvince = essContext.LookupStateProvinceByCode(stateProvinceCode);
            if (stateProvince != null)
            {
                essContext.AddLink(stateProvince, sourceProperty, target);
            }
            else
            {
                stateProvince = essContext.LookupStateProvinceById(oldCode);
                if (stateProvince != null)
                {
                    essContext.DeleteLink(stateProvince, sourceProperty, target);
                }
            }
        }

        private void SetJurisdictionLink(string jurisdictionCode, string sourceProperty, object target, string oldCode)
        {
            var jurisdiction = essContext.LookupJurisdictionByCode(jurisdictionCode);
            if (jurisdiction != null)
            {
                essContext.AddLink(jurisdiction, sourceProperty, target);
            }
            else
            {
                jurisdiction = essContext.LookupJurisdictionByCode(oldCode);
                if (jurisdiction != null)
                {
                    essContext.DeleteLink(jurisdiction, sourceProperty, target);
                }
            }
        }
    }
}
