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
        Task<EvacueeQueryResult> QueryEvacuee(ReportQuery evacueeQuery);

        Task<SupportQueryResult> QuerySupport(ReportQuery supportQuery);
    }

    public class ReportQuery
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

    public class SupportQueryResult
    {
        public IEnumerable<Support> Items { get; set; }
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

    public class Support
    {
        [Display(Name = "ESS File Number")]
        public string FileId { get; set; }

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

        [Display(Name = "Purchaser of Goods")]
        public string PurchaserOfGoods { get; set; }

        [Display(Name = "Support Number")]
        public string SupportNumber { get; set; }

        [Display(Name = "Support Type")]
        public string SupportType { get; set; }

        [Display(Name = "Sub Support Type")]
        public string SubSupportType { get; set; }

        [Display(Name = "Valid From Date")]
        public string ValidFromDate { get; set; }

        [Display(Name = "Valid From Time")]
        public string ValidFromTime { get; set; }

        [Display(Name = "Number Of Days")]
        public int NumberOfDays { get; set; }

        [Display(Name = "Valid To Date")]
        public string ValidToDate { get; set; }

        [Display(Name = "Valid To Time")]
        public string ValidToTime { get; set; }

        [Display(Name = "Number Of Evacuees for Support")]
        public string NumberOfEvacuees { get; set; }

        [Display(Name = "Total Amount")]
        public decimal TotalAmount { get; set; }

        [Display(Name = "Breakfasts per Person")]
        public string Breakfasts { get; set; }

        [Display(Name = "Lunches per Person")]
        public string Lunches { get; set; }

        [Display(Name = "Dinners per Person")]
        public string Dinners { get; set; }

        [Display(Name = "Number Of Rooms")]
        public string NumberOfRooms { get; set; }

        [Display(Name = "Number of Nights")]
        public string NumberOfNights { get; set; }

        [Display(Name = "Support Created Date")]
        public string SupportCreatedDate { get; set; }

        [Display(Name = "Support Created Time")]
        public string SupportCreatedTime { get; set; }

        [Display(Name = "Clothing Extreme Weather Conditions")]
        public bool ExtremeWinterConditions { get; set; }

        [Display(Name = "Groceries Number of Meals")]
        public string NumberOfMeals { get; set; }

        [Display(Name = "Supplier Legal Name")]
        public string SupplierLegalName { get; set; }

        [Display(Name = "Supplier Name")]
        public string SupplierName { get; set; }

        [Display(Name = "Supplier Address Line 1")]
        public string AddressLine1 { get; set; }

        [Display(Name = "Supplier Address Line 2")]
        public string AddressLine2 { get; set; }

        [Display(Name = "Supplier City")]
        public string City { get; set; }

        [Display(Name = "Supplier Postal Code")]
        public string PostalCode { get; set; }

        [Display(Name = "Supplier Telephone")]
        public string Phone { get; set; }

        [Display(Name = "Supplier Fax")]
        public string Fax { get; set; }

        [Display(Name = "Lodging Name")]
        public string LodgingName { get; set; }

        [Display(Name = "Lodging Address")]
        public string LodgingAddress { get; set; }

        [Display(Name = "Bileting City")]
        public string BiletingCity { get; set; }

        [Display(Name = "Group Lodging City")]
        public string GroupLodgingCity { get; set; }

        [Display(Name = "Lodging Contact Number")]
        public string LodgingContactNumber { get; set; }

        [Display(Name = "Lodging Email Address")]
        public string LodgingEmail { get; set; }
    }

    public enum EvacuationFileStatus
    {
        Pending = 174360000,
        Active = 174360001,
        Completed = 174360002,
        Expired = 174360003,
        Archived = 174360004
    }

    public enum SupportType
    {
        Food_Groceries = 174360000,
        Food_Restaurant = 174360001,
        Lodging_Hotel = 174360002,
        Lodging_Bileting = 174360003,
        Lodging_Group = 174360004,
        Incidentals = 174360005,
        Clothing = 174360006,
        Transportation_Taxi = 174360007,
        Transportation_Other = 174360008,
    }

    public enum InsuranceOption
    {
        No,
        Yes,
        Unsure,
        Unknown
    }
}
