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

namespace EMBC.ESS.Shared.Contracts.Submissions
{
    public class SubmitFileCommand : Command
    {
        public File File { get; set; }
        public NeedsAssessment InitialNeedsAssessment { get; set; }
    }

    public class SubmitAnonymousFileCommand : Command
    {
        public Profile SubmitterProfile { get; set; }
        public File File { get; set; }
        public NeedsAssessment InitialNeedsAssessment { get; set; }
    }

    public class EvacuationFilesQuery : Query<EvacuationFilesQueryResult> { }

    public class EvacuationFilesQueryResult { }

    public class RegistrantsQuery : Query<RegistrantsQueryResult> { }

    public class RegistrantsQueryResult { }

    public class File
    {
        public string Id { get; set; }
        public DateTime EvacuationDate { get; set; }
        public Address EvacuatedFromAddress { get; set; }
    }

    public class NeedsAssessment
    {
        public string Id { get; set; }
        public string FileId { get; set; }
        public NeedsAssessmentType Type { get; set; }
        public InsuranceOption Insurance { get; set; }
        public bool? CanEvacueeProvideFood { get; set; }
        public bool? CanEvacueeProvideLodging { get; set; }
        public bool? CanEvacueeProvideClothing { get; set; }
        public bool? CanEvacueeProvideTransportation { get; set; }
        public bool? CanEvacueeProvideIncidentals { get; set; }
        public bool HaveSpecialDiet { get; set; }
        public string SpecialDietDetails { get; set; }
        public bool HaveMedication { get; set; }
        public IEnumerable<HouseholdMember> HouseholdMembers { get; set; } = Array.Empty<HouseholdMember>();
        public IEnumerable<Pet> Pets { get; set; } = Array.Empty<Pet>();
        public bool? HasPetsFood { get; set; }
    }

    public class Profile
    {
        public string Id { get; set; }
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
        public bool IsMailingAddressSameAsPrimaryAddress { get; set; }
        public bool RestrictedAccess { get; set; }
        public string SecretPhrase { get; set; }
    }

    public class HouseholdMember
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string PreferredName { get; set; }
        public string Gender { get; set; }
        public string DateOfBirth { get; set; }
        public bool isUnder19 { get; set; }
    }

    public class Pet
    {
        public string Type { get; set; }
        public string Quantity { get; set; }
    }

    public enum InsuranceOption
    {
        No,
        Yes,
        Unsure,
        Unknown
    }

    public enum NeedsAssessmentType
    {
        Preliminary,
        Assessed
    }

    public class Address
    {
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Jurisdiction { get; set; }
        public string StateProvince { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
    }
}
