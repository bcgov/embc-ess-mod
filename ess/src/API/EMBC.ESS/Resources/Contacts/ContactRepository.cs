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
        private readonly IEssContextFactory essContextFactory;
        private readonly IMapper mapper;

        public ContactRepository(IEssContextFactory essContextFactory, IMapper mapper)
        {
            this.essContext = essContextFactory.Create();
            this.essContextFactory = essContextFactory;
            this.mapper = mapper;
        }

        public async Task<ContactCommandResult> ManageContact(ContactCommand cmd) =>
            cmd switch
            {
                SaveContact command => await Handle(command),
                DeleteContact command => await Handle(command),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };

        public async Task<ContactQueryResult> QueryContact(ContactQuery query) =>
            query switch
            {
                RegistrantQuery q => await Handle(q),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };

        public async Task<ContactInviteCommandResult> ManageContactInvite(ContactInviteCommand cmd) =>
            cmd switch
            {
                CreateNewContactEmailInvite command => await Handle(command),
                MarkContactInviteAsUsed command => await Handle(command),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };

        public async Task<ContactInviteQueryResult> QueryContactInvite(ContactInviteQuery query) =>
            query switch
            {
                ContactEmailInviteQuery q => await Handle(q),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };

        private async Task<ContactCommandResult> Handle(SaveContact cmd)
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

        private async Task<ContactCommandResult> Handle(DeleteContact cmd)
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

        private async Task<ContactQueryResult> Handle(RegistrantQuery query)
        {
            var readCtx = essContextFactory.CreateReadOnly();

            IQueryable<contact> contactQuery = readCtx.contacts
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

        private async Task<ContactInviteCommandResult> Handle(CreateNewContactEmailInvite cmd)
        {
            var contact = await essContext.contacts.ByKey(Guid.Parse(cmd.ContactId)).GetValueAsync();
            var invitingTeamMember = string.IsNullOrEmpty(cmd.RequestingUserId)
                ? null
                : essContext.era_essteamusers.Where(m => m.statecode == (int)EntityState.Active && m.era_essteamuserid == Guid.Parse(cmd.RequestingUserId)).Single();

            //deactivate all current invites for this contact
            var currentInvites = await ((DataServiceQuery<era_evacueeemailinvite>)essContext.era_evacueeemailinvites
                .Where(i => i.statecode == (int)EntityState.Active && i._era_registrant_value == Guid.Parse(cmd.ContactId)))
                .GetAllPagesAsync();

            foreach (var currentInvite in currentInvites)
            {
                essContext.DeactivateObject(currentInvite, (int)EmailInviteStatus.Expired);
            }

            //create new invite
            var newInvite = new era_evacueeemailinvite
            {
                era_evacueeemailinviteid = Guid.NewGuid(),
                era_emailaddress = cmd.Email
            };

            essContext.AddToera_evacueeemailinvites(newInvite);

            //link to registrant and inviting user
            essContext.SetLink(newInvite, nameof(era_evacueeemailinvite.era_Registrant), contact);
            if (invitingTeamMember != null) essContext.SetLink(newInvite, nameof(era_evacueeemailinvite.era_ESSTeamUser), invitingTeamMember);

            await essContext.SaveChangesAsync();

            essContext.DetachAll();

            return new ContactInviteCommandResult { InviteId = newInvite.era_evacueeemailinviteid.ToString() };
        }

        private async Task<ContactInviteQueryResult> Handle(ContactEmailInviteQuery query)
        {
            var invites = await ((DataServiceQuery<era_evacueeemailinvite>)essContext.era_evacueeemailinvites
                .Where(i => i.statecode == (int)EntityState.Active && i.era_evacueeemailinviteid == Guid.Parse(query.InviteId)))
                .GetAllPagesAsync();

            essContext.DetachAll();

            return new ContactInviteQueryResult
            {
                Items = mapper.Map<IEnumerable<ContactInvite>>(invites)
            };
        }

        private async Task<ContactInviteCommandResult> Handle(MarkContactInviteAsUsed cmd)
        {
            var invite = essContext.era_evacueeemailinvites
            .Where(i => i.statecode == (int)EntityState.Active && i.era_evacueeemailinviteid == Guid.Parse(cmd.InviteId))
            .SingleOrDefault();

            if (invite != null)
            {
                essContext.DeactivateObject(invite, (int)EmailInviteStatus.Used);
                await essContext.SaveChangesAsync();
            }

            return new ContactInviteCommandResult { InviteId = cmd.InviteId };
        }
    }

    internal enum EmailInviteStatus
    {
        Active = 1,
        Used = 174360000,
        Expired = 2,
    }
}
