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
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Reports
{
    public interface IReportRepository
    {
        Task<EvacueeQueryResult> QueryEvacuee(EvacueeQuery evacueeQuery);
    }

    public class EvacueeQuery
    {
        [Display(Name = "File Id")]
        public string FileId { get; set; }

        [Display(Name = "Task Number")]
        public string TaskNumber { get; set; }

        [Display(Name = "Evacuated From")]
        public string EvacuatedFrom { get; set; }

        [Display(Name = "Evacuted To")]
        public string EvacuatedTo { get; set; }
    }

    public class EvacueeQueryResult
    {
        public IEnumerable<Evacuee> Items { get; set; }
    }

    public class Evacuee
    {
        [Display(Name = "ESS File Number")]
        public string FileId { get; set; }

        [Display(Name = "Registration Completed")]
        public bool RegistrationCompleted { get; set; }

        [Display(Name = "Task #")]
        public string TaskNumber { get; set; }

        [Display(Name = "Task # Start Date")]
        public string TaskStartDate { get; set; }

        [Display(Name = "Task # Start Time")]
        public string TaskStartTime { get; set; }

        [Display(Name = "Task # End Date")]
        public string TaskEndDate { get; set; }

        [Display(Name = "Task # End Time")]
        public string TaskEndTime { get; set; }

        [Display(Name = "ESS File Status")]
        public EvacuationFileStatus EvacuationFileStatus { get; set; }

        [Display(Name = "Evacuated To")]
        public string EvacuatedTo { get; set; }

        [Display(Name = "Evacuated From")]
        public string EvacuatedFrom { get; set; }

        [Display(Name = "Facility Name")]
        public string FacilityName { get; set; }

        [Display(Name = "Self Registration Date")]
        public string SelfRegistrationDate { get; set; }

        [Display(Name = "Self Registration Time")]
        public string SelfRegistrationTime { get; set; }

        [Display(Name = "Registration Completed Date")]
        public string RegistrationCompletedDate { get; set; }

        [Display(Name = "Registration Completed Time")]
        public string RegistrationCompletedTime { get; set; }

        [Display(Name = "Is Head Of Household")]
        public bool IsHeadOfHousehold { get; set; }

        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        [Display(Name = "Date Of Birth")]
        public string DateOfBirth { get; set; }

        public string Gender { get; set; }

        [Display(Name = "Preferred Name")]
        public string PreferredName { get; set; }

        public string Initials { get; set; }

        [Display(Name = "Address Line 1")]
        public string AddressLine1 { get; set; }

        [Display(Name = "Address Line 2")]
        public string AddressLine2 { get; set; }

        public string Community { get; set; }

        public string Province { get; set; }

        [Display(Name = "Postal Code")]
        public string PostalCode { get; set; }

        public string Country { get; set; }

        [Display(Name = "Phone Number")]
        public string Phone { get; set; }

        [Display(Name = "Email Address")]
        public string Email { get; set; }

        [Display(Name = "Mailing Address Line 1")]
        public string MailingAddressLine1 { get; set; }

        [Display(Name = "Mailing Address Line 2")]
        public string MailingAddressLine2 { get; set; }

        [Display(Name = "Mailing Community")]
        public string MailingCommunity { get; set; }

        [Display(Name = "Mailing Province")]
        public string MailingProvince { get; set; }

        [Display(Name = "Mailing Postal Code")]
        public string MailingPostal { get; set; }

        [Display(Name = "Mailing Country")]
        public string MailingCountry { get; set; }

        public InsuranceOption Insurance { get; set; }

        [Display(Name = "Pets")]
        public int NumberOfPets { get; set; }

        [Display(Name = "Service Recommendation Inquiry")]
        public bool Inquiry { get; set; }

        [Display(Name = "Service Recommendation Health Services")]
        public bool HealthServices { get; set; }

        [Display(Name = "Service Recommendation First Aid")]
        public bool FirstAid { get; set; }

        [Display(Name = "Service Recommendation Personal Services")]
        public bool PersonalServices { get; set; }

        [Display(Name = "Service Recommendation Child Care")]
        public bool ChildCare { get; set; }

        [Display(Name = "Service Recommendation Pet Care")]
        public bool PetCare { get; set; }

        [Display(Name = "Able to Provide Accommodation")]
        public bool CanProvideAccommodation { get; set; }

        [Display(Name = "Able to Provide Clothing")]
        public bool CanProvideClothing { get; set; }

        [Display(Name = "Able to Provide Food")]
        public bool CanProvideFood { get; set; }

        [Display(Name = "Able to Provide Incidentals")]
        public bool CanProvideIncidentals { get; set; }

        [Display(Name = "Able to Provide Transportation")]
        public bool CanProvideTransportation { get; set; }

        [Display(Name = "Medication Needs")]
        public bool NeedsMedication { get; set; }

        [Display(Name = "Medication supply for 3 days")]
        public bool HasEnoughSupply { get; set; }

        [Display(Name = "Dietary Needs")]
        public string DietaryNeeds { get; set; }

        [Display(Name = "Supports Provided")]
        public int NumberOfSupports { get; set; }

        [Display(Name = "Supports Total Amount Summary")]
        public decimal SupportsTotalAmount { get; set; }
    }

    public enum EvacuationFileStatus
    {
        Pending = 174360000,
        Active = 174360001,
        Completed = 174360002,
        Expired = 174360003,
        Archived = 174360004
    }

    public enum InsuranceOption
    {
        No,
        Yes,
        Unsure,
        Unknown
    }
}
