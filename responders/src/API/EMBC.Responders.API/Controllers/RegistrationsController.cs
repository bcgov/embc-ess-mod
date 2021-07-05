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
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Submissions;
using EMBC.Responders.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Handles registration related operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public partial class RegistrationsController : ControllerBase
    {
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private readonly IEvacuationSearchService evacuationSearchService;

        public RegistrationsController(IMessagingClient messagingClient, IMapper mapper, IEvacuationSearchService evacuationSearchService)
        {
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.evacuationSearchService = evacuationSearchService;
        }

        /// <summary>
        /// Gets a Registrant Profile
        /// </summary>
        /// <param name="registrantId">RegistrantId</param>
        /// <returns>registrant</returns>
        [HttpGet("registrants/{registrantId}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<RegistrantProfile>> GetRegistrantProfile(string registrantId)
        {
            var registrant = (await messagingClient.Send(new RegistrantsSearchQuery
            {
                Id = registrantId
            })).Items.FirstOrDefault();

            if (registrant == null || registrant.RegistrantProfile == null) return NotFound();

            return Ok(mapper.Map<RegistrantProfile>(registrant.RegistrantProfile));
        }

        /// <summary>
        /// Creates a Registrant Profile
        /// </summary>
        /// <param name="registrant">Registrant</param>
        /// <returns>new registrant id</returns>
        [HttpPost("registrants")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<RegistrationResult>> CreateRegistrantProfile(RegistrantProfile registrant)
        {
            if (registrant == null) return BadRequest();

            var profile = mapper.Map<ESS.Shared.Contracts.Submissions.RegistrantProfile>(registrant);
            var id = await messagingClient.Send(new SaveRegistrantCommand
            {
                Profile = profile
            });
            return Ok(new RegistrationResult { Id = id });
        }

        /// <summary>
        /// Updates a Registrant Profile
        /// </summary>
        /// <param name="registrantId">RegistrantId</param>
        /// <param name="registrant">Registrant</param>
        /// <returns>updated registrant id</returns>
        [HttpPost("registrants/{registrantId}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<RegistrationResult>> UpdateRegistrantProfile(string registrantId, RegistrantProfile registrant)
        {
            if (registrant == null) return BadRequest();

            registrant.Id = registrantId;

            var profile = mapper.Map<ESS.Shared.Contracts.Submissions.RegistrantProfile>(registrant);
            var id = await messagingClient.Send(new SaveRegistrantCommand
            {
                Profile = profile
            });
            return Ok(new RegistrationResult { Id = id });
        }

        /// <summary>
        /// Get security questions for a registrant
        /// </summary>
        /// <param name="registrantId">registrant id</param>
        /// <returns>list of security questions and masked answers</returns>
        [HttpGet("registrants/{registrantId}/security")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetSecurityQuestionsResponse>> GetSecurityQuestions(string registrantId)
        {
            var registrant = (await messagingClient.Send(new RegistrantsSearchQuery
            {
                Id = registrantId
            })).Items.FirstOrDefault();

            if (registrant == null || registrant.RegistrantProfile == null) return NotFound();

            return Ok(new GetSecurityQuestionsResponse { Questions = mapper.Map<IEnumerable<SecurityQuestion>>(registrant.RegistrantProfile.SecurityQuestions) });
        }

        /// <summary>
        /// verify answers for security questions
        /// </summary>
        /// <param name="registrantId">registrant id</param>
        /// <param name="request">array of questions and their answers</param>
        /// <returns>number of correct answers</returns>
        [HttpPost("registrants/{registrantId}/security")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<VerifySecurityQuestionsResponse>> VerifySecurityQuestions(string registrantId, VerifySecurityQuestionsRequest request)
        {
            VerifySecurityQuestionsQuery verifySecurityQuestionsQuery = new VerifySecurityQuestionsQuery { RegistrantId = registrantId, Answers = mapper.Map<IEnumerable<ESS.Shared.Contracts.Submissions.SecurityQuestion>>(request.Answers) };
            var response = await messagingClient.Send(verifySecurityQuestionsQuery);
            return Ok(mapper.Map<VerifySecurityQuestionsResponse>(response));
        }

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
        /// Updates a File Note
        /// </summary>
        /// <param name="fileId">fileId</param>
        /// <param name="noteId">noteId</param>
        /// <param name="note">note</param>
        /// <returns>newly created note id</returns>
        [HttpPost("files/{fileId}/notes/{noteId}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<RegistrationResult>> UpdateFileNote(string fileId, string noteId, Note note)
        {
            note.Id = noteId;
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
        /// get the security phrase of an evacuation file
        /// </summary>
        /// <param name="fileId">file id</param>
        /// <returns>masked security phrase</returns>
        [HttpGet("files/{fileId}/security")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetSecurityPhraseResponse>> GetSecurityPhrase(string fileId)
        {
            var file = (await messagingClient.Send(new EvacuationFilesSearchQuery
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
            VerifySecurityPhraseQuery verifySecurityPhraseQuery = new VerifySecurityPhraseQuery { FileId = fileId, SecurityPhrase = request.Answer };
            var response = await messagingClient.Send(verifySecurityPhraseQuery);
            return Ok(mapper.Map<VerifySecurityPhraseResponse>(response));
        }
    }

    public class RegistrationResult
    {
        public string Id { get; set; }
    }

    public class EvacuationFileNotesResult
    {
        public string Id { get; set; }
    }

    public class EvacuationFileHouseholdMember
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initials { get; set; }
        public string Gender { get; set; }
        public string DateOfBirth { get; set; }
        public HouseholdMemberType Type { get; set; }
        public bool IsMatch { get; set; }
        public bool IsPrimaryRegistrant { get; set; }
        public bool IsHouseholdMember => !IsPrimaryRegistrant;
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RegistrantStatus
    {
        [Description("Verified")]
        Verified,

        [Description("Not Verified")]
        NotVerified
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

    public class SecurityQuestion
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public bool AnswerChanged { get; set; }
    }

    public class GetSecurityQuestionsResponse
    {
        public IEnumerable<SecurityQuestion> Questions { get; set; }
    }

    public class VerifySecurityQuestionsRequest
    {
        public IEnumerable<SecurityQuestion> Answers { get; set; }
    }

    public class VerifySecurityQuestionsResponse
    {
        public int NumberOfCorrectAnswers { get; set; }
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
        public NoteType Type { get; set; }
        public string Content { get; set; }
        public DateTime AddedOn { get; set; }
        public string MemberName { get; set; }
        public string TeamName { get; set; }
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

    /// <summary>
    /// Registrant profile
    /// </summary>
    public class RegistrantProfile
    {
        public string Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

        public bool Restriction { get; set; }

        [Required]
        public PersonDetails PersonalDetails { get; set; }

        [Required]
        public ContactDetails ContactDetails { get; set; }

        [Required]
        public Address PrimaryAddress { get; set; }

        public Address MailingAddress { get; set; }
        public bool IsMailingAddressSameAsPrimaryAddress { get; set; }
        public SecurityQuestion[] SecurityQuestions { get; set; }
        public bool VerifiedUser { get; set; }
    }

    public class RegistrationsMapping : Profile
    {
        public RegistrationsMapping()
        {
            CreateMap<VerifySecurityPhraseResponse, ESS.Shared.Contracts.Submissions.VerifySecurityPhraseResponse>()
                .ReverseMap()
                ;

            CreateMap<VerifySecurityQuestionsResponse, ESS.Shared.Contracts.Submissions.VerifySecurityQuestionsResponse>()
                .ReverseMap()
                ;

            CreateMap<SecurityQuestion, ESS.Shared.Contracts.Submissions.SecurityQuestion>()
                .ReverseMap()
                ;

            CreateMap<EvacuationFileHouseholdMember, ESS.Shared.Contracts.Submissions.HouseholdMember>()
                .ForMember(d => d.PreferredName, opts => opts.Ignore())
                .ForMember(d => d.IsUnder19, opts => opts.Ignore())
                .ForMember(d => d.IsPrimaryRegistrant, opts => opts.MapFrom(s => s.Type == HouseholdMemberType.Registrant))
                .ForMember(d => d.LinkedRegistrantId, opts => opts.Ignore())
                ;

            CreateMap<HouseholdMember, EvacuationFileHouseholdMember>()
                   .ForMember(d => d.Type, opts => opts.MapFrom(s => s.IsPrimaryRegistrant ? HouseholdMemberType.Registrant : HouseholdMemberType.HouseholdMember))
                   .ForMember(d => d.IsMatch, opts => opts.Ignore())
                   ;

            CreateMap<Pet, ESS.Shared.Contracts.Submissions.Pet>()
                .ReverseMap()
                ;

            CreateMap<Note, ESS.Shared.Contracts.Submissions.Note>()
                .ForMember(d => d.ModifiedOn, opts => opts.Ignore())
                .ForMember(d => d.CreatingTeamMemberId, opts => opts.Ignore())
                .ForMember(d => d.TeamId, opts => opts.Ignore())
                ;

            CreateMap<ESS.Shared.Contracts.Submissions.Note, Note>()
                ;

            CreateMap<NeedsAssessment, ESS.Shared.Contracts.Submissions.NeedsAssessment>()
                .ForMember(d => d.CompletedOn, opts => opts.Ignore())
                .ForMember(d => d.CreatedOn, opts => opts.Ignore())
                .ForMember(d => d.CreatedByUserId, opts => opts.Ignore())
                .ForMember(d => d.CreatedByDisplayName, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedUserId, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedDisplayName, opts => opts.Ignore())
                .ForMember(d => d.Type, opts => opts.MapFrom(s => NeedsAssessmentType.Assessed))
                .ForMember(d => d.Notes, opts => opts.ConvertUsing<NeedsAssessmentNotesConverter, NeedsAssessment>(n => n))
                ;

            CreateMap<ESS.Shared.Contracts.Submissions.NeedsAssessment, NeedsAssessment>()
                .ForMember(d => d.ModifiedOn, opts => opts.MapFrom(s => s.LastModified))
                .ForMember(d => d.EvacuationImpact, opts => opts.MapFrom(s => s.Notes.Where(n => n.Type == ESS.Shared.Contracts.Submissions.NoteType.EvacuationImpact).SingleOrDefault().Content))
                .ForMember(d => d.EvacuationExternalReferrals, opts => opts.MapFrom(s => s.Notes.Where(n => n.Type == ESS.Shared.Contracts.Submissions.NoteType.EvacuationExternalReferrals).SingleOrDefault().Content))
                .ForMember(d => d.PetCarePlans, opts => opts.MapFrom(s => s.Notes.Where(n => n.Type == ESS.Shared.Contracts.Submissions.NoteType.PetCarePlans).SingleOrDefault().Content))
                .ForMember(d => d.HouseHoldRecoveryPlan, opts => opts.MapFrom(s => s.Notes.Where(n => n.Type == ESS.Shared.Contracts.Submissions.NoteType.RecoveryPlan).SingleOrDefault().Content))
                ;

            CreateMap<Address, ESS.Shared.Contracts.Submissions.Address>()
               .ForMember(d => d.Community, opts => opts.MapFrom(s => s.CommunityCode))
               .ForMember(d => d.Country, opts => opts.MapFrom(s => s.CountryCode))
               .ForMember(d => d.StateProvince, opts => opts.MapFrom(s => s.StateProvinceCode))
               ;

            CreateMap<ESS.Shared.Contracts.Submissions.Address, Address>()
                .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => s.Community))
                .ForMember(d => d.StateProvinceCode, opts => opts.MapFrom(s => s.StateProvince))
                .ForMember(d => d.CountryCode, opts => opts.MapFrom(s => s.Country))
                ;

            CreateMap<EvacuationFile, ESS.Shared.Contracts.Submissions.EvacuationFile>()
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.IsRestricted))
                .ForMember(d => d.SecurityPhraseChanged, opts => opts.MapFrom(s => s.SecurityPhraseEdited))
                .ForMember(d => d.TaskId, opts => opts.MapFrom(s => s.Task.TaskNumber))
                .ForMember(d => d.EvacuationDate, opts => opts.MapFrom(s => s.EvacuationFileDate))
                .ForMember(d => d.HouseholdMembers, opts => opts.Ignore())
                .AfterMap((s, d) => d.NeedsAssessment.HouseholdMembers.Single(m => m.IsPrimaryRegistrant).LinkedRegistrantId = s.PrimaryRegistrantId)
                ;

            CreateMap<ESS.Shared.Contracts.Submissions.EvacuationFile, EvacuationFile>()
                .ForMember(d => d.EvacuationFileDate, opts => opts.MapFrom(s => s.EvacuationDate))
                .ForMember(d => d.SecurityPhraseEdited, opts => opts.MapFrom(s => s.SecurityPhraseChanged))
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.HouseholdMembers, opts => opts.MapFrom(s => s.HouseholdMembers))
                .ForMember(d => d.Task, opts => opts.MapFrom(s => s.TaskId == null
                    ? null
                    : new EvacuationFileTask
                    {
                        TaskNumber = s.TaskId
                    }))
                ;

            CreateMap<RegistrantProfile, ESS.Shared.Contracts.Submissions.RegistrantProfile>()
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.Restriction))
                .ForMember(d => d.IsMailingAddressSameAsPrimaryAddress, opts => opts.Ignore())
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.ContactDetails.Phone))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.ContactDetails.Email))
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => s.PersonalDetails.DateOfBirth))
                .ForMember(d => d.Gender, opts => opts.MapFrom(s => s.PersonalDetails.Gender))
                .ForMember(d => d.PreferredName, opts => opts.MapFrom(s => s.PersonalDetails.PreferredName))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.PersonalDetails.Initials))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.PersonalDetails.LastName))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.PersonalDetails.FirstName))
                .ForMember(d => d.UserId, opts => opts.Ignore())
                .ForMember(d => d.AuthenticatedUser, opts => opts.Ignore())
                .ForMember(d => d.CreatedOn, opts => opts.Ignore())
                .ForMember(d => d.CreatedByUserId, opts => opts.Ignore())
                .ForMember(d => d.CreatedByDisplayName, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedUserId, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedDisplayName, opts => opts.Ignore())
                ;

            CreateMap<ESS.Shared.Contracts.Submissions.RegistrantProfile, RegistrantProfile>()
                .ForMember(d => d.ModifiedOn, opts => opts.MapFrom(s => s.LastModified))
                .ForMember(d => d.Restriction, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.PersonalDetails, opts => opts.MapFrom(s => new PersonDetails
                {
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    DateOfBirth = s.DateOfBirth,
                    Gender = s.Gender,
                    Initials = s.Initials,
                    PreferredName = s.PreferredName
                }))
                .ForMember(d => d.ContactDetails, opts => opts.MapFrom(s => new ContactDetails
                {
                    Email = s.Email,
                    Phone = s.Phone
                }))
                .ForMember(d => d.IsMailingAddressSameAsPrimaryAddress, opts => opts.MapFrom(s =>
                    s.MailingAddress.Country == s.PrimaryAddress.Country &&
                    s.MailingAddress.StateProvince == s.PrimaryAddress.StateProvince &&
                    s.MailingAddress.Community == s.PrimaryAddress.Community &&
                    s.MailingAddress.City == s.PrimaryAddress.City &&
                    s.MailingAddress.PostalCode == s.PrimaryAddress.PostalCode &&
                    s.MailingAddress.AddressLine1 == s.PrimaryAddress.AddressLine1 &&
                    s.MailingAddress.AddressLine2 == s.PrimaryAddress.AddressLine2))
                ;
        }
    }

    public class NeedsAssessmentNotesConverter : IValueConverter<NeedsAssessment, IEnumerable<ESS.Shared.Contracts.Submissions.Note>>
    {
        public IEnumerable<ESS.Shared.Contracts.Submissions.Note> Convert(NeedsAssessment sourceMember, ResolutionContext context)
        {
            List<ESS.Shared.Contracts.Submissions.Note> ret = new List<ESS.Shared.Contracts.Submissions.Note>();

            if (!string.IsNullOrEmpty(sourceMember.EvacuationImpact))
            {
                ret.Add(new ESS.Shared.Contracts.Submissions.Note
                {
                    Content = sourceMember.EvacuationImpact,
                    Type = ESS.Shared.Contracts.Submissions.NoteType.EvacuationImpact,
                });
            }

            if (!string.IsNullOrEmpty(sourceMember.EvacuationExternalReferrals))
            {
                ret.Add(new ESS.Shared.Contracts.Submissions.Note
                {
                    Content = sourceMember.EvacuationExternalReferrals,
                    Type = ESS.Shared.Contracts.Submissions.NoteType.EvacuationExternalReferrals,
                });
            }

            if (!string.IsNullOrEmpty(sourceMember.PetCarePlans))
            {
                ret.Add(new ESS.Shared.Contracts.Submissions.Note
                {
                    Content = sourceMember.PetCarePlans,
                    Type = ESS.Shared.Contracts.Submissions.NoteType.PetCarePlans,
                });
            }

            if (!string.IsNullOrEmpty(sourceMember.HouseHoldRecoveryPlan))
            {
                ret.Add(new ESS.Shared.Contracts.Submissions.Note
                {
                    Content = sourceMember.HouseHoldRecoveryPlan,
                    Type = ESS.Shared.Contracts.Submissions.NoteType.RecoveryPlan,
                });
            }

            return ret;
        }
    }
}
