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

namespace EMBC.ESS.Resources.Reports
{
    public interface IReportRepository
    {
        Task<EvacueeQueryResult> QueryEvacuee(EvacueeQuery evacueeQuery);
    }

    public class EvacueeQuery
    {
        public string FileId { get; set; }
        public string TaskNumber { get; set; }
        public string EvacuatedFrom { get; set; }
        public string EvacuatedTo { get; set; }
    }

    public class EvacueeQueryResult
    {
        public IEnumerable<Evacuee> Items { get; set; }
    }

    public class Evacuee
    {
        public string FileId { get; set; }
        public bool RegistrationCompleted { get; set; }
        public string TaskNumber { get; set; }
        public DateTime TaskStartDate { get; set; }
        public DateTime TaskEndDate { get; set; }
        public EvacuationFileStatus EvacuationFileStatus { get; set; }
        public string EvacuatedTo { get; set; }
        public string EvacuatedFrom { get; set; }
        public string FacilityName { get; set; }
        public DateTime SelfRegistrationDate { get; set; }
        public DateTime RegistrationCompletedDate { get; set; }
        public bool IsHeadOfHousehold { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string PreferredName { get; set; }
        public string Initials { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Community { get; set; }
        public string Province { get; set; }
        public string Country { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string MailingAddressLine1 { get; set; }
        public string MailingAddressLine2 { get; set; }
        public string MailingCommunity { get; set; }
        public string MailingProvince { get; set; }
        public string MailingCountry { get; set; }
        public string Insurance { get; set; }
        public int NumberOfPets { get; set; }
        public string Inquiry { get; set; }
        public string HealthServices { get; set; }
        public string FirstAid { get; set; }
        public string PersonalServices { get; set; }
        public string ChildCare { get; set; }
        public string PetCare { get; set; }
        public bool CanProvideAccommodation { get; set; }
        public bool CanProvideClothing { get; set; }
        public bool CanProvideFood { get; set; }
        public bool CanProvideIncidentals { get; set; }
        public bool CanProvideTransportation { get; set; }
        public bool NeedsMedication { get; set; }
        public bool HasEnoughSupply { get; set; }
        public string DietaryNeeds { get; set; }
    }

    public enum EvacuationFileStatus
    {
        Pending = 174360000,
        Active = 174360001,
        Completed = 174360002,
        Expired = 174360003,
        Archived = 174360004
    }
}
