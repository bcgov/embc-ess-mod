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
using EMBC.ESS.Resources.Cases.Evacuations;

namespace EMBC.ESS.Resources.Cases
{
    public interface ICaseRepository
    {
        Task<ManageCaseCommandResult> ManageCase(ManageCaseCommand cmd);

        Task<CaseQueryResult> QueryCase(CaseQuery query);
    }

    public abstract class ManageCaseCommand
    { }

    public class ManageCaseCommandResult
    {
        public string Id { get; set; }
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
        public DateTime CreatedOn { get; set; }
        public DateTime LastModified { get; set; }
    }

    public class SubmitEvacuationFileNeedsAssessment : ManageCaseCommand
    {
        public EvacuationFile EvacuationFile { get; set; }
    }

    public class LinkEvacuationFileRegistrant : ManageCaseCommand
    {
        public string FileId { get; set; }
        public string RegistrantId { get; set; }
        public string HouseholdMemberId { get; set; }
    }

    public class EvacuationFilesQuery : CaseQuery
    {
        public string FileId { get; set; }
        public string PrimaryRegistrantId { get; set; }
        public bool MaskSecurityPhrase { get; set; } = true;

        public EvacuationFileStatus[] IncludeFilesInStatuses { get; set; } = Array.Empty<EvacuationFileStatus>();
        public DateTime? RegistraionDateFrom { get; set; }
        public DateTime? RegistraionDateTo { get; set; }
        public int? Limit { get; set; }
        public string HouseholdMemberId { get; set; }
        public string LinkedRegistrantId { get; set; }
        public string NeedsAssessmentId { get; set; }
    }

    public class SaveEvacuationFileNote : ManageCaseCommand
    {
        public string FileId { get; set; }
        public Note Note { get; set; }
    }

    public class SaveEvacuationFileSupportCommand : ManageCaseCommand
    {
        public string FileId { get; set; }
        public IEnumerable<Support> Supports { get; set; }
    }

    public class VoidEvacuationFileSupportCommand : ManageCaseCommand
    {
        public string FileId { get; set; }
        public string SupportId { get; set; }
        public SupportVoidReason VoidReason { get; set; }
    }
}
