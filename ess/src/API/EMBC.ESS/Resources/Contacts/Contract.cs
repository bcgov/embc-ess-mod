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

using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Contacts
{
    public interface IContactRepository
    {
        Task<ContactCommandResult> ManageContact(ContactCommand cmd);

        Task<ContactQueryResult> QueryContact(ContactQuery cmd);
    }

    public abstract class ContactCommand { }

    public class ContactCommandResult
    {
        public string ContactId { get; set; }
    }

    public class ContactQuery
    {
        public string ByContactId { get; set; }
        public string UserId { get; set; }
        public bool LeaveSecurityAnswersUnmasked { get; set; } = false;
    }

    public class ContactQueryResult
    {
        public IEnumerable<Contact> Items { get; set; }
    }

    public class SaveContact : ContactCommand
    {
        public Contact Contact { get; set; }
    }

    public class DeleteContact : ContactCommand
    {
        public string ContactId { get; set; }
    }

    public class Contact
    {
        public string Id { get; set; }
        public bool Authenticated { get; set; }
        public bool Verified { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string PreferredName { get; set; }
        public string Gender { get; set; }
        public string DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public Address PrimaryAddress { get; set; }
        public Address MailingAddress { get; set; }
        public bool RestrictedAccess { get; set; }
        public IEnumerable<SecurityQuestion> SecurityQuestions { get; set; }
        public object UserId { get; set; }
    }

    public class Address
    {
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Community { get; set; }
        public string StateProvince { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
    }

    public class SecurityQuestion
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
    }
}
