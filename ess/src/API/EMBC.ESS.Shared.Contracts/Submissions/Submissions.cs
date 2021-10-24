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
    /// <summary>
    /// Evacuation file submission command
    /// </summary>
    public class SubmitEvacuationFileCommand : Command
    {
        public EvacuationFile File { get; set; }
    }

    /// <summary>
    /// Evacuation file and registrant profile for anonymous file submission
    /// </summary>
    public class SubmitAnonymousEvacuationFileCommand : Command
    {
        public RegistrantProfile SubmitterProfile { get; set; }
        public EvacuationFile File { get; set; }
    }

    /// <summary>
    /// Save registrant's profile
    /// </summary>
    public class SaveRegistrantCommand : Command
    {
        public RegistrantProfile Profile { get; set; }
    }

    /// <summary>
    /// Delete registrant's profile
    /// </summary>
    public class DeleteRegistrantCommand : Command
    {
        public string UserId { get; set; }
    }

    /// <summary>
    /// Updated registrant's verified status
    /// </summary>
    public class SetRegistrantVerificationStatusCommand : Command
    {
        public string RegistrantId { get; set; }
        public bool Verified { get; set; }
    }

    /// <summary>
    /// save a file's note
    /// </summary>
    public class SaveEvacuationFileNoteCommand : Command
    {
        public string FileId { get; set; }
        public Note Note { get; set; }
    }

    /// <summary>
    /// Link Registrant and Household Member
    /// </summary>
    public class LinkRegistrantCommand : Command
    {
        public string FileId { get; set; }
        public string RegistantId { get; set; }
        public string HouseholdMemberId { get; set; }
    }

    /// <summary>
    /// Link Registrant with a user
    /// </summary>
    public class ProcessRegistrantInviteCommand : Command
    {
        public string InviteId { get; set; }
        public string LoggedInUserId { get; set; }
    }

    /// <summary>
    /// Proccess supports for a file, return a print request id
    /// </summary>
    public class ProcessSupportsCommand : Command
    {
        public string RequestingUserId { get; set; }
        public bool IncludeSummaryInReferralsPrintout { get; set; }
        public string FileId { get; set; }
        public IEnumerable<Support> supports { get; set; }
    }

    /// <summary>
    /// void a support in a file by id
    /// </summary>
    public class VoidSupportCommand : Command
    {
        public string FileId { get; set; }
        public string SupportId { get; set; }
        public SupportVoidReason VoidReason { get; set; }
    }

    /// <summary>
    /// query the supplier list for a task
    /// </summary>
    public class SuppliersListQuery : Query<SuppliersListQueryResponse>
    {
        public string TaskId { get; set; }
    }

    public class SuppliersListQueryResponse
    {
        public IEnumerable<SupplierDetails> Items { get; set; }
    }

    /// <summary>
    /// query a print request's content
    /// </summary>
    public class PrintRequestQuery : Query<PrintRequestQueryResult>
    {
        public string PrintRequestId { get; set; }
        public string RequestingUserId { get; set; }
    }

    public class PrintRequestQueryResult
    {
        public string ContentType { get; set; }
        public byte[] Content { get; set; }
        public DateTime PrintedOn { get; set; }
    }

    /// <summary>
    /// create a new support reprint request, returns the new print request id
    /// </summary>
    public class ReprintSupportCommand : Command
    {
        public string FileId { get; set; }
        public string RequestingUserId { get; set; }
        public string SupportId { get; set; }
        public string ReprintReason { get; set; }
    }

    /// <summary>
    /// send an registrant an invite to join the application
    /// </summary>
    public class InviteRegistrantCommand : Command
    {
        public string ContactId { get; set; }
        public string Email { get; set; }
        public string RequestingUserId { get; set; }
    }
}
