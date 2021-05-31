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
    public class RegistrationsController : ControllerBase
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
        /// Search evacuation files and profiles matching the search parameters
        /// </summary>
        /// <param name="searchParameters">search parameters to filter the results</param>
        /// <returns>matching files list and registrants list</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<SearchResults>> Search([FromQuery] SearchParameters searchParameters)
        {
            var userRole = Enum.Parse<MemberRole>(User.FindFirstValue("user_role"));
            var searchResults = await evacuationSearchService.Search(searchParameters.firstName, searchParameters.lastName, searchParameters.dateOfBirth, userRole);

            return Ok(searchResults);
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
            var questions = new[]
            {
                new SecurityQuestion { Id = 1, Question = "question1", Answer = "a***1" },
                new SecurityQuestion { Id = 2, Question = "question2", Answer = "a***2" },
                new SecurityQuestion { Id = 3, Question = "question3", Answer = "a***3" },
            };

            return Ok(await Task.FromResult(new GetSecurityQuestionsResponse { Questions = questions }));
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
        /// get the security phrase of an evacuation file
        /// </summary>
        /// <param name="fileId">file id</param>
        /// <returns>masked security phrase</returns>
        [HttpGet("files/{fileId}/security")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetSecurityPhraseResponse>> GetSecurityPhrase(string fileId)
        {
            var phrase = "a*****z";

            return Ok(await Task.FromResult(new GetSecurityPhraseResponse { SecurityPhrase = phrase }));
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
            var isCorrect = await messagingClient.Send(verifySecurityPhraseQuery);
            return Ok(new VerifySecurityPhraseResponse { IsCorrect = isCorrect });

            //this will be the replacement once the nuget package is updated for the query response
            //var response = await messagingClient.Send(verifySecurityPhraseQuery);
            //return Ok(mapper.Map<VerifySecurityPhraseResponse>(response));
        }

        /// <summary>
        /// Creates or updates a Registrant Profile
        /// </summary>
        /// <param name="evacuee">Evacuee</param>
        /// <returns>new registrant id</returns>
        [HttpPost("profile")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<string>> UpsertRegistrantProfile(EvacueeProfile evacuee)
        {
            if (evacuee == null) return BadRequest();

            var profile = mapper.Map<RegistrantProfile>(evacuee);
            var id = await messagingClient.Send(new SaveRegistrantCommand
            {
                Profile = profile
            });
            return Ok(id);
        }
    }

    public class SearchParameters
    {
        [Required]
        public string firstName { get; set; }

        [Required]
        public string lastName { get; set; }

        [Required]
        public string dateOfBirth { get; set; }
    }

    public class SearchResults
    {
        public IEnumerable<RegistrantProfileSearchResult> Registrants { get; set; }
        public IEnumerable<EvacuationFileSearchResult> Files { get; set; }
    }

    public class RegistrantProfileSearchResult
    {
        public string Id { get; set; }
        public bool IsRestricted { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public RegistrantStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public Address PrimaryAddress { get; set; }
        public IEnumerable<EvacuationFileSearchResult> EvacuationFiles { get; set; }
    }

    public class EvacuationFileSearchResult
    {
        public string Id { get; set; }
        public bool IsRestricted { get; set; }
        public string TaskId { get; set; }
        public Address EvacuatedFrom { get; set; }
        public DateTime CreatedOn { get; set; }
        public EvacuationFileStatus Status { get; set; }
        public IEnumerable<EvacuationFileHouseholdMember> HouseholdMembers { get; set; }
    }

    public class EvacuationFileHouseholdMember
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public HouseholdMemberType Type { get; set; }
        public bool IsMatch { get; set; }
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
        [Description("In Progress")]
        InProgress,

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
        [Description("Main Applicant")]
        MainApplicant,

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
    /// Evacuee profile
    /// </summary>
    public class EvacueeProfile
    {
        public string Id { get; set; }

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
            CreateMap<VerifySecurityQuestionsResponse, ESS.Shared.Contracts.Submissions.VerifySecurityQuestionsResponse>()
                .ReverseMap()
                ;

            CreateMap<SecurityQuestion, ESS.Shared.Contracts.Submissions.SecurityQuestion>()
                //This line can get removed once nuget package is updated
                .ForMember(d => d.AnswerIsMasked, opts => opts.MapFrom(s => !s.AnswerChanged))
                .ReverseMap()
                ;

            CreateMap<Address, ESS.Shared.Contracts.Submissions.Address>()
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.CommunityCode))
                .ForMember(d => d.Country, opts => opts.MapFrom(s => s.CountryCode))
                .ForMember(d => d.StateProvince, opts => opts.MapFrom(s => s.StateProvinceCode))
                .ReverseMap()
                .ForMember(d => d.City, opts => opts.Ignore())
                ;

            CreateMap<EvacueeProfile, ESS.Shared.Contracts.Submissions.RegistrantProfile>()
                .ForMember(d => d.SecurityQuestions, opts => opts.MapFrom(s => s.SecurityQuestions))
                .ForMember(d => d.RestrictedAccess, opts => opts.Ignore())
                .ForMember(d => d.IsMailingAddressSameAsPrimaryAddress, opts => opts.Ignore())
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.ContactDetails.Phone))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.ContactDetails.Email))
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => s.PersonalDetails.DateOfBirth))
                .ForMember(d => d.Gender, opts => opts.MapFrom(s => s.PersonalDetails.Gender))
                .ForMember(d => d.PreferredName, opts => opts.MapFrom(s => s.PersonalDetails.PreferredName))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.PersonalDetails.Initials))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.PersonalDetails.LastName))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.PersonalDetails.FirstName))
                .ForMember(d => d.UserId, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.Id, opts => opts.Ignore())
                .ForMember(d => d.AuthenticatedUser, opts => opts.Ignore())
                .ForMember(d => d.VerifiedUser, opts => opts.MapFrom(s => s.VerifiedUser))
                ;
        }
    }
}
