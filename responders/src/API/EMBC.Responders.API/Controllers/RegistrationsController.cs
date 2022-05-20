using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Responders.API.Services;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Handles registration related operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public partial class RegistrationsController : ControllerBase
    {
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private readonly IEvacuationSearchService evacuationSearchService;

        private string currentUserId => User.FindFirstValue("user_id");
        private string currentUserRole => User.FindFirstValue("user_role");

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
            var registrant = (await messagingClient.Send(new RegistrantsQuery
            {
                Id = registrantId
            })).Items.FirstOrDefault();

            if (registrant == null) return NotFound(registrantId);

            return Ok(mapper.Map<RegistrantProfile>(registrant));
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

            var profile = mapper.Map<ESS.Shared.Contracts.Events.RegistrantProfile>(registrant);
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

            var profile = mapper.Map<ESS.Shared.Contracts.Events.RegistrantProfile>(registrant);
            var id = await messagingClient.Send(new SaveRegistrantCommand
            {
                Profile = profile
            });
            return Ok(new RegistrationResult { Id = id });
        }

        /// <summary>
        /// Sets the Registrant Profile Verified flag to the supplied value
        /// </summary>
        /// <param name="registrantId">RegistrantId</param>
        /// <param name="verified">Verified</param>
        /// <returns>updated registrant id</returns>
        [HttpPost("registrants/{registrantId}/verified/{verified}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<RegistrationResult>> SetRegistrantVerified(string registrantId, bool verified)
        {
            var id = await messagingClient.Send(new SetRegistrantVerificationStatusCommand
            {
                RegistrantId = registrantId,
                Verified = verified
            });
            return await Task.FromResult(Ok(new RegistrationResult { Id = id }));
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
            var registrant = (await messagingClient.Send(new RegistrantsQuery
            {
                Id = registrantId
            })).Items.FirstOrDefault();

            if (registrant == null) return NotFound(registrantId);

            return Ok(new GetSecurityQuestionsResponse { Questions = mapper.Map<IEnumerable<SecurityQuestion>>(registrant.SecurityQuestions) });
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
            VerifySecurityQuestionsQuery verifySecurityQuestionsQuery = new VerifySecurityQuestionsQuery { RegistrantId = registrantId, Answers = mapper.Map<IEnumerable<ESS.Shared.Contracts.Events.SecurityQuestion>>(request.Answers) };
            var response = await messagingClient.Send(verifySecurityQuestionsQuery);
            return Ok(mapper.Map<VerifySecurityQuestionsResponse>(response));
        }

        [HttpPost("registrants/{registrantId}/invite")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> InviteToRegistrantPortal(string registrantId, InviteRequest request)
        {
            var inviteRequest = new InviteRegistrantCommand
            {
                RegistrantId = registrantId,
                Email = request.Email,
                RequestingUserId = currentUserId
            };
            var inviteId = await messagingClient.Send(inviteRequest);
            return Ok(inviteId);
        }
    }

    public class RegistrationResult
    {
        public string Id { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RegistrantStatus
    {
        [Description("Verified")]
        Verified,

        [Description("Not Verified")]
        NotVerified
    }

    public class SecurityQuestion
    {
        public int Id { get; set; }

        [Required]
        public string Question { get; set; }

        [Required]
        public string Answer { get; set; }

        public bool AnswerChanged { get; set; }
    }

    public class GetSecurityQuestionsResponse
    {
        public IEnumerable<SecurityQuestion> Questions { get; set; }
    }

    public class VerifySecurityQuestionsRequest
    {
        [Required]
        public IEnumerable<SecurityQuestion> Answers { get; set; } = Array.Empty<SecurityQuestion>();
    }

    public class VerifySecurityQuestionsResponse
    {
        public int NumberOfCorrectAnswers { get; set; }
    }

    /// <summary>
    /// Registrant profile
    /// </summary>
    public class RegistrantProfile
    {
        public string? Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }

        [Required]
        public bool Restriction { get; set; }

        [Required]
        public PersonDetails PersonalDetails { get; set; }

        [Required]
        public ContactDetails ContactDetails { get; set; }

        [Required]
        public Address PrimaryAddress { get; set; }

        [Required]
        public Address MailingAddress { get; set; }

        public bool IsMailingAddressSameAsPrimaryAddress { get; set; }

        public SecurityQuestion[] SecurityQuestions { get; set; } = Array.Empty<SecurityQuestion>();

        public bool AuthenticatedUser { get; set; }
        public bool VerifiedUser { get; set; }

        public bool IsMinor { get; set; }
    }

    public class InviteRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }

    public class RegistrationsMapping : Profile
    {
        public RegistrationsMapping()
        {
            CreateMap<VerifySecurityQuestionsResponse, ESS.Shared.Contracts.Events.VerifySecurityQuestionsResponse>()
                .ReverseMap()
                ;

            CreateMap<SecurityQuestion, ESS.Shared.Contracts.Events.SecurityQuestion>()
                .ReverseMap()
                ;

            CreateMap<Address, ESS.Shared.Contracts.Events.Address>()
               .ForMember(d => d.Community, opts => opts.MapFrom(s => s.CommunityCode))
               .ForMember(d => d.Country, opts => opts.MapFrom(s => s.CountryCode))
               .ForMember(d => d.StateProvince, opts => opts.MapFrom(s => s.StateProvinceCode))
               ;

            CreateMap<ESS.Shared.Contracts.Events.Address, Address>()
                .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => s.Community))
                .ForMember(d => d.StateProvinceCode, opts => opts.MapFrom(s => s.StateProvince))
                .ForMember(d => d.CountryCode, opts => opts.MapFrom(s => s.Country))
                ;

            CreateMap<RegistrantProfile, ESS.Shared.Contracts.Events.RegistrantProfile>()
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.Restriction))
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
                .ForMember(d => d.VerifiedUser, opts => opts.Ignore())
                .ForMember(d => d.CreatedByUserId, opts => opts.Ignore())
                .ForMember(d => d.CreatedByDisplayName, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.MapFrom(s => s.ModifiedOn))
                .ForMember(d => d.LastModifiedUserId, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedDisplayName, opts => opts.Ignore())
                ;

            CreateMap<ESS.Shared.Contracts.Events.RegistrantProfile, RegistrantProfile>()
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
                    string.Equals(s.MailingAddress.Country, s.PrimaryAddress.Country, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.StateProvince, s.PrimaryAddress.StateProvince, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.Community, s.PrimaryAddress.Community, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.City, s.PrimaryAddress.City, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.PostalCode, s.PrimaryAddress.PostalCode, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.AddressLine1, s.PrimaryAddress.AddressLine1, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.AddressLine2, s.PrimaryAddress.AddressLine2, StringComparison.InvariantCultureIgnoreCase)))
                ;
        }
    }
}
