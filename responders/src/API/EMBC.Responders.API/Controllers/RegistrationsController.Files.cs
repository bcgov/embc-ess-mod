using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Extensions;
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
        /// <param name="needsAssessmentId">optional historical needs aseesment id</param>
        /// <returns>file</returns>
        [HttpGet("files/{fileId}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<EvacuationFile>> GetFile(string fileId, string? needsAssessmentId = null)
        {
            var file = await evacuationSearchService.GetEvacuationFile(fileId, needsAssessmentId);

            if (file == null) return NotFound(fileId);

            foreach (var note in file.Notes)
            {
                note.IsEditable = UserCanEditNote(note);
            }

            return Ok(file);
        }

        /// <summary>
        /// Search files
        /// </summary>
        /// <param name="registrantId">fileId</param>
        /// <param name="manualFileId">manualFileId</param>
        /// <param name="id">id</param>
        /// <returns>file</returns>
        [HttpGet("files")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<EvacuationFileSummary>>> GetFiles([FromQuery] string? registrantId, [FromQuery] string? manualFileId, [FromQuery] string? id)
        {
            if (!string.IsNullOrEmpty(registrantId) && string.IsNullOrEmpty(manualFileId))
            {
                var userRole = Enum.Parse<MemberRole>(currentUserRole);
                var files = await evacuationSearchService.GetEvacuationFilesByRegistrantId(registrantId, userRole);
                return Ok(files);
            }
            else if (!string.IsNullOrEmpty(manualFileId) && string.IsNullOrEmpty(registrantId))
            {
                var files = await evacuationSearchService.GetEvacuationFilesByManualFileId(manualFileId);
                return Ok(files);
            }
            else if (!string.IsNullOrEmpty(id))
            {
                var files = await evacuationSearchService.GetEvacuationFilesByFileId(id);
                return Ok(files);
            }

            return BadRequest(new ProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Invalid request",
                Detail = $"Query using one of {nameof(registrantId)}, {nameof(manualFileId)} or {nameof(id)}"
            });
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
            var mappedFile = mapper.Map<EMBC.ESS.Shared.Contracts.Events.EvacuationFile>(file);

            mappedFile.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            mappedFile.NeedsAssessment.CompletedBy = new EMBC.ESS.Shared.Contracts.Events.TeamMember { Id = currentUserId };
            var id = await messagingClient.Send(new SubmitEvacuationFileCommand
            {
                File = mappedFile
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
            var mappedFile = mapper.Map<EMBC.ESS.Shared.Contracts.Events.EvacuationFile>(file);

            mappedFile.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            mappedFile.NeedsAssessment.CompletedBy = new EMBC.ESS.Shared.Contracts.Events.TeamMember { Id = currentUserId };

            var id = await messagingClient.Send(new SubmitEvacuationFileCommand
            {
                File = mappedFile
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
                Note = mapper.Map<EMBC.ESS.Shared.Contracts.Events.Note>(note),
                FileId = fileId
            };

            cmd.Note.CreatedBy = new EMBC.ESS.Shared.Contracts.Events.TeamMember
            {
                Id = currentUserId
            };

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
            note.Id = noteId;
            var cmd = new SaveEvacuationFileNoteCommand
            {
                Note = mapper.Map<EMBC.ESS.Shared.Contracts.Events.Note>(note),
                FileId = fileId
            };

            cmd.Note.CreatedBy = new EMBC.ESS.Shared.Contracts.Events.TeamMember
            {
                Id = currentUserId
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
            if (!UserCanHideNote()) return BadRequest(new ProblemDetails { Detail = "You do not have sufficient permissions to edit a note's hidden status." });

            var cmd = new ChangeNoteStatusCommand
            {
                NoteId = noteId,
                FileId = fileId,
                IsHidden = isHidden
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

            if (file == null) return NotFound(fileId);

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

        [HttpPost("files/{fileId}/link")]
        public async Task<ActionResult<string>> LinkRegistrantToHouseholdMember(string fileId, RegistrantLinkRequest request)
        {
            var res = await messagingClient.Send(new LinkRegistrantCommand { FileId = fileId, RegistantId = request.RegistantId, HouseholdMemberId = request.HouseholdMemberId });
            return Ok(res);
        }

        private bool UserCanEditNote(Note note) => !string.IsNullOrEmpty(note.CreatingTeamMemberId) && note.CreatingTeamMemberId.Equals(currentUserId) && note.AddedOn >= DateTime.UtcNow.AddHours(-24);

        private bool UserCanHideNote()
        {
            var userRole = Enum.Parse<MemberRole>(currentUserRole);
            return new[] { MemberRole.Tier3, MemberRole.Tier4 }.Any(r => r == userRole);
        }
    }

    /// <summary>
    /// Evacuation File
    /// </summary>
    public class EvacuationFile
    {
        public string? Id { get; set; } = null!;
        public string? ManualFileId { get; set; }

        public DateTime? CompletedOn { get; set; }

        public string? CompletedBy { get; set; }
        public bool? IsPaper { get; set; }

        [Required]
        public string PrimaryRegistrantId { get; set; } = null!;

        public string? PrimaryRegistrantFirstName { get; set; } = null!;
        public string? PrimaryRegistrantLastName { get; set; } = null!;

        [Required]
        public Address EvacuatedFromAddress { get; set; } = null!;

        [Required]
        public string RegistrationLocation { get; set; } = null!;

        [Required]
        public NeedsAssessment NeedsAssessment { get; set; } = null!;

        public IEnumerable<Note> Notes { get; set; } = Array.Empty<Note>();
        public IEnumerable<Support> Supports { get; set; } = Array.Empty<Support>();

        public string? SecurityPhrase { get; set; }
        public bool? SecurityPhraseEdited { get; set; } = false;

        public bool? IsRestricted { get; set; }
        public EvacuationFileStatus? Status { get; set; }
        public DateTime? EvacuationFileDate { get; set; }
        public IEnumerable<EvacuationFileHouseholdMember> HouseholdMembers { get; set; } = Array.Empty<EvacuationFileHouseholdMember>();

        [Required]
        public EvacuationFileTask? Task { get; set; }
    }

    public class EvacuationFileSummary
    {
        public string Id { get; set; } = null!;
        public string? ManualFileId { get; set; }
        public EvacuationFileStatus Status { get; set; }
        public EvacuationFileTask? Task { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime IssuedOn { get; set; }
        public DateTime EvacuationFileDate { get; set; }
        public Address EvacuatedFromAddress { get; set; }
        public bool? IsRestricted { get; set; }
        public bool? IsPaper { get; set; }
        public bool IsPerliminary => Task == null;
        public bool HasSupports { get; set; }
    }

    public class EvacuationFileTask
    {
        [Required]
        public string? TaskNumber { get; set; }

        public string? CommunityCode { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public string? Status { get; set; }
        public IEnumerable<EvacuationFileTaskFeature> Features { get; set; } = Array.Empty<EvacuationFileTaskFeature>();
    }

    public class EvacuationFileTaskFeature
    {
        public string Name { get; set; }
        public bool Enabled { get; set; }
    }

    /// <summary>
    /// Needs assessment form
    /// </summary>
    public class NeedsAssessment
    {
        public string? Id { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ReviewingTeamMemberId { get; set; }
        public string? ReviewingTeamMemberDisplayName { get; set; }

        [Required]
        public InsuranceOption Insurance { get; set; }

        public string? EvacuationImpact { get; set; }
        public string? EvacuationExternalReferrals { get; set; }
        public string? PetCarePlans { get; set; }
        public string? HouseHoldRecoveryPlan { get; set; }

        public IEnumerable<ReferralServices> RecommendedReferralServices { get; set; } = Array.Empty<ReferralServices>();

        [Required]
        public IEnumerable<EvacuationFileHouseholdMember> HouseholdMembers { get; set; } = Array.Empty<EvacuationFileHouseholdMember>();

        public bool HaveSpecialDiet { get; set; }
        public string? SpecialDietDetails { get; set; }
        public bool TakeMedication { get; set; }
        public bool? HaveMedicalSupplies { get; set; }
        public IEnumerable<Pet> Pets { get; set; } = Array.Empty<Pet>();
        public bool? HavePetsFood { get; set; }
        public bool? CanProvideFood { get; set; }
        public bool? CanProvideLodging { get; set; }
        public bool? CanProvideClothing { get; set; }
        public bool? CanProvideTransportation { get; set; }
        public bool? CanProvideIncidentals { get; set; }
        public NeedsAssessmentType? Type { get; set; }
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
        public string? Id { get; set; }

        [Required]
        public string Content { get; set; } = null!;

        public DateTime AddedOn { get; set; }
        public string? CreatingTeamMemberId { get; set; }
        public string? MemberName { get; set; }
        public string? TeamName { get; set; }
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
        [Required]
        public string Type { get; set; } = null!;

        [Required]
        public string Quantity { get; set; } = null;
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
        public string Id { get; set; } = null!;
    }

    public class EvacuationFileHouseholdMember
    {
        public string? Id { get; set; }
        public string? LinkedRegistrantId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? Initials { get; set; }
        public string Gender { get; set; }
        public string DateOfBirth { get; set; }
        public HouseholdMemberType Type { get; set; }
        public bool IsPrimaryRegistrant { get; set; }
        public bool IsHouseholdMember => !IsPrimaryRegistrant;
        public bool IsMinor { get; set; }
        public bool? IsRestricted { get; set; }
        public bool? IsVerified { get; set; }
    }

    public class GetSecurityPhraseResponse
    {
        public string SecurityPhrase { get; set; } = null!;
    }

    public class VerifySecurityPhraseRequest
    {
        [Required]
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

    public class RegistrantLinkRequest
    {
        [Required]
        public string RegistantId { get; set; }

        [Required]
        public string HouseholdMemberId { get; set; }
    }

    public class EvacuationFileMapping : Profile
    {
        public EvacuationFileMapping()
        {
            CreateMap<EvacuationFile, EMBC.ESS.Shared.Contracts.Events.EvacuationFile>()
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.IsRestricted))
                .ForMember(d => d.SecurityPhraseChanged, opts => opts.MapFrom(s => s.SecurityPhraseEdited))
                .ForPath(d => d.RelatedTask.Id, opts => opts.MapFrom(s => s.Task.TaskNumber))
                .ForMember(d => d.EvacuationDate, opts => opts.MapFrom(s => s.EvacuationFileDate))
                .ForMember(d => d.HouseholdMembers, opts => opts.Ignore())
                .ForMember(d => d.Notes, opts => opts.Ignore())
                .ForMember(d => d.Supports, opts => opts.Ignore())
                .ForMember(d => d.CreatedOn, opts => opts.Ignore())
                .ForMember(d => d.PrimaryRegistrantUserId, opts => opts.Ignore())
                ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.EvacuationFile, EvacuationFile>()
                .ForMember(d => d.EvacuationFileDate, opts => opts.MapFrom(s => s.EvacuationDate))
                .ForMember(d => d.SecurityPhraseEdited, opts => opts.MapFrom(s => s.SecurityPhraseChanged))
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.PrimaryRegistrantFirstName, opts => opts.Ignore())
                .ForMember(d => d.PrimaryRegistrantLastName, opts => opts.Ignore())
                .ForMember(d => d.Task, opts => opts.MapFrom(s => s.RelatedTask))
                .AfterMap((s, d) =>
                {
                    var primaryRegistrant = s.HouseholdMembers.FirstOrDefault(m => m.IsPrimaryRegistrant);
                    d.PrimaryRegistrantFirstName = primaryRegistrant?.FirstName;
                    d.PrimaryRegistrantLastName = primaryRegistrant?.LastName;
                })
                ;

            CreateMap<IncidentTask, EvacuationFileTask>()
                .ForMember(d => d.TaskNumber, opts => opts.MapFrom(s => s == null ? null : s.Id))
                .ForMember(d => d.From, opts => opts.MapFrom(s => s == null ? (DateTime?)null : s.StartDate))
                .ForMember(d => d.To, opts => opts.MapFrom(s => s == null ? (DateTime?)null : s.EndDate))
                .ForMember(d => d.Features, opts => opts.Ignore())
                ;

            CreateMap<NeedsAssessment, EMBC.ESS.Shared.Contracts.Events.NeedsAssessment>()
                .ForMember(d => d.CompletedOn, opts => opts.Ignore())
                .ForMember(d => d.CompletedBy, opts => opts.Ignore())
                .ForMember(d => d.Type, opts => opts.MapFrom(s => NeedsAssessmentType.Assessed))
                .ForMember(d => d.Notes, opts => opts.ConvertUsing<NeedsAssessmentNotesConverter, NeedsAssessment>(n => n))
                ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.NeedsAssessment, NeedsAssessment>()
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.CompletedOn))
                .ForMember(d => d.ModifiedOn, opts => opts.MapFrom(s => s.CompletedOn))
                .ForMember(d => d.ReviewingTeamMemberId, opts => opts.MapFrom(s => s.CompletedBy == null ? null : s.CompletedBy.Id))
                .ForMember(d => d.ReviewingTeamMemberDisplayName, opts => opts.MapFrom(s => s.CompletedBy == null ? null : s.CompletedBy.DisplayName))
                .ForMember(d => d.EvacuationImpact, opts => opts.MapFrom(s => s.Notes.SingleOrDefaultProperty(n => n.Type == ESS.Shared.Contracts.Events.NoteType.EvacuationImpact, n => n.Content)))
                .ForMember(d => d.EvacuationExternalReferrals, opts => opts.MapFrom(s => s.Notes.SingleOrDefaultProperty(n => n.Type == EMBC.ESS.Shared.Contracts.Events.NoteType.EvacuationExternalReferrals, n => n.Content)))
                .ForMember(d => d.PetCarePlans, opts => opts.MapFrom(s => s.Notes.SingleOrDefaultProperty(n => n.Type == EMBC.ESS.Shared.Contracts.Events.NoteType.PetCarePlans, n => n.Content)))
                .ForMember(d => d.HouseHoldRecoveryPlan, opts => opts.MapFrom(s => s.Notes.SingleOrDefaultProperty(n => n.Type == EMBC.ESS.Shared.Contracts.Events.NoteType.RecoveryPlan, n => n.Content)))
                ;

            CreateMap<EvacuationFileHouseholdMember, HouseholdMember>()
                .ForMember(d => d.LinkedRegistrantId, opts => opts.Ignore())
                .ForMember(d => d.RestrictedAccess, opts => opts.Ignore())
                .ForMember(d => d.Verified, opts => opts.Ignore())
                .ForMember(d => d.Authenticated, opts => opts.Ignore())
                ;

            CreateMap<HouseholdMember, EvacuationFileHouseholdMember>()
                .ForMember(d => d.Type, opts => opts.MapFrom(s => s.IsPrimaryRegistrant ? HouseholdMemberType.Registrant : HouseholdMemberType.HouseholdMember))
                .ForMember(d => d.IsVerified, opts => opts.MapFrom(s => s.Verified))
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                ;

            CreateMap<Pet, EMBC.ESS.Shared.Contracts.Events.Pet>()
                .ReverseMap()
                ;

            CreateMap<Note, EMBC.ESS.Shared.Contracts.Events.Note>()
                .ForMember(d => d.ModifiedOn, opts => opts.Ignore())
                .ForMember(d => d.CreatedBy, opts => opts.Ignore())
                .ForMember(d => d.Type, opts => opts.Ignore())
                ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.Note, Note>()
                .ForMember(d => d.IsEditable, opts => opts.Ignore())
                .ForMember(d => d.CreatingTeamMemberId, opts => opts.MapFrom(s => s.CreatedBy.Id))
                .ForMember(d => d.MemberName, opts => opts.MapFrom(s => s.CreatedBy.DisplayName))
                .ForMember(d => d.TeamName, opts => opts.MapFrom(s => s.CreatedBy.TeamName))
                ;

            CreateMap<VerifySecurityPhraseResponse, EMBC.ESS.Shared.Contracts.Events.VerifySecurityPhraseResponse>()
                .ReverseMap()
                ;
        }
    }

    public class NeedsAssessmentNotesConverter : IValueConverter<NeedsAssessment, IEnumerable<EMBC.ESS.Shared.Contracts.Events.Note>>
    {
        public IEnumerable<EMBC.ESS.Shared.Contracts.Events.Note> Convert(NeedsAssessment sourceMember, ResolutionContext context)
        {
            List<EMBC.ESS.Shared.Contracts.Events.Note> ret = new List<EMBC.ESS.Shared.Contracts.Events.Note>();

            if (!string.IsNullOrEmpty(sourceMember.EvacuationImpact))
            {
                ret.Add(new EMBC.ESS.Shared.Contracts.Events.Note
                {
                    Content = sourceMember.EvacuationImpact,
                    Type = EMBC.ESS.Shared.Contracts.Events.NoteType.EvacuationImpact,
                });
            }

            if (!string.IsNullOrEmpty(sourceMember.EvacuationExternalReferrals))
            {
                ret.Add(new EMBC.ESS.Shared.Contracts.Events.Note
                {
                    Content = sourceMember.EvacuationExternalReferrals,
                    Type = EMBC.ESS.Shared.Contracts.Events.NoteType.EvacuationExternalReferrals,
                });
            }

            if (!string.IsNullOrEmpty(sourceMember.PetCarePlans))
            {
                ret.Add(new EMBC.ESS.Shared.Contracts.Events.Note
                {
                    Content = sourceMember.PetCarePlans,
                    Type = EMBC.ESS.Shared.Contracts.Events.NoteType.PetCarePlans,
                });
            }

            if (!string.IsNullOrEmpty(sourceMember.HouseHoldRecoveryPlan))
            {
                ret.Add(new EMBC.ESS.Shared.Contracts.Events.Note
                {
                    Content = sourceMember.HouseHoldRecoveryPlan,
                    Type = EMBC.ESS.Shared.Contracts.Events.NoteType.RecoveryPlan,
                });
            }

            return ret;
        }
    }
}
