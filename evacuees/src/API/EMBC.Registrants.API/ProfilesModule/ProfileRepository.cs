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
using EMBC.Registrants.API.Controllers;
using EMBC.ResourceAccess.Dynamics;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace EMBC.Registrants.API.ProfilesModule
{
    public interface IProfileRepository
    {
        Task<string> Create(Profile profile);

        Task<Profile> Read(string userId);

        Task Update(Profile profile);

        Task<bool> DoesProfileExist(string userId);

        Task Delete(string userId);
    }

    public class ProfileRepository : IProfileRepository
    {
        private readonly DynamicsClientContext dynamicsClient;
        private readonly AutoMapper.IMapper mapper;

        public ProfileRepository(DynamicsClientContext dynamicsClient, AutoMapper.IMapper mapper)
        {
            this.dynamicsClient = dynamicsClient;
            this.mapper = mapper;
        }

        public async Task<string> Create(Profile profile)
        {
            var existingContactId = GetContactIdForBcscId(profile.Id);
            if (existingContactId.HasValue) throw new Exception($"Profile already exists for ID {profile.Id}: {existingContactId}");

            var contact = mapper.Map<contact>(profile);

            contact.contactid = Guid.NewGuid();
            contact.era_authenticated = true;
            contact.era_verified = false;
            contact.era_registrationdate = DateTimeOffset.UtcNow;

            dynamicsClient.AddTocontacts(contact);

            dynamicsClient.TryAddLink(dynamicsClient.LookupCountryByCode(profile.PrimaryAddress.Country), nameof(era_country.era_contact_Country), contact);
            dynamicsClient.TryAddLink(dynamicsClient.LookupStateProvinceByCode(profile.PrimaryAddress.StateProvince), nameof(era_provinceterritories.era_provinceterritories_contact_ProvinceState), contact);
            dynamicsClient.TryAddLink(dynamicsClient.LookupJurisdictionByCode(profile.PrimaryAddress.Community), nameof(era_jurisdiction.era_jurisdiction_contact_City), contact);

            dynamicsClient.TryAddLink(dynamicsClient.LookupCountryByCode(profile.MailingAddress.Country), nameof(era_country.era_country_contact_MailingCountry), contact);
            dynamicsClient.TryAddLink(dynamicsClient.LookupStateProvinceByCode(profile.MailingAddress.StateProvince), nameof(era_provinceterritories.era_provinceterritories_contact_MailingProvinceState), contact);
            dynamicsClient.TryAddLink(dynamicsClient.LookupJurisdictionByCode(profile.MailingAddress.Community), nameof(era_jurisdiction.era_jurisdiction_contact_MailingCity), contact);

            var results = await dynamicsClient.SaveChangesAsync<contact>(SaveChangesOptions.BatchWithSingleChangeset);

            dynamicsClient.Detach(contact);

            return contact.contactid.ToString();
        }

        public async Task<Profile> Read(string userId)
        {
            await Task.CompletedTask;
            var contact = dynamicsClient.contacts
                  .Expand(c => c.era_City)
                  .Expand(c => c.era_ProvinceState)
                  .Expand(c => c.era_Country)
                  .Expand(c => c.era_MailingCity)
                  .Expand(c => c.era_MailingProvinceState)
                  .Expand(c => c.era_MailingCountry)
                  .Where(c => c.era_bcservicescardid == userId)
                  .SingleOrDefault();

            if (contact == null) return null;

            dynamicsClient.Detach(contact);

            return mapper.Map<Profile>(contact);
        }

        public async Task Update(Profile profile)
        {
            var contactId = GetContactIdForBcscId(profile.Id);
            var contact = mapper.Map<contact>(profile);

            contact.contactid = contactId;

            dynamicsClient.AttachTo(nameof(dynamicsClient.contacts), contact);

            dynamicsClient.TryAddLink(dynamicsClient.LookupCountryByCode(profile.PrimaryAddress.Country), nameof(era_country.era_contact_Country), contact);
            dynamicsClient.TryAddLink(dynamicsClient.LookupStateProvinceByCode(profile.PrimaryAddress.StateProvince), nameof(era_provinceterritories.era_provinceterritories_contact_ProvinceState), contact);
            dynamicsClient.TryAddLink(dynamicsClient.LookupJurisdictionByCode(profile.PrimaryAddress.Community), nameof(era_jurisdiction.era_jurisdiction_contact_City), contact);

            dynamicsClient.TryAddLink(dynamicsClient.LookupCountryByCode(profile.MailingAddress.Country), nameof(era_country.era_country_contact_MailingCountry), contact);
            dynamicsClient.TryAddLink(dynamicsClient.LookupStateProvinceByCode(profile.MailingAddress.StateProvince), nameof(era_provinceterritories.era_provinceterritories_contact_MailingProvinceState), contact);
            dynamicsClient.TryAddLink(dynamicsClient.LookupJurisdictionByCode(profile.MailingAddress.Community), nameof(era_jurisdiction.era_jurisdiction_contact_MailingCity), contact);

            dynamicsClient.UpdateObject(contact);

            var updatedContact = await dynamicsClient.SaveChangesAsync<contact>(SaveChangesOptions.BatchWithSingleChangeset);

            dynamicsClient.Detach(updatedContact);
        }

        public async Task<bool> DoesProfileExist(string userId)
        {
            await Task.CompletedTask;
            return GetContactIdForBcscId(userId).HasValue;
        }

        public async Task Delete(string userId)
        {
            var contact = dynamicsClient.contacts.Where(c => c.era_bcservicescardid == userId).SingleOrDefault();
            if (contact != null)
            {
                dynamicsClient.DeleteObject(contact);
                await dynamicsClient.SaveChangesAsync();
            }
        }

        private Guid? GetContactIdForBcscId(string bcscId) =>
            dynamicsClient.contacts
                .Where(c => c.era_bcservicescardid == bcscId)
                .Select(c => new { c.contactid, c.era_bcservicescardid })
                .SingleOrDefault()?.contactid;

        //private Guid? GetContactIdForBcscId(string bcscId) =>
        //  dynamicsClient.contacts.GetSingleEntityByKey(new Dictionary<string, object> { { nameof(contact.era_bcservicescardid), bcscId } }).Select(c => c.contactid).GetValue();
    }
}
