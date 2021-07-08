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
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Submissions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Files related endpoints
    /// </summary>
    public partial class RegistrationsController
    {
        /// <summary>
        /// Gets a File
        /// </summary>
        /// <param name="fileId">fileId</param>
        /// <returns>file</returns>
        [HttpGet("files/{fileId}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<EvacuationFile>> GetFile(string fileId)
        {
            var file = await evacuationSearchService.GetEvacuationFile(fileId);

            if (file == null) return NotFound();

            foreach (var note in file.Notes)
            {
                note.IsEditable = UserCanEditNote(note);
            }

            return Ok(file);
        }

        /// <summary>
        /// Creates a File
        /// </summary>
        /// <param name="file">file</param>
        /// <returns>new file id</returns>
        [HttpPost("files")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<RegistrationResult>> CreateFile(EvacuationFile file)
        {
            var id = await messagingClient.Send(new SubmitEvacuationFileCommand
            {
                File = mapper.Map<ESS.Shared.Contracts.Submissions.EvacuationFile>(file)
            });

            return Ok(new RegistrationResult { Id = id });
        }

        /// <summary>
        /// Updates a File
        /// </summary>
        /// <param name="fileId">fileId</param>
        /// <param name="file">file</param>
        /// <returns>updated file id</returns>
        [HttpPost("files/{fileId}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<RegistrationResult>> UpdateFile(string fileId, EvacuationFile file)
        {
            file.Id = fileId;
            var id = await messagingClient.Send(new SubmitEvacuationFileCommand
            {
                File = mapper.Map<ESS.Shared.Contracts.Submissions.EvacuationFile>(file)
            });

            return Ok(new RegistrationResult { Id = id });
        }

        /// <summary>
        /// Create a File Note
        /// </summary>
        /// <param name="fileId">fileId</param>
        /// <param name="note">note</param>
        /// <returns>newly created note id</returns>
        [HttpPost("files/{fileId}/notes")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<RegistrationResult>> CreateFileNote(string fileId, Note note)
        {
            var cmd = new SaveEvacuationFileNoteCommand
            {
                Note = mapper.Map<ESS.Shared.Contracts.Submissions.Note>(note),
                FileId = fileId
            };
            var userId = User.FindFirstValue("user_id");
            cmd.Note.CreatingTeamMemberId = userId;

            var id = await messagingClient.Send(cmd);

            return Ok(new EvacuationFileNotesResult { Id = id });
        }

        /// <summary>
        /// Updates a File Note's content
        /// </summary>
        /// <param name="fileId">fileId</param>
        /// <param name="noteId">noteId</param>
        /// <param name="note">note</param>
        /// <returns>updated note id</returns>
        [HttpPost("files/{fileId}/notes/{noteId}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<RegistrationResult>> UpdateFileNoteContent(string fileId, string noteId, Note note)
        {
            var existing_note = (await messagingClient.Send(new EvacuationFileNotesQuery { FileId = fileId, NoteId = noteId })).Notes.SingleOrDefault();
            if (existing_note == null) return NotFound();

            if (!UserCanEditNote(mapper.Map<Note>(existing_note))) return BadRequest(new ProblemDetails { Detail = "The note may be edited only by the user who created it withing a 24 hour period." });

            existing_note.Content = note.Content;

            var cmd = new SaveEvacuationFileNoteCommand
            {
                Note = mapper.Map<ESS.Shared.Contracts.Submissions.Note>(existing_note),
            };

            var id = await messagingClient.Send(cmd);
            return Ok(new EvacuationFileNotesResult { Id = id });
        }

        /// <summary>
        /// Sets a File Note's isHidden field
        /// </summary>
        /// <param name="fileId">fileId</param>
        /// <param name="noteId">noteId</param>
        /// <param name="isHidden">isHidden</param>
        /// <returns>updated note id</returns>
        [HttpPost("files/{fileId}/notes/{noteId}/hidden")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<RegistrationResult>> SetFileNoteHiddenStatus(string fileId, string noteId, bool isHidden)
        {
            var existing_note = (await messagingClient.Send(new EvacuationFileNotesQuery { FileId = fileId, NoteId = noteId })).Notes.SingleOrDefault();
            if (existing_note == null) return NotFound();

            if (!UserCanHideNote()) return BadRequest(new ProblemDetails { Detail = "You do not have sufficient permissions to edit a note's hidden status." });

            existing_note.IsHidden = isHidden;

            var cmd = new SaveEvacuationFileNoteCommand
            {
                Note = mapper.Map<ESS.Shared.Contracts.Submissions.Note>(existing_note),
            };

            var id = await messagingClient.Send(cmd);
            return Ok(new EvacuationFileNotesResult { Id = id });
        }

        /// <summary>
        /// get the security phrase of an evacuation file
        /// </summary>
        /// <param name="fileId">file id</param>
        /// <returns>masked security phrase</returns>
        [HttpGet("files/{fileId}/security")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetSecurityPhraseResponse>> GetSecurityPhrase(string fileId)
        {
            var file = (await messagingClient.Send(new EvacuationFilesQuery
            {
                FileId = fileId
            })).Items.FirstOrDefault();

            if (file == null) return NotFound();

            return Ok(new GetSecurityPhraseResponse { SecurityPhrase = file.SecurityPhrase });
        }

        /// <summary>
        /// verify an evacuation file's security phrase
        /// </summary>
        /// <param name="fileId">file id</param>
        /// <param name="request">security phrase to verify</param>
        /// <returns>result of verification</returns>
        [HttpPost("files/{fileId}/security")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<VerifySecurityPhraseResponse>> VerifySecurityPhrase(string fileId, VerifySecurityPhraseRequest request)
        {
            var verifySecurityPhraseQuery = new VerifySecurityPhraseQuery { FileId = fileId, SecurityPhrase = request.Answer };
            var response = await messagingClient.Send(verifySecurityPhraseQuery);
            return Ok(mapper.Map<VerifySecurityPhraseResponse>(response));
        }

        private bool UserCanEditNote(Note note) => note.CreatingTeamMemberId.Equals(User.FindFirstValue("user_id")) && note.AddedOn >= DateTime.Now.AddHours(-24);

        private bool UserCanHideNote()
        {
            var userRole = Enum.Parse<MemberRole>(User.FindFirstValue("user_role"));
            return new[] { MemberRole.Tier3, MemberRole.Tier4 }.Any(r => r == userRole);
        }
    }

    /// <summary>
    /// Evacuation File
    /// </summary>
    public class EvacuationFile
    {
        public string Id { get; set; }

        [Required]
        public string PrimaryRegistrantId { get; set; }

        [Required]
        public Address EvacuatedFromAddress { get; set; }

        [Required]
        public string RegistrationLocation { get; set; }

        [Required]
        public NeedsAssessment NeedsAssessment { get; set; }

        public IEnumerable<Note> Notes { get; set; }

        public string SecurityPhrase { get; set; }
        public bool SecurityPhraseEdited { get; set; }

        public bool? IsRestricted { get; set; }
        public EvacuationFileStatus? Status { get; set; }
        public DateTime? EvacuationFileDate { get; set; }
        public IEnumerable<EvacuationFileHouseholdMember> HouseholdMembers { get; set; }

        [Required]
        public EvacuationFileTask Task { get; set; }
    }

    public class EvacuationFileTask
    {
        [Required]
        public string TaskNumber { get; set; }

        public string CommunityCode { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
    }

    /// <summary>
    /// Needs assessment form
    /// </summary>
    public class NeedsAssessment
    {
        public string Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

        [Required]
        public InsuranceOption Insurance { get; set; }

        public string EvacuationImpact { get; set; }
        public string EvacuationExternalReferrals { get; set; }
        public string PetCarePlans { get; set; }
        public string HouseHoldRecoveryPlan { get; set; }
        public IEnumerable<ReferralServices> RecommendedReferralServices { get; set; }

        [Required]
        public IEnumerable<EvacuationFileHouseholdMember> HouseholdMembers { get; set; } = Array.Empty<EvacuationFileHouseholdMember>();

        public bool HaveSpecialDiet { get; set; }
        public string SpecialDietDetails { get; set; }
        public bool TakeMedication { get; set; }
        public bool? HaveMedicalSupplies { get; set; }
        public IEnumerable<Pet> Pets { get; set; } = Array.Empty<Pet>();
        public bool? HavePetsFood { get; set; }
        public bool? CanProvideFood { get; set; }
        public bool? CanProvideLodging { get; set; }
        public bool? CanProvideClothing { get; set; }
        public bool? CanProvideTransportation { get; set; }
        public bool? CanProvideIncidentals { get; set; }
        public NeedsAssessmentType Type { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum InsuranceOption
    {
        [Description("No")]
        No,

        [Description("Yes")]
        Yes,

        [Description("Unsure")]
        Unsure,

        [Description("Unknown")]
        Unknown
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum NeedsAssessmentType
    {
        Preliminary,
        Assessed
    }

    public class Note
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public DateTime AddedOn { get; set; }
        public string CreatingTeamMemberId { get; set; }
        public string MemberName { get; set; }
        public string TeamName { get; set; }
        public bool IsEditable { get; set; }
        public bool IsHidden { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum NoteType
    {
        [Description("General")]
        General,

        [Description("Evacuation Impact")]
        EvacuationImpact,

        [Description("Evacuation External Referrals")]
        EvacuationExternalReferrals,

        [Description("Pet Care Plans")]
        PetCarePlans,

        [Description("HouseHold Recovery Plan")]
        HouseHoldRecoveryPlan
    }

    /// <summary>
    /// Pet
    /// </summary>
    public class Pet
    {
        public string Type { get; set; }
        public string Quantity { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ReferralServices
    {
        [Description("Inquiry")]
        Inquiry,

        [Description("Health")]
        Health,

        [Description("First Aid")]
        FirstAid,

        [Description("Personal")]
        Personal,

        [Description("Child Care")]
        ChildCare,

        [Description("Pet Care")]
        PetCare
    }

    public class EvacuationFileNotesResult
    {
        public string Id { get; set; }
    }

    public class EvacuationFileHouseholdMember
    {
        public string Id { get; set; }
        public string LinkedRegistrantId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string Gender { get; set; }
        public string DateOfBirth { get; set; }
        public HouseholdMemberType Type { get; set; }
        public bool IsPrimaryRegistrant { get; set; }
        public bool IsHouseholdMember => !IsPrimaryRegistrant;
        public bool? IsRestricted { get; set; }
        public bool? IsVerified { get; set; }
    }

    public class GetSecurityPhraseResponse
    {
        public string SecurityPhrase { get; set; }
    }

    public class VerifySecurityPhraseRequest
    {
        public string Answer { get; set; }
    }

    public class VerifySecurityPhraseResponse
    {
        public bool IsCorrect { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum EvacuationFileStatus
    {
        [Description("Pending")]
        Pending,

        [Description("Active")]
        Active,

        [Description("Expired")]
        Expired,

        [Description("Completed")]
        Completed
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum HouseholdMemberType
    {
        [Description("Registrant")]
        Registrant,

        [Description("Household Member")]
        HouseholdMember
    }
}
