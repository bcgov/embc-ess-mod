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
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Submissions;

namespace EMBC.ESS.Resources.Cases
{
    public interface ICaseRepository
    {
        Task<ManageCaseCommandResult> ManageCase(ManageCaseCommand cmd);

        Task<CaseQueryResult> QueryCase(CaseQuery query);
    }

    public abstract class ManageCaseCommand { }

    public class ManageCaseCommandResult
    {
        public string CaseId { get; set; }
    }

    public abstract class CaseQuery
    {
    }

    public class CaseQueryResult
    {
        public IEnumerable<Case> Items { get; set; } = Array.Empty<Case>();
    }

    public abstract class Case
    {
        public string Id { get; set; }
    }

    public class SaveEvacuationFile : ManageCaseCommand
    {
        public EvacuationFile EvacuationFile { get; set; }
    }

    public class DeleteEvacuationFile : ManageCaseCommand
    {
        public string Id { get; set; }
    }

    public class EvacuationFilesQuery : CaseQuery
    {
        public string FileId { get; set; }
        public string UserId { get; set; }
        public string PrimaryRegistrantId { get; set; }
    }

    public class SearchEvacuationFilesQuery : EvacuationFilesQuery
    {
        public string PrimaryRegistrantUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DateOfBirth { get; set; }
        public bool IncludeRestrictedAccess { get; set; }
        public bool IncludeHouseholdMembers { get; set; }
        public EvacuationFileStatus[] IncludeFilesInStatuses { get; set; } = Array.Empty<EvacuationFileStatus>();
    }

    public class EvacuationFile : Case
    {
        public EvacuationAddress EvacuatedFromAddress { get; set; }
        public IEnumerable<NeedsAssessment> NeedsAssessments { get; set; } = Array.Empty<NeedsAssessment>();
        public string PrimaryRegistrantId { get; set; }
        public string SecretPhrase { get; set; }
        public DateTime EvacuationDate { get; internal set; }
    }

    public class EvacuationAddress
    {
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Community { get; set; }
        public string StateProvince { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
    }

    public class NeedsAssessment
    {
        public string Id { get; set; }

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
        public NeedsAssessmentType Type { get; set; }
    }

    public class HouseholdMember
    {
        public string Id { get; set; }
        public bool isUnder19 { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string PreferredName { get; set; }
        public string Gender { get; set; }
        public string DateOfBirth { get; set; }
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
}
