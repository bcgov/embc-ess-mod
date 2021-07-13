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
                ? essContext.contacts
                    .Expand(c => c.era_Country)
                    .Expand(c => c.era_MailingCountry)
                    .Expand(c => c.era_ProvinceState)
                    .Expand(c => c.era_MailingProvinceState)
                    .Where(c => c.contactid == contact.contactid.Value).SingleOrDefault()
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

            essContext.SetLink(contact, nameof(contact.era_Country), essContext.LookupCountryByCode(cmd.Contact.PrimaryAddress.Country));
            essContext.SetLink(contact, nameof(contact.era_ProvinceState), essContext.LookupStateProvinceByCode(cmd.Contact.PrimaryAddress.StateProvince));
            essContext.SetLink(contact, nameof(contact.era_City), essContext.LookupJurisdictionByCode(cmd.Contact.PrimaryAddress.Community));

            essContext.SetLink(contact, nameof(contact.era_MailingCountry), essContext.LookupCountryByCode(cmd.Contact.MailingAddress.Country));
            essContext.SetLink(contact, nameof(contact.era_MailingProvinceState), essContext.LookupStateProvinceByCode(cmd.Contact.MailingAddress.StateProvince));
            essContext.SetLink(contact, nameof(contact.era_MailingCity), essContext.LookupJurisdictionByCode(cmd.Contact.MailingAddress.Community));

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
    }
}
