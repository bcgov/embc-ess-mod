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
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

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

        public Task<ContactQueryResult> QueryContact(ContactQuery cmd)
        {
            throw new NotImplementedException();
        }

        private async Task<ContactCommandResult> HandleSaveContact(SaveContact cmd)
        {
            // var existingContactId = GetContactIdForBcscId(profile.Id);

            var contact = cmd.Contact;
            var mappedContact = mapper.Map<contact>(cmd.Contact);

            mappedContact.contactid = Guid.NewGuid();
            mappedContact.era_authenticated = true;
            mappedContact.era_verified = false;
            mappedContact.era_registrationdate = DateTimeOffset.UtcNow;

            essContext.AddTocontacts(mappedContact);

            essContext.AddLink(essContext.LookupCountryByCode(contact.PrimaryAddress.Country), nameof(era_country.era_contact_Country), mappedContact);
            essContext.AddLink(essContext.LookupStateProvinceByCode(contact.PrimaryAddress.StateProvince), nameof(era_provinceterritories.era_provinceterritories_contact_ProvinceState), mappedContact);
            essContext.AddLink(essContext.LookupJurisdictionByCode(contact.PrimaryAddress.Community), nameof(era_jurisdiction.era_jurisdiction_contact_City), mappedContact);

            essContext.AddLink(essContext.LookupCountryByCode(contact.MailingAddress.Country), nameof(era_country.era_country_contact_MailingCountry), mappedContact);
            essContext.AddLink(essContext.LookupStateProvinceByCode(contact.MailingAddress.StateProvince), nameof(era_provinceterritories.era_provinceterritories_contact_MailingProvinceState), mappedContact);
            essContext.AddLink(essContext.LookupJurisdictionByCode(contact.MailingAddress.Community), nameof(era_jurisdiction.era_jurisdiction_contact_MailingCity), mappedContact);

            var results = await essContext.SaveChangesAsync();

            essContext.Detach(mappedContact);

            return new ContactCommandResult { ContactId = mappedContact.contactid.ToString() };
        }

        private Guid? GetContactIdForBcscId(string bcscId) =>
            essContext.contacts
                .Where(c => c.era_bcservicescardid == bcscId)
                .Select(c => new { c.contactid, c.era_bcservicescardid })
                .SingleOrDefault()?.contactid;

        private async Task<ContactCommandResult> HandleDeleteContact(DeleteContact cmd)
        {
            var contact = essContext.contacts.Where(c => c.externaluseridentifier == cmd.ContactId).SingleOrDefault();
            if (contact != null)
            {
                essContext.DeleteObject(contact);
                await essContext.SaveChangesAsync();
            }
            return new ContactCommandResult { ContactId = cmd.ContactId };
        }
    }
}
